<template>
   <!-- Основной контейнер модального окна -->
   <div id="main-login-modal" class="modal modal-code" @click.self="closeModal" @keydown="handleTabKeydown">
      <!-- Анимация для модального контента -->
      <transition name="modal-fade">
         <div class="modal__content">
            <!-- Кнопка закрытия модального окна -->
            <button class="modal__close-button" @click="closeModal" aria-label="Close" tabindex="0">
               <img :src="closeIcon" alt="close icon" />
            </button>

            <!-- Заголовок модального окна -->
            <div class="modal__header">
               <!-- Логотип и иконка в заголовке -->
               <div class="modal__header-image">
                  <img src="../assets/icons/a-id.svg" alt="header image" />
               </div>
               <!-- Разделительная линия -->
               <div class="modal__header-bar"></div>
            </div>

            <!-- Форма входа -->
            <form class="modal__form" @submit.prevent="submitForm">
               <!-- Секция формы: ввод телефона или email -->
               <div class="modal__form-section">
                  <!-- Загрузка (оверлей со спиннером) -->
                  <div v-show="isLoading" class="loading-overlay">
                     <div class="spinner"></div>
                  </div>

                  <!-- Поле ввода кода подтверждения -->
                  <div class="input-wrapper">
                     <p class="input-wrapper__title">Подтвердите e-mail</p>
                     <p class="input-wrapper__description">
                        Введите проверочный код, отправленный на почту {{ email }}
                     </p>
                     <p class="input-wrapper__description">
                        Это необходимо, чтобы важные данные не попали в руки злоумышленников.
                     </p>
                     <!-- Компонент ввода кода (VueOtpInput) -->
                     <OTPInput v-model="code" :maxlength="4" inputmode="tel" auto-focus autocomplete="one-time-code"
                        @input="resetSendCodeFlag" @complete="submitForm">
                        <template #default="{ slots }">
                           <div class="otp-container">
                              <div v-for="(slot, idx) in slots" :key="idx" v-bind="slot" class="otp-input" :class="{
                                 'otp-input--active': slot.isActive,
                                 'otp-input--filled': slot.char,
                                 'otp-input--error': hasError
                              }" @click="focusSlot(idx)">
                                 <span v-if="slot.char">{{ slot.char }}</span>
                                 <span v-else-if="slot.isActive" class="otp-caret"></span>
                              </div>
                           </div>
                        </template>
                     </OTPInput>
                     <!-- Таймер до получения нового кода -->
                     <p class="timer-message" v-if="timeLeft > 0">
                        Получить новый можно через {{ formattedTime }}
                     </p>
                     <button v-else @click.prevent="requestCode" class="modal__button modal__button--revers"
                        tabindex="0">
                        Получить новый код
                     </button>
                  </div>
               </div>
            </form>
         </div>
      </transition>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import closeIcon from '~/assets/icons/close.svg';
import { useUserStore } from '~/store/user';
import { useCreateStore } from '~/store/create';
import { confirmCode } from '~/services/apiClient';
import { OTPInput } from 'vue-input-otp'

// Store и базовые рефы
const userStore = useUserStore();
const createStore = useCreateStore();
const email = computed(() => createStore.email);
const code = ref('');
const isLoading = ref(false);
const canResendCode = ref(true);
const hasError = ref(false)

// Таймер и ошибки
let timer = null;
const timeLeft = ref(0);

const emit = defineEmits(['confirmed']);

onMounted(() => {
   checkAndRestoreTimer();
});

// Запуск таймера
const startTimer = () => {
   const firstTimeKey = 'firstTimeTimestamp';
   const firstTimeDuration = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

   // Проверяем, если прошло меньше 24 часов с первого запуска
   const firstTime = localStorage.getItem(firstTimeKey);
   const isFirstTime = !firstTime || Date.now() - firstTime > firstTimeDuration;

   // Если первый запуск, сохраняем метку времени
   if (isFirstTime) {
      localStorage.setItem(firstTimeKey, Date.now());
   }

   clearInterval(timer);

   // Устанавливаем время (1 минута при первом запуске, 3 минуты при повторных)
   const duration = isFirstTime ? 60 : 180; // 1 минута или 3 минуты
   const endTime = Date.now() + duration * 1000;

   // Сохранение времени окончания в localStorage
   localStorage.setItem('timerEndTime', endTime);

   // Обновление оставшегося времени
   updateRemainingTime(endTime);

   timer = setInterval(() => {
      updateRemainingTime(endTime);
   }, 1000);
};

// Восстановление таймера при открытии модального окна или перезагрузке страницы
const checkAndRestoreTimer = () => {
   const endTime = parseInt(localStorage.getItem('timerEndTime'), 10);

   if (endTime && endTime > Date.now()) {
      updateRemainingTime(endTime);

      timer = setInterval(() => {
         updateRemainingTime(endTime);
      }, 1000);
   }
};

// Обновление оставшегося времени
const updateRemainingTime = (endTime) => {
   const remainingTime = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);

   timeLeft.value = remainingTime;

   if (remainingTime === 0) {
      clearInterval(timer);
      localStorage.removeItem('timerEndTime');
   }
};

function resetErrorOtp() {
   hasError.value = false
}

const resetSendCodeFlag = () => {
   canResendCode.value = true;
   resetErrorOtp();
}

const formattedTime = computed(() => {
   const minutes = Math.floor(timeLeft.value / 60);
   const seconds = timeLeft.value % 60;
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

function focusSlot(index) {
   document.querySelectorAll('.otp-input')[index]?.focus();
}

// Монтирование компонента
onMounted(() => {
   nextTick(() => setFocusOnInput());
});

// Установка фокуса
const setFocusOnInput = () => {
   document.querySelector('.otp-input')?.focus();
};

const handleTabKeydown = (event) => {
   const focusableElements = Array.from(
      document.querySelectorAll(
         '#main-login-modal .modal__content button:not([disabled]), ' +
         '#main-login-modal .modal__content input:not([disabled]), ' +
         '#main-login-modal .modal__content select:not([disabled]), ' +
         '#main-login-modal .modal__content textarea:not([disabled]), ' +
         '#main-login-modal .modal__content a[href]:not([disabled]), ' +
         '#main-login-modal .modal__content [tabindex]:not([tabindex="-1"]):not([disabled])'
      )
   );

   const visibleElements = focusableElements.filter(el => el.offsetParent !== null);

   const firstElement = visibleElements[0];
   const lastElement = visibleElements[visibleElements.length - 1];

   if (event.key === 'Tab') {
      if (event.shiftKey) {
         if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
         }
      } else {
         if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
         }
      }
   }
};

// Очистка формы
const clearFormFields = () => {
   code.value = '';
};

// Закрытие модального окна
const closeModal = () => {
   document.body.style.overflow = '';
   clearFormFields();
   emit('confirmed');
};

// Проверка и обработка входа
const submitForm = async () => {
   console.log('submitForm triggered');
   if (isLoading.value || !canResendCode.value) return;

   isLoading.value = true;

   try {
      const response = await confirmCode({ email: email.value, code: code.value });
      if (response.success) {
         handleSuccessfulLogin();
         code.value = '';
         emit('confirmed');
      } else {
         canResendCode.value = false;
      }
   } catch (error) {
      console.error('Ошибка подтверждения кода:', error);
   } finally {
      isLoading.value = false;
   }
};


const requestCode = async () => {
   if (isLoading.value) return;
   isLoading.value = true;
   try {
      await userStore.updateProfile({ email: email.value });
      startTimer();
   } catch (error) {
      console.error('Ошибка запроса кода:', error);
   } finally {
      isLoading.value = false;
   }
};

// Успешный вход
const handleSuccessfulLogin = () => {
   clearFormFields();
   userStore.fetchAndSetUserdata();
   closeModal();
};
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 122200;
   top: 0;
   left: 0;
   width: 100%;
   height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(3px);
   padding: 20px;
   box-sizing: border-box;
   overflow: hidden;

   &__content {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      animation: slide-up 0.3s ease-out;
      transition: height 0.3s ease-out;
   }

   &__close-button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.1s ease-in-out;
      width: 16px;
      height: 16px;
      top: 8px;
      right: 8px;
      z-index: 15;
      background: none;
      border: none;
      cursor: pointer;

      img {
         width: 16px;
         height: 16px;
      }
   }

   &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-direction: column;

      &-image {
         width: auto;
         display: flex;
         gap: 8px;
         max-height: 200px;
         padding: 32px 40px;
         margin-right: auto;

         img {
            width: 100%;
            min-height: 32px;
         }
      }

      &-bar {
         width: 100%;
         height: 2px;
         background-color: #eeeeee;
      }

      &-switcher {
         display: flex;
         position: relative;
         justify-content: space-between;
         width: calc(100% - 84px);
         border: 1px solid #d6d6d6;
         padding: 4px;
         border-radius: 4px;
         margin-top: 24px;

         .switcher {
            position: absolute;
            bottom: 2;
            left: 2;
            width: calc(50% - 4px);
            border-radius: 4px;
            height: 27px;
            background-color: #3366FF;
            transition: transform 0.2s ease;
            z-index: 0;
         }

         button {
            padding: 4px 6px;
            z-index: 111;
            background-color: transparent;
            width: 50%;
            cursor: pointer;
            font-size: 14px;
            border: none;

            @media (max-width: 480px) {
               font-size: 12px;
               height: 27px;
            }

            &.active {
               color: #fff;
            }
         }
      }
   }

   &__form {
      width: 100%;
      padding: 24px 0;
      padding-bottom: 0;
      display: flex;
      position: relative;
      flex-direction: column;

      &-section {
         padding: 0;

         .input-wrapper {
            display: flex;
            flex-direction: column;
            margin-bottom: 24px;
            padding: 0 40px;
            font-size: 12px;

            label {
               margin-bottom: 5px;
               font-size: 12px;
               color: #323232;
            }

            &__title {
               font-size: 16px;
               margin-bottom: 8px;
               font-weight: 700;
               color: #323232;
            }

            &__description {
               font-size: 14px;
               line-height: 18px;
               color: #323232;
               margin-bottom: 24px;
               margin-top: 0;

               &--link {
                  color: #3366ff;
                  cursor: pointer;
                  margin-top: 8px;
                  font-size: 14px;
                  line-height: 18px;
               }
            }

            input {
               border: 1px solid #d6d6d6;
               border-radius: 4px;
               height: 34px;
               line-height: 18px;
               width: 100%;
               font-size: 14px;
               padding: 0 12px;
               box-sizing: border-box;
            }

            &__telegram-checkbox {
               display: flex;
               align-items: center;
               margin-top: 8px;
               gap: 8px;

               input {
                  height: 14px;
                  width: 14px;
               }

               span {
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  line-height: 18px;
                  color: #323232;

                  img {
                     margin-left: 8px;
                     margin-right: 4px;
                  }
               }
            }

            .forgot-password-link {
               display: inline-block;
               text-decoration: none;
               font-size: 14px;
               color: #3366ff;
               margin-top: 6px;
               margin-bottom: 0;
               margin-left: auto;
            }
         }
      }
   }

   &__footer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
      padding: 0 42px;
      padding-bottom: 24px;
   }
}

@keyframes slide-up {
   from {
      opacity: 0;
      transform: translateY(50%);
   }

   to {
      opacity: 1;
      transform: translateY(0);
   }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
   transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
   opacity: 0;
}

.timer-message {
   margin-top: 24px;
   color: #787878;
   font-size: 14px;
   text-align: center;
}

.modal__button {
   width: 100%;
   height: 38px;
   margin-top: 24px;
   border: none;
   border-radius: 6px;
   font-size: 14px;
   cursor: pointer;
   background-color: #3366ff;
   color: #fff;

   &--revers {
      background-color: #fff;
      color: #3366ff;
      height: auto;
   }

   &--change {
      padding-top: 24px;
      border-top: 1px solid #EEEEEE;
   }

   &.--disabled {
      background-color: #EEEEEE;
      color: #A8A8A8;
   }
}

.checkbox-wrapper {
   display: flex;
   flex-direction: column;
   gap: 16px;

   label {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;

      input[type="checkbox"] {
         margin-right: 6px;
         margin-top: 2px;
         border-radius: 4px;
         height: 14px;
         width: 14px;
         min-width: 14px;
         margin-bottom: auto;
      }
   }

   span {
      font-size: 14px;
      line-height: 18px;
      color: #323232;
   }

   &--blue {
      color: #3366FF;
   }
}

.checkbox-wrapper--tg {
   color: #31A8DF !important;
}

.loading-overlay {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   backdrop-filter: blur(1px);
   background: rgba(255, 255, 255, 0.7);
   z-index: 10;
}

.spinner {
   border: 8px solid #f3f3f3;
   border-top: 8px solid #3366FF;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   animation: spin 1s linear infinite;
}

.input-error {
   outline: 1px solid red;
}

.error-message {
   color: red;
   font-size: 14px;
   margin-top: 4px;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}

.otp-container {
   display: flex;
   gap: 12px;
   justify-content: space-between;
   align-items: center;
}

.otp-input {
   width: 52px;
   height: 62px;
   color: #323232;
   font-size: 32px;
   border: 1px solid #D6D6D6;
   border-radius: 6px;
   text-align: center;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: #fff;
   transition: all 0.3s ease;
   position: relative;
   cursor: text;
   user-select: none;
}

.otp-input:hover {
   border-color: #A6A6A6;
}

.otp-input--active {
   border-color: #3366FF;
   box-shadow: 0 0 12px rgba(51, 102, 255, 0.4);
}

.otp-input--filled {
   border-color: #3366FF;
}

.otp-input--error {
   border-color: #FF5959;
}

.otp-caret {
   width: 2px;
   height: 40%;
   background-color: #3366FF;
   animation: blink 1s step-end infinite;
}

@keyframes blink {

   0%,
   100% {
      opacity: 1;
   }

   50% {
      opacity: 0;
   }
}
</style>

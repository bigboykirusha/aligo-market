<template>
   <!-- Основной контейнер модального окна -->
   <div v-show="isLoginModalOpen" id="main-login-modal" class="modal" @click.self="closeModal"
      @keydown="handleTabKeydown">
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
               <!-- Переключатель вкладок (SMS или Email) -->
               <div v-show="isBothSaved && !showCodeInput" class="modal__header-switcher">
                  <button :class="{ 'active': activeTab === 0 }" @click="switchTab(0)" tabindex="0">
                     {{ $t('loginModal.smsLogin') }}
                  </button>
                  <button :class="{ 'active': activeTab === 1 }" @click="switchTab(1)" tabindex="0">
                     {{ $t('loginModal.emailLogin') }}
                  </button>
                  <!-- Индикатор активной вкладки -->
                  <div class="switcher" :style="{ transform: `translateX(${activeTab * 100}%)` }"></div>
               </div>
            </div>

            <!-- Форма входа -->
            <form class="modal__form" @submit.prevent="submitForm">
               <!-- Секция формы: ввод телефона или email -->
               <div v-show="(activeTab === 0 || activeTab === 1)" class="modal__form-section">
                  <!-- Загрузка (оверлей со спиннером) -->
                  <div v-show="isLoading" class="loading-overlay">
                     <div class="spinner"></div>
                  </div>

                  <!-- Поле ввода телефона или email -->
                  <div v-show="!showCodeInput" class="input-wrapper">
                     <p class="input-wrapper__title">{{ isPhoneTab ? 'Введите номер телефона' : 'Введите адрес почты' }}
                     </p>
                     <p class="input-wrapper__description">
                        Мы отправим вам проверочный код для входа в аккаунт
                     </p>
                     <!-- Ввод телефона -->
                     <input v-show="isPhoneTab" :class="{ 'input-error': contactInfoError && isPhoneTab }" type="tel"
                        @keydown.backspace="handleBackspace" v-model="phoneNumber" class="phone-input" ref="phoneInput"
                        @input="resetError" v-mask="'+7 (###) ###-##-##'" />
                     <!-- Ввод email -->
                     <input v-show="!isPhoneTab" type="email" v-model="email" @input="handleInput" class="phone-input"
                        :class="{ 'input-error': contactInfoError && !isPhoneTab }" ref="emailInput" />
                     <!-- Чекбокс "Вход через Telegram" -->
                     <p v-if="contactInfoError && !showCodeInput" class="error-message">{{ contactInfoError }}</p>
                     <label v-show="isPhoneTab" class="input-wrapper__telegram-checkbox">
                        <input type="checkbox" v-model="loginWithTelegram" />
                        <span>Отправить код в <img src="../assets/icons/tgshka.svg" alt=""><span
                              class="checkbox-wrapper--tg">Telegram</span></span>
                     </label>
                  </div>

                  <!-- Поле ввода кода подтверждения -->
                  <div class="input-wrapper" v-show="showCodeInput">
                     <p class="input-wrapper__title">Введите код</p>
                     <p class="input-wrapper__description">
                        Мы отправили код на {{ isPhoneTab ? formattedPhoneNumber : email }}<br />
                     <div @click.prevent="switchTab(activeTab); startTimer" class="input-wrapper__description--link">
                        Изменить {{ isPhoneTab ? 'номер' : 'почту' }}
                     </div>
                     </p>

                     <!-- Компонент ввода кода (VueOtpInput) -->
                     <VueOtpInput input-classes="otp-input" inputType="numeric" :num-inputs="4" v-model:value="code"
                        :should-auto-focus="true" @on-complete="submitForm" />
                     <!-- Таймер до получения нового кода -->
                     <p class="timer-message" v-if="timeLeft > 0">
                        Получить новый можно через {{ formattedTime }}
                     </p>
                     <button v-else @click.prevent="requestCode" class="modal__button modal__button--revers"
                        tabindex="0">
                        Получить новый код
                     </button>
                     <button v-if="activeTab === 0 && showCodeInput"
                        class="modal__button modal__button--revers modal__button--change"
                        @click.prevent="loginWithEmail">
                        Войти через почту
                     </button>
                     <!-- Кнопка "Войти по SMS" -->
                     <button v-if="activeTab === 1 && showCodeInput"
                        class="modal__button modal__button--revers modal__button--change" @click.prevent="loginWithSMS">
                        Войти по SMS
                     </button>
                  </div>
               </div>

               <!-- Нижняя часть модального окна (кнопки и чекбоксы) -->
               <div v-if="!showCodeInput" class="modal__footer">
                  <!-- Таймер до повторного входа -->
                  <p class="timer-message" v-if="timeLeft > 0">
                     Войти снова можно через {{ formattedTime }}
                  </p>
                  <!-- Кнопка "Вход" -->
                  <button v-show="isBothSaved && !showCodeInput && !(timeLeft > 0)" :disabled="isContactInfoInvalid"
                     class="modal__button" :class="{ '--disabled': isContactInfoInvalid }" @click.prevent="submitForm"
                     tabindex="0">
                     Вход
                  </button>
                  <!-- Кнопка "Отправить" или "Зарегистрироваться" -->
                  <button v-show="!isBothSaved && !showCodeInput && !(timeLeft > 0)" :disabled="isContactInfoRegInvalid"
                     class="modal__button" :class="{ '--disabled': isContactInfoRegInvalid }" tabindex="0">
                     {{ showCodeInput ? 'Зарегистрироваться' : 'Отправить' }}
                  </button>
                  <!-- Чекбоксы согласия с правилами -->
                  <div v-if="!isBothSaved && !showCodeInput" class="checkbox-wrapper">
                     <label>
                        <input type="checkbox" v-model="checkbox1" />
                        <span>Согласен с <span class="checkbox-wrapper--blue">правилами Aligo</span></span>
                     </label>
                     <label>
                        <input type="checkbox" v-model="checkbox2" />
                        <span>Принимаю <span class="checkbox-wrapper--blue">политику обработки персональных
                              данных</span></span>
                     </label>
                  </div>
               </div>
            </form>
         </div>
      </transition>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import closeIcon from '../assets/icons/close.svg';
import { getCookie, setCookie } from '~/services/auth';
import { loginUserByPhone, confirmPhoneCode } from '../services/apiClient';
import { useUserStore } from '../store/user';
import VueOtpInput from 'vue3-otp-input';
import { useLoginModalStore } from '~/store/loginModal.js';

const loginModalStore = useLoginModalStore();

const isLoginModalOpen = computed(() => loginModalStore.isOpen);

// Store и базовые рефы
const userStore = useUserStore();
const loginWithTelegram = ref(false);
const activeTab = ref(0);
const phoneNumber = ref('');
const email = ref('');
const code = ref('');
const showCodeInput = ref(false);
const isLoading = ref(false);

// Таймер и ошибки
let timer = null;
const timeLeft = ref(0);

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

const contactInfoError = ref('');
const generalError = ref('');

// Для ввода
const phoneInput = ref(null);
const emailInput = ref(null);
const checkbox1 = ref(false);
const checkbox2 = ref(false);

// Вспомогательные вычисления
const isPhoneTab = computed(() => activeTab.value === 0);
const isBothSaved = computed(() => isPhoneSaved.value && isEmailSaved.value);
const formattedPhoneNumber = computed(() =>
   phoneNumber.value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '7 ($1) $2 - $3 - $4')
);

const formattedTime = computed(() => {
   const minutes = Math.floor(timeLeft.value / 60);
   const seconds = timeLeft.value % 60;
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const isContactInfoInvalid = computed(() => {
   const isInvalid = isPhoneTab.value
      ? !validatePhoneNumber(phoneNumber.value)
      : !validateEmail(email.value);
   console.log(phoneNumber.value)
   return isInvalid;
});

const isContactInfoRegInvalid = computed(
   () => isContactInfoInvalid.value || !checkbox1.value || !checkbox2.value
);
const isCodeInvalid = computed(() => showCodeInput.value && code.value.length < 6);

// Сохранение данных
const isPhoneSaved = computed(() => {
   const savedData = JSON.parse(getCookie('userData') || '{}');
   if (savedData.phoneNumber) phoneNumber.value = savedData.phoneNumber;
   return !!savedData.phoneNumber;
});

const isEmailSaved = computed(() => {
   const savedData = JSON.parse(getCookie('userData') || '{}');
   if (savedData.email) email.value = savedData.email;
   return !!savedData.email;
});

// Монтирование компонента
onMounted(() => {
   const savedUserData = JSON.parse(getCookie('userData') || '{}');
   phoneNumber.value = savedUserData.phoneNumber || '';
   email.value = savedUserData.email || '';
   if (savedUserData.phoneNumber && savedUserData.email) {
      activeTab.value = 0;  // Вкладка телефона
   } else {
      activeTab.value = savedUserData.email ? 1 : 0;  // Если есть email, активируем его вкладку
   }
   nextTick(() => setFocusOnInput());
});

// Установка фокуса
const setFocusOnInput = () => {
   nextTick(() => {
      if (showCodeInput.value) {
         document.querySelector('.otp-input')?.focus();
      } else {
         (isPhoneTab.value ? phoneInput.value : emailInput.value)?.focus();
      }
   });
};

const handleInput = () => {
   resetError();
   validateEmail(email.value);
};

const handleBackspace = () => {

   let value = phoneNumber.value;
   const lengthBefore = value.length;

   if (['-', '('].includes(value[lengthBefore - 2])) {
      phoneNumber.value = value.slice(0, lengthBefore - 1);
   }
};

const resetError = () => {
   contactInfoError.value = '';
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

// Обработка переключения табов
const switchTab = (index) => {
   activeTab.value = index;
   showCodeInput.value = false;
   setFocusOnInput();
};

// Очистка формы
const clearFormFields = () => {
   code.value = '';
   generalError.value = '';
};

// Закрытие модального окна
const closeModal = () => {
   document.body.style.overflow = '';
   clearFormFields();
   loginModalStore.closeLoginModal();
   showCodeInput.value = false;
};

// Проверка и обработка входа
const submitForm = async () => {
   if (isLoading.value || isContactInfoInvalid.value) {
      return;
   }

   isLoading.value = true;

   try {
      const cleanedPhone = removePhoneFormatting(phoneNumber.value);
      const requestData = isPhoneTab.value
         ? { phone: cleanedPhone }
         : { email: email.value };

      if (loginWithTelegram.value) {
         requestData.is_send_code_telegram = 1;
      }

      if (!showCodeInput.value) {
         const response = await loginUserByPhone(requestData);
         if (response.success) {
            showCodeInput.value = true;
            startTimer();
            alert(`Код: ${response.code}`);
         } else {
            contactInfoError.value = response.message || 'Ошибка при отправке кода.';
         }
      } else {
         const response = await confirmPhoneCode({ ...requestData, code: code.value });
         if (response.success) {
            handleSuccessfulLogin(response.data, cleanedPhone);
         } else {
            contactInfoError.value = response.data.message || 'Неверный код.';
         }
      }
   } catch (error) {
      contactInfoError.value = error.message;
      console.error('Ошибка при отправке запроса:', contactInfoError);
   } finally {
      isLoading.value = false;
   }
};

const requestCode = async () => {

   if (isContactInfoInvalid.value) {
      return;
   }

   isLoading.value = true;

   try {
      const cleanedPhone = removePhoneFormatting(phoneNumber.value);
      const requestData = isPhoneTab.value
         ? { phone: cleanedPhone }
         : { email: email.value };

      if (loginWithTelegram.value) {
         requestData.is_send_code_telegram = 1;
      }

      const response = await loginUserByPhone(requestData);
      if (response.success) {
         showCodeInput.value = true;
         startTimer();
         alert(`Код: ${response.code}`);
      } else {
         contactInfoError.value = response.message || 'Ошибка при отправке кода.';
      }

   } catch (error) {
      contactInfoError.value = error.message;
      console.error('Ошибка при отправке запроса:', contactInfoError);
   } finally {
      isLoading.value = false;
   }
}

const loginWithEmail = () => {
   activeTab.value = 1;
   showCodeInput.value = false;
   setFocusOnInput();
   console.log('Login with Email');
};

const loginWithSMS = () => {
   activeTab.value = 2;
   showCodeInput.value = false;
   setFocusOnInput();
   console.log('Login with SMS');
};

// Успешный вход
const handleSuccessfulLogin = (data, cleanedPhone) => {
   const { token, user_id } = data;
   setCookie(
      'userData',
      JSON.stringify({
         token,
         user_id,
         phoneNumber: isPhoneTab.value ? cleanedPhone : '',
         email: !isPhoneTab.value ? email.value : '',
      }),
      7
   );
   clearFormFields();
   userStore.isLoggedIn = true;
   userStore.fetchAndSetUserdata();
   userStore.fetchUserCounts();
   closeModal();
};

// Дополнительные методы
const validatePhoneNumber = (phone) => /^\+79\d{9}$/.test(removePhoneFormatting(phone));
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const removePhoneFormatting = (phone) => phone.replace(/[^\d+]/g, '');
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 1222;
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

         display: flex;
         position: relative;
         justify-content: space-between;
         width: calc(100% - 84px);
         border: 1px solid #d6d6d6;
         padding: 4px;
         border-radius: 4px;
         margin-top: 24px;

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
</style>

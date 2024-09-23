<template>
   <div id="main-login-modal" class="modal" @click.self="closeModal">
      <transition name="modal-fade">
         <div :class="modalContentClasses">
            <button class="modal__close-button" @click="closeModal" aria-label="Close" @keydown.enter.prevent>
               <img :src="closeIcon" alt="close icon" />
            </button>
            <div class="modal__header">
               <div class="modal__header-image">
                  <img src="../assets/images/logo.svg" alt="header image" />
                  <img src="../assets/icons/ID.svg" alt="header image" />
               </div>
               <div class="modal__header-bar"></div>
               <div v-show="isPhoneSaved === isEmailSaved" class="modal__header-switcher">
                  <button :class="{ 'active': activeTab === 0 }" @click="switchTab(0)" @keydown.enter.prevent>
                     {{ $t('loginModal.smsLogin') }}
                  </button>
                  <button :class="{ 'active': activeTab === 1 }" @click="switchTab(1)" @keydown.enter.prevent>
                     {{ $t('loginModal.emailLogin') }}
                  </button>
               </div>
            </div>

            <form class="modal__form" @submit.prevent="submitForm" @keydown.enter.prevent="handleEnter">
               <div>
                  <div v-if="isLoading" class="loading-overlay">
                     <div class="spinner"></div>
                  </div>
                  <div v-show="activeTab === 0" class="modal__form-section">
                     <div class="input-wrapper" v-if="!showCodeInput">
                        <p class="input-wrapper__title">Введите номер телефона</p>
                        <p class="input-wrapper__description">Мы отправим вам проверочный код в СМС для входа в аккаунт
                        </p>
                        <input type="tel" v-model="phoneNumber" class="phone-input" v-mask="'+7 (###) ### - ## - ##'"
                           ref="phoneInput">
                     </div>
                     <div class="input-wrapper" v-else>
                        <p class="input-wrapper__description">
                           Мы отправили код для подтверждения на номер {{ formattedPhoneNumber }}<br />
                           <span @click.prevent="switchTab(0)"
                              class="input-wrapper__description input-wrapper__description--link">Изменить номер</span>
                        </p>
                        <input type="text" v-model="code" placeholder="Код">
                        <p class="timer-message" v-if="timeLeft > 0">
                           Получить новый можно через {{ formattedTime }}
                        </p>
                        <button v-else @click.prevent="requestCode" class="modal__button modal__button--revers">
                           Получить новый код
                        </button>
                     </div>
                     <div class="modal__header-bar"></div>
                  </div>
                  <div v-show="activeTab === 1" class="modal__form-section">
                     <div class="input-wrapper" v-if="!showCodeInput">
                        <p class="input-wrapper__title">Введите адрес почты</p>
                        <p class="input-wrapper__description">Мы отправим вам проверочный код для входа в аккаунт</p>
                        <input type="email" v-model="email" @input="validateEmail" class="phone-input" ref="emailInput">
                     </div>
                     <div class="input-wrapper" v-else>
                        <p class="input-wrapper__description">
                           Мы отправили код для подтверждения на почту {{ email }} <br />
                           <span @click.prevent="switchTab(1)"
                              class="input-wrapper__description input-wrapper__description--link">Изменить почту</span>
                        </p>
                        <input type="text" v-model="code" placeholder="Код">
                        <p class="timer-message" v-if="timeLeft > 0">
                           Получить новый можно через {{ formattedTime }}
                        </p>
                        <button v-else @click.prevent="requestCode" class="modal__button modal__button--revers">
                           Получить новый код
                        </button>
                     </div>
                     <div class="modal__header-bar"></div>
                  </div>
               </div>
               <div class="modal__footer">
                  <button v-show="activeTab === 0 && showCodeInput && (isPhoneSaved || isEmailSaved)"
                     @click.prevent="switchTab(1)" class="modal__button modal__button--revers">
                     Войти через почту
                  </button>
                  <button v-show="activeTab === 1 && showCodeInput" @click.prevent="switchTab(0)"
                     class="modal__button modal__button--revers">
                     Войти по SMS
                  </button>
                  <button v-if="(isPhoneSaved || isEmailSaved) && !showCodeInput" :disabled="isSubmitDisabled"
                     class="modal__button" :class="{ '--disabled': isSubmitDisabled }" @click.prevent="requestCode">
                     Вход
                  </button>
                  <button v-show="!isPhoneSaved && !isEmailSaved" :disabled="isSubmitDisabled" class="modal__button"
                     :class="{ '--disabled': isSubmitDisabled }">
                     {{ showCodeInput ? 'Зарегистрироваться' : 'Отправить' }}
                  </button>
                  <div v-if="!isPhoneSaved && !isEmailSaved && showCodeInput" class="checkbox-wrapper">
                     <label>
                        <input type="checkbox" v-model="checkbox1" />
                        <span>Согласен с <span class="checkbox-wrapper--blue">правилами Aligo</span></span>
                     </label>
                     <label>
                        <input type="checkbox" v-model="checkbox2" />
                        <span>Принимаю политику обработки <span class="checkbox-wrapper--blue">персональных
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
import { ref, watch, computed, onMounted } from 'vue';
import { useUserStore } from '../store/user';
import closeIcon from '../assets/icons/close.svg';
import { loginUserByPhone, confirmPhoneCode } from '../services/apiClient';
import { setCookie, getCookie } from '../services/auth';

const emit = defineEmits(['close-loginModal']);
const userStore = useUserStore();

const activeTab = ref(0);
const phoneNumber = ref('');
const email = ref('');
const code = ref('');
const showCodeInput = ref(false);
const timeLeft = ref(59);
const isLoading = ref(false);
let timer = null;

const checkbox1 = ref(false);
const checkbox2 = ref(false);

const vFocus = {
   mounted(el) {
      el.focus();
   },
};

defineExpose({
   directives: {
      focus: vFocus,
   },
});

const phoneInput = ref(null);
const emailInput = ref(null);

const userData = ref({ user_id: '', phoneNumber: '', email: '', token: '' });

const formattedTime = computed(() => {
   const minutes = Math.floor(timeLeft.value / 60);
   const seconds = timeLeft.value % 60;
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const startTimer = () => {
   if (timer) clearInterval(timer);
   timeLeft.value = 59;
   timer = setInterval(() => {
      if (timeLeft.value > 0) {
         timeLeft.value--;
      } else {
         clearInterval(timer);
      }
   }, 1000);
};

const switchTab = (index) => {
   activeTab.value = index;
   showCodeInput.value = false;

   if (index === 0) {
      nextTick(() => {
         phoneInput.value.focus();
      });
   } else {
      nextTick(() => {
         emailInput.value.focus();
      });
   }
};

const handleEnter = (event) => {
   event.preventDefault();
   event.stopPropagation();

   if ((isPhoneSaved.value || isEmailSaved.value) && !showCodeInput.value) {
      requestCode();
   } else if (showCodeInput.value) {
      submitForm();
   }
};

const isSubmitDisabled = computed(() => {
   const isPhoneTab = activeTab.value === 0;
   if (!showCodeInput.value && !isPhoneSaved.value && !isEmailSaved.value) {
      return isPhoneTab ? !validatePhoneNumber(phoneNumber.value) : !validateEmail(email.value);
   }
   if (showCodeInput.value && !isPhoneSaved.value && !isEmailSaved.value) {
      return !checkbox1.value || !checkbox2.value || code.value.length < 2;
   }
   return false;
});

const submitForm = async () => {
   if (isSubmitDisabled.value || isLoading.value) return;

   isLoading.value = true;

   try {
      let response;
      const cleanedPhoneNumber = removePhoneFormatting(phoneNumber.value);
      const requestData = activeTab.value === 0
         ? { phone: cleanedPhoneNumber }
         : { email: email.value };

      if (!showCodeInput.value) {
         response = await loginUserByPhone(requestData);
         if (response.success) {
            showCodeInput.value = true;
            startTimer();
         }
      } else {
         response = await confirmPhoneCode({ ...requestData, code: code.value });
         if (response.success) {
            const { token, user_id } = response.data;
            userData.value = activeTab.value === 0
               ? { token, user_id, phoneNumber: cleanedPhoneNumber }
               : { token, user_id, email: email.value };
            setCookie('userData', JSON.stringify(userData.value), 7);
            clearFormFields();
            userStore.isLoggedIn = true;
            userStore.fetchAndSetUserdata();
            closeModal();
         } else {
            console.error('Ошибка при подтверждении кода', response.message);
         }
      }
   } catch (error) {
      console.error('Ошибка при выполнении запроса', error);
   } finally {
      isLoading.value = false;
   }
};

const closeModal = () => {
   clearFormFields();
   emit('close-loginModal');
   showCodeInput.value = false;
   if (timer) clearInterval(timer);
};

const validatePhoneNumber = (phone) => {
   const cleanedPhone = String(phone).replace(/[^\d+]/g, '');
   const phoneRegex = /^(\+7|7)?(\d{3})(\d{3})(\d{2})(\d{2})$/;
   return phoneRegex.test(cleanedPhone);
};

const validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

const clearFormFields = () => {
   code.value = '';
};

const modalContentClasses = computed(() => ({
   'modal__content': true,
   'modal__content--animated': true,
}));

const formattedPhoneNumber = computed(() => {
   return phoneNumber.value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '7 ($1) $2 - $3 - $4');
});

const removePhoneFormatting = (phone) => {
   return String(phone).replace(/[^\d+]/g, '');
};

const isPhoneSaved = computed(() => {
   const savedUserData = JSON.parse(getCookie('userData'));
   if (savedUserData && savedUserData.phoneNumber) {
      phoneNumber.value = savedUserData.phoneNumber;
      return true;
   }
   return false;
});

const isEmailSaved = computed(() => {
   const savedUserData = JSON.parse(getCookie('userData'));
   if (savedUserData && savedUserData.email) {
      email.value = savedUserData.email;
      activeTab.value = 1;
      return true;
   }
   return false;
});

const requestCode = async () => {
   if (isLoading.value) return;

   isLoading.value = true;

   try {
      const requestData = activeTab.value === 0
         ? { phone: removePhoneFormatting(phoneNumber.value) }
         : { email: email.value };

      const response = await loginUserByPhone(requestData);
      if (response.success) {
         showCodeInput.value = true;
         startTimer();
      }
   } catch (error) {
      console.error('Ошибка при отправке кода', error);
   } finally {
      isLoading.value = false;
   }
};

watch(code, (newCode) => {
   if (newCode.trim().length === 6 && (isPhoneSaved.value || isEmailSaved.value)) {
      submitForm();
   }
});

onMounted(() => {
   const savedUserData = JSON.parse(getCookie('userData'));
   if (savedUserData) {
      if (savedUserData.phoneNumber) {
         phoneNumber.value = savedUserData.phoneNumber;
      }
      if (savedUserData.email) {
         email.value = savedUserData.email;
         activeTab.value = 1;
      }
   }
});
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 10;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
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
      width: 30px;
      height: 30px;
      border-radius: 50%;
      top: 8px;
      right: 8px;
      z-index: 15;
      background: none;
      border: none;
      cursor: pointer;

      &:hover {
         background-color: #D6EFFF;
      }

      img {
         width: 14px;
         height: 14px;
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
            height: 32px;

            &:last-child {
               height: 20px;
               margin-top: auto;
            }
         }
      }

      &-bar {
         width: 100%;
         height: 2px;
         background-color: #eeeeee;
      }

      &-switcher {
         display: flex;
         justify-content: space-between;
         width: calc(100% - 84px);
         border: 1px solid #d6d6d6;
         padding: 4px;
         border-radius: 4px;
         margin-top: 24px;

         button {
            padding: 4px 6px;
            background-color: transparent;
            width: 50%;
            border: none;
            cursor: pointer;
            font-size: 14px;
            outline: none;
            transition: background-color 0.3s ease;

            @media screen and (max-width: 480px) {
               font-size: 12px;
            }

            &.active {
               background-color: #3366ff;
               color: #fff;
               border-radius: 4px;
            }
         }
      }
   }

   &__form {
      width: 100%;
      padding: 24px 0;
      display: flex;
      position: relative;
      flex-direction: column;

      &-section {
         padding: 0;

         .input-wrapper {
            display: flex;
            flex-direction: column;
            margin-bottom: 24px;
            padding: 0 42px;
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
               color: #323232;
               margin-bottom: 24px;
               margin-top: 0;

               &--link {
                  color: #3366ff;
               }
            }

            input {
               border: 1px solid #d6d6d6;
               border-radius: 4px;
               height: 38px;
               width: 100%;
               font-size: 14px;
               padding: 0 12px;
               box-sizing: border-box;

               &:focus {
                  outline: none;
                  border-color: #3366ff;
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
      gap: 24px;
      padding: 0 42px;
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
   border-radius: 4px;
   font-size: 14px;
   cursor: pointer;
   background-color: #3366ff;
   color: #fff;

   &--revers {
      background-color: #fff;
      color: #3366ff;
      height: auto;
   }

   &.--disabled {
      background-color: #d6d6d6;
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
   }

   &--blue {
      color: #3366FF;
   }

   input[type="checkbox"] {
      margin-right: 6px;
      margin-bottom: auto;
   }
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
   /* полупрозрачный фон */
   z-index: 10;
   /* чтобы быть выше остальных элементов */
}

.spinner {
   border: 8px solid #f3f3f3;
   /* цвет фона */
   border-top: 8px solid #3366FF;
   /* цвет спиннера */
   border-radius: 50%;
   width: 40px;
   height: 40px;
   animation: spin 1s linear infinite;
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

<template>
   <div id="main-login-modal" class="modal" @click.self="closeModal" @keydown="handleEnterKeydown">
      <transition name="modal-fade">
         <div :class="modalContentClasses" @keydown="handleEnterKeydown">
            <button class="modal__close-button" @click="closeModal" aria-label="Close" tabindex="0"
               @keydown="handleEnterKeydown">
               <img :src="closeIcon" alt="close icon" />
            </button>
            <div class="modal__header" @keydown="handleEnterKeydown">
               <div class="modal__header-image">
                  <img src="../assets/images/logo.svg" alt="header image" />
                  <img src="../assets/icons/ID.svg" alt="header image" />
               </div>
               <div class="modal__header-bar"></div>
               <div v-show="isBothSaved && !showCodeInput" class="modal__header-switcher">
                  <button :class="{ 'active': activeTab === 0 }" @click="switchTab(0)" tabindex="0">
                     {{ $t('loginModal.smsLogin') }}
                  </button>
                  <button :class="{ 'active': activeTab === 1 }" @click="switchTab(1)" tabindex="0">
                     {{ $t('loginModal.emailLogin') }}
                  </button>
                  <div class="switcher" :style="{ transform: `translateX(${activeTab * 100}%)` }"></div>
               </div>
            </div>

            <form class="modal__form" @submit="submitForm" @keydown="handleEnterKeydown">
               <div v-show="isLoading" class="loading-overlay">
                  <div class="spinner"></div>
               </div>
               <div v-show="(activeTab === 0 || activeTab === 1) && !isLoading" class="modal__form-section"
                  @keydown="handleEnterKeydown">
                  <div v-show="!showCodeInput" class="input-wrapper">
                     <p class="input-wrapper__title">{{ isPhoneTab ? 'Введите номер телефона' : 'Введите адрес почты' }}
                     </p>
                     <p class="input-wrapper__description">Мы отправим вам проверочный код для входа в аккаунт</p>
                     <input v-show="isPhoneTab" type="tel" v-model="phoneNumber" class="phone-input"
                        @keydown.enter="handleEnter" v-mask="'+7 (###) ###-##-##'" ref="phoneInput" />
                     <input v-show="!isPhoneTab" type="email" v-model="email" @input="validateEmail" class="phone-input"
                        @keydown.enter="handleEnter" ref="emailInput" />
                     <label v-show="isPhoneTab" class="input-wrapper__telegram-checkbox">
                        <input tabindex="0" type="checkbox" v-model="loginWithTelegram" />
                        <span>Вход через <span class="checkbox-wrapper--blue">Telegram</span></span>
                     </label>
                  </div>
                  <div class="input-wrapper" v-show="showCodeInput" @keydown="handleEnterKeydown">
                     <p class="input-wrapper__title">Введите код</p>
                     <p class="input-wrapper__description">
                        Мы отправили код на {{ isPhoneTab ? formattedPhoneNumber : email }}<br />
                     <div @click.prevent="switchTab(activeTab); startTimer" class="input-wrapper__description--link">
                        Изменить {{ isPhoneTab ? 'номер' : 'почту' }}
                     </div>
                     </p>
                     <VueOtpInput input-classes="otp-input" inputType="numeric" :num-inputs="6" v-model:value="code"
                        :should-auto-focus="true" @on-complete="submitForm" />
                     <p class="timer-message" v-if="timeLeft > 0">Получить новый можно через {{ formattedTime }}</p>
                     <button v-else @click.prevent="requestCode" class="modal__button modal__button--revers"
                        tabindex="0">
                        Получить новый код
                     </button>
                  </div>
               </div>

               <div v-if="!showCodeInput" class="modal__footer">
                  <p class="timer-message" v-if="timeLeft > 0">Войти снова можно через {{ formattedTime }}</p>
                  <button v-show="isBothSaved && !showCodeInput && !(timeLeft > 0)" :disabled="isContactInfoInvalid" class="modal__button"
                     :class="{ '--disabled': isContactInfoInvalid }" @click.prevent="requestCode" tabindex="0">
                     Вход
                  </button>
                  <button v-show="!isBothSaved && !showCodeInput && !(timeLeft > 0)" :disabled="isContactInfoRegInvalid"
                     class="modal__button" :class="{ '--disabled': isContactInfoRegInvalid }" tabindex="0">
                     {{ showCodeInput ? 'Зарегистрироваться' : 'Отправить' }}
                  </button>
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
import { ref, computed, onMounted } from 'vue';
import closeIcon from '../assets/icons/close.svg';
import { getCookie, setCookie } from '~/services/auth';
import { loginUserByPhone, confirmPhoneCode } from '../services/apiClient';
import { useUserStore } from '../store/user';
import { nextTick } from 'vue';
import VueOtpInput from 'vue3-otp-input';

const userStore = useUserStore();
const loginWithTelegram = ref(false);
const activeTab = ref(0);
const phoneNumber = ref('');
const email = ref('');
const code = ref('');
const showCodeInput = ref(false);
let timer = null;
const timeLeft = ref(0);
const isLoading = ref(false);
const emit = defineEmits(['close-loginModal']);
const checkbox1 = ref(false);
const checkbox2 = ref(false);
const phoneInput = ref(null);
const emailInput = ref(null);

const contactInfoError = ref('');
const generalError = ref('');

const isPhoneTab = computed(() => activeTab.value === 0);
const isBothSaved = computed(() => isPhoneSaved.value && isEmailSaved.value);
const formattedPhoneNumber = computed(() => {
   return phoneNumber.value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '7 ($1) $2 - $3 - $4');
});
const formattedTime = computed(() => {
   const minutes = Math.floor(timeLeft.value / 60);
   const seconds = timeLeft.value % 60;
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
const modalContentClasses = computed(() => ({
   'modal__content': true,
   'modal__content--animated': true,
}));

const userData = ref({ user_id: '', phoneNumber: '', email: '', token: '' });
const isContactInfoInvalid = computed(() => {
   const isInvalid = isPhoneTab.value ? !validatePhoneNumber(phoneNumber.value) : !validateEmail(email.value);
   contactInfoError.value = isInvalid ? 'Пожалуйста, введите корректный номер телефона или адрес почты.' : '';
   return isInvalid;
});
const isContactInfoRegInvalid = computed(() => {
   const commonInvalid = isPhoneTab.value ? !validatePhoneNumber(phoneNumber.value) : !validateEmail(email.value);
   const isInvalid = commonInvalid || !checkbox1.value || !checkbox2.value;
   return isInvalid;
});
const isCodeInvalid = computed(() => showCodeInput.value && code.value.length < 6);

onMounted(() => {
   const savedUserData = JSON.parse(getCookie('userData'));
   if (savedUserData) {
      phoneNumber.value = savedUserData.phoneNumber || '';
      email.value = savedUserData.email || '';

      if (savedUserData.phoneNumber && savedUserData.email) {
         activeTab.value = 0;
      } else if (savedUserData.email) {
         activeTab.value = 1;
      } else {
         activeTab.value = 0;
      }
   }
   nextTick(() => {
      setFocusOnInput();
   });
});

const setFocusOnInput = () => {
   if (showCodeInput.value) {
      const otpInput = document.querySelector('.otp-input');
      if (otpInput) {
         otpInput.focus();
      }
   } else {
      if (isPhoneTab.value) {
         if (phoneInput.value) {
            phoneInput.value.focus();
         }
      } else {
         if (emailInput.value) {
            emailInput.value.focus();
         }
      }
   }
};

const startTimer = () => {
   clearInterval(timer);
   timeLeft.value = 180;
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
   setFocusOnInput();
};

const submitForm = async () => {
   if (isCodeInvalid.value || isLoading.value) return;

   isLoading.value = true;
   generalError.value = '';
   try {
      const cleanedPhoneNumber = removePhoneFormatting(phoneNumber.value);
      const requestData = activeTab.value === 0 ? { phone: cleanedPhoneNumber } : { email: email.value };

      if (loginWithTelegram.value) {
         requestData.is_send_code_telegram = 1;
      }

      let response;
      if (!showCodeInput.value) {
         response = await loginUserByPhone(requestData);
         if (response.success) {
            showCodeInput.value = true;
            alert(`Код: ${response.code}`);
            console.log('Код:', response.code);
            startTimer();
         } else {
            generalError.value = response.message || 'Неизвестная ошибка. Пожалуйста, попробуйте еще раз.';
         }
      } else {
         response = await confirmPhoneCode({ ...requestData, code: code.value });
         if (response.success) {
            handleSuccessfulLogin(response.data, cleanedPhoneNumber);
         } else {
            generalError.value = response.message || 'Ошибка при подтверждении кода.';
         }
      }
   } catch (error) {
      console.error('Ошибка при выполнении запроса', error);
      generalError.value = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
   } finally {
      isLoading.value = false;
   }
};

const handleSuccessfulLogin = (data, cleanedPhoneNumber) => {
   const { token, user_id } = data;
   userData.value = activeTab.value === 0
      ? { token, user_id, phoneNumber: cleanedPhoneNumber }
      : { token, user_id, email: email.value };
   setCookie('userData', JSON.stringify(userData.value), 7);
   clearFormFields();
   userStore.isLoggedIn = true;
   userStore.fetchAndSetUserdata();
   closeModal();
};

const closeModal = () => {
   document.body.style.overflow = '';
   clearFormFields();
   emit('close-loginModal');
   showCodeInput.value = false;
   clearInterval(timer);
};

const requestCode = async () => {
   if (isLoading.value) return;

   isLoading.value = true;
   generalError.value = '';
   try {
      const requestData = activeTab.value === 0
         ? { phone: removePhoneFormatting(phoneNumber.value) }
         : { email: email.value };

      if (loginWithTelegram.value) {
         requestData.is_send_code_telegram = 1;
      }

      const response = await loginUserByPhone(requestData);
      if (response.success) {
         showCodeInput.value = true;
         startTimer();
         alert(`Код: ${response.code}`);
         console.log('Код:', response.code);
      } else {
         generalError.value = response.message || 'Неизвестная ошибка. Пожалуйста, попробуйте еще раз.';
      }
   } catch (error) {
      console.error('Ошибка при отправке кода', error);
      generalError.value = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
   } finally {
      isLoading.value = false;
      console.log('Код:', response);
   }
};

const validatePhoneNumber = (phone) => {
   const cleanedPhone = String(phone).replace(/[^\d+]/g, '');
   return /^(\+7|7)?(\d{3})(\d{3})(\d{2})(\d{2})$/.test(cleanedPhone);
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const clearFormFields = () => {
   code.value = '';
   generalError.value = '';
};

const removePhoneFormatting = (phone) => String(phone).replace(/[^\d+]/g, '');

const isPhoneSaved = computed(() => {
   const savedUserData = JSON.parse(getCookie('userData'));
   if (savedUserData && savedUserData.phoneNumber) {
      phoneNumber.value = savedUserData.phoneNumber;
      return true;
   }
   return false;
});

const handleEnterKeydown = (event) => {
   console.log(event);
   if (event.key === 'Enter') {
      event.preventDefault();
      submitForm();
   }
};


const handleEnter = (event) => {

   if (isBothSaved.value && !showCodeInput.value) {
      requestCode();
   } else if (showCodeInput.value) {
      submitForm();
   }
};

const isEmailSaved = computed(() => {
   const savedUserData = JSON.parse(getCookie('userData'));
   if (savedUserData && savedUserData.email) {
      email.value = savedUserData.email;
      activeTab.value = 1;
      return true;
   }
   return false;
});
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 1222;
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

            @media screen and (max-width: 480px) {
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
               margin-bottom: 32px;
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

               &:focus {
                  outline: none;
                  border-color: #3366ff;
               }
            }

            &__telegram-checkbox {
               display: flex;
               align-items: center;
               margin-top: 8px;
               gap: 8px;

               input {
                  height: 14px;
                  width: 14px;

                  &:focus {
                     outline: 2px solid #3366FF;
                     border: 1px solid #3366FF;
                  }
               }

               span {
                  font-size: 14px;
                  line-height: 18px;
                  color: #323232;
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

      .checkbox-wrapper--blue {
         color: #3366FF;
      }
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

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}
</style>

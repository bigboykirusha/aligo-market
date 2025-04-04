<template>
   <div class="edit-profile">
      <div class="edit-profile__title">
         Управление профилем
      </div>
      <div class="edit-profile__subtitle">Личные данные</div>
      <div class="edit-profile__form-container">
         <form ref="profileForm" @submit.prevent class="edit-profile__form">

            <!-- Поле код -->
            <div class="simple-input">
               <label class="simple-input__label">Номер профиля</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__text">{{ profile.uniqueCode }}</div>
               </div>
            </div>

            <!-- Поле Username -->
            <div class="simple-input" :class="{ 'has-error': validationErrors.username }">
               <label class="simple-input__label">Имя</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__block">
                     <input v-if="editMode.username" id="username" v-model="profile.username" type="text"
                        class="simple-input__field" placeholder="Введите имя пользователя"
                        @input="markAsChanged('username')" />
                     <div v-else class="simple-input__text">{{ profile.username }}</div>
                     <div v-if="validationErrors.username" class="simple-input__error-message">
                        {{ validationErrors.username }}
                     </div>
                     <div v-if="editMode.username" class="edit-input-actions">
                        <button @click="saveField('username')"
                           class="edit-input-actions__save-button edit-input-actions__save-button-common">
                           <img :src="checkIcon" alt="" />Отправить
                        </button>
                        <button @click="cancelEdit('username')"
                           class="edit-input-actions__cancel-button edit-input-actions__cancel-button-common">
                           <img :src="cancelIcon" alt="" />Отменить
                        </button>
                     </div>
                     <div v-if="!profile.username && !editMode.username" class="simple-input__text">
                        <button type="button" class="edit-button" @click="toggleEditMode('username')">
                           <img :src="plusIcon" alt="wqdqdw" />
                           Добавить
                        </button>
                     </div>
                  </div>
                  <button v-if="!editMode.username && profile.username" type="button" class="edit-button"
                     @click="toggleEditMode('username')">
                     <img :src="editIcon" alt="Edit" class="edit-button__icon" /> Изменить
                  </button>
               </div>
            </div>

            <div class="simple-input simple-input--phone" :class="{ 'has-error': validationErrors.phone }">
               <label class="simple-input__label simple-input__label--phone">Телефон</label>
               <div v-if="!(!profile.phone && !editMode.phone)"
                  class="simple-input__wrapper simple-input__wrapper--phone">
                  <div class="simple-input__block simple-input__block--phone">
                     <input @keydown.backspace="handleBackspace" v-if="editMode.phone" id="phone"
                        v-model="profile.phone" type="tel" v-mask="'+7 (###) ###-##-##'" class="simple-input__field"
                        placeholder="Введите телефон" maxlength="18" @input="markAsChanged('phone')" />
                     <div v-else class="simple-input__text">{{ profile.phone }}
                        <div v-if="!codeInputVisible" class="simple-input__description">
                           При изменение номера потребуется подтверждение через SMS - код.
                        </div>
                        <div v-if="codeInputVisible" class="simple-input__description">
                           Введите код, отправленный на новый номер телефона.
                        </div>
                     </div>

                     <button v-if="!editMode.phone && profile.phone" type="button"
                        class="edit-button edit-button--phone" @click="toggleEditMode('phone')">
                        <img :src="editIcon" alt="Edit" class="edit-button__icon" /> Изменить
                     </button>
                  </div>
                  <div v-if="validationErrors.phone" class="simple-input__error-message">
                     {{ validationErrors.phone }}
                  </div>
                  <div v-if="editMode.phone" class="edit-input-actions">
                     <button @click="saveField('phone')" class="edit-input-actions__save-button">
                        <img :src="checkIcon" alt="" />Отправить
                     </button>
                     <button @click="cancelEdit('phone')" class="edit-input-actions__cancel-button">
                        <img :src="cancelIcon" alt="" />Отменить
                     </button>
                  </div>
                  <div v-if="codeInputVisible" class="simple-input__code-block">
                     <OTPInput v-model="code" :maxlength="4" inputmode="tel" autocomplete="one-time-code"
                        @complete="submitCode">
                        <template #default="{ slots }">
                           <div class="otp-container">
                              <div v-for="(slot, idx) in slots" :key="idx" v-bind="slot" class="otp-input" :class="{
                                 'otp-input--active': slot.isActive,
                                 'otp-input--filled': slot.char,
                              }" @click="focusSlot(idx)">
                                 <span v-if="slot.char">{{ slot.char }}</span>
                                 <span v-else-if="slot.isActive" class="otp-caret"></span>
                              </div>
                           </div>
                        </template>
                     </OTPInput>
                     <p class="timer-message" v-if="timeLeft > 0">
                        Получить новый можно через {{ formattedTime }}
                     </p>
                     <button v-else @click.prevent="saveField('phone')" class="timer-text" tabindex="0">
                        Получить новый код
                     </button>
                  </div>
               </div>
               <div v-if="!profile.phone && !editMode.phone" class="simple-input__text simple-input__text--btn">
                  <button type="button" class="edit-button" @click="toggleEditMode('phone')">
                     <img :src="plusIcon" alt="wqdqdw" />
                     Добавить
                  </button>
               </div>
            </div>

            <!-- Поле Email -->
            <div class="simple-input simple-input--phone" :class="{ 'has-error': validationErrors.email }">
               <label class="simple-input__label simple-input__label--phone">Почта</label>
               <div v-if="!(!profile.email && !editMode.email)"
                  class="simple-input__wrapper simple-input__wrapper--phone"
                  :class="{ 'simple-input__wrapper--confirm': !isConfirmed }">
                  <div class="simple-input__block simple-input__block--phone">
                     <input v-if="editMode.email" id="email" v-model="profile.email" type="email"
                        class="simple-input__field" placeholder="Введите email" @input="markAsChanged('email')" />
                     <div v-else class="simple-input__text">{{ profile.email }}
                        <div v-if="!isConfirmed && !emailCodeInputVisible" class="simple-input__confirmed">
                           Подтвердите почту
                        </div>
                        <div v-if="!isConfirmed && !emailCodeInputVisible" class="simple-input__description">Это
                           необходимо для повышения безопасности вашего
                           аккаунта и получения важных оповещений</div>
                        <div v-else-if="emailCodeInputVisible" class="simple-input__description">Введите проверочный
                           код, отправленный на указанную почту:
                        </div>
                        <div v-else class="simple-input__description">При изменение почты потребуется
                           подтверждение через код.</div>
                        <div v-if="!isConfirmed && !emailCodeInputVisible" @click="saveField('email')"
                           class="simple-input__button--confirm">
                           Подтвердить</div>
                     </div>
                     <button v-if="!editMode.email && profile.email" type="button"
                        class="edit-button edit-button--phone" @click="toggleEditMode('email')">
                        <img :src="editIcon" alt="Edit" class="edit-button__icon" /> Изменить
                     </button>
                  </div>
                  <div v-if="validationErrors.email" class="simple-input__error-message">
                     {{ validationErrors.email }}
                  </div>
                  <div v-if="editMode.email" class="edit-input-actions">
                     <button @click="saveField('email')" class="edit-input-actions__save-button"
                        :class="{ 'edit-input-actions__save-button--confirm': !isConfirmed }">
                        <img :src="checkIcon" alt="" />Сохранить
                     </button>
                     <button @click="cancelEdit('email')" class="edit-input-actions__cancel-button"
                        :class="{ 'edit-input-actions__cancel-button--confirm': !isConfirmed }">
                        <img :src="cancelIcon" alt="" />Отменить
                     </button>
                  </div>
                  <div v-if="emailCodeInputVisible" class="simple-input__code-block">
                     <!-- Используем VueOtpInput для email -->
                     <OTPInput v-model="emailCode" :maxlength="4" inputmode="tel" autocomplete="one-time-code"
                        @complete="submitEmailCode">
                        <template #default="{ slots }">
                           <div class="otp-container">
                              <div v-for="(slot, idx) in slots" :key="idx" v-bind="slot" class="otp-input" :class="{
                                 'otp-input--active': slot.isActive,
                                 'otp-input--filled': slot.char,
                              }" @click="focusSlot(idx)">
                                 <span v-if="slot.char">{{ slot.char }}</span>
                                 <span v-else-if="slot.isActive" class="otp-caret"></span>
                              </div>
                           </div>
                        </template>
                     </OTPInput>
                     <p class="timer-message" v-if="timeLeft > 0">
                        Получить новый можно через {{ formattedTime }}
                     </p>
                     <button v-else @click.prevent="saveField('email')" class="timer-text" tabindex="0">
                        Получить новый код
                     </button>
                  </div>
               </div>
               <div v-if="!profile.email && !editMode.email" class="simple-input__text simple-input__text--btn">
                  <button type="button" class="edit-button" @click="toggleEditMode('email')">
                     <img :src="plusIcon" alt="wqdqdw" />
                     Добавить
                  </button>
               </div>
            </div>

            <!-- Поле Адрес -->
            <div class="simple-input" :class="{ 'has-error': validationErrors.address }">
               <label class="simple-input__label">Адрес</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__block">
                     <input v-if="editMode.address" type="text" class="simple-input__field simple-input__field--address"
                        :class="{ 'simple-input__field--open': suggestions.length > 0 }" :placeholder="'Введите адрес'"
                        v-model="addressInputValue" @input="handleAddressInput"
                        @keydown.enter.prevent="handleEnterKey" />
                     <div v-else class="simple-input__text">{{ profile.address }}</div>
                     <div v-if="!profile.address && !editMode.address" class="simple-input__text">
                        <button type="button" class="edit-button " @click="toggleEditMode('address')">
                           <img :src="plusIcon" alt="wqdqdw" />
                           Добавить
                        </button>
                     </div>
                     <div v-if="validationErrors.address" class="simple-input__error-message">
                        {{ validationErrors.address }}
                     </div>
                     <div v-if="editMode.address" class="edit-input-actions">
                        <button @click="saveField('address')"
                           class="edit-input-actions__save-button edit-input-actions__save-button-common">
                           <img :src="checkIcon" alt="" />Отправить
                        </button>
                        <button @click="cancelEdit('address')"
                           class="edit-input-actions__cancel-button edit-input-actions__cancel-button-common">
                           <img :src="cancelIcon" alt="" />Отменить
                        </button>
                     </div>
                     <ul v-if="suggestions.length > 0" class="address-suggestions">
                        <li v-for="suggestion in suggestions" :key="suggestion.id"
                           @click="selectAddressSuggestion(suggestion)">
                           {{ suggestion.fullAddress }}
                        </li>
                     </ul>
                  </div>
                  <button v-if="!editMode.address && profile.address" type="button" class="edit-button"
                     @click="toggleEditMode('address')">
                     <img :src="editIcon" alt="Edit" class="edit-button__icon" /> Изменить
                  </button>
               </div>
            </div>

            <!-- Поле Дата регистрации -->
            <div class="simple-input">
               <label class="simple-input__label">Дата регистрации</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__text">{{ formattedDate }}</div>
               </div>
            </div>
         </form>
      </div>
      <Security />
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../store/user';
import { useCityStore } from '~/store/city';
import { debounce } from 'lodash-es';
import { fetchSuggestions } from '~/services/apiLocation';
import { confirmCode } from '~/services/apiClient';
import { validateEmail, validatePhoneNumber, validateUsername } from '~/services/validation';
import { OTPInput } from 'vue-input-otp'
import { mask as vMask } from 'vue-the-mask'
import checkIcon from '../assets/icons/check-icon.svg';
import cancelIcon from '../assets/icons/cancel.svg';
import editIcon from '../assets/icons/edit.svg';
import plusIcon from '../assets/icons/plus.svg';

defineOptions({
   directives: {
      mask: vMask
   }
})

const isAddressSelected = ref(false);

const isConfirmed = computed(() => !userStore.unconfirmed_email)

const cityStore = useCityStore();
const userStore = useUserStore();

const profile = computed(() => ({
   createdAt: userStore.createdAt,
   username: userStore.username,
   email: userStore.unconfirmed_email || userStore.email,
   phone: userStore.phoneNumber,
   uniqueCode: userStore.uniqueCode,
   address: userStore.address,
   city_id: userStore.city_id || null,
   latitude: userStore.latitude || null,
   longitude: userStore.longitude || null,
}));


let timer = null;
const timeLeft = ref(0);

onMounted(() => {
   checkAndRestoreTimer();
});

const startTimer = () => {
   const firstTimeKey = 'firstTimeTimestamp2';
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
   localStorage.setItem('timerEndTime2', endTime);

   // Обновление оставшегося времени
   updateRemainingTime(endTime);

   timer = setInterval(() => {
      updateRemainingTime(endTime);
   }, 1000);
};

// Восстановление таймера при открытии модального окна или перезагрузке страницы
const checkAndRestoreTimer = () => {
   const endTime = parseInt(localStorage.getItem('timerEndTime2'), 10);

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

const formattedTime = computed(() => {
   const minutes = Math.floor(timeLeft.value / 60);
   const seconds = timeLeft.value % 60;
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const changedFields = ref({});
const editMode = ref({
   address: false,
   username: false,
   email: false,
   phone: false,
});

const addressInputValue = ref(profile.value.address);
const suggestions = ref([]);
const codeInputVisible = ref(false);
const code = ref('');
const emailCodeInputVisible = ref(false);
const emailCode = ref('');

function focusSlot(index) {
   document.querySelectorAll('.otp-input')[index]?.focus();
}

const handleAddressInput = () => {
   isAddressSelected.value = false;
   if (addressInputValue.value.length > 3) {
      debouncedFetchSuggestions(addressInputValue.value);
   } else {
      suggestions.value = [];
   }
};

const handleClickOutside = (event) => {
   const suggestionsElement = document.querySelector('.address-suggestions');
   if (suggestionsElement && !suggestionsElement.contains(event.target)) {
      suggestions.value = [];
   }
};

onMounted(() => {
   document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside);
});

const handleBackspace = () => {

   let value = profile.value['phone'];
   const lengthBefore = value.length;

   if (['-', '('].includes(value[lengthBefore - 2])) {
      profile.value['phone'] = value.slice(0, lengthBefore - 1);
   }
};

const submitEmailCode = async () => {
   try {
      await confirmCode({ email: profile.value.email, code: emailCode.value });
      emailCodeInputVisible.value = false;
      emailCode.value = '';
      userStore.fetchAndSetUserdata();
   } catch (error) {
      console.error('Ошибка при подтверждении кода email', error);
   }
};

const submitCode = async () => {
   try {
      const formattedPhone = profile.value.phone.replace(/[^\d+]/g, '');

      await confirmCode({ phone: formattedPhone, code: code.value });
      codeInputVisible.value = false;
      code.value = '';
   } catch (error) {
      console.error('Ошибка при подтверждении кода', error);
   }
};

const validationErrors = ref({
   username: '',
   email: '',
   phone: '',
   address: '',
});

const fetchSuggestionsData = async (query) => {
   try {
      suggestions.value = await fetchSuggestions(query);
   } catch (error) {
      console.error('Ошибка получения предложений:', error);
   }
};

const debouncedFetchSuggestions = debounce(fetchSuggestionsData, 300);

const selectAddressSuggestion = (suggestion) => {
   addressInputValue.value = suggestion.fullAddress;
   suggestions.value = [];
   profile.value.address = addressInputValue.value;
   isAddressSelected.value = true;

   markAsChanged('address');

   profile.value.city_id = cityStore.selectedCity.id;
   profile.value.latitude = suggestion.geoObject.Point.pos.split(' ')[1];
   profile.value.longitude = suggestion.geoObject.Point.pos.split(' ')[0];
   markAsChanged('city_id');
   markAsChanged('latitude');
   markAsChanged('longitude');
};

const handleEnterKey = () => {
   if (suggestions.value.length > 0) {
      selectAddressSuggestion(suggestions.value[0]);
   } else {
      profile.value.address = addressInputValue.value;
      markAsChanged('address');
   }
};

watch(addressInputValue, (newValue) => {
   profile.value.address = newValue;
   markAsChanged('address');
});

const formattedDate = computed(() => {
   if (profile.value && profile.value.createdAt) {
      const date = new Date(profile.value.createdAt);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('ru-RU', options);
   }
   return '';
});

const markAsChanged = (field) => {
   console.log('markAsChanged', field);
   if (profile.value[field] !== userStore[field]) {
      changedFields.value[field] = profile.value[field];
   } else {
      delete changedFields.value[field];
   }

   validationErrors.value[field] = false;
};

const toggleEditMode = (field) => {
   // Переключаем режим редактирования
   editMode.value[field] = !editMode.value[field];

   // Если редактируется телефон или email, сбрасываем состояния
   if (field === 'phone') {
      codeInputVisible.value = false;
      code.value = '';
   } else if (field === 'email') {
      emailCodeInputVisible.value = false;
      emailCode.value = '';
   }
};

const validateField = (field) => {
   let isValid = true;
   let errorMessage = '';

   if (!changedFields.value[field]) {
      let fieldName = '';
      switch (field) {
         case 'email':
            fieldName = 'email';
            break;
         case 'phone':
            fieldName = 'номер';
            break;
         case 'username':
            fieldName = 'имя';
            break;
         default:
            fieldName = 'значение';
      }

      validationErrors.value[field] = `Вы не изменили ${fieldName}.`;
      return;
   }
   if (field === 'address' && !isAddressSelected.value) {
      errorMessage = 'Выберите адрес из списка подсказок.';
      isValid = false;
   } else if (field === 'username' && !validateUsername(profile.value.username)) {
      isValid = false;
      errorMessage = 'Имя может содержать только латинские или только кириллические буквы, пробел и тире.';
   } else if (field === 'email' && !validateEmail(profile.value.email)) {
      isValid = false;
      errorMessage = 'Пожалуйста, введите корректный email.';
   } else if (field === 'phone' && (!profile.value.phone || !validatePhoneNumber(profile.value.phone.replace(/[^\d+]/g, '')))) {
      isValid = false;
      errorMessage = 'Пожалуйста, введите корректный номер телефона.';
   }

   validationErrors.value[field] = errorMessage;

   return isValid;
};

const saveField = async (field) => {
   let response;
   if (!isConfirmed.value && (field === 'email')) {
      response = await handleSubmit();
      console.log(response);
      if (response.success) {
         emailCodeInputVisible.value = true;
         startTimer();
      } else {
         validationErrors.value[field] = response.message || response;
         return;
      }
   }

   if (editMode.value[field]) {
      const isValid = validateField(field);

      if (!isValid) return;

      if (field === 'phone') {
         response = await handleSubmit();

         if (response.success) {
            codeInputVisible.value = true;
            startTimer();
         } else {
            validationErrors.value[field] = response.message || response;
            return;
         }
      } else if (field === 'email') {
         response = await handleSubmit();

         if (response.success) {
            emailCodeInputVisible.value = true;
            startTimer();
         } else {
            validationErrors.value[field] = response.message || response;
            return;
         }
      } else {
         response = await handleSubmit();

         if (!response.success) {
            validationErrors.value[field] = response.message || response;
            return;
         }
      }

      // Если нет ошибок, сбрасываем режим редактирования
      editMode.value[field] = false;
   }
};

const cancelEdit = (field) => {
   if (field === 'phone') {
      profile.value[field] = userStore.phoneNumber;
   } else if (field === 'email') {
      profile.value[field] = userStore.unconfirmed_email || userStore.email;
   } else {
      profile.value[field] = userStore[field];
   }
   delete changedFields.value[field];
   editMode.value[field] = false;
   codeInputVisible.value = false;
   code.value = '';
   validationErrors.value[field] = false;
};

const handleSubmit = async () => {
   if (!isConfirmed.value && (Object.keys(changedFields.value).length == 0)) {
      const response = await userStore.updateProfile({ email: userStore.unconfirmed_email });

      if (response.success) {
         console.log('Email успешно обновлен:', response.data);
      }

      return response;
   }

   console.log('changedFields.value', changedFields.value);
   if (Object.keys(changedFields.value).length > 0) {
      const response = await userStore.updateProfile(changedFields.value);
      if (response.success) {
         Object.keys(editMode.value).forEach((key) => {
            editMode.value[key] = false;
         });
         changedFields.value = {};

         console.log('Профиль успешно обновлен:', response.data);
      }

      return response;
   }
};
</script>

<style scoped lang="scss">
.edit-profile {
   width: 100%;
   background-color: #fff;
   border-radius: 8px;
   display: flex;
   flex-direction: column;
   margin-bottom: 24px;
   padding: 16px;

   @media (max-width: 768px) {
      padding: 0;
   }

   .address-suggestions {
      position: absolute;
      background-color: #fff;
      border: 1px solid #3366FF;
      border-top: 1px solid #C4C4C4;
      border-radius: 0 0 6px 6px;
      top: 34px;
      width: 100%;
      max-height: 180px;
      overflow-y: auto;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 10;

      li {
         padding: 8px;
         font-size: 14px;
         cursor: pointer;
         transition: background-color 0.3s;

         &:hover {
            background-color: #f0f0f0;
         }
      }
   }

   &__title {
      display: flex;
      gap: 40px;
      align-items: center;
      color: #003BCE;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
   }

   &__subtitle {
      color: #323232;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 24px;
   }

   &__form-container {
      display: flex;
      justify-content: flex-start;
      margin-left: -16px;
   }

   &__form {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   .simple-input {
      display: flex;
      margin-bottom: 16px;
      margin-right: 16px;
      margin-left: 16px;

      &--phone {
         margin-right: 0;
      }

      &__confirmed {
         font-size: 14px;
         margin-top: 8px;
         color: #FF5959;
      }

      &__code-block {
         margin-top: 16px;
      }

      @media (max-width: 768px) {
         align-items: flex-start;
         flex-direction: column;
         gap: 8px;
         margin-right: 0;
      }

      &__label {
         color: #A8A8A8;
         font-size: 14px;
         min-width: 200px;

         @media (max-width: 768px) {
            font-size: 12px;
         }
      }

      &__block {
         width: 100%;

         &--phone {
            display: flex;
         }
      }

      &__wrapper {
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         position: relative;
         width: 100%;

         &--phone {
            padding: 16px;
            margin-left: -16px;
            flex-direction: column;
            border-radius: 6px;
            background-color: #EEF9FF;

            @media (max-width: 768px) {
               margin-left: 0;
            }
         }

         &--confirm {
            background-color: #FFF6DF;
         }
      }

      &__text,
      &__field {
         width: 100%;
         font-size: 14px;
         min-width: 220px;
         line-height: 18px;

      }

      &__text {

         img {
            width: 12px;
            height: 12px;
            margin-right: 6px;
         }

         &--btn {
            min-width: none;
            max-width: 200px;
            top: 20%;
         }
      }

      &__field {
         height: 34px;
         border: 1px solid #C4C4C4;
         border-radius: 6px;
         padding: 8px;
         font-size: 14px;
         color: #323232;
         outline: none;

         &:focus {
            border-color: #3366FF;
         }

         &--open {
            border-radius: 6px 6px 0 0;
            border-color: #3366FF;
            border-bottom: none;
         }
      }

      &__description {
         margin-top: 4px;
         font-size: 14px;
         color: #787878;
      }

      &__button--confirm {
         background-color: #3366FF;
         color: #FFFFFF;
         display: flex;
         align-items: center;
         justify-content: center;
         height: 34px;
         width: 135px;
         border-radius: 6px;
         margin-top: 16px;
         transition: background-color 0.2s ease;

         &:hover {
            background-color: #144DF8;
         }
      }

      .edit-input-actions {
         display: flex;
         gap: 40px;
         margin-top: 10px;
      }
   }

   .edit-button {
      display: flex;
      align-items: flex-start;
      line-height: 1;
      background-color: transparent;
      color: #3366FF;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;

      @media (max-width: 768px) {
         padding-right: 16px;
      }

      &__icon {
         width: 12px;
         height: 12px;
         margin-right: 6px;
      }

      &--phone {
         @media (max-width: 768px) {
            padding-right: 0;
         }
      }
   }

   .edit-input-actions {
      display: flex;
      gap: 40px;
      margin-top: 10px;

      &__save-button {
         display: flex;
         justify-content: center;
         align-items: center;
         height: 34px;
         gap: 8px;
         background-color: #EEF9FF;
         color: #3366FF;
         border: none;
         border-radius: 6px;
         font-size: 14px;
         cursor: pointer;
         transition: background-color 0.3s;

         &--confirm {
            background-color: #FFF6DF;
         }

         &-common {
            background-color: #FFFFFF;
         }

         img {
            width: 14px;
         }
      }

      &__cancel-button {
         display: flex;
         justify-content: center;
         gap: 8px;
         align-items: center;
         height: 34px;
         background-color: #EEF9FF;
         color: #3366FF;
         border: none;
         border-radius: 6px;
         font-size: 14px;
         cursor: pointer;
         transition: background-color 0.3s;

         &--confirm {
            background-color: #FFF6DF;
         }

         &-common {
            background-color: #FFFFFF;
         }

         img {
            width: 14px;
         }
      }
   }

   &__submit-button {
      display: block;
      padding: 4px 8px;
      background-color: #3366FF;
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s;

      &-common {
         background-color: #FFFFFF;
      }

      &:hover {
         background-color: #0044cc;
      }
   }
}

.simple-input__field--address {
   width: 100%;

}

.simple-input.has-error .simple-input__field {
   border-color: #FF5959;
   color: #FF5959;
}

.simple-input__error-message {
   color: #FF5959;
   font-size: 12px;
   margin-top: 6px;
}

.timer-message {
   margin-top: 16px;
   color: #787878;
   font-size: 14px;
   text-align: left;
}

.timer-text {
   margin-top: 16px;
   outline: none;
   background-color: transparent;
   border: none;
   color: #3366FF;
   font-size: 14px;
   text-align: center;
}

.otp-container {
   display: flex;
   gap: 12px;
   justify-content: flex-start;
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
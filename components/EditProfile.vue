<template>
   <div class="edit-profile">
      <client-only>
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
               <div class="simple-input">
                  <label class="simple-input__label">Имя</label>
                  <div class="simple-input__wrapper">
                     <div class="simple-input__block">
                        <input v-if="editMode.username" id="username" v-model="profile.username" type="text"
                           class="simple-input__field" placeholder="Введите имя пользователя"
                           @input="markAsChanged('username')" />
                        <div v-else class="simple-input__text">{{ profile.username }}</div>
                        <div v-if="editMode.username" class="edit-input-actions">
                           <button @click="saveField('username')" class="edit-input-actions__save-button">Сохранить
                              изменения</button>
                           <button @click="cancelEdit('username')"
                              class="edit-input-actions__cancel-button">Отмена</button>
                        </div>
                        <div v-if="!profile.username && !editMode.username" class="simple-input__text">
                           <button type="button" class="edit-button" @click="toggleEditMode('username')">
                              <img src="../assets/icons/plus.svg" alt="wqdqdw">
                              Добавить
                           </button>
                        </div>
                     </div>
                     <button v-if="!editMode.username && profile.username" type="button" class="edit-button"
                        @click="toggleEditMode('username')">
                        <img src="../assets/icons/edit.svg" alt="Edit" class="edit-button__icon" /> Изменить
                     </button>
                  </div>

               </div>

               <!-- Поле Логин -->
               <div class="simple-input">
                  <label class="simple-input__label">Логин</label>
                  <div class="simple-input__wrapper">
                     <div class="simple-input__block">
                        <input v-if="editMode.login" id="login" v-model="profile.login" type="text"
                           class="simple-input__field" placeholder="Введите логин" @input="markAsChanged('login')" />
                        <div v-else class="simple-input__text">{{ profile.login }}</div>
                        <div v-if="editMode.login" class="edit-input-actions">
                           <button @click="saveField('login')" class="edit-input-actions__save-button">Сохранить
                              изменения</button>
                           <button @click="cancelEdit('login')"
                              class="edit-input-actions__cancel-button">Отмена</button>
                        </div>
                        <div v-if="!profile.login && !editMode.login" class="simple-input__text">
                           <button type="button" class="edit-button" @click="toggleEditMode('login')">
                              <img src="../assets/icons/plus.svg" alt="wqdqdw">
                              Добавить
                           </button>
                        </div>
                     </div>
                     <button v-if="!editMode.login && profile.login" type="button" class="edit-button"
                        @click="toggleEditMode('login')">
                        <img src="../assets/icons/edit.svg" alt="Edit" class="edit-button__icon" /> Изменить
                     </button>
                  </div>
               </div>

               <!-- Поле Телефон -->
               <div class="simple-input simple-input--phone">
                  <label class="simple-input__label simple-input__label--phone">Телефон</label>
                  <div v-if="!(!profile.phone && !editMode.phone)" class="simple-input__wrapper simple-input__wrapper--phone">
                     <div class="simple-input__block simple-input__block--phone">
                        <input v-mask="'+7 (###) ###-##-##'" v-if="editMode.phone" id="phone" v-model="profile.phone"
                           type="text" class="simple-input__field" placeholder="Введите телефон" maxlength="18"
                           @input="markAsChanged('phone')" />
                        <div v-else class="simple-input__text">{{ profile.phone }} <div
                              class="simple-input__description">При изменение номера потребуется подтверждение через SMS
                              - код.</div>
                        </div>

                        <button v-if="!editMode.phone && profile.phone" type="button"
                           class="edit-button edit-button--phone" @click="toggleEditMode('phone')">
                           <img src="../assets/icons/edit.svg" alt="Edit" class="edit-button__icon" /> Изменить
                        </button>
                     </div>
                     <div v-if="editMode.phone" class="edit-input-actions">
                        <button @click="saveField('phone')" class="edit-input-actions__save-button">Сохранить
                           изменения</button>
                        <button @click="cancelEdit('phone')" class="edit-input-actions__cancel-button">Отмена</button>
                     </div>
                     <div v-if="codeInputVisible" class="simple-input__code-block">
                        <input id="code" v-model="code" type="text" class="simple-input__field"
                           placeholder="Введите код" maxlength="6" />
                        <div class="simple-input__description">Введите код, отправленный на новый номер телефона.</div>
                        <div class="edit-input-actions">
                           <button @click="submitCode" class="edit-input-actions__save-button">Отправить</button>
                           <button @click="cancelCode" class="edit-input-actions__cancel-button">Отмена</button>
                        </div>
                     </div>
                  </div>
                  <div v-if="!profile.phone && !editMode.phone" class="simple-input__text simple-input__text--btn">
                     <button type="button" class="edit-button" @click="toggleEditMode('phone')">
                        <img src="../assets/icons/plus.svg" alt="wqdqdw">
                        Добавить
                     </button>
                  </div>
               </div>

               <!-- Поле Email -->
               <div class="simple-input simple-input--phone">
                  <label class="simple-input__label simple-input__label--phone">Почта</label>
                  <div v-if="!(!profile.email && !editMode.email)"
                     class="simple-input__wrapper simple-input__wrapper--phone">
                     <div class="simple-input__block simple-input__block--phone">
                        <input v-if="editMode.email" id="email" v-model="profile.email" type="email"
                           class="simple-input__field" placeholder="Введите email" @input="markAsChanged('email')" />
                        <div v-else class="simple-input__text">{{ profile.email
                           }} <div class="simple-input__description">При изменение почты потребуется подтверждение через
                              код.
                           </div>
                        </div>
                        <button v-if="!editMode.email && profile.email" type="button"
                           class="edit-button edit-button--phone" @click="toggleEditMode('email')">
                           <img src="../assets/icons/edit.svg" alt="Edit" class="edit-button__icon" /> Изменить
                        </button>
                     </div>
                     <div v-if="editMode.email" class="edit-input-actions">
                        <button @click="saveField('email')" class="edit-input-actions__save-button">Сохранить</button>
                        <button @click="cancelEdit('email')" class="edit-input-actions__cancel-button">Отмена</button>
                     </div>
                     <div v-if="emailCodeInputVisible" class="simple-input__code-block">
                        <input id="emailCode" v-model="emailCode" type="text" class="simple-input__field"
                           placeholder="Введите код" maxlength="6" />
                        <div class="simple-input__description">Введите код, отправленный на новый email.</div>
                        <div class="edit-input-actions">
                           <button @click="submitEmailCode" class="edit-input-actions__save-button">Отправить</button>
                           <button @click="cancelEmailCode" class="edit-input-actions__cancel-button">Отмена</button>
                        </div>
                     </div>
                  </div>
                  <div v-if="!profile.email && !editMode.email" class="simple-input__text simple-input__text--btn">
                     <button type="button" class="edit-button" @click="toggleEditMode('email')">
                        <img src="../assets/icons/plus.svg" alt="wqdqdw">
                        Добавить
                     </button>
                  </div>
               </div>

               <!-- Поле Адрес -->
               <div class="simple-input">
                  <label class="simple-input__label">Адрес</label>
                  <div class="simple-input__wrapper">
                     <div class="simple-input__block">
                        <input v-if="editMode.address" type="text"
                           class="simple-input__field simple-input__field--address" :placeholder="'Введите адрес'"
                           v-model="addressInputValue" @input="handleAddressInput"
                           @keydown.enter.prevent="handleEnterKey" />
                        <div v-else class="simple-input__text">{{ profile.address }}</div>
                        <div v-if="!profile.address && !editMode.address" class="simple-input__text">
                           <button type="button" class="edit-button " @click="toggleEditMode('address')">
                              <img src="../assets/icons/plus.svg" alt="wqdqdw">
                              Добавить
                           </button>
                        </div>
                        <div v-if="editMode.address" class="edit-input-actions">
                           <button @click="saveField('address')"
                              class="edit-input-actions__save-button">Сохранить</button>
                           <button @click="cancelEdit('address')"
                              class="edit-input-actions__cancel-button">Отмена</button>
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
                        <img src="../assets/icons/edit.svg" alt="Edit" class="edit-button__icon" /> Изменить
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
      </client-only>
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../store/user';
import { debounce } from 'lodash-es';
import { fetchSuggestions } from '~/services/apiLocation';
import { confirmCode } from '~/services/apiClient';

const userStore = useUserStore();
const profile = ref({
   createdAt: userStore.createdAt,
   username: userStore.username,
   login: userStore.login,
   email: userStore.email,
   phone: userStore.phoneNumber,
   uniqueCode: userStore.uniqueCode,
   address: userStore.address,
   city: userStore.city || null,
   latitude: userStore.latitude || null,
   longitude: userStore.longitude || null,
});

const changedFields = ref({});
const editMode = ref({
   address: false,
   username: false,
   login: false,
   email: false,
   phone: false,
});

const addressInputValue = ref(profile.value.address);
const suggestions = ref([]);
const codeInputVisible = ref(false);
const code = ref('');
const emailCodeInputVisible = ref(false);
const emailCode = ref('');

const handleAddressInput = () => {
   if (addressInputValue.value.length > 3) {
      debouncedFetchSuggestions(addressInputValue.value);
   } else {
      suggestions.value = [];
   }
};

const submitEmailCode = async () => {
   try {
      await confirmCode({ email: profile.value.email, code: emailCode.value });
      emailCodeInputVisible.value = false;
      emailCode.value = '';
   } catch (error) {
      console.error('Ошибка при подтверждении кода email', error);
   }
};

const cancelEmailCode = () => {
   emailCodeInputVisible.value = false;
   emailCode.value = '';
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

const cancelCode = () => {
   codeInputVisible.value = false;
   code.value = '';
};

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
   markAsChanged('address');

   profile.value.city = suggestion.geoObject.metaDataProperty.GeocoderMetaData.Address.Components.find(comp => comp.kind === 'locality')?.name || '';
   profile.value.latitude = suggestion.geoObject.Point.pos.split(' ')[1];
   profile.value.longitude = suggestion.geoObject.Point.pos.split(' ')[0];
   markAsChanged('city');
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
};

const toggleEditMode = (field) => {
   if (editMode.value[field]) {
      profile.value[field] = addressInputValue.value;
      markAsChanged(field);
   }
   editMode.value[field] = !editMode.value[field];
};

const saveField = async (field) => {
   if (editMode.value[field]) {
      if (field === 'phone') {
         codeInputVisible.value = true;
         await handleSubmit();
      } else if (field === 'email') {
         emailCodeInputVisible.value = true;
         await handleSubmit();
      } else {
         await handleSubmit();
      }
   }
   editMode.value[field] = false;
};

const cancelEdit = (field) => {
   editMode.value[field] = false;
   codeInputVisible.value = false;
   code.value = '';
};

const handleSubmit = async () => {
   try {
      if (Object.keys(changedFields.value).length > 0) {
         await userStore.updateProfile(changedFields.value);
         Object.keys(editMode.value).forEach((key) => {
            editMode.value[key] = false;
         });
         changedFields.value = {};
      }
   } catch (error) {
      console.error('Ошибка при обновлении профиля', error);
   }
};
</script>

<style scoped lang="scss">
.simple-input__code-block {
   margin-top: 1rem;
}

.simple-input__description {
   margin-top: 0.5rem;
   font-size: 0.875rem;
   color: #666;
}

.edit-profile {
   width: 100%;
   background-color: #fff;
   border-radius: 8px;
   margin-bottom: 24px;
   padding: 16px;

   @media (max-width: 768px) {
      padding: 0;
   }

   .address-suggestions {
      position: absolute;
      background-color: #fff;
      border: 1px solid #C4C4C4;
      border-radius: 6px;
      top: 34px;
      width: 100%;
      max-height: 200px;
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
         gap: 16px;

         &--phone {
            padding: 16px;
            margin-left: -16px;
            flex-direction: column;
            gap: 8px;
            border-radius: 6px;
            background-color: #D6EFFF;

            @media (max-width: 768px) {
               margin-left: 0;
            }

         }
      }

      &__text,
      &__field {
         width: 100%;
         font-size: 14px;
         min-width: 220px;
         line-height: 18px;
      }

      &__field {
         &--address {
            width: 100%;
         }
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
      }

      &__description {
         font-size: 14px;
         color: #3366FF;
         margin-top: 8px;
      }

      .edit-input-actions {
         display: flex;
         gap: 16px;
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
      gap: 16px;
      margin-top: 10px;

      &__save-button {
         display: flex;
         justify-content: center;
         align-items: center;
         height: 34px;
         width: 100%;
         background-color: #D6EFFF;
         color: #3366FF;
         border: none;
         border-radius: 6px;
         font-size: 14px;
         cursor: pointer;
         transition: background-color 0.3s;
      }

      &__cancel-button {
         display: flex;
         justify-content: center;
         align-items: center;
         height: 34px;
         width: 100%;
         background-color: #ffffff;
         color: #3366FF;
         border: none;
         border-radius: 6px;
         font-size: 14px;
         cursor: pointer;
         transition: background-color 0.3s;
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

      &:hover {
         background-color: #0044cc;
      }
   }
}
</style>

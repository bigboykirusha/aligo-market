<template>
   <div class="photo-info">
      <div class="car-info">
         <div class="car-info__description">
            <div class="car-info__title"> {{ brand }} {{ model }}, {{ year }}</div>
            <div class="car-info__block">
               <div class="car-info__amount">{{ formatNumberWithSpaces(amount) }} ₽</div>
               <WishlistButton v-if="!(userId === userStore.userId)" @toggle-login-modal="toggleLoginModal" :id="adsId"
                  :is_in_favorites="inFavorite" />
            </div>
         </div>
         <div class="car-info__content">
            <p v-for="(value, key) in characteristics" :key="key" class="car-info__text">
               <span class="car-info__label">{{ key }}: </span>{{ value }}
            </p>
         </div>
      </div>
      <div class="user-info">
         <div class="user-info__container">
            <div class="user-info__block">
               <div class="user-info__name">{{ userData.username }}</div>
               <div class="user-info__rating">
                  <div class="user-info__rating-text">
                     <template v-if="userData.count_reviews_about_myself > 0">
                        {{ userData.grade }}
                        <NuxtRating :rating-value="Number(userData.grade)" :rating-count="5" :rating-size="9"
                           :rating-spacing="6" :active-color="'#3366FF'" :inactive-color="'#FFFFFF'"
                           :border-color="'#3366FF'" :border-width="2" :rounded-corners="true" :read-only="true" />
                        <div class="user-info__reviews">
                           {{ userData.count_reviews_about_myself }} {{
                              pluralizeReview(Number(userData.count_reviews_about_myself))
                           }}
                        </div>
                     </template>
                     <template v-else>
                        У пользователя нет отзывов
                     </template>
                  </div>
               </div>
            </div>
            <div class="user-info__avatar">
               <img :src="userAvatarUrl" alt="Аватар пользователя" />
            </div>
         </div>
         <div class="user-info__actions">
            <button v-if="!phoneNumber" class="user-info__actions-button--show-phone" @click="showPhoneNumber">
               {{ showPhoneText }}
            </button>
            <a v-else :href="'tel:' + rawPhoneNumber" class="user-info__actions-button--show-phone">
               {{ phoneNumber }}
            </a>
            <button class="user-info__actions-button--write" @click="handleWriteMessage">
               Написать
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserOtherInfo, getUserPhoneEmail, getCarById } from '~/services/apiClient.js';
import { getImageUrl } from '~/services/imageUtils';
import { useUserStore } from '~/store/user';
import avatar from '../assets/icons/avatar-revers.svg';
import { useChatStore } from '~/store/chatStore';
import { formatNumberWithSpaces } from '~/services/amountUtils';
import { useRouter } from '#vue-router';
import { useLoginModalStore } from '~/store/loginModal.js';

const loginModalStore = useLoginModalStore();

const toggleLoginModal = () => {
   loginModalStore.toggleLoginModal();
};

const props = defineProps({
   userId: {
      type: Number,
      required: true
   },
   adsId: {
      type: Number,
      required: true
   }
});

const emit = defineEmits(['close-viewer']);

const userStore = useUserStore();
const userData = ref({});
const userAvatarUrl = ref('');
const phoneNumber = ref('');
const rawPhoneNumber = ref('');
const carData = ref(null);
const amount = ref(null);
const brand = ref('');
const model = ref('');
const year = ref('');
const inFavorite = ref(false);
const showPhoneText = ref('Показать номер');
const router = useRouter();

const fetchUserData = async () => {
   try {
      const data = await getUserOtherInfo(props.userId);
      userData.value = data;
      inFavorite.value = data.is_in_favorites;
      userAvatarUrl.value = getImageUrl(data.photo?.path, avatar);
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
   }
};

const fetchCarData = async () => {
   try {
      const data = await getCarById(props.adsId);
      carData.value = data;
      amount.value = data.ads_parameter.amount;
      brand.value = data.auto_technical_specifications[0].brand.title;
      model.value = data.auto_technical_specifications[0].model.title;
      year.value = data.auto_technical_specifications[0].year_release.title;
   } catch (error) {
      console.error('Ошибка при получении данных автомобиля: ', error);
   }
};

const characteristics = computed(() => {
   if (!carData.value) return {};

   const mileage = carData.value.auto_history_conditions[0].mileage;
   const mileageText = mileage ? `${mileage} км` : 'Не указано';

   return {
      'Пробег': mileageText,
      'Владельцев по ПТС': carData.value.auto_history_conditions[0].count_owners?.title || 'Не указано',
      'Состояние': carData.value.auto_history_conditions[0].state.title || 'Не указано',
      'Тип двигателя': carData.value.auto_technical_specifications[0].engine_type.title || 'Не указано',
      'Привод': carData.value.auto_technical_specifications[0].drive.title || 'Не указано',
      'Тип кузова': carData.value.auto_technical_specifications[0].car_body_type.title || 'Не указано',
      'Цвет': carData.value.auto_appearances[0].color.title || 'Не указано',
      'Руль': carData.value.auto_technical_specifications[0].handlebar.title || 'Не указано',
   };
});

function pluralizeReview(count) {
   const lastDigit = count % 10;
   const lastTwoDigits = count % 100;

   if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'отзывов';
   }

   if (lastDigit === 1) {
      return 'отзыв';
   }

   if (lastDigit >= 2 && lastDigit <= 4) {
      return 'отзыва';
   }

   return 'отзывов';
}

const formatPhoneNumber = (phone) => {
   const cleaned = ('' + phone).replace(/\D/g, '');
   const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
   if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
   }
   return phone;
};

const chatStore = useChatStore();

const handleWriteMessage = () => {
   writeMessage();
   emit('close-viewer');
};

const writeMessage = () => {
   chatStore.openChat(router);
};

const showPhoneNumber = async () => {
   try {
      if (!phoneNumber.value) {
         const { phone } = await getUserPhoneEmail(props.userId);
         rawPhoneNumber.value = phone;
         phoneNumber.value = formatPhoneNumber(phone);
         showPhoneText.value = phoneNumber.value;
      }
   } catch (error) {
      console.error('Ошибка при получении номера телефона:', error);
   }
};

onMounted(() => {
   fetchUserData();
   fetchCarData();
});
</script>

<style lang="scss" scoped>
.photo-info {
   min-width: 320px;
   padding: 32px 24px;
   display: flex;
   height: 100%;
   flex-direction: column;
   border-radius: 8px;
   background-color: #fff;

   @media (max-width: 1024px) {
      max-height: 306px;
      padding: 24px;
   }

   @media (max-width: 767px) {
      max-height: 230px;
      margin: 0 -16px;
      border-radius: 8px 8px 0 0;
   }
}

.car-info {
   height: 100%;
   width: 100%;
   color: #323232;

   &__title {
      color: #003BCE;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 8px;
      font-weight: 700;

      @media (max-width: 1024px) {
         margin-bottom: 4px;
      }
   }

   &__description {
      margin-bottom: 24px;

      @media (max-width: 1024px) {
         margin-bottom: 16px;
      }
   }

   &__block {
      display: flex;
      align-items: center;
      justify-content: space-between;
   }

   &__amount {
      color: #323232;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
   }

   .car-info__content {
      display: grid;
      gap: 16px;
      padding: 16px 0;
      border-top: 1px solid #D6EFFF;

      @media (max-width: 1024px) and (min-width: 768px) {
         grid-template-columns: repeat(2, 1fr);
         gap: 8px;
      }

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__text {
      display: inline-block;
      width: 100%;
      font-size: 14px;
   }

   &__label {
      color: #787878;
   }
}

.user-info {
   height: fit-content;
   display: flex;
   gap: 8px;
   padding-top: 24px;
   flex-direction: column;
   align-items: flex-start;
   border-top: 1px solid #D6EFFF;
   text-align: center;

   @media (max-width: 1024px) and (min-width: 768px) {
      padding-top: 16px;
      flex-direction: row;
      align-items: center;
      gap: 120px;
   }

   @media (max-width: 768px) {
      padding-top: 16px;
   }

   &__block {
      display: flex;
      gap: 8px;
      flex-direction: column;
      align-items: flex-start;

      @media (max-width: 768px) {
         gap: 4px;
      }
   }

   &__container {
      display: flex;
      gap: 8px;
      width: 100%;
      flex-direction: row;
      align-items: center;
   }

   &__avatar {
      margin-left: auto;
      width: 47px;
      height: 47px;

      img {
         width: 47px;
         height: 47px;
         border-radius: 50%;
         object-fit: cover;
      }
   }

   &__name {
      font-size: 16px;
      font-weight: bold;
      line-height: 20px;
      text-align: left;
      color: #323232;
   }

   &__rating {
      display: flex;
      align-items: center;
      gap: 16px;

      &-text {
         font-size: 14px;
         display: flex;
         gap: 8px;
         align-items: center;
         color: #3366FF;

         &--empty {
            color: #323232;
         }
      }
   }

   &__reviews {
      font-size: 14px;
      color: #3366FF;
      margin-left: 8px;
   }

   &__registered-date {
      font-size: 14px;
      color: #323232;
      padding-top: 16px;
   }

   &__actions {
      display: flex;
      padding-top: 16px;
      gap: 8px;
      width: 100%;

      @media (max-width: 1024px) and (min-width: 768px) {
         padding-top: 0;
      }

      button,
      a {
         display: block;
         width: 100%;
         padding: 10px;
         font-size: 14px;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         transition: background-color 0.3s, color 0.3s;
      }

      .user-info__actions-button--write {
         background-color: #5F2EEA;
         color: white;

         @media (max-width: 1024px) {
            max-width: 50%;
         }

         &:hover {
            background-color: #5716DF;
         }
      }

      .user-info__actions-button--show-phone {
         background-color: #3366FF;
         color: #FFF;
         border: none;

         &:hover {
            background-color: #144DF8;
         }
      }
   }
}
</style>

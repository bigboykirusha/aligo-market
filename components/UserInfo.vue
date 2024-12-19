<template>
   <div class="user-info">
      <div class="user-info__container">
         <div class="user-info__avatar">
            <img :src="userAvatarUrl" alt="Аватар пользователя" />
         </div>
         <div class="user-info__block">
            <div class="user-info__name">{{ userData.username }}</div>
            <div class="user-info__rating">
               <div class="user-info__rating-text">
                  <template v-if="userData.count_reviews_about_myself > 0">
                     {{ userData.grade }}
                     <NuxtRating :rating-value="Number(userData.grade)" :rating-count="5" :rating-size="10"
                        :rating-spacing="6" :active-color="'#3366FF'" :inactive-color="'#FFFFFF'"
                        :border-color="'#3366FF'" :border-width="2" :rounded-corners="true" :read-only="true" />
                     <div @click="toggleReviewsModal" class="user-info__reviews">
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
            <div class="user-info__completed-ads">ID: {{ formatUniqueCode(userData.unique_code) }}</div>
            <div class="user-info__completed-ads">Частное лицо</div>
            <div class="user-info__completed-ads">Завершено 5 объявлений</div>
            <div class="user-info__registered-date">{{ registeredDate }}</div>
         </div>
      </div>
      <div class="user-info__actions">
         <button v-if="!phoneNumber" class="user-info__actions-button--show-phone" @click="showPhoneNumber">
            {{ showPhoneText }}
         </button>
         <a v-else :href="'tel:' + rawPhoneNumber" class="user-info__actions-button--show-phone" @click="handleCall">
            {{ phoneNumber }}
         </a>
         <button class="user-info__actions-button--write" @click="handleWriteMessage">
            Написать
         </button>
      </div>
   </div>
   <ReviewsPopup :userId="props.userId" :visible="isReviewsPopupVisible"
      :count_reviews_about_myself="count_reviews_about_myself" :rating="rating" @update:visible="toggleReviewsModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserOtherInfo, getUserPhoneEmail } from '~/services/apiClient.js';
import { getImageUrl } from '~/services/imageUtils';
import avatar from '../assets/icons/avatar-revers.svg';
import { useChatStore } from '~/store/chatStore';
import { useUserStore } from '~/store/user';
import { useLoginModalStore } from '~/store/loginModal.js';
import { useRouter } from '#vue-router';

const router = useRouter();

const loginModalStore = useLoginModalStore();

const toggleLoginModal = () => {
   loginModalStore.toggleLoginModal();
};

const isReviewsPopupVisible = ref(false);

const toggleReviewsModal = (visible) => {
   isReviewsPopupVisible.value = visible;
};

const props = defineProps({
   userId: {
      type: String,
      required: true
   }
});

const userData = ref({});
const userAvatarUrl = ref('');
const registeredDate = ref('');
const phoneNumber = ref('');
const rawPhoneNumber = ref('');
const showPhoneText = ref('Показать номер');

const userStore = useUserStore();

const fetchUserData = async () => {
   try {
      const data = await getUserOtherInfo(props.userId);
      userData.value = data;
      userAvatarUrl.value = getImageUrl(data.photo?.path, avatar);
      registeredDate.value = formatDate(new Date(data.created_at));
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
   }
};

const formatUniqueCode = (code) => {
   return code ? code.replace(/(.{4})(?=.)/g, '$1 ') : '';
};

const formatDate = (date) => {
   const options = { year: 'numeric', month: 'long' };
   return `На сайте с ${date.toLocaleString('ru', options)}`;
};

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

const writeMessage = () => {
   if (!userStore.isLoggedIn) {
      toggleLoginModal();
      return;
   }
   chatStore.openChat();
};

const handleWriteMessage = () => {
   writeMessage();
};

const handleCall = () => {
   if (!userStore.isLoggedIn) {
      toggleLoginModal();
      return;
   }
};

const showPhoneNumber = async () => {
   try {
      if (!userStore.isLoggedIn) {
         toggleLoginModal();
         return;
      }

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
});
</script>

<style lang="scss" scoped>
.user-info {
   height: fit-content;
   min-width: 270px;
   background-color: #fff;
   display: flex;
   gap: 8px;
   flex-direction: column;
   align-items: flex-start;
   padding: 24px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   text-align: center;

   &__block {
      display: flex;
      gap: 8px;
      flex-direction: column;
      align-items: flex-start;
   }

   &__container {
      display: flex;
      gap: 8px;
      flex-direction: column;
      align-items: flex-start;

      @media (max-width: 768px) {
         flex-direction: row;
         gap: 24px;
      }
   }

   &__avatar {
      margin: auto 0;
      margin-right: auto;

      img {
         width: 160px;
         height: 160px;
         border-radius: 50%;
         object-fit: cover;
         margin-bottom: 8px;

         @media (max-width: 768px) {
            width: 120px;
            height: 120px;
         }

         @media (max-width: 420px) {
            width: 100px;
            height: 100px;
            margin-bottom: 0;
         }
      }
   }

   &__name {
      font-size: 24px;
      font-weight: bold;
      line-height: 30px;
      text-align: left;
      color: #323232;

      @media (max-width: 768px) {
         font-size: 20px;
         line-height: 24px;
      }
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
      cursor: pointer;

      &:hover {
         text-decoration: underline;
      }
   }

   &__completed-ads,
   &__registered-date {
      font-size: 14px;
      color: #323232;
   }

   &__registered-date {
      padding-bottom: 16px;
   }

   &__actions {
      display: flex;
      border-top: 1px solid #D6D6D6;
      padding-top: 24px;
      flex-direction: column;
      gap: 16px;
      width: 100%;

      @media (max-width: 768px) {
         flex-direction: row;
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
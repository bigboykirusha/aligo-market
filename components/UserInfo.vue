<template>
   <div class="user-info">
      <template v-if="isLoading">
         <div class="user-info__skeleton">
            <div class="user-info__skeleton-container">
               <div class="user-info__skeleton-avatar"></div>
               <div class="user-info__skeleton-block">
                  <div class="user-info__skeleton-name"></div>
                  <div class="user-info__skeleton-rating"></div>
                  <div class="user-info__skeleton-id"></div>
                  <div class="user-info__skeleton-status"></div>
                  <div class="user-info__skeleton-ads"></div>
                  <div class="user-info__skeleton-date"></div>
               </div>
            </div>
            <div class="user-info__skeleton-actions">
               <div class="user-info__skeleton-button"></div>
               <div class="user-info__skeleton-button"></div>
            </div>
         </div>
      </template>
      <template v-else>
         <div class="user-info__container">
            <div class="user-info__avatar">
               <img :src="userAvatarUrl" alt="Аватар пользователя" />
            </div>
            <div class="user-info__block">
               <div class="user-info__name">{{ userData.username }}</div>
               <div class="user-info__rating">
                  <div class="user-info__rating-text">{{ !userData.grade ? '0.0' : rating }}</div>
                  <NuxtRating :rating-value="Number(userData.grade)" :rating-count="5" :rating-size="9"
                     :rating-spacing="6" active-color="#3366FF" inactive-color="#FFFFFF" border-color="#3366FF"
                     :border-width="2" rounded-corners read-only />
                  <span class="user-info__rating-count">
                     {{ userData.count_reviews_about_myself === 0 ? 'Нет отзывов' : `${pluralizedReviews}` }}
                  </span>
               </div>
               <div class="user-info__completed-ads">ID: {{ formattedUniqueCode }}</div>
               <div class="user-info__completed-ads">Частное лицо</div>
               <div class="user-info__completed-ads">Завершено 0 объявлений</div>
               <div class="user-info__registered-date">{{ registeredDate }}</div>
            </div>
         </div>
         <div class="user-info__actions">
            <button v-if="!phoneNumber" class="user-info__actions-button--show-phone" @click="showPhoneNumber">
               {{ showPhoneText }}
            </button>
            <a v-else :href="`tel:${rawPhoneNumber}`" class="user-info__actions-button--show-phone" @click="handleCall">
               {{ phoneNumber }}
            </a>
            <button class="user-info__actions-button--write" @click="handleWriteMessage">
               Написать
            </button>
         </div>
      </template>
   </div>
   <ReviewsPopup v-if="userData" :userId="Number(userData.id)" :visible="isReviewsPopupVisible"
      :count_reviews_about_myself="userData.count_reviews_about_myself" :rating="userData.grade"
      @update:visible="toggleReviewsModal" />
</template>

<script setup>
import { ref, computed } from 'vue';
import avatar from '../assets/icons/avatar-revers.svg';
import { getImageUrl } from '~/services/imageUtils';
import { useChatStore } from '~/store/chatStore';
import { useUserStore } from '~/store/user';
import { getUserPhoneEmail } from '~/services/apiClient';
import { useLoginModalStore } from '~/store/loginModal.js';
import { useRouter } from '#vue-router';

const router = useRouter();
const loginModalStore = useLoginModalStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const props = defineProps({
   userData: { type: Object, default: () => ({}) },
   isLoading: { type: Boolean, required: true }
});

const userAvatarUrl = computed(() => getImageUrl(props.userData?.photo?.arr_title_size?.default, avatar));
const registeredDate = computed(() =>
   props.userData?.created_at
      ? `На сайте с ${new Date(props.userData.created_at).toLocaleString('ru', { year: 'numeric', month: 'long' })}`
      : ''
);
const phoneNumber = ref('');
const rawPhoneNumber = ref('');
const showPhoneText = ref('Показать номер');
const isReviewsPopupVisible = ref(false);

const formattedUniqueCode = computed(() => props.userData?.unique_code?.replace(/(.{4})(?=.)/g, '$1 ') || '');
const pluralizedReviews = computed(() => {
   const count = Number(props.userData?.count_reviews_about_myself);
   if (count % 100 >= 11 && count % 100 <= 19) return 'отзывов';
   if (count % 10 === 1) return 'отзыв';
   if (count % 10 >= 2 && count % 10 <= 4) return 'отзыва';
   return 'отзывов';
});

const showPhoneNumber = async () => {
   if (!userStore.isLoggedIn) return loginModalStore.toggleLoginModal();
   try {
      if (!phoneNumber.value) {
         const { phone } = await getUserPhoneEmail(props.userData?.id);
         rawPhoneNumber.value = phone;
         phoneNumber.value = phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
         showPhoneText.value = phoneNumber.value;
      }
   } catch (error) {
      console.error('Ошибка при получении номера телефона:', error);
   }
};

const handleWriteMessage = () => {
   if (!userStore.isLoggedIn) return loginModalStore.toggleLoginModal();
   if (window.innerWidth < 768) {
      router.push('/profile/messages');
   }
   chatStore.openChat(router);
};

const handleCall = () => {
   if (!userStore.isLoggedIn) loginModalStore.toggleLoginModal();
};

const toggleReviewsModal = (visible) => {
   isReviewsPopupVisible.value = visible;
};
</script>

<style lang="scss" scoped>
.user-info {
   height: fit-content;
   min-width: 270px;
   background-color: #fff;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 8px;
   padding: 24px;
   padding-bottom: 32px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   text-align: center;

   @media (max-width: 768px) {
      box-shadow: none;
      border-radius: 0;
      padding: 24px 0 0;
   }

   &__block,
   &__container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
   }

   &__container {
      @media (max-width: 768px) {
         flex-direction: row;
         gap: 24px;
      }
   }

   &__avatar {
      margin-right: auto;
      padding-bottom: 8px;

      img {
         width: 160px;
         height: 160px;
         border-radius: 50%;
         object-fit: cover;
         box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);

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
      line-height: 30px;
      font-weight: bold;
      text-align: left;
      color: #323232;

      @media (max-width: 768px) {
         font-size: 20px;
      }
   }

   &__rating {
      display: flex;
      align-items: center;
      outline: none;
      margin: 4px 0;
      gap: 8px;
      font-size: 14px;
      color: #3366FF;
      transition: color 0.2s ease;
   }

   &__rating-text {
      font-size: 14px;
      line-height: 18px;
      color: #3366FF;

      &--empty {
         font-size: 14px;
         color: #323232;
      }
   }

   &__completed-ads,
   &__registered-date {
      font-size: 14px;
      color: #323232;
   }

   &__registered-date {
      padding-bottom: 16px;

      @media (max-width: 768px) {
         padding-bottom: 0;
      }
   }

   &__actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      border-top: 1px solid #D6D6D6;
      padding-top: 24px;

      @media (max-width: 768px) {
         flex-direction: row;
         position: fixed;
         bottom: 70px;
         left: 0;
         z-index: 23;
         padding: 16px;
         border-top: none;
         background-color: rgba(#EEF9FF, 0.3);
         backdrop-filter: blur(8px);
         border-radius: 24px 24px 0 0;
      }

      button,
      a {
         display: block;
         width: 100%;
         padding: 8px 12px;
         font-size: 14px;
         font-weight: 400;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
      }

      &-button {
         &--write {
            background-color: #5F2EEA;
            color: white;

            &:hover {
               background-color: #5716DF;
            }
         }

         &--show-phone {
            background-color: #3366FF;
            color: white;

            &:hover {
               background-color: #144DF8;
            }
         }
      }
   }
}

.user-info__skeleton {
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 489px;
   gap: 40px;
   align-items: center;
   justify-content: space-between;

   &-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      width: 100%;

      @media (max-width: 768px) {
         flex-direction: row;
         align-items: flex-start;
      }
   }

   @media (max-width: 768px) {
      height: auto;
   }

   &-avatar {
      width: 160px;
      height: 160px;
      margin-right: auto;
      border-radius: 50%;
      background: #e0e0e0;
      animation: pulse 1.5s infinite ease-in-out;

      @media (max-width: 768px) {
         min-width: 120px;
         height: 120px;
      }

      @media (max-width: 420px) {
         min-width: 100px;
         height: 100px;
         margin-bottom: 0;
      }
   }

   &-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
   }

   &-name,
   &-rating,
   &-id,
   &-status,
   &-ads,
   &-date {
      height: 20px;
      border-radius: 4px;
      background: #e0e0e0;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &-name {
      width: 60%;
      height: 35px;

      @media (max-width: 768px) {
         height: 30px;
      }
   }

   &-rating {
      margin: 4px 0;
   }

   &-id,
   &-status,
   &-ads,
   &-date {
      width: 80%;
   }

   &-actions {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 16px;
      justify-content: space-between;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &-button {
      width: 100%;
      height: 36px;
      border-radius: 6px;
      background: #e0e0e0;
      animation: pulse 1.5s infinite ease-in-out;
   }
}

@keyframes pulse {
   0% {
      background-color: #e0e0e0;
   }

   50% {
      background-color: #d6d6d6;
   }

   100% {
      background-color: #e0e0e0;
   }
}
</style>
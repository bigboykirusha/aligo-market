<template>
   <div class="car-details">
      <div class="car-details__content">
         <header class="car-details__header">
            <div class="car-details__title">{{ brand }} {{ model }}, {{ year }}</div>
            <div class="car-details__price">{{ formatNumberWithSpaces(amount) }} ₽</div>
         </header>
         <div class="car-details__actions">
            <WishlistButton v-if="!(id_user_owner_ads === userStore.userId)" @toggle-login-modal="toggleLoginModal"
               :id="props.id" size="big" />
            <ShareButton />
         </div>
         <div class="car-details__contact">
            <div v-if="isLoggedIn" class="car-details__contact-buttons">
               <a v-if="showPhone && !(id_user_owner_ads === userStore.userId)" :href="'tel:' + phone"
                  class="car-details__contact-button" @click.prevent="makeCall">
                  <span class="car-details__contact-button-text">{{ formattedPhone }}</span>
               </a>
               <a v-else-if="!(id_user_owner_ads === userStore.userId)" href="#" class="car-details__contact-button"
                  @click.prevent="showTel">
                  <span class="car-details__contact-button-text">Показать номер</span>
               </a>
               <a v-else-if="!(id_user_owner_ads === userStore.userId)" href="#" class="car-details__contact-button"
                  @click.prevent="toggleLoginModal">
                  <span class="car-details__contact-button-text">Показать номер</span>
               </a>
               <div @click="openChat" v-if="!(id_user_owner_ads === userStore.userId)"
                  class="car-details__write-button">
                  Написать</div>
            </div>
            <div class="user-info">
               <div class="user-info__group">
                  <nuxt-link :to="`/user/${props.id_user_owner_ads}`" class="user-info__name">{{ formattedUsername
                     }}</nuxt-link>
                  <div class="user-info__rating">
                     <div class="user-info__rating-text">{{ !rating ? '0.0' : rating }}</div>
                     <NuxtRating :rating-value="rating" :rating-count="5" :rating-size="10" :rating-spacing="6"
                        active-color="#3366FF" inactive-color="#FFFFFF" border-color="#3366FF" :border-width="2"
                        rounded-corners read-only />
                     <span class="user-info__rating-count">
                        {{ userStore.countReviews === 0 ? 'Нет отзывов' : `${userStore.countReviews}
                        ${pluralizeReview(userStore.countReviews)}` }}
                     </span>
                  </div>
                  <span class="user-info__status">Частное лицо</span>
               </div>
               <nuxt-link :to="`/user/${props.id_user_owner_ads}`">
                  <img class="user-info__avatar" v-if="userPhotoUrl" :src="getImageUrl(userPhotoUrl)"
                     alt="User Avatar" />
                  <span class="user-info__letter" v-else>{{ formattedUsername.charAt(0) }}</span>
               </nuxt-link>
            </div>
         </div>
      </div>
      <div class="car-details__location">
         <p><b>Место встречи:</b> {{ place }}</p>
         <div v-if="latitude && longitude" class="car-details__map"
            :class="['car-details__map', { '--visible': isMapVisible, '--hidden': !isMapVisible }]">
            <iframe
               :src="`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed&sensor=false`"
               frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
            </iframe>
         </div>
         <p v-else>Пользователь не отметил свое местоположение</p>
         <button v-if="latitude && longitude" class="car-details__map-toggle" @click="toggleMap">
            <img v-if="!isMapVisible" :src="locationIcon" />
            <img v-else :src="downIcon" class="button-icon" />
            <div> {{ isMapVisible ? 'Скрыть карту' : 'Показать на карте' }}</div>
         </button>
      </div>
   </div>
   <ReviewsPopup :userId="props.id_user_owner_ads" :visible="isReviewsPopupVisible"
      :count_reviews_about_myself="count_reviews_about_myself" :rating="rating" @update:visible="toggleReviewsModal" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { seeContact, getUser } from '~/services/apiClient';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { useUserStore } from '~/store/user';
import { getImageUrl } from '../services/imageUtils'
import { useChatStore } from '~/store/chatStore';
import { useLoginModalStore } from '~/store/loginModal.js';
import { useRouter } from '#vue-router';
import downIcon from "../assets/icons/down.svg";
import locationIcon from "../assets/icons/loc.svg";

const loginModalStore = useLoginModalStore();

const toggleLoginModal = () => {
   loginModalStore.toggleLoginModal();
};

const currentChatStore = useChatStore();

const props = defineProps({
   brand: String,
   model: String,
   year: String,
   amount: Number,
   username: String,
   place: String,
   id: Number,
   is_in_favorites: Number,
   latitude: String,
   longitude: String,
   id_user_owner_ads: Number,
   photos: Array,
   count_reviews_about_myself: Number
});

const showPhone = ref(false);
const phone = ref('');
const isMapVisible = ref(true);
const userStore = useUserStore();
const userPhotoUrl = ref('');
const isDesktop = ref(false);
const router = useRouter();

const isLoggedIn = computed(() => userStore.isLoggedIn);

const rating = ref(0);
const count_reviews_about_myself = ref(0);

const isReviewsPopupVisible = ref(false);

const toggleReviewsModal = (visible) => {
   isReviewsPopupVisible.value = visible;
};

const formattedPhone = computed(() => {
   const phoneString = phone.value.replace(/\D/g, '');

   if (phoneString.startsWith('7') && phoneString.length === 11) {
      return `+7 (${phoneString.slice(1, 4)}) ${phoneString.slice(4, 7)}-${phoneString.slice(7, 9)}-${phoneString.slice(9)}`;
   }

   return phoneString;
});

const formattedUsername = computed(() => {
   const username = props.username || 'Имя';
   return username.charAt(0).toUpperCase() + username.slice(1);
});

const showTel = async () => {
   try {
      const response = await seeContact({ ads_id: props.id });
      if (response.success) {
         phone.value = response.phone;
         showPhone.value = true;
      }
   } catch (error) {
      console.error('Ошибка при получении телефона: ', error);
   }
};

function pluralizeReview(count) {
   const lastDigit = count % 10;
   const lastTwoDigits = count % 100;

   if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return ' отзывов';
   }

   if (lastDigit === 1) {
      return ' отзыв';
   }

   if (lastDigit >= 2 && lastDigit <= 4) {
      return ' отзыва';
   }

   return ' отзывов';
};

const makeCall = () => {
   window.location.href = `tel:${phone.value}`;
};

const openChat = () => {
   if (window.innerWidth < 768) {
      router.push('/profile/messages');
   }
   currentChatStore.openChat(router);
};

const toggleMap = () => {
   isMapVisible.value = !isMapVisible.value;
};

const prepareChatData = async () => {
   const chatData = {
      ads_info: `${props.brand} ${props.model}, ${props.year}`,
      ads_photo: [{
         arr_title_size: {
            preview: props.photos?.[0]?.arr_title_size.preview,
         },
      }],
      for_user: {
         id: props.id_user_owner_ads,
         photo: {
            arr_title_size: {
               preview: userPhotoUrl.value,
            },
         },
         username: formattedUsername.value,
      },
      from_user: {
         id: null,
      },
      ads_id: props.id,
      main_category_id: 1,
      ads_amount: props.amount,
   };

   currentChatStore.setCurrentChat(chatData);
};

onMounted(async () => {
   try {
      isDesktop.value = window.innerWidth > 768;

      const userData = await getUser(props.id_user_owner_ads);
      userPhotoUrl.value = userData.photo?.arr_title_size.preview;
      count_reviews_about_myself.value = userData.count_reviews_about_myself;
      rating.value = userData.grade;

      if (props.id_user_owner_ads !== userStore.userId) {
         await prepareChatData();
      }
      console.log('Данные пользователя:', userData);
   } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
   }
});

onBeforeUnmount(() => {
   currentChatStore.closeChat();
});
</script>

<style lang="scss" scoped>
.car-details {
   width: 100%;

   @media (max-width: 1280px) {
      display: flex;
      max-width: 100%;
      align-items: flex-end;
      column-gap: 52px;
   }

   @media (max-width: 768px) {
      flex-direction: column;
   }

   &__back {
      display: none;
      padding-bottom: 26px;
      border-bottom: 1px solid #d6d6d6;
      margin-bottom: 32px;

      @media (max-width: 768px) {
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding-bottom: 16px;
         padding-top: 16px;
         margin-bottom: 16px;
         border-top: 1px solid #d6d6d6;
      }

      &-link {
         img {
            height: 14px;
         }
      }
   }

   &__actions {
      display: flex;
      gap: 24px;

      @media (max-width: 1280px) {
         display: none;
      }
   }

   &__content {
      @media (max-width: 1280px) {
         width: 50%;
         margin-top: 24px;
      }

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__header {
      margin-bottom: 24px;
   }

   &__contact-buttons {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 24px;

      @media (max-width: 768px) {
         position: fixed;
         z-index: 23;
         background-color: rgba(#EEF9FF, 0.3);
         backdrop-filter: blur(8px);
         border-radius: 24px 24px 0 0;
         padding: 16px;
         bottom: 70px;
         flex-direction: row;
         gap: 16px;
      }
   }

   .user-info__status {
      font-size: 14px;
      color: #323232;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__write-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #5F2EEA;
      color: white;
      height: 60px;
      font-size: 20px;
      border: none;
      border-radius: 6px;
      transition: $transition-1;
      cursor: pointer;

      @media (max-width: 1280px) {
         height: 40px;
         font-size: 14px;
      }

      @media (max-width: 768px) {
         font-size: 16px;
         padding: 8px;
         margin-bottom: 0;
      }

      &:hover {
         background-color: #5716DF;
      }
   }

   &__title {
      font-size: 32px;
      line-height: 36px;
      color: #003BCE;
      margin-bottom: 16px;
      font-weight: 700;

      @media (max-width: 1280px) {
         font-size: 24px;
         line-height: 30px;
      }

      @media (max-width: 768px) {
         font-size: 20px;
         line-height: 24px;
      }
   }

   &__price {
      font-size: 24px;
      font-weight: 700;
      line-height: 30px;
      color: #323232;
   }

   &__contact {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 24px;
      padding: 32px 40px;
      border-radius: 8px;
      background-color: #EEF9FF;
      margin-top: 16px;
      gap: 24px;

      @media (max-width: 1280px) {
         margin-bottom: 0;
      }

      @media (max-width: 768px) {
         flex-direction: row;
         padding: 24px;
         margin-bottom: 24px;
         align-items: center;
      }

      @media (max-width: 768px) {
         flex-direction: column;
      }

      &-button {
         width: 100%;
         display: flex;
         align-items: center;
         justify-content: center;
         background-color: #3366ff;
         color: white;
         height: 60px;
         font-size: 20px;
         border: none;
         border-radius: 6px;
         transition: $transition-1;
         cursor: pointer;

         @media (max-width: 1280px) {
            height: 40px;
         }

         @media (max-width: 768px) {
            font-size: 16px;
            padding: 8px;
            margin-bottom: 0;
            margin: auto 0;
         }

         &:hover {
            background-color: #144DF8;
         }

         &-text {
            @media (max-width: 1240px) {
               font-size: 14px;
            }
         }
      }
   }

   &__location {
      font-size: 14px;
      color: #323232;

      @media (max-width: 1280px) {
         width: 50%;
         height: 100%;
         min-height: 100%;
      }

      @media (max-width: 768px) {
         width: 100%;
         min-height: 0;
         margin-top: 0;
         height: auto;
      }

      p {
         font-size: 14px;

         b {
            display: block;
         }
      }
   }

   &__map {
      width: 100%;
      height: 0;
      margin: 15px 0 10px;
      border-radius: 6px;
      overflow: hidden;
      transition: height 0.5s ease;

      iframe {
         width: 100%;
         height: 100%;
      }

      &.--hidden {
         height: 0;
      }

      &.--visible {
         height: 308px;

         @media (max-width: 1280px) {
            height: 219px;
         }
      }
   }

   &__map-toggle {
      display: flex;
      align-items: center;
      background-color: white;
      color: #3366ff;
      border: none;
      cursor: pointer;

      img {
         height: 16px;
         margin-right: 6px;
      }

      .button-icon {
         height: 8px;
         transform: rotate(180deg);
      }
   }
}

.user-info {
   display: flex;
   align-items: center;
   margin-bottom: 1rem;
   width: 100%;
   justify-content: space-between;

   @media (max-width: 768px) {
      margin-bottom: 0;
      margin: auto 0;
   }

   &__group {
      display: flex;
      flex-direction: column;
      margin-right: 16px;
      gap: 6px;
   }

   &__name {
      font-size: 16px;
      color: #323232;
      font-weight: 700;

      @media (max-width: 768px) {
         margin-bottom: 0;
      }
   }

   &__rating {
      display: flex;
      align-items: center;
      outline: none;
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

   &__rating-count {
      margin-left: 8px;
      font-size: 14px;
      line-height: 18px;
   }

   &__avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 64px;
      width: 64px;
      min-height: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 50%;
      background-color: #3366ff;
      color: #fff;
      font-size: 48px;
      font-weight: 700;
      line-height: 1;


      @media (max-width: 768px) {
         min-width: 57px;
         width: 57px;
         min-height: 57px;
         height: 57px;
         font-size: 42px;
      }
   }

   &__letter {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 64px;
      width: 64px;
      min-height: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 50%;
      background-color: #3366ff;
      color: #fff;
      font-size: 36px;
      font-weight: 700;
      line-height: 1;

      @media (max-width: 768px) {
         min-width: 57px;
         width: 57px;
         min-height: 57px;
         height: 57px;
         font-size: 42px;
      }
   }

   &__reviews {
      font-size: 14px;
      color: #323232;
   }
}
</style>

<template>
   <div :class="['card', { 'card--horizontal': horizontal }]">
      <nuxt-link :to="`/car/${url}`" class="card__image">
         <Swiper v-if="images.length" :modules="[SwiperAutoplay, SwiperPagination]" :slides-per-view="1"
            :pagination="{ clickable: true }" :navigation="false" :loop="true">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <img class="card__img" :src="getImageUrl(image.arr_title_size.middle)" alt="Slide Image" draggable="false" @contextmenu.prevent preload />
            </SwiperSlide>
         </Swiper>
         <img v-else :src="placeholder" alt="Placeholder image" class="card__placeholder" />
      </nuxt-link>
      <div class="card__section">
         <nuxt-link class="card__title" :to="`/car/${url}`">
            {{ brand }} {{ model }}, {{ year }}
         </nuxt-link>
         <div class="card__body">
            <div v-if="!horizontal" class="card__wishlist-button">
               <WishlistButton @toggle-login-modal="toggleLoginModal" :id="id" size="small" />
            </div>
            <span class="card__price">{{ formatNumberWithSpaces(price) }} ₽</span>
            <div v-if="horizontal" class="card__description">{{ description }}</div>
            <div class="card__info">
               <div class="card__location">{{ place }}</div>
               <div class="card__date">{{ timeAgo }}</div>
            </div>
            <div v-if="!horizontal && !(id_user_owner_ads === userStore.userId)" class="card__buttons">
               <button class="button" @click="isLoggedIn ? productCardAction() : toggleLoginModal()">
                  <span class="button__text">Написать</span>
               </button>
               <button class="button" @click="isLoggedIn ? handleCallClick() : toggleLoginModal()">
                  <span class="button__text">Позвонить</span>
               </button>
            </div>
         </div>
      </div>
      <div v-if="horizontal" class="card__wishlist-button--horizontal">
         <WishlistButton @toggle-login-modal="toggleLoginModal" :id="id" size="small" isWithBorder />
      </div>
      <div v-if="horizontal" class="card__more">
         <div class="card__username">{{ formattedUsername }}</div>
         <div class="card__reviews">Нет отзывов</div>
         <div v-if="!(id_user_owner_ads === userStore.userId)" class="card__buttons">
            <button class="button" @click="isLoggedIn ? productCardAction() : toggleLoginModal()">
               <span class="button__text">Написать</span>
            </button>
            <button class="button" @click="isLoggedIn ? handleCallClick() : toggleLoginModal()">
               <span class="button__text">{{ showPhone ? formattedPhone : 'Показать номер' }}</span>
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '~/store/user';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { getImageUrl } from '../services/imageUtils';
import { seeContact, getUser } from '~/services/apiClient';
import { useChatStore } from '~/store/chatStore';
import { useLoginModalStore } from '~/store/loginModal.js';
import { useRouter } from 'vue-router';
import placeholder from "../assets/icons/placeholder.png";

const router = useRouter();
const loginModalStore = useLoginModalStore();
const currentChatStore = useChatStore();

const showPhone = ref(false);
const phone = ref(null);

const props = defineProps({
   id: Number,
   description: { type: String, default: 'Нет описания' },
   price: Number,
   place: { type: String, default: 'Не указано' },
   brand: { type: String, default: 'Не указано' },
   model: { type: String, default: 'Не указано' },
   year: { type: String, default: '2007' },
   username: { type: String, default: 'Не указано' },
   horizontal: { type: Boolean, default: false },
   images: { type: Array, default: () => [] },
   created_at: { type: String, default: 'Не указано' },
   id_user_owner_ads: Number,
});

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const formattedUsername = computed(() => formatUsername(props.username));

const url = `${props.brand.toLowerCase()}-${props.model.toLowerCase()}-${props.year.toLowerCase()}-${props.id}`;

const timeAgo = computed(() => calculateTimeAgo(props.created_at));

function formatUsername(username) {
   return username.charAt(0).toUpperCase() + username.slice(1);
}

const formattedPhone = computed(() => {
   if (!phone.value) return '';
   const digits = phone.value.replace(/\D/g, '');

   return digits.length === 11 && digits.startsWith('7')
      ? `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
      : phone.value;
});

function calculateTimeAgo(dateString) {
   const now = new Date();
   const date = new Date(dateString);
   const diff = now - date;
   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) {
      return `${days} дней назад`;
   } else if (hours > 0) {
      return `${hours} часов назад`;
   } else if (minutes > 0) {
      return `${minutes} минут назад`;
   } else {
      return `${seconds} секунд назад`;
   }
}

function toggleLoginModal() {
   loginModalStore.toggleLoginModal();
}

const productCardAction = () => {
   prepareChatData();
};

const prepareChatData = async () => {
   const userData = await getUser(props.id_user_owner_ads);
   const chatData = {
      ads_info: `${props.brand} ${props.model}, ${props.year}`,
      ads_photo: [{
         arr_title_size: {
            preview: props.images?.[0]?.arr_title_size.preview,
         },
      }],
      for_user: {
         id: props.id_user_owner_ads,
         photo: {
            arr_title_size: {
               preview: userData.photo?.arr_title_size.preview,
            },
         },
         username: formattedUsername.value,
      },
      ads_id: props.id,
      ads_amount: props.price,
      main_category_id: 1,
   };

   currentChatStore.setCurrentChat(chatData);
   currentChatStore.openChat(router);

   if (window.innerWidth < 768) {
      router.push('profile/messages');
   }
};

const fetchPhoneNumber = async () => {
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

const handleCallClick = async () => {
   if (showPhone.value) {
      makeCall();
   } else {
      await fetchPhoneNumber();
      if (!props.horizontal) {
         makeCall();
      }
   }
};

const makeCall = () => {
   window.location.href = `tel:${phone.value}`;
};
</script>

<style scoped lang="scss">
.card {
   position: relative;
   display: flex;
   flex-direction: column;
   background: #ffffff;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   overflow: hidden;
   min-width: 224px;
   transition: transform 0.3s, box-shadow 0.3s;

   &__placeholder {
      width: 100%;
      height: 100%;
      object-fit: cover;
   }

   &:hover .card__buttons {
      transform: translateY(10px);
      opacity: 1;
   }

   &__section {
      display: flex;
      width: 100%;
      max-width: 100%;
      flex-direction: column;
      position: relative;
   }

   &__info {
      margin-top: auto;
   }

   &__description {
      font-size: 14px;
      color: #323232;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   &__image {
      flex: 0 0 auto;
      width: 100%;
      max-height: 220px;
      cursor: pointer;

      img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         transition: transform 0.2s ease;

         &:hover {
            transform: scale(1.02);
         }
      }
   }

   &__wishlist-button {
      position: absolute;
      z-index: 1;
      top: -12px;
      right: 16px;
   }

   &__wishlist-button--horizontal {
      padding: 24px;

      @media (max-width: 768px) {
         position: absolute;
         z-index: 5;
         right: 0;
         top: 0;
         padding: 16px;
      }
   }

   &__title {
      font-weight: 700;
      width: 100%;
      display: block;
      max-width: 100%;
      font-size: 16px;
      color: #3366ff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-decoration: none;
      padding: 16px;
      padding-bottom: 12px;
   }

   &__block {
      display: flex;
      column-gap: 5px;
   }

   &__price,
   &__currency {
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
   }

   &__location,
   &__date {
      font-size: 12px;
      color: #a8a8a8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   &__body {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0 16px 16px;
      background: white;
   }

   &__more {
      display: flex;
      flex-direction: column;
      min-width: 216px;
      gap: 10px;
      padding: 24px;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__username {
      display: flex;
      align-items: center;
      font-weight: bold;
      height: 24px;
      font-size: 14px;
      color: #323232;
      text-decoration: none;
   }

   &__reviews {
      font-size: 12px;
      color: #3366ff;
   }

   &__buttons {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 12px;
      background: white;
      transform: translateY(40px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
   }

   .button {
      border: none;
      border-radius: 6px;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.07);

      &__text {
         display: block;
         padding: 10px;
         font-size: 14px;
         text-align: center;
         color: #3366ff;
         background-color: #d6efff;
         border-radius: 6px;
         cursor: pointer;
         transition: background-color 0.3s;

         &:hover {
            background-color: #A4DCFF;
         }
      }
   }

   &--horizontal {
      flex-direction: row;
      height: 220px;

      .card__title {
         max-width: calc(100% - 40px);
         padding: 24px;
         padding-bottom: 8px;

         @media (max-width: 768px) {
            padding: 16px;
            padding-bottom: 8px;
         }
      }

      .card__body {
         padding: 0 24px 24px;
         row-gap: 8px;

         @media (max-width: 768px) {
            padding: 0 16px 16px;
         }
      }

      .card__section {
         max-width: calc(100% - 140px);
      }

      .card__buttons {
         position: static;
         width: 100%;
         padding: 0;
         margin-top: auto;
         display: flex;
         flex-direction: column;
         gap: 16px;
         opacity: 1;
         transform: none !important;
      }

      .card__image {
         width: 220px;
         height: 220px;

         @media (max-width: 768px) {
            width: 180px;
         }

         @media (max-width: 768px) {
            width: 140px;
         }
      }
   }
}

.swiper {
   height: 220px;

   img {
      height: 220px;
      width: 100%;
      object-fit: cover;
   }
}
</style>
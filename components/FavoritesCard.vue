<template>
   <div class="card">
      <div class="card__image">
         <Swiper v-if="images.length" :modules="[SwiperAutoplay, SwiperPagination]" :slides-per-view="1"
            :pagination="{ clickable: true }" :navigation="false" :loop="true">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <img v-if="image.path" :src="getImageUrl(image.path)" alt="Slide Image" />
               <img v-else src='../assets/icons/placeholder.png' alt="Placeholder image" class="card__placeholder" />
            </SwiperSlide>
            <div class="swiper-pagination"></div>
         </Swiper>
         <img v-else src='../assets/icons/placeholder.png' alt="Placeholder image" class="card__placeholder" />
      </div>
      <div class="card__body">
         <nuxt-link :to="`/car/${id}`" class="card__title">
            {{ brand }} {{ model }}, {{ year }}
         </nuxt-link>
         <div class="card__block">
            <span class="card__price">{{ formatNumberWithSpaces(price) }}</span>
            <span class="card__currency">₽</span>
         </div>
         <div class="card__info">
            <div class="card__location">{{ place }}</div>
            <div class="card__date">{{ timeAgo }}</div>
         </div>
      </div>
      <div class="card__more">
         <div v-if="!props.isAdmin" class="card__wishlist">
            <button class="card__wishlist-button" :class="{ active: isWishlisted }" @click.prevent="toggleWishList">
               <img :src="isWishlisted ? favActive : fav" alt="Избранное" class="icon-heart" />
            </button>
         </div>
         <div class="card__section">
            <div class="card__part">
               <div class="card__username">{{ formattedUsername }}</div>
               <div class="card__state">Частное лицо</div>
            </div>
            <div v-if="props.isAdmin" class="card__buttons">
               <button class="button">
                  <img src="../assets/icons/options.svg" />
               </button>
            </div>
            <div v-else class="card__buttons">
               <button v-if="isLoggedIn" class="button" @click="productCardAction('Написать')">
                  <a :href="`mailto:${messageEmail}`" class="button__text">
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M15 7.61112C15.0027 8.63769 14.7628 9.65036 14.3 10.5667C13.7512 11.6647 12.9076 12.5882 11.8636 13.2339C10.8195 13.8795 9.6164 14.2217 8.38888 14.2222C7.36231 14.2249 6.34964 13.9851 5.43333 13.5222L1 15L2.47778 10.5667C2.01494 9.65036 1.7751 8.63769 1.77778 7.61112C1.77825 6.3836 2.12047 5.18046 2.76611 4.13644C3.41175 3.09243 4.3353 2.24879 5.43333 1.70002C6.34964 1.23719 7.36231 0.997346 8.38888 1.00002H8.77777C10.3989 1.08946 11.9301 1.77372 13.0782 2.9218C14.2263 4.06987 14.9105 5.60108 15 7.22223V7.61112Z"
                           stroke="#3366FF" stroke-linecap="round" stroke-linejoin="round" />
                     </svg>

                  </a>
               </button>
               <button v-else class="button" @click="toggleLoginModal">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M15 7.61112C15.0027 8.63769 14.7628 9.65036 14.3 10.5667C13.7512 11.6647 12.9076 12.5882 11.8636 13.2339C10.8195 13.8795 9.6164 14.2217 8.38888 14.2222C7.36231 14.2249 6.34964 13.9851 5.43333 13.5222L1 15L2.47778 10.5667C2.01494 9.65036 1.7751 8.63769 1.77778 7.61112C1.77825 6.3836 2.12047 5.18046 2.76611 4.13644C3.41175 3.09243 4.3353 2.24879 5.43333 1.70002C6.34964 1.23719 7.36231 0.997346 8.38888 1.00002H8.77777C10.3989 1.08946 11.9301 1.77372 13.0782 2.9218C14.2263 4.06987 14.9105 5.60108 15 7.22223V7.61112Z"
                        stroke="#3366FF" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

               </button>

               <button v-if="isLoggedIn" class="button" @click="handleCallClick">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M16.9678 12.9791V15.3877C16.9687 15.6113 16.9229 15.8327 16.8333 16.0375C16.7438 16.2424 16.6124 16.4263 16.4476 16.5775C16.2828 16.7286 16.0883 16.8437 15.8765 16.9154C15.6647 16.987 15.4402 17.0136 15.2175 16.9935C12.7469 16.725 10.3737 15.8808 8.28865 14.5286C6.34875 13.2959 4.70406 11.6512 3.47136 9.71135C2.11448 7.61679 1.27006 5.23206 1.00652 2.75036C0.986453 2.52834 1.01284 2.30457 1.084 2.0933C1.15515 1.88203 1.26952 1.6879 1.41981 1.52325C1.57011 1.35861 1.75304 1.22706 1.95696 1.13699C2.16088 1.04691 2.38132 1.00029 2.60425 1.00008H5.0129C5.40254 0.996243 5.78028 1.13422 6.07572 1.3883C6.37116 1.64237 6.56413 1.99521 6.61866 2.38103C6.72032 3.15185 6.90886 3.9087 7.18068 4.63713C7.2887 4.9245 7.31208 5.23682 7.24804 5.53707C7.18401 5.83732 7.03525 6.11292 6.81938 6.33121L5.79972 7.35087C6.94267 9.36092 8.60696 11.0252 10.617 12.1682L11.6367 11.1485C11.855 10.9326 12.1306 10.7839 12.4308 10.7198C12.7311 10.6558 13.0434 10.6792 13.3308 10.7872C14.0592 11.059 14.816 11.2476 15.5869 11.3492C15.9769 11.4042 16.333 11.6007 16.5877 11.9012C16.8423 12.2017 16.9776 12.5853 16.9678 12.9791Z"
                        stroke="#3366FF" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </button>
               <button v-else class="button" @click="toggleLoginModal">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M16.9678 12.9791V15.3877C16.9687 15.6113 16.9229 15.8327 16.8333 16.0375C16.7438 16.2424 16.6124 16.4263 16.4476 16.5775C16.2828 16.7286 16.0883 16.8437 15.8765 16.9154C15.6647 16.987 15.4402 17.0136 15.2175 16.9935C12.7469 16.725 10.3737 15.8808 8.28865 14.5286C6.34875 13.2959 4.70406 11.6512 3.47136 9.71135C2.11448 7.61679 1.27006 5.23206 1.00652 2.75036C0.986453 2.52834 1.01284 2.30457 1.084 2.0933C1.15515 1.88203 1.26952 1.6879 1.41981 1.52325C1.57011 1.35861 1.75304 1.22706 1.95696 1.13699C2.16088 1.04691 2.38132 1.00029 2.60425 1.00008H5.0129C5.40254 0.996243 5.78028 1.13422 6.07572 1.3883C6.37116 1.64237 6.56413 1.99521 6.61866 2.38103C6.72032 3.15185 6.90886 3.9087 7.18068 4.63713C7.2887 4.9245 7.31208 5.23682 7.24804 5.53707C7.18401 5.83732 7.03525 6.11292 6.81938 6.33121L5.79972 7.35087C6.94267 9.36092 8.60696 11.0252 10.617 12.1682L11.6367 11.1485C11.855 10.9326 12.1306 10.7839 12.4308 10.7198C12.7311 10.6558 13.0434 10.6792 13.3308 10.7872C14.0592 11.059 14.816 11.2476 15.5869 11.3492C15.9769 11.4042 16.333 11.6007 16.5877 11.9012C16.8423 12.2017 16.9776 12.5853 16.9678 12.9791Z"
                        stroke="#3366FF" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </button>
            </div>
         </div>
      </div>
   </div>
   <LoginModal v-if="modalLoginOpen" @close-loginModal="toggleLoginModal" />
</template>

<script setup>
import { ref, computed } from 'vue';
import favActive from '../assets/icons/fav-white.svg';
import fav from '../assets/icons/fav.svg';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { getImageUrl } from '../services/imageUtils'
import { useUserStore } from '~/store/user';
import { useFavoritesStore } from '~/store/favorites';
import { seeContact } from '~/services/apiClient';

const props = defineProps({
   id: Number,
   description: String,
   price: Number,
   place: {
      type: String,
      default: 'Не указано'
   },
   callNumber: String,
   messageEmail: String,
   brand: String,
   model: String,
   year: String,
   username: String,
   horizontal: {
      type: Boolean,
      default: false
   },
   is_in_favorites: {
      type: Number,
      default: 1
   },
   images: Array,
   created_at: String,
   isAdmin: Boolean,
});

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const isWishlisted = computed(() => favoritesStore.items.includes(props.id));
const formattedUsername = computed(() => {
   const username = props.username || 'Имя не указано';
   return username.charAt(0).toUpperCase() + username.slice(1);
});
const modalLoginOpen = ref(false);
const showPhone = ref(false);
const phone = ref('');

const toggleWishList = async () => {
   await favoritesStore.toggleFavorite(props.id);
   userStore.fetchUserCounts();
};

const toggleLoginModal = () => {
   modalLoginOpen.value = !modalLoginOpen.value;
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
   if (isLoggedIn.value) {
      await fetchPhoneNumber();
      if (phone.value) {
         makeCall();
      }
   }
};

const makeCall = () => {
   window.location.href = `tel:${phone.value}`;
};

function calculateTimeAgo(dateString) {
   const now = new Date();
   const date = new Date(dateString);
   const diff = now - date;

   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) {
      return `${days} ${days % 10 === 1 && days % 100 !== 11 ? 'день' :
         (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) ? 'дня' :
            'дней'} назад`;
   } else if (hours > 0) {
      return `${hours} ${hours % 10 === 1 && hours % 100 !== 11 ? 'час' :
         (hours % 10 >= 2 && hours % 10 <= 4 && (hours % 100 < 10 || hours % 100 >= 20)) ? 'часа' :
            'часов'} назад`;
   } else if (minutes > 0) {
      return `${minutes} ${minutes % 10 === 1 && minutes % 100 !== 11 ? 'минута' :
         (minutes % 10 >= 2 && minutes % 10 <= 4 && (minutes % 100 < 10 || minutes % 100 >= 20)) ? 'минуты' :
            'минут'} назад`;
   } else {
      return `${seconds} ${seconds % 10 === 1 && seconds % 100 !== 11 ? 'секунда' :
         (seconds % 10 >= 2 && seconds % 10 <= 4 && (seconds % 100 < 10 || seconds % 100 >= 20)) ? 'секунды' :
            'секунд'} назад`;
   }
}

const timeAgo = computed(() => calculateTimeAgo(props.created_at));
</script>

<style scoped lang="scss">
.card {
   position: relative;
   display: flex;
   flex-direction: row;
   height: 120px;
   background: #ffffff;
   box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
   border-radius: 6px;
   overflow: hidden;
   transition: transform 0.3s, box-shadow 0.3s;

   &__placeholder {
      width: 100%;
      height: 100%;
      object-fit: cover;
   }

   &__body {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 14px 16px;
      background: white;
   }

   &__title {
      font-weight: bold;
      font-size: 16px;
      color: #3366ff;
      text-decoration: none;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   &__location,
   &__date {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   &__price,
   &__currency {
      font-weight: 700;
      font-size: 14px;
   }

   &__block {
      display: flex;
      column-gap: 5px;
      margin-bottom: 10px;
   }

   &__section {
      display: flex;
      column-gap: 30px;

      @media screen and (max-width: 1200px) {
         flex-direction: column;
      }

      @media screen and (max-width: 1000px) {
         display: none;
      }

   }

   &__info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 12px;
      margin-top: auto;
      color: #a8a8a8;
   }

   &__more {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      gap: 110px;

      @media screen and (max-width: 1200px) {
         gap: 40px;
      }

      @media screen and (max-width: 1000px) {
         padding: 16px 0;
         padding-right: 16px;
      }
   }

   &__part {
      display: flex;
      flex-direction: column;
      gap: 4px;
   }

   &__state {
      color: #323232;
      font-size: 14px;
   }

   &__username {
      font-weight: bold;
      font-size: 16px;
      width: 250px;
      text-wrap: wrap;
      color: #000;
      margin-right: auto;

      @media screen and (max-width: 1200px) {
         width: 250px;
      }
   }

   &__wishlist {
      margin-right: auto;
   }

   &__wishlist-button {
      width: 24px;
      height: 24px;
      background-color: white;
      border: 1px solid transparent;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s;

      &.active {
         background-color: #3366ff;
         border-color: #3366ff;
      }

      .icon-heart {
         margin-top: 1px;
         width: 12px;
         height: 12px;
      }
   }

   &__buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media screen and (max-width: 1200px) {
         width: fit-content;
         margin-top: 8px;
         gap: 12px;
      }

      @media screen and (max-width: 1000px) {
         width: fit-content;
         gap: 12px;
      }
   }

   .button {
      border: none;
      height: 34px;
      width: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      color: #3366ff;
      background-color: #d6efff;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
         background-color: #9ed2f1;
      }

      @media screen and (max-width: 1000px) {
         height: 28px;
         width: 28px;
      }
   }
}

.swiper {
   width: 120px;
   height: 100%;
   display: flex;
   align-items: center;

   img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 120px;
   }
}
</style>

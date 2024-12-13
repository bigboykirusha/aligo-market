<template>
   <div :class="['card', { 'card--horizontal': horizontal }]">
      <nuxt-link :to="`/car/${id}`" class="card__image">
         <Swiper v-if="images.length" :modules="[SwiperAutoplay, SwiperPagination]" :slides-per-view="1"
            :pagination="{ clickable: true }" :navigation="false" :loop="true" :autoplay="false">>
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <picture v-if="image.path">
                  <source v-if="image.path_webp" :srcset="getImageUrl(image.path_webp)" type="image/webp" />
                  <img :src="getImageUrl(image.path)" alt="Slide Image" />
               </picture>
               <img v-else src="../assets/icons/placeholder.png" alt="Placeholder image" class="card__placeholder" />
            </SwiperSlide>
            <div class="swiper-pagination"></div>
         </Swiper>
         <img v-else src='../assets/icons/placeholder.png' alt="Placeholder image" class="card__placeholder" />
      </nuxt-link>
      <div class="card__body">
         <div v-if="!horizontal" class="card__vertical">
            <button v-if="isLoggedIn && !(id_user_owner_ads === userStore.userId)" class="card__wishlist-button"
               :class="{ active: isWishlisted }" @click="toggleWishList">
               <img :src="isWishlisted ? favActive : fav" alt="Избранное" class="icon-heart" />
            </button>
            <button v-else-if="!(id_user_owner_ads === userStore.userId)" class="card__wishlist-button"
               @click="toggleLoginModal">
               <img :src="fav" alt="Избранное" class="icon-heart" />
            </button>
         </div>
         <nuxt-link :to="`/car/${id}`" class="card__title">
            {{ brand }} {{ model }}, {{ year }}
            <div v-if="horizontal" class="card__horizontal">
               <button v-if="!(id_user_owner_ads === userStore.userId) && isLoggedIn" class="card__wishlist-button"
                  :class="{ active: isWishlisted }" @click.prevent="toggleWishList">
                  <img :src="isWishlisted ? favActive : fav" alt="Избранное" class="icon-heart" />
               </button>
               <button v-else-if="!(id_user_owner_ads === userStore.userId)" class="card__wishlist-button"
                  @click.prevent="toggleLoginModal">
                  <img :src="fav" alt="Избранное" class="icon-heart" />
               </button>
            </div>
         </nuxt-link>
         <div class="card__block">
            <span class="card__price">{{ formatNumberWithSpaces(price) }}</span>
            <span class="card__currency">₽</span>
         </div>
         <div v-if="horizontal" class="card__description">{{ description }}</div>
         <div class="card__info">
            <div class="card__location">{{ place }}</div>
            <div class="card__date">{{ timeAgo }}</div>
         </div>
         <div v-if="!horizontal && !(id_user_owner_ads === userStore.userId)" class="card__buttons">
            <button v-if="isLoggedIn" class="button" @click="productCardAction('Написать')">
               <a class="button__text">{{ $t('card.write') }}</a>
            </button>
            <button v-else class="button" @click="toggleLoginModal">
               <span class="button__text">{{ $t('card.write') }}</span>
            </button>

            <button v-if="isLoggedIn && showPhone" class="button" @click="makeCall">
               <a :href="`tel:${phone}`" class="button__text">{{ $t('card.call') }}</a>
            </button>
            <button v-else-if="isLoggedIn" class="button" @click="handleCallClick">
               <span class="button__text">{{ $t('card.call') }}</span>
            </button>
            <button v-else class="button" @click="toggleLoginModal">
               <span class="button__text">{{ $t('card.call') }}</span>
            </button>
         </div>
      </div>
      <div v-if="horizontal" class="card__more">
         <div class="card__username">{{ formattedUsername }}</div>
         <div class="card__reviews">3 отзыва</div>
         <div class="horizontal-wishlist">
            <button v-if="isLoggedIn && !(id_user_owner_ads === userStore.userId)" class="card__wishlist-button"
               :class="{ active: isWishlisted }" @click="toggleWishList">
               <img :src="isWishlisted ? favActive : fav" alt="Избранное" class="icon-heart" />
            </button>
            <button v-else-if="!(id_user_owner_ads === userStore.userId)" class="card__wishlist-button"
               @click="toggleLoginModal">
               <img :src="fav" alt="Избранное" class="icon-heart" />
            </button>
         </div>
         <div v-if="!(id_user_owner_ads === userStore.userId)" class="card__buttons">
            <button v-if="isLoggedIn" class="button" @click="productCardAction('Написать')">
               <a class="button__text">Написать на сайте</a>
            </button>
            <button v-else class="button" @click="toggleLoginModal">
               <span class="button__text">Написать на сайте</span>
            </button>
            <button v-if="isLoggedIn && showPhone" class="button" @click="makeCall">
               <a :href="`tel:${phone}`" class="button__text">Показать номер</a>
            </button>
            <button v-else-if="isLoggedIn" class="button" @click="handleCallClick">
               <span class="button__text">Показать номер</span>
            </button>
            <button v-else class="button" @click="toggleLoginModal">
               <span class="button__text">Показать номер</span>
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import favActive from '../assets/icons/fav-white.svg';
import fav from '../assets/icons/fav.svg';
import { useUserStore } from '~/store/user';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { getImageUrl } from '../services/imageUtils'
import { useFavoritesStore } from '~/store/favorites';
import { seeContact, getUser } from '~/services/apiClient';
import { useChatStore } from '~/store/chatStore';
import { useLoginModalStore } from '~/store/loginModal.js';

const loginModalStore = useLoginModalStore();

const toggleLoginModal = () => {
   loginModalStore.toggleLoginModal();
};

const currentChatStore = useChatStore();

const showPhone = ref(false);
const phone = ref('');

function getRandomDelay() {
   return Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
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

const props = defineProps({
   id: {
      type: Number,
      default: 0
   },
   description: {
      type: String,
      default: 'Нет описания'
   },
   price: {
      type: Number,
      default: 0
   },
   place: {
      type: String,
      default: 'Не указано'
   },
   callNumber: {
      type: String,
      default: 'Не указано'
   },
   messageEmail: {
      type: String,
      default: 'Не указано'
   },
   brand: {
      type: String,
      default: 'Не указано'
   },
   model: {
      type: String,
      default: 'Не указано'
   },
   year: {
      type: String,
      default: '2007'
   },
   username: {
      type: String,
      default: 'Не указано'
   },
   horizontal: {
      type: Boolean,
      default: false
   },
   is_in_favorites: {
      type: Number,
      default: 1
   },
   images: {
      type: Array,
      default: () => []
   },
   created_at: {
      type: String,
      default: 'Не указано'
   },
   id_user_owner_ads: {
      type: Number,
      default: 0
   },
});

const isWishlisted = computed(() => favoritesStore.items.includes(props.id))
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userPhotoUrl = ref('');

const toggleWishList = async () => {
   await favoritesStore.toggleFavorite(props.id);
   userStore.fetchUserCounts();
};

const formattedUsername = computed(() => {
   const username = props.username || 'Имя не указано';
   return username.charAt(0).toUpperCase() + username.slice(1);
});

const productCardAction = (action) => {
   if (action === 'Написать') {
      prepareChatData();
   }
   console.log(`Выполнено действие: ${action}`);
};

const prepareChatData = async () => {
   const userData = await getUser(props.id_user_owner_ads);
   userPhotoUrl.value = userData.photo?.path;

   const chatData = {
      ads_info: `${props.brand} ${props.model}, ${props.year}`,
      ads_photo: [{
         path: props.images[0]?.path,
      }],
      for_user: {
         id: props.id_user_owner_ads,
         photo: {
            path: userPhotoUrl.value,
         },
         username: formattedUsername.value,
      },
      ads_id: props.id,
      main_category_id: 1,
      from_user: {
         id: null,
      },
   };

   currentChatStore.setCurrentChat(chatData);
   currentChatStore.openChat();
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
   min-width: 220px;
   transition: transform 0.3s, box-shadow 0.3s;

   &__placeholder {
      width: 100%;
      height: 100%;
      object-fit: cover;
   }

   &:hover {
      .card__buttons {
         transform: translateY(10px);
         opacity: 1;
      }
   }

   &__image {
      flex: 0 0 auto;
      width: 100%;
      max-height: 220px;
      cursor: pointer;

      .card__img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         transition: all 0.3s;

         &:hover {
            filter: contrast(1.02) brightness(1.02);
            transform: scale(1.02);
         }
      }
   }

   &__wishlist-button {
      position: absolute;
      top: -12px;
      right: 16px;
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

      &:hover {
         background-color: #D6EFFF;
         border-color: #D6EFFF;
      }

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

   &__title {
      display: block;
      font-weight: bold;
      font-size: 14px;
      line-height: 129%;
      color: #3366ff;
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   &__block {
      display: flex;
      column-gap: 5px;
   }

   &__price {
      font-weight: bold;
      font-size: 14px;
      line-height: 129%;
      color: #323232;
   }

   &__currency {
      font-weight: bold;
      font-size: 14px;
      line-height: 129%;
      color: black;
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
      position: relative;
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      z-index: 2;
      padding: 14px 16px 16px;
      background: white;
   }

   &__more {
      display: flex;
      gap: 10px;
      flex-direction: column;
      padding: 24px;
   }

   @media (max-width: 768px) {
      .card__buttons .button {
         .button__text {
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
         }
      }
   }

   &__username {
      display: flex;
      align-items: center;
      font-weight: bold;
      height: 24px;
      font-size: 14px;
      line-height: 129%;
      color: #000;
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
      gap: 6px;
      padding: 10px;
      background: white;
      transform: translateY(40px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
   }

   .button {
      border: none;
      border-radius: 6px;

      &__text {
         display: block;
         padding: 10px;
         font-weight: 400;
         font-size: 14px;
         line-height: 129%;
         text-align: center;
         color: #3366ff;
         background-color: #d6efff;
         border-radius: 6px;
         cursor: pointer;
         transition: background-color 0.3s;

         @media (max-width: 768px) {
            display: none;
         }

         &:hover {
            background-color: #9ed2f1;
         }
      }
   }


   &--horizontal {
      flex-direction: row;
      height: 220px;

      &:hover {
         .card__buttons {
            transform: none;
            opacity: 1;
         }
      }

      .card {
         &__image {
            width: 220px;
            height: 220px;

            @media (max-width: 991px) {
               width: 180px;
            }

            @media (max-width: 480px) {
               width: 136px;
            }
         }

         &__wishlist-button {
            position: static;
         }

         &__title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            font-weight: bold;
            font-size: 14px;
            line-height: 129%;
            color: #3366ff;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
         }

         &__description {
            font-size: 14px;
            color: #323232;
            max-width: 80%;
            margin-bottom: auto;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
         }

         &__block {
            display: flex;
            column-gap: 5px;
         }

         &__username,
         &__reviews {
            @media (max-width: 768px) {
               display: none;
            }
         }

         &__price {
            font-weight: bold;
            font-size: 14px;
            line-height: 129%;
            color: black;
         }

         &__currency {
            font-weight: bold;
            font-size: 14px;
            line-height: 129%;
            color: black;
         }

         &__location,
         &__date {
            font-size: 12px;
            color: #a8a8a8;
            max-width: 80%;
         }

         &__body {
            position: relative;
            display: flex;
            max-width: 470px;
            flex: 2;
            flex-direction: column;
            row-gap: 10px;
            z-index: 2;
            padding: 24px;
            background: white;

            @media (max-width: 991px) {
               max-width: 340px;
            }

            @media (max-width: 768px) {
               padding-right: 0;
               max-width: 300px;
            }

            @media (max-width: 600px) {
               padding-right: 0;
               max-width: 160px;
            }
         }

         &__more {
            min-width: 260px;
            margin-left: auto;

            @media (max-width: 768px) {
               min-width: 0;
            }
         }

         &__buttons {
            position: static;
            width: 100%;

            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 0;
            margin-top: auto;
            background: white;
            transform: none;
            opacity: 1;
            transition: none;

            .button {
               width: 144px;

               @media (max-width: 768px) {
                  width: 28px;
                  height: 28px;
                  background-color: #d6efff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
               }

               &__text {
                  padding: 8px;

                  @media (max-width: 768px) {
                     padding: 0;
                     display: none;
                     height: 14px;
                     width: 14px;
                     margin-top: 3px;
                  }
               }
            }
         }
      }
   }
}

.horizontal-wishlist {
   display: none;

   @media (max-width: 768px) {
      display: block;
   }
}

.card__horizontal {

   @media (max-width: 768px) {
      display: none;
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

.swiper-counter {
   position: absolute;
   z-index: 3;
   top: 10px;
   right: 10px;
   background-color: #3366ff;
   color: white;
   padding: 2px 6px;
   border-radius: 15px;
   font-size: 12px;
}
</style>
<template>
   <div :class="['side-menu', { 'side-menu--open': isMenuOpen }]" ref="userMenuRef">
      <div class="user-menu">
         <img class="close-icon" src="../assets/icons/close-white.svg" alt="" @click="toggleMenu">
         <div class="user-menu__header">
            <div class="user-menu__block">
               <ul class="user-menu__nav-list">
                  <li class="user-menu__nav-item">
                     <button class="user-menu__nav-link" @click="toggleModal">
                        <img :src="defaultLocationIcon" alt="location icon" />
                        <span class="user-menu__text user-menu__text--hidden">{{ translatedCityName }}</span>
                     </button>
                  </li>
               </ul>

               <img :src="avatarUrl" alt="login icon" class="user-menu__icon" />
               <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                  class="hidden-input" />
               <img src="../assets/icons/change-ava.svg" alt="change avatar icon" class="user-menu__icon-change"
                  @click="triggerFileInput" />

               <a class="user-menu__user-name">{{ displayName }}</a>

               <div v-if="rating === null" class="user-menu__rating-text">О вас нет отзывов</div>
               <a v-else class="user-menu__profile-button">
                  <div class="user-menu__rating">
                     <div class="user-menu__rating-text">{{ rating }}</div>
                     <NuxtRating :rating-value="Number(rating)" :rating-count="5" :rating-size="9" :rating-spacing="6"
                        :active-color="'#FFFFFF'" :inactive-color="'#3366FF'" :border-color="'#FFFFFF'"
                        :border-width="2" :rounded-corners="true" :read-only="true" />
                     {{ countReviews }} {{ pluralizeReview(countReviews) }}
                  </div>
               </a>

               <nuxt-link @click="toggleMenu" to="/profile/edit" class="user-menu__profile-button">
                  Управление профилем
               </nuxt-link>

               <nuxt-link @click="toggleMenu" class="user-menu__item--post" to="/createAd">
                  <img :src="postIcon" />Разместить объявление
               </nuxt-link>
            </div>
         </div>

         <ul class="user-menu__list">
            <li class="user-menu__item user-menu__item--search">
               <nuxt-link @click="toggleMenu" to="/">
                  <img :src="searchIcon" />Все объявления
               </nuxt-link>
            </li>
            <li v-for="(item, index) in menuItems" :key="index" class="user-menu__item" @click="toggleMenu">
               <nuxt-link :to="item.link">
                  <img :src="item.icon" />{{ item.text }}
                  <div v-if="item.count" class="user-menu__count">{{ item.count }}</div>
               </nuxt-link>
            </li>
            <li class="user-menu__item user-menu__item--logout" @click="logout">Выйти</li>
         </ul>
      </div>
      <LocationModal v-if="modalOpen" @close-modal="toggleModal" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getImageUrl } from '../services/imageUtils';
import { useUserStore } from '~/store/user';
import { useCityStore } from '~/store/city';
import { useBurgerStore } from '~/store/burger';
import { getUserCount } from '~/services/apiClient.js';
import defaultLocationIcon from '../assets/icons/location.svg';
import avatarRevers from '../assets/icons/avatar-revers.svg';

import searchIcon from '../assets/icons/search-blue.svg';
import adIcon from '../assets/icons/ad.svg';
import favIcon from '../assets/icons/favorites-menu.svg';
import reviewsIcon from '../assets/icons/reviews.svg';
import notifIcon from '../assets/icons/notif-blue.svg';
import mailMenuIcon from '../assets/icons/message-menu.svg';
import busIcon from '../assets/icons/briefcase.svg';
import postIcon from '../assets/icons/add.svg';


const userStore = useUserStore();
const cityStore = useCityStore();
const burgerStore = useBurgerStore();

const isMenuOpen = computed(() => burgerStore.isOpen);
const modalOpen = ref(false);
const userMenuRef = ref(null);

const countReviews = computed(() => userStore.countReviews);

const userName = computed(() => userStore.username || userStore.login);
const avatarUrl = computed(() => getImageUrl(userStore.photo?.path, avatarRevers));
const phoneNumber = computed(() => userStore.phoneNumber);
const rating = computed(() => userStore.grade);

const translatedCityName = computed(() => cityStore.selectedCity.name);
const formattedPhoneNumber = computed(() => phoneNumber.value || userStore.email);
const displayName = computed(() => userName.value ? capitalize(userName.value) : formattedPhoneNumber.value);

const menuItems = [
   { text: 'Мои объявления', link: '/profile/ads', icon: adIcon, count: userStore.countAds },
   { text: 'Избранное', link: '/profile/favorites', icon: favIcon, count: userStore.countFavorites },
   { text: 'Сообщения', link: '/profile/messages', icon: mailMenuIcon, count: userStore.count_new_messages },
   { text: 'Оповещения', link: '/profile/notifications', icon: notifIcon, count: userStore.countUnreadNotify },
   { text: 'Отзывы', link: '/profile/reviews', icon: reviewsIcon, count: userStore.countReviews },
   { text: 'Для бизнеса', link: '/business', icon: busIcon }
];

const toggleMenu = () => {
   burgerStore.toggleBurger();
};

const toggleModal = () => (modalOpen.value = !modalOpen.value);

const logout = () => {
   userStore.clearUserdata();
   toggleMenu();
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

const handleAvatarChange = async (event) => {
   const file = event.target.files[0];
   if (!file) return;
   try {
      await userStore.updateProfile({ photo: file });
      avatarUrl.value = URL.createObjectURL(file);
   } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
   }
};

const triggerFileInput = () => {
   userMenuRef.value?.querySelector('#avatarUpload')?.click();
};

onMounted(async () => {
   try {
      const data = await getUserCount();
      userStore.countFavorites = data.count_favorites;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
   }
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<style scoped lang="scss">
.side-menu {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: #1a1a1a;
   z-index: 10000;
   width: 100%;
   height: 100vh;
   display: flex;
   justify-content: center;
   transform: translateX(100%);
   align-items: center;
   transition: transform 0.3s ease-in-out;

   &--open {
      transform: translateX(0);
   }

   &__close-button {
      background: transparent;
      border: none;
      cursor: pointer;
   }
}

.user-menu {
   display: flex;
   flex-direction: column;
   background-color: #ffffff;
   width: 100%;
   height: 100%;

   &__header {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
   }

   &__nav-list {
      display: flex;
      position: relative;
      align-items: center;
      list-style: none;
      gap: 40px;
      width: 100%;
      margin-bottom: 16px;
   }

   &__nav-item {
      display: flex;
      align-items: center;
      position: relative;
   }

   &__rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
   }

   &__rating-text {
      font-size: 14px;
      color: #ffffff;
   }

   &__nav-link {
      display: flex;
      align-items: center;
      color: $white;
      font-weight: 400;
      font-size: 12px;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: $transition-1;

      img {
         margin-right: 7px;
      }
   }

   &__block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 24px 40px 32px;
      background-color: #3366FF;
      width: 100%;
   }

   &__user-circle {
      background-color: #007bff;
      color: #ffffff;
      font-size: 18px;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: bold;
   }

   &__user-name {
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin-bottom: 4px;
   }

   &__profile-button {
      font-size: 14px;
      color: white;
      background: transparent;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
         color: #0056b3;
         text-decoration: underline;
      }
   }

   &__icon {
      object-fit: cover;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-bottom: 16px;
   }

   &__icon-change {
      position: absolute;
      left: 85px;
      top: 105px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      padding: 0 5px;
      background-color: white;
      object-fit: contain;
      cursor: pointer;
      border: 1px solid #eeeeee;

      &:hover {
         background-color: #D6EFFF;
      }
   }

   &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background-color: white;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 32px 40px;
   }

   &__item {

      a {
         display: flex;
         justify-content: flex-start;
         gap: 10px;
         align-items: center;
         font-size: 14px;
         color: #3366FF;
         cursor: pointer;
         transition: all 0.2s;

         svg {
            width: 16px;

            path {
               stroke: #3366FF;
            }
         }

         &:hover {
            text-decoration: underline;
         }
      }
   }

   &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #3366FF;
      background: #EEF9FF;
      border-radius: 12px;
      padding: 0 7px;
      height: 20px;
   }

   &__item--logout {
      color: #787878;
      padding-top: 16px;
      margin-top: 8px;
      font-size: 14px;
      cursor: pointer;
      border-top: 1px solid #EEEEEE;
      transition: all 0.2s;

      &:hover {
         color: red;
         text-decoration: underline;
      }
   }

   &__item--search {
      padding-bottom: 24px;
      margin-bottom: 8px;
      font-size: 14px;
      cursor: pointer;
      border-bottom: 1px solid #EEEEEE;
   }

   &__item--post {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #ffffff;
      font-size: 14px;
      cursor: pointer;
      margin-top: 16px;

      img {
         width: 16px;
         height: 16px;
      }
   }
}

.hidden-input {
   display: none;
}

.close-icon {
   position: absolute;
   z-index: 14;
   top: 24px;
   right: 24px;
   width: 16px;
   height: 16px;
}
</style>
<template>
   <div :class="['side-menu', { 'side-menu--open': isMenuOpen }]" ref="userMenuRef">
      <div class="user-menu">
         <img class="close-icon" :src="icons.close" alt="close" @click="toggleMenu" />
         <div class="user-menu__header">
            <div class="user-menu__block">
               <ul class="user-menu__nav-list">
                  <li class="user-menu__nav-item">
                     <button class="user-menu__nav-link" @click="toggleModal">
                        <img :src="icons.location" alt="location icon" />
                        <span class="user-menu__text user-menu__text--hidden">{{ translatedCityName }}</span>
                     </button>
                  </li>
               </ul>

               <img :src="avatarUrl" alt="avatar" class="user-menu__icon" />
               <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                  class="hidden-input" />
               <img :src="icons.changeAva" alt="change avatar" class="user-menu__icon-change"
                  @click="triggerFileInput" />

               <a class="user-menu__user-name">{{ displayName }}</a>

               <div class="user-menu__profile-button">
                  <nuxt-link to="/profile/reviews/aboutme" class="user-menu__rating">
                     <div class="user-menu__rating-text">{{ rating === 0 ? '0.0' : rating }}</div>
                     <NuxtRating :rating-value="rating" :rating-count="5" :rating-size="10" :rating-spacing="6"
                        active-color="#FFFFFF" inactive-color="#3366FF" border-color="#FFFFFF" :border-width="2"
                        rounded-corners read-only />
                     <span class="user-menu__rating-count">
                        {{ userStore.countReviews === 0 ? 'Нет отзывов' : `${userStore.countReviews}
                        ${pluralizeReview(userStore.countReviews)}` }}
                     </span>
                  </nuxt-link>
               </div>

               <nuxt-link @click="toggleMenu" to="/profile/edit" class="user-menu__profile-button">Управление
                  профилем</nuxt-link>

               <nuxt-link @click="toggleMenu" class="user-menu__item--post" to="/create">
                  <img :src="icons.post" />Разместить объявление
               </nuxt-link>
            </div>
         </div>

         <ul class="user-menu__list">
            <li class="user-menu__item user-menu__item--search">
               <nuxt-link @click="toggleMenu" to="/">
                  <img :src="icons.search" />Все объявления
               </nuxt-link>
            </li>
            <li v-for="item in menuItems" :key="item.link" class="user-menu__item" @click="toggleMenu">
               <nuxt-link :to="item.link">
                  <img :src="item.icon" />{{ item.text }}
                  <div v-if="item.count" class="user-menu__count">{{ item.count }}</div>
               </nuxt-link>
            </li>
            <li class="user-menu__item user-menu__item--logout" @click="logout">Выйти</li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '~/store/user';
import { useCityStore } from '~/store/city';
import { useBurgerStore } from '~/store/burger';
import { useLoginModalStore } from '~/store/loginModal';
import { useLocationModalStore } from '~/store/locationModalStore';
import { useRouter } from '#app';
import { storeToRefs } from 'pinia';
import { getImageUrl } from '../services/imageUtils';

import closeIcon from '../assets/icons/close-white.svg';
import defaultLocationIcon from '../assets/icons/location.svg';
import avatarRevers from '../assets/icons/avatar-revers.svg';
import changeAvaIcon from '../assets/icons/change-ava.svg';
import searchIcon from '../assets/icons/search-blue.svg';
import adIcon from '../assets/icons/ad.svg';
import favIcon from '../assets/icons/favorites-menu.svg';
import reviewsIcon from '../assets/icons/reviews.svg';
import notifIcon from '../assets/icons/notif-blue.svg';
import mailMenuIcon from '../assets/icons/message-menu.svg';
import busIcon from '../assets/icons/briefcase.svg';
import specIcon from '../assets/icons/spec-check-icon.svg';
import postIcon from '../assets/icons/add.svg';

const userStore = useUserStore();
const cityStore = useCityStore();
const burgerStore = useBurgerStore();
const loginModalStore = useLoginModalStore();
const locationModalStore = useLocationModalStore();
const router = useRouter();

const { count_new_messages, countFavorites, countAds, countUnreadNotify, countReviews } = storeToRefs(userStore);

const isMenuOpen = computed(() => burgerStore.isOpen);
const userMenuRef = ref(null);

const userName = computed(() => userStore.username || userStore.login);
const avatarUrl = computed(() => getImageUrl(userStore.photo?.arr_title_size?.preview, avatarRevers));
const rating = computed(() => userStore.grade);
const translatedCityName = computed(() => cityStore.selectedCity.name);
const displayName = computed(() => userName.value ? capitalize(userName.value) : userStore.phoneNumber || userStore.email);

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const icons = {
   close: closeIcon,
   location: defaultLocationIcon,
   avatarFallback: avatarRevers,
   changeAva: changeAvaIcon,
   search: searchIcon,
   ad: adIcon,
   fav: favIcon,
   reviews: reviewsIcon,
   notif: notifIcon,
   message: mailMenuIcon,
   business: busIcon,
   post: postIcon
};

const menuItems = computed(() => [
   { text: 'Мои объявления', link: '/profile/ads/all', icon: icons.ad, count: countAds.value },
   { text: 'Избранное', link: '/profile/favorites/ads', icon: icons.fav, count: countFavorites.value },
   { text: 'Сообщения', link: '/profile/messages', icon: icons.message, count: count_new_messages.value },
   { text: 'Оповещения', link: '/profile/notifications', icon: icons.notif, count: countUnreadNotify.value },
   { text: 'Отзывы', link: '/profile/reviews/mine', icon: icons.reviews, count: userStore.count_new_reviews_about_myself },
   { text: 'Проверка авто', link: '/profile/reports', icon: specIcon, count: 0 },
   { text: 'Для бизнеса', link: '/business', icon: icons.business }
]);

const handleAvatarChange = async (event) => {
   const file = event.target.files[0];
   if (!file) return;

   const validFormats = ['image/heic', 'image/heif', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
   const maxSizeMB = 5;
   const maxSizeBytes = maxSizeMB * 1024 * 1024;

   if (!validFormats.includes(file.type)) {
      popupErrorStore.showError('Ошибка: допустимые форматы изображений - HEIC, HEIF, JPG, JPEG, PNG, WEBP.');
      return;
   }

   if (file.size > maxSizeBytes) {
      popupErrorStore.showError(`Ошибка: размер файла не должен превышать ${maxSizeMB} МБ.`);
      return;
   }

   try {
      await userStore.updateProfile({ photo: file });
   } catch (error) {
      popupErrorStore.showError('Ошибка при загрузке аватара. Попробуйте позже.');
      console.error('Ошибка при загрузке аватара:', error);
   }
};

const triggerFileInput = () => {
   userMenuRef.value?.querySelector('#avatarUpload')?.click();
};

const logout = () => {
   userStore.clearUserdata();
   loginModalStore.hideCodeField();
   router.push('/');
   toggleMenu();
};

const pluralizeReview = (count) => {
   const lastDigit = count % 10;
   const lastTwoDigits = count % 100;
   if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'отзывов';
   if (lastDigit === 1) return 'отзыв';
   if (lastDigit >= 2 && lastDigit <= 4) return 'отзыва';
   return 'отзывов';
};

const toggleMenu = () => burgerStore.toggleBurger();
const toggleModal = () => locationModalStore.toggleMenu();

</script>

<style scoped lang="scss">
.side-menu {
   position: fixed;
   inset: 0;
   background: linear-gradient(to bottom, #3366FF 0px, #3366FF 200px, #ffffff 200px, #ffffff 100%);
   z-index: 10000;
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100vh;
   height: 100dvh;
   transform: translateX(100%);
   transition: transform 0.2s ease-in-out;
   overflow-y: auto;

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

   &__header,
   &__nav-list,
   &__rating {
      display: flex;
      align-items: center;
   }

   &__header {
      gap: 12px;
   }

   &__rating {
      display: flex;
      align-items: center;
      outline: none;
      gap: 8px;
      font-size: 14px;
      margin: 4px 0;
      color: #FFFFFF;
      transition: color 0.2s ease;
   }

   &__rating-text {
      font-size: 14px;
      line-height: 18px;
      color: #FFFFFF;

      &--empty {
         font-size: 14px;
         color: #323232;
      }
   }

   &__nav-list {
      gap: 40px;
      list-style: none;
      width: 100%;
      margin-bottom: 16px;
   }

   &__nav-link {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: 0.2s ease-in-out;

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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      background-color: #007bff;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }

   &__user-name {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
   }

   &__profile-button {
      font-size: 14px;
      color: #ffffff;
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
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-bottom: 16px;
      object-fit: cover;
   }

   &__icon-change {
      position: absolute;
      left: 85px;
      top: 97px;
      width: 24px;
      height: 24px;
      padding: 0 5px;
      background-color: #ffffff;
      border-radius: 50%;
      border: 1px solid #eeeeee;
      cursor: pointer;
      object-fit: contain;

      &:hover {
         background-color: #D6EFFF;
      }
   }

   &__list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      list-style: none;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 32px 40px;
      background-color: #ffffff;
   }

   &__item a {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #3366FF;
      cursor: pointer;
      transition: all 0.2s;

      img {
         max-width: 16px;
         max-height: 16px;
         width: 16px;
      }

      &:hover {
         text-decoration: underline;
      }
   }

   &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      height: 24px;
      width: 24px;
      color: #3366FF;
      background: #EEF9FF;
      border-radius: 12px;
      line-height: 1;
   }

   &__item--logout {
      padding-top: 16px;
      margin-top: 8px;
      font-size: 14px;
      color: #787878;
      cursor: pointer;
      border-top: 1px solid #EEEEEE;
      transition: color 0.2s;

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
      font-size: 14px;
      color: #ffffff;
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
   top: 24px;
   right: 24px;
   width: 16px;
   height: 16px;
   z-index: 14;
}
</style>
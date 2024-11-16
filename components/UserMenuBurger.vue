<template>
   <div>
      <div class="side-menu-overlay" @click="toggleMenu"></div>
      <LocationModal v-if="modalOpen" @close-modal="toggleModal" />
      <div :class="['side-menu', { 'side-menu--right': isRight }]" ref="userMenuRef">
         <div class="user-menu">
            <div class="user-menu__header">
               <client-only>
                  <div class="user-menu__block">
                     <ul class="user-menu__nav-list">
                        <li class="user-menu__nav-item">
                           <LanguageSwitcher />
                        </li>
                        <li class="user-menu__nav-item">
                           <button class="user-menu__nav-link" @click="toggleModal">
                              <img :src="defaultLocationIcon" alt="location icon" />
                              <span class="user-menu__text user-menu__text--hidden">{{ translatedCityName }}</span>
                           </button>
                           <LocationPopup @open-modal="toggleModal" />
                        </li>
                        <li class="user-menu__nav-item">
                           <button class="side-menu__close-button" @click="toggleMenu">
                              <img src="../assets/icons/close-white.svg" alt="Close" />
                           </button>
                        </li>
                     </ul>

                     <img :src="avatarUrl || avatarRevers" alt="login icon" class="user-menu__icon" />
                     <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                        class="hidden-input" />
                     <img src="../assets/icons/change-ava.svg" alt="change avatar icon" class="user-menu__icon-change"
                        @click="triggerFileInput" />

                     <a v-if="userName" class="user-menu__user-name">{{ capitalizedUserName }}</a>
                     <a v-else class="user-menu__user-name">{{ formattedPhoneNumber }}</a>

                     <div v-if="rating === null" class="user-menu__rating-text">О вас нет отзывов</div>
                     <a v-else class="user-menu__profile-button">
                        <div class="user-menu__rating">
                           <div class="user-menu__rating-text">{{ rating }}</div>
                           <NuxtRating :rating-value="Number(rating)" :rating-count="5" :rating-size="10"
                              :rating-spacing="6" :active-color="'#FFFFFF'" :inactive-color="'#3366FF'"
                              :border-color="'#FFFFFF'" :border-width="2" :rounded-corners="true" :read-only="true" />
                        </div>
                     </a>

                     <nuxt-link @click="toggleMenu" to="/myself/editProfile" class="user-menu__profile-button">
                        Управление профилем
                     </nuxt-link>
                  </div>
               </client-only>
            </div>

            <ul class="user-menu__list">
               <li v-for="(item, index) in menuItems" :key="index" class="user-menu__item" @click="toggleMenu">
                  <nuxt-link :to="item.link">
                     <img :src="item.icon" />{{ item.text }}
                     <div v-if="item.count" class="user-menu__count">{{ item.count }}</div>
                  </nuxt-link>
               </li>
               <li class="user-menu__item user-menu__item--logout" @click="logout">
                  Выйти
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getImageUrl } from '../services/imageUtils';
import { useUserStore } from '~/store/user';
import { useCityStore } from '~/store/city';
import { getUserCount } from '~/services/apiClient.js';
import defaultLocationIcon from '../assets/icons/location.svg';
import avatarRevers from '../assets/icons/avatar-revers.svg';

import searchIcon from '../assets/icons/search-blue.svg';
import adIcon from '../assets/icons/ad.svg';
import favIcon from '../assets/icons/fav.svg';
import reviewsIcon from '../assets/icons/reviews.svg';
import notifIcon from '../assets/icons/notif-blue.svg';
import mailMenuIcon from '../assets/icons/mail-menu.svg';
import busIcon from '../assets/icons/briefcase.svg';

const userStore = useUserStore();
const cityStore = useCityStore();

const props = defineProps({
   isRight: {
      type: Boolean,
      default: false,
   }
});

const userName = computed(() => userStore.username || userStore.login);
const avatarUrl = ref(getImageUrl(userStore.photo?.path));
const phoneNumber = computed(() => userStore.phoneNumber);
const modalOpen = ref(false);
const translatedCityName = computed(() => cityStore.selectedCity.name);

const countFavorites = computed(() => userStore.countFavorites);
const countAds = computed(() => userStore.countAds);
const countUnreadNotify = computed(() => userStore.countUnreadNotify);
const countMessage = computed(() => userStore.count_new_messages);
const rating = computed(() => userStore.grade);

const formattedPhoneNumber = computed(() => phoneNumber.value || userStore.email);
const capitalizedUserName = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() + userName.value.slice(1) : '');

const userMenuRef = ref(null);
const emit = defineEmits(['close-burgerMenu']);

const toggleMenu = () => emit('close-burgerMenu');
const toggleModal = () => (modalOpen.value = !modalOpen.value);
const logout = () => {
   userStore.clearUserdata();
   toggleMenu();
};

const fetchUserCounts = async () => {
   try {
      const data = await getUserCount();
      userStore.countFavorites = data.count_favorites;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
   }
};

onMounted(() => {
   fetchUserCounts();
});

const handleAvatarChange = async (event) => {
   const file = event.target.files[0];
   if (file) {
      try {
         const formData = new FormData();
         formData.append('photo', file);
         await userStore.updateProfile({ photo: file });
         avatarUrl.value = URL.createObjectURL(file);
      } catch (error) {
         console.error('Ошибка при загрузке аватара: ', error);
      }
   }
};

const triggerFileInput = () => {
   const fileInput = userMenuRef.value?.querySelector('#avatarUpload');
   if (fileInput) {
      fileInput.click();
   }
};

const menuItems = [
   { text: 'Поиск объявлений', link: '/', icon: searchIcon },
   { text: 'Мои объявления', link: '/myself/ads', icon: adIcon, count: countAds },
   { text: 'Избранное', link: '/myself/favorites', icon: favIcon, count: countFavorites },
   { text: 'Отзывы', link: '/myself/reviews', icon: reviewsIcon },
   { text: 'Оповещения', link: '/myself/notifications', icon: notifIcon, count: countUnreadNotify },
   { text: 'Сообщения', link: '/myself/messages', icon: mailMenuIcon, count: countMessage },
   { text: 'Для бизнеса', link: '/myself/business', icon: busIcon },
];
</script>

<style scoped lang="scss">
.hidden-input {
   display: none;
}

.side-menu-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   background-color: rgba(0, 0, 0, 0.5);
   z-index: 10;
}

.side-menu {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100vh;
   background-color: #ffffff;
   display: flex;
   flex-direction: column;
   z-index: 4000;
   align-items: center;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   animation: slide-left 0.3s ease-out forwards;

   &--right {
      left: auto;
      z-index: 10;
      right: 0;
      animation: slide-right 0.3s ease-out forwards;

      .user-menu__nav-list {
         justify-content: flex-end;
         flex-direction: row-reverse;
         width: 100%;
         height: 56px;
         margin: 0;
      }

      .user-menu__nav-item {
         &:last-child {
            margin-right: auto;
            margin-left: 0;
         }
      }
   }
}

.side-menu__close-button {
   background: transparent;
   border: none;
   cursor: pointer;
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
      width: 100%;
      position: relative;
   }

   &__nav-list {
      display: flex;
      position: relative;
      align-items: center;
      list-style: none;
      gap: 40px;
      width: calc(100% + 44px);
      height: 56px;
      margin: 0 -24px;
   }

   &__nav-item {
      display: flex;
      align-items: center;
      position: relative;

      &:last-child {
         margin-left: auto;
      }
   }

   &__rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
   }

   .user-menu__rating-text {
      font-size: 14px;
      color: #ffffff;
      margin-right: 6px;
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
      background-color: #3366FF;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 40px;
      gap: 10px;
      width: 100%;
      padding-bottom: 40px;
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
      gap: 24px;
      background-color: white;
      border-radius: 0 0 4px 4px;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 40px;
   }

   &__item {

      &--search {
         border-bottom: 1px solid #EEEEEE;
         padding-bottom: 24px
      }

      img {
         width: 14px;
         max-height: 14px;
      }

      a {
         display: flex;
         justify-content: flex-start;
         outline: none;
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
      width: fit-content;
      padding: 0 7px;
      line-height: 1;
      height: 20px;
   }

   &__item--logout {
      color: #323232;
      padding-top: 24px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 0 0 4px 4px;
      border-top: 1px solid #EEEEEE;
      transition: all 0.2s;

      &:hover {
         color: red;
         text-decoration: underline;
      }
   }
}

@keyframes slide-left {
   from {
      transform: translateX(-100%);
   }

   to {
      transform: translateX(0);
   }
}

@keyframes slide-right {
   from {
      transform: translateX(100%);
   }

   to {
      transform: translateX(0);
   }
}
</style>

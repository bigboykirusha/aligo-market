<template>
   <div class="user-menu" ref="userMenuRef">
      <div class="user-menu__header">
         <client-only>
            <template v-if="userStore.photo?.path && capitalizedUserName && formattedPhoneNumber && userStore.address">
               <img :src="userAvatar" alt="user avatar" class="user-menu__user-avatar">
               <div v-if="capitalizedUserName" class="user-menu__block">
                  <nuxt-link to="/myself/editProfile" class="user-menu__user-name">{{ capitalizedUserName }}</nuxt-link>
                  <nuxt-link v-if="isProfileComplete" to="/myself/editProfile" class="user-menu__profile-button">
                     Заполнить профиль
                  </nuxt-link>
                  <nuxt-link v-else to="/myself/editProfile" class="user-menu__profile-button">
                     Редактировать профиль
                  </nuxt-link>
               </div>
            </template>
            <template v-else-if="userStore.photo?.path || capitalizedUserName || formattedPhoneNumber">
               <img v-if="userStore.photo?.path" :src="userAvatar" alt="user avatar" class="user-menu__user-avatar">
               <span v-if="!userStore.photo?.path && userStore.username" class="user-menu__user-circle">{{ initial
                  }}</span>
               <img v-if="!userStore.photo?.path && !userStore.username" :src="userAvatar" alt="user avatar"
                  class="user-menu__user-avatar">
               <div class="user-menu__block">
                  <nuxt-link to="/myself/editProfile" class="user-menu__user-name">
                     {{ capitalizedUserName || formattedPhoneNumber }}
                  </nuxt-link>
                  <nuxt-link v-if="isProfileComplete" to="/myself/editProfile" class="user-menu__profile-button">
                     Заполнить профиль
                  </nuxt-link>
                  <nuxt-link v-else to="/myself/editProfile" class="user-menu__profile-button">
                     Редактировать профиль
                  </nuxt-link>
               </div>
            </template>
            <template v-else>
               <div class="user-menu__block">
                  <nuxt-link v-if="isProfileComplete" to="/myself/editProfile" class="user-menu__profile-button">
                     Заполнить профиль
                  </nuxt-link>
                  <nuxt-link v-else to="/myself/editProfile" class="user-menu__profile-button">
                     Редактировать профиль
                  </nuxt-link>
               </div>
            </template>
         </client-only>
      </div>
      <ul class="user-menu__list">
         <li class="user-menu__item">
            <nuxt-link to="/myself/ads">Мои объявления <div v-show="countAds" class="user-menu__count">{{ countAds }}
               </div>
            </nuxt-link>
         </li>
         <li class="user-menu__item">
            <nuxt-link to="/myself/drafts">Черновики <div v-show="countDrafts" class="user-menu__count">{{ countDrafts
                  }}
               </div></nuxt-link>
         </li>
         <li class="user-menu__item">
            <nuxt-link to="/myself/favorites">Избранное <div v-show="countFavorites" class="user-menu__count">{{
               countFavorites }}</div></nuxt-link>
         </li>
         <li class="user-menu__item">
            <nuxt-link to="/myself/messages">Сообщения <div v-show="countMessage" class="user-menu__count">{{
               countMessage }}
               </div></nuxt-link>
         </li>
         <li class="user-menu__item">
            <nuxt-link to="/myself/notifications">Оповещения <div v-show="countUnreadNotify" class="user-menu__count">{{
               countUnreadNotify }}</div></nuxt-link>
         </li>
         <li class="user-menu__item">
            <nuxt-link to="/myself/reviews">Отзывы</nuxt-link>
         </li>
         <li class="user-menu__item user-menu__item--logout" @click="logout">
            Выйти
         </li>
      </ul>
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useUserStore } from '~/store/user';
import { getUserCount } from '~/services/apiClient.js';
import { useFavoritesStore } from '~/store/favorites';
import { getImageUrl } from '../services/imageUtils'
import avatarPhoto from '../assets/icons/avatar-revers.svg'

const favoritesStore = useFavoritesStore();
const userStore = useUserStore();
const userMenuRef = ref(null);

const isProfileComplete = computed(() => userStore.photo && userStore.username && userStore.phoneNumber.value && userStore.address && userStore.login);

const userName = computed(() => userStore.username || userStore.login);
const initial = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() : '');
const phoneNumber = computed(() => userStore.phoneNumber || '');
const formattedPhoneNumber = computed(() => {
   if (phoneNumber.value) {
      return phoneNumber.value;
   } else {
      return userStore.email;
   }
});
const capitalizedUserName = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() + userName.value.slice(1) : '');

const countFavorites = ref(favoritesStore.countFavorites);
const countUnreadNotify = ref(userStore.countUnreadNotify);
const countDrafts = ref(userStore.countDrafts);
const countAds = ref(userStore.countAds);
const countMessage = ref(userStore.count_new_messages);

const emit = defineEmits(['close-userMenu']);

const fetchUserCounts = async () => {
   try {
      const data = await getUserCount();
      countUnreadNotify.value = data.count_unread_notify;
      countDrafts.value = data.count_drafts;
      countMessage.value = data.count_new_messages;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
   }
};

const closeModal = () => {
   emit('close-userMenu');
};

const handleClickOutside = (event) => {
   if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      closeModal();
   }
};

const userAvatar = computed(() => getImageUrl(userStore.photo?.path, avatarPhoto));

onMounted(() => {
   fetchUserCounts();
   document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
   document.removeEventListener('click', handleClickOutside);
});

const logout = () => {
   userStore.clearUserdata();
   emit('close-userMenu');
};
</script>

<style scoped lang="scss">
.user-menu {
   position: absolute;
   z-index: 20;
   background-color: white;
   border: 1px solid #3366FF;
   border-radius: 0 0 4px 4px;
   top: 0;
   left: -16px;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 216px;

   @media screen and (max-width: 1420px) {
      right: -16px;
      margin-left: auto;
   }

   &__user-avatar {
      height: 24px;
      width: 24px;
      object-fit: cover;
      border-radius: 50%;
   }

   &__header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background-color: #fff;
      border-bottom: 1px solid #EEEEEE;
      width: 100%;
   }

   &__block {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
   }

   &__user-circle {
      background-color: #3366FF;
      font-size: 14px;
      color: #fff;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
   }

   &__user-name {
      font-size: 12px;
      font-weight: 700;
      color: #0056b3;
   }

   &__profile-button {
      font-size: 10px;
      color: #0056b3;
      background: transparent;
      border: none;
      cursor: pointer;
      line-height: 1;
      text-decoration: none;

      &:hover {
         color: #003d7a;
         text-decoration: underline;
      }
   }

   &__list {
      list-style: none;
      background-color: white;
      border-radius: 0 0 4px 4px;
      width: 100%;
      margin: 0;
      padding: 0;
   }

   &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      font-size: 12px;
      color: #323232;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
         background: #D6EFFF;
         color: #3366FF;
      }

      & a {
         color: inherit;
         text-decoration: none;
         display: flex;
         align-items: center;
         justify-content: space-between;
         width: 100%;
      }
   }

   &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background: #3366FF;
      border-radius: 12px;
      width: fit-content;
      padding: 0 7px;
      line-height: 1;
      height: 20px;
   }

   &__item--logout {
      color: #323232;
      padding: 10px 16px;
      font-size: 12px;
      cursor: pointer;
      border-radius: 0 0 4px 4px;
      border-top: 1px solid #EEEEEE;
      transition: all 0.2s;

      &:hover {
         background: #D6EFFF;
         color: #3366FF;
      }
   }
}
</style>
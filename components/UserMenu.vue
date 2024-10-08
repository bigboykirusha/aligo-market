<template>
   <div class="user-menu" ref="userMenuRef">
      <div class="user-menu__header">
         <client-only>
            <template v-if="userName">
               <div class="user-menu__block">
                  <img :src="avatarUrl" alt="login icon" class="user-menu__icon">
                  <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                     style="display: none" />
                  <img src="../assets/icons/change-ava.svg" alt="login icon" class="user-menu__icon-change"
                     @click="triggerFileInput">
                  <a class="user-menu__user-name">{{ capitalizedUserName }}</a>
                  <div v-if="rating === null" class="user-menu__rating-text--empty">
                     О вас нет отзывов
                  </div>
                  <a v-else class="user-menu__profile-button">
                     <div class="user-menu__rating">
                        <div class="user-menu__rating-text">{{ rating }}</div>
                        <NuxtRating :rating-value="Number(rating)" :rating-count="5" :rating-size="10"
                           :rating-spacing="6" :active-color="'#3366FF'" :inactive-color="'#FFFFFF'"
                           :border-color="'#3366FF'" :border-width="2" :rounded-corners="true" :read-only="true" />
                     </div> {{ countReviews }} {{ pluralizeReview(Number(countReviews)) }}
                  </a>
                  <nuxt-link to="/myself/editProfile" class="user-menu__profile-button">Управление профилем</nuxt-link>
               </div>
            </template>
            <template v-else>
               <div class="user-menu__block">
                  <img :src="avatarUrl" alt="login icon" class="user-menu__icon">
                  <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                     style="display: none" />
                  <img src="../assets/icons/change-ava.svg" alt="login icon" class="user-menu__icon-change"
                     @click="triggerFileInput">
                  <a class="user-menu__user-name">{{ formattedPhoneNumber }}</a>
                  <div v-if="rating === null" class="user-menu__rating-text--empty">
                     О вас нет отзывов
                  </div>
                  <a v-else class="user-menu__profile-button">
                     <div class="user-menu__rating">
                        <div class="user-menu__rating-text">{{ rating }}</div>
                        <NuxtRating :rating-value="Number(rating)" :rating-count="5" :rating-size="10"
                           :rating-spacing="6" :active-color="'#3366FF'" :inactive-color="'#FFFFFF'"
                           :border-color="'#3366FF'" :border-width="2" :rounded-corners="true" :read-only="true" />
                     </div> {{ countReviews }} {{ pluralizeReview(Number(countReviews)) }}
                  </a>
                  <nuxt-link to="/myself/editProfile" class="user-menu__profile-button">Управление профилем</nuxt-link>
               </div>
            </template>
         </client-only>
      </div>
      <ul class="user-menu__list">
         <li class="user-menu__item"
            :class="{ 'user-menu__item--active': activeItem === 'ads' || 'drafts' || 'archive' }"
            @click="selectMenuItem('ads')">
            <nuxt-link to="/myself/ads"><img src="../assets/icons/ad.svg" />Мои
               объявления <div v-show="countAds" class="user-menu__count">{{ countAds }}</div></nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': activeItem === 'favorites' }"
            @click="selectMenuItem('favorites')">
            <nuxt-link to="/myself/favorites"><img src="../assets/icons/fav.svg" />Избранное <div
                  v-show="countFavorites" class="user-menu__count">{{ countFavorites }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': activeItem === 'notifications' }"
            @click="selectMenuItem('notifications')">
            <nuxt-link to="/myself/notifications"><img src="../assets/icons/support.svg" />Оповещения
               <div v-show="countUnreadNotify" class="user-menu__count">{{ countUnreadNotify }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': activeItem === 'messages' }"
            @click="selectMenuItem('messages')">
            <nuxt-link to="/myself/messages"><img src="../assets/icons/mail-menu.svg" />Сообщения <div
                  v-show="countMessage" class="user-menu__count">{{ countMessage }}</div></nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': activeItem === 'support' }"
            @click="selectMenuItem('support')">
            <nuxt-link to="/myself/favorites"><img src="../assets/icons/send.svg" />Поддержка</nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': activeItem === 'reviews' }"
            @click="selectMenuItem('reviews')">
            <nuxt-link to="/myself/reviews"><img src="../assets/icons/reviews.svg" />Отзывы</nuxt-link>
         </li>
         <li class="user-menu__item user-menu__item--logout" @click="logout">
            Выйти
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { getUserCount } from '~/services/apiClient.js';
import { getImageUrl } from '../services/imageUtils'
import avatarPhoto from '../assets/icons/avatar-revers.svg'

const userStore = useUserStore();
const route = useRoute();

const userName = computed(() => userStore.username);
const capitalizedUserName = computed(() => {
   return userName.value ? userName.value.charAt(0).toUpperCase() + userName.value.slice(1) : '';
});

const phoneNumber = computed(() => userStore.phoneNumber);
const avatarUrl = ref(getImageUrl(userStore.photo?.path, avatarPhoto));
const rating = computed(() => userStore.grade);
const userMenuRef = ref(null);

const countFavorites = computed(() => userStore.countFavorites);
const countAds = computed(() => userStore.countAds);
const countUnreadNotify = computed(() => userStore.countUnreadNotify);
const countReviews = computed(() => userStore.countReviews);
const countMessage = computed(() => userStore.count_new_messages);

const emit = defineEmits(['close-userMenu', 'itemSelected']);

const logout = () => {
   userStore.clearUserdata();
   emit('close-userMenu');
};

const fetchUserCounts = async () => {
   try {
      const data = await getUserCount();
      countFavorites.value = data.count_favorites;
      countUnreadNotify.value = data.count_unread_notify;
      countMessage.value = data.count_new_messages;
      countAds.value = data.count_ads;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
   }
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
};

const formattedPhoneNumber = computed(() => {
   if (phoneNumber.value) {
      return phoneNumber.value;
   } else {
      return userStore.email;
   }
});

const activeItem = ref(route.params.title || 'ads');

const selectMenuItem = (item) => {
   activeItem.value = item;
   emit('itemSelected', item);
};

watch(() => route.params.title, (newTitle) => {
   activeItem.value = newTitle;
});

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
</script>

<style scoped lang="scss">
.user-menu {
   position: relative;
   background-color: white;
   border: 1px solid #eeeeee;
   border-radius: 4px;
   padding: 24px;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 270px;
   min-width: 270px;
   height: fit-content;

   @media (max-width: 991px) {
      width: 230px;
      min-width: 230px;
   }

   @media (max-width: 768px) {
      display: none;
   }

   &__icon {
      object-fit: cover;
      width: 64px;
      height: 64px;
      border-radius: 50%;
   }

   &__icon-change {
      position: absolute;
      left: 72px;
      top: 64px;
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

   &__rating {
      display: flex;
      align-items: center;
      gap: 8px;
   }

   .user-menu__rating-text {
      font-size: 14px;
      color: #3366FF;

      &--empty {
         font-size: 14px;
         color: #323232;
      }
   }

   &__header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      background-color: #fff;
      border-bottom: 1px solid #EEEEEE;
      width: 100%;
   }

   &__block {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 10px;
      padding-bottom: 24px;
      border-bottom: 1px solid #EEEEEE;
   }

   &__user-circle {
      background-color: #fff;
      font-size: 14px;
      color: #0056b3;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
   }

   &__user-name {
      font-size: 16px;
      font-weight: 700;
      color: #323232;
   }

   &__profile-button {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #3366FF;
      background: transparent;
      padding-top: 4px;
      border: none;
      cursor: pointer;
      line-height: 1;
      text-decoration: none;

      &:hover {
         text-decoration: underline;
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
      margin: 0;
      padding-top: 24px;
   }

   &__item a {
      display: flex;
      justify-content: flex-start;
      outline: none;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      color: #3366FF;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
         color: #144DF8;
         font-weight: 500;
      }
   }

   &__item--active {
      font-weight: 700;
   }

   &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #3366FF;
      background: #EEF9FF;
      padding: 0 7px;
      line-height: 1;
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
</style>
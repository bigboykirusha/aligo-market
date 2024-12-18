<template>
   <div class="user-menu" :class="{ 'user-menu--scrolled': isScrolled }" ref="userMenuRef">
      <div class="user-menu__header">
         <client-only>
            <div class="user-menu__block">
               <img :src="avatarUrl" alt="login icon" class="user-menu__icon">
               <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                  style="display: none" />
               <img src="../assets/icons/change-ava.svg" alt="change avatar" class="user-menu__icon-change"
                  @click="triggerFileInput">

               <a class="user-menu__user-name">{{ displayName }}</a>

               <div v-if="!rating" class="user-menu__rating-text--empty">О вас нет отзывов</div>
               <nuxt-link to="/myself/reviews" v-else class="user-menu__rating">
                  <div class="user-menu__rating-text">{{ rating }}</div>
                  <NuxtRating :rating-value="Number(rating)" :rating-count="5" :rating-size="10" :rating-spacing="6"
                     :active-color="'#3366FF'" :inactive-color="'#FFFFFF'" :border-color="'#3366FF'" :border-width="2"
                     :rounded-corners="true" :read-only="true" />
                  {{ countReviews }} {{ pluralizeReview(countReviews) }}
               </nuxt-link>

               <nuxt-link to="/myself/editProfile" class="user-menu__profile-button">
                  Управление профилем
               </nuxt-link>
            </div>
         </client-only>
      </div>

      <!-- Список меню -->
      <ul class="user-menu__list">
         <li class="user-menu__item" :class="{ 'user-menu__item--active': isActive('ads') }"
            @click="selectMenuItem('ads')">
            <nuxt-link to="/myself/ads">
               <img src="../assets/icons/ad.svg" /> Мои объявления
               <div v-show="countAds" class="user-menu__count">{{ countAds }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': isActive('favorites') }"
            @click="selectMenuItem('favorites')">
            <nuxt-link to="/myself/favorites">
               <img src="../assets/icons/fav.svg" /> Избранное
               <div v-show="countFavorites" class="user-menu__count">{{ countFavorites }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': isActive('messages') }"
            @click="selectMenuItem('messages')">
            <nuxt-link to="/myself/messages">
               <img src="../assets/icons/support.svg" /> Сообщения
               <div v-show="countMessage" class="user-menu__count">{{ countMessage }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': isActive('notifications') }"
            @click="selectMenuItem('notifications')">
            <nuxt-link to="/myself/notifications">
               <img src="../assets/icons/mail-menu.svg" /> Оповещения
               <div v-show="countUnreadNotify" class="user-menu__count">{{ countUnreadNotify }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item" :class="{ 'user-menu__item--active': isActive('reviews') }"
            @click="selectMenuItem('reviews')">
            <nuxt-link to="/myself/reviews">
               <img src="../assets/icons/reviews.svg" /> Отзывы
               <div v-show="countReviews" class="user-menu__count">{{ countReviews }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item user-menu__item--logout" @click="logout">Выйти</li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { getImageUrl } from '../services/imageUtils';
import avatarPhoto from '../assets/icons/avatar-revers.svg';

const userStore = useUserStore();
const route = useRoute();
const avatarUrl = ref(getImageUrl(userStore.photo?.path, avatarPhoto));
const userMenuRef = ref(null);

const displayName = computed(() => userStore.username || formattedPhoneNumber.value);

const formattedPhoneNumber = computed(() => userStore.phoneNumber || userStore.email);

const rating = computed(() => userStore.grade);
const countFavorites = computed(() => userStore.countFavorites);
const countAds = computed(() => userStore.countAds);
const countUnreadNotify = computed(() => userStore.countUnreadNotify);
const countReviews = computed(() => userStore.countReviews);
const countMessage = computed(() => userStore.count_new_messages);

const activeItem = ref(route.params.title || 'ads');

watch(() => route.params.title, (newTitle) => {
   activeItem.value = newTitle;
});


watch(
   () => userStore.$state,
   () => {
      avatarUrl.value = getImageUrl(userStore.photo?.path, avatarPhoto);
   },
   { deep: true }
);

const selectMenuItem = (item) => {
   activeItem.value = item;
};

const isActive = (item) => activeItem.value === item;

const handleAvatarChange = async (event) => {
   const file = event.target.files[0];
   if (file) {
      try {
         await userStore.updateProfile({ photo: file });
         avatarUrl.value = URL.createObjectURL(file);
      } catch (error) {
         console.error('Ошибка при загрузке аватара: ', error);
      }
   }
};

const triggerFileInput = () => {
   const fileInput = userMenuRef.value?.querySelector('#avatarUpload');
   fileInput?.click();
};

const isScrolled = ref(false);

const handleScroll = () => {
   isScrolled.value = window.scrollY > 0;
};

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
});

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
});

const logout = () => {
   userStore.clearUserdata();
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
</script>

<style scoped lang="scss">
.user-menu {
   position: fixed;
   top: 0;
   z-index: 1000;
   background-color: white;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   padding: 24px;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 270px;
   height: fit-content;
   margin-top: 134px;
   transition: margin-top 0.3s ease;

   &--scrolled {
      margin-top: 90px;
   }

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
      font-size: 14px;
      color: #3366FF;
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
      color: #787878;
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
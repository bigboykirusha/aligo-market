<template>
   <div class="user-menu" :class="{ 'user-menu--scrolled': isScrolled }" ref="userMenuRef">
      <div class="user-menu__header">
         <div class="user-menu__block">
            <img :src="avatarUrl" alt="login icon" class="user-menu__icon" />
            <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
               style="display: none" />
            <img src="../assets/icons/change-ava.svg" alt="change avatar" class="user-menu__icon-change"
               @click="triggerFileInput" />

            <a class="user-menu__user-name">{{ displayName }}</a>

            <nuxt-link to="/profile/reviews/aboutme" class="user-menu__rating">
               <div class="user-menu__rating-text">{{ rating === 0 ? '0.0' : rating }}</div>
               <NuxtRating :rating-value="rating" :rating-count="5" :rating-size="9" :rating-spacing="6"
                  active-color="#3366FF" inactive-color="#FFFFFF" border-color="#3366FF" :border-width="2"
                  rounded-corners read-only />
               <span class="user-menu__rating-count">
                  {{ userStore.countReviews === 0 ? 'Нет отзывов' : `${userStore.countReviews}
                  ${pluralizeReview(userStore.countReviews)}` }}
               </span>
            </nuxt-link>

            <nuxt-link to="/profile/edit" class="user-menu__profile-button">Управление профилем</nuxt-link>
         </div>
      </div>

      <ul class="user-menu__list">
         <template v-for="item in menuItems" :key="item.id">
            <li class="user-menu__item" :class="{ 'user-menu__item--active': isActive(item.id) }"
               @click="selectMenuItem(item.id)">
               <nuxt-link :to="item.link">
                  <img :src="item.icon" /> {{ item.label }}
                  <div v-show="item.count" class="user-menu__count">{{ item.count }}</div>
               </nuxt-link>
            </li>
         </template>
         <li class="user-menu__item user-menu__item--logout" @click="logout">Выйти</li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useLoginModalStore } from '~/store/loginModal';
import { usePopupErrorStore } from '~/store/popupErrorStore';
import { getImageUrl } from '../services/imageUtils';
import avatarPhoto from '../assets/icons/avatar-revers.svg';

import adIcon from '~/assets/icons/ad.svg';
import favIcon from '~/assets/icons/fav.svg';
import supportIcon from '~/assets/icons/support.svg';
import mailIcon from '~/assets/icons/mail-menu.svg';
import reviewsIcon from '~/assets/icons/reviews.svg';
import specIcon from '~/assets/icons/spec-check-icon.svg';

const userStore = useUserStore();
const popupErrorStore = usePopupErrorStore();

const loginModalStore = useLoginModalStore();
const route = useRoute();
const router = useRouter();
const userMenuRef = ref(null);
const isScrolled = ref(false);
const activeItem = computed(() => {
   return menuItems.value.find(item => route.path.startsWith(item.link))?.id;
});

const isActive = (item) => activeItem.value === item;

const avatarUrl = computed(() => getImageUrl(userStore.photo?.arr_title_size?.default, avatarPhoto));
const displayName = computed(() => userStore.username || userStore.phoneNumber || userStore.email);
const rating = computed(() => Number(userStore.grade));

const menuItems = computed(() => [
   { id: 'ads', label: 'Мои объявления', link: '/profile/ads/all', icon: adIcon, count: userStore.countAds },
   { id: 'favorites', label: 'Избранное', link: '/profile/favorites/ads', icon: favIcon, count: userStore.countFavorites },
   { id: 'messages', label: 'Сообщения', link: '/profile/messages', icon: supportIcon, count: userStore.count_new_messages },
   { id: 'notifications', label: 'Оповещения', link: '/profile/notifications', icon: mailIcon, count: userStore.countUnreadNotify },
   { id: 'reviews', label: 'Отзывы', link: '/profile/reviews/mine', icon: reviewsIcon, count: userStore.count_new_reviews_about_myself },
   { id: 'reports', label: 'Проверка авто', link: '/profile/reports', icon: specIcon, count: 0 }
]);

watch(() => route.params.title, (newTitle) => activeItem.value = newTitle);

const selectMenuItem = (item) => activeItem.value = item;

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

const triggerFileInput = () => userMenuRef.value?.querySelector('#avatarUpload')?.click();
const handleScroll = () => isScrolled.value = window.scrollY > 0;
const logout = () => {
   userStore.clearUserdata();
   loginModalStore.hideCodeField();
   router.push('/');
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const pluralizeReview = (count) => {
   if (count % 100 >= 11 && count % 100 <= 19) return 'отзывов';
   if (count % 10 === 1) return 'отзыв';
   if (count % 10 >= 2 && count % 10 <= 4) return 'отзыва';
   return 'отзывов';
};
</script>

<style scoped lang="scss">
.user-menu {
   background-color: white;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   padding: 24px;
   display: flex;
   flex-direction: column;
   align-items: center;
   min-width: 270px;
   height: fit-content;

   &--scrolled {
      // position: sticky;
   }

   @media (max-width: 991px) {
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
      left: 48px;
      top: 42px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      padding: 0 5px;
      background-color: white;
      object-fit: contain;
      cursor: pointer;
      border: 1px solid #eeeeee;
      transition: background-color 0.2s ease;

      &:hover {
         background-color: #D6EFFF;
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

      &:hover {
         text-decoration: underline;
      }
   }

   &__header {
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      background-color: #fff;
      border-bottom: 1px solid #D6D6D6;
      width: 100%;
      padding-bottom: 24px;
   }

   &__block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 12px;
   }

   &__user-name {
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      color: #323232;
   }

   &__profile-button {
      display: flex;
      font-size: 14px;
      color: #3366FF;
      background: transparent;
      border: none;
      cursor: pointer;
      text-decoration: none;

      &:hover {
         text-decoration: underline;
      }
   }

   &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
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
      gap: 8px;
      align-items: center;
      font-size: 14px;
      color: #3366FF;
      cursor: pointer;
      transition: color 0.2s ease, font-weight 0.2s ease;

      &:hover {
         color: #144DF8;
         font-weight: 700;
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
      line-height: 1;
      border-radius: 12px;
      height: 24px;
      width: 24px;
      font-weight: 700;
   }

   &__item--logout {
      color: #787878;
      padding-top: 24px;
      margin-top: 8px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 0 0 4px 4px;
      border-top: 1px solid #d6d6d6;
      transition: color 0.2s ease, text-decoration 0.2s ease;

      &:hover {
         color: red;
         text-decoration: underline;
      }
   }
}
</style>
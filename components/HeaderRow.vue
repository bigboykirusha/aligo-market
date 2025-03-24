<template>
   <div class="header-row"
      :class="{ 'header-row--expanded': showDropdown || !isWithMargin, 'header-row--with-margin': isWithMargin }">
      <div class="header-row__container" :class="{ 'header-row__container--create': isCreatePage }">
         <nuxt-link v-show="!isInputFocused || isDesktop" to="/" class="header-row__logo-section">
            <img :src="logoMain" alt="Logo" class="header-row__logo" />
         </nuxt-link>
         <div v-show="(!isProfilePage || (isProfilePage && !isDesktop)) && !isCreatePage" class="header-row__controls">
            <button class="header-row__btn" @click.stop="toggleCategories">
               <div
                  :class="showDropdown ? 'header-row__icon header-row__icon--cross' : 'header-row__icon header-row__icon--categories'">
               </div>
               <span class="header-row__controls-text">{{ $t('header.allCategories') }}</span>
            </button>
            <div class="header-row__search-bar" ref="searchBar">
               <div class="header-row__search">
                  <input type="text" v-model="searchQuery" :placeholder="searchPlaceholder"
                     class="header-row__search-input" @keydown.enter="handleSearch" ref="searchInput"
                     @focus="handleInputFocus(true)" @blur="handleInputFocus(false)" />
                  <img v-if="searchQuery" src="../assets/icons/close-blue.svg" class="clear-icon" alt="Clear Icon"
                     @click="clearSearch" />
               </div>
               <button :class="{ 'header-row__search-btn--focused': isInputFocused }" class="header-row__search-btn"
                  @click="handleSearch">
                  <img class="header-row__search-btn-icon header-row__search-btn-icon--white"
                     src="../assets/icons/search.svg" alt="Search">
                  <img class="header-row__search-btn-icon header-row__search-btn-icon--blue"
                     src="../assets/icons/search-button-blue.svg" alt="Search">
               </button>
            </div>
            <nuxt-link v-if="isLoggedIn" to="/create" class="header-row__btn header-row__btn--post-ad">
               <span>{{ $t('header.postAd') }}</span>
            </nuxt-link>
            <button v-else class="header-row__btn header-row__btn--post-ad" @click="toggleLoginModal">
               <span>{{ $t('header.postAd') }}</span>
            </button>
            <button v-show="isLoggedIn && !isWithMargin" class="header-row__avatar"
               :class="{ 'header-row__avatar--active': userMenuStore.isActive }" @click.stop="toggleUserMenu">
               <img :src="userAvatar" alt="User Avatar" class="header-row__avatar-image" />
               <div class="header-row__small-text">{{ userStore.username || userStore.phoneNumber || userStore.email }}
               </div>
               <nuxt-link v-if="userMenuStore.isActive"
                  :class="{ 'header-row__edit--active': userMenuStore.isActive, 'header-row__edit--reversed': !userStore.username }"
                  to="/profile/edit" class="header-row__edit">
                  <img :src="userStore.username ? editIcon : editIconB" alt="Add icon" class="header-row__icon" />
               </nuxt-link>
            </button>
            <button v-show="!isLoggedIn && !isWithMargin" class="header-row__avatar" @click="toggleLoginModal">
               <img src="../assets/icons/avatar-revers.svg" alt="User Avatar" class="header-row__avatar-image" />
               <div class="header-row__small-text">Вход</div>
            </button>
         </div>
         <div v-show="isProfilePage && isDesktop && !isCreatePage" class="header-row__controls">
            <div class="header-row__buttons">
               <nuxt-link to="/auto" class="header-row__button">
                  <img :src="carIcon" alt="Автомобили" />
                  <span>Автомобили</span>
               </nuxt-link>
               <nuxt-link to="/parts" class="header-row__button">
                  <img :src="discIcon" alt="Автотовары" />
                  <span>Автотовары</span>
               </nuxt-link>
               <nuxt-link to="/moto" class="header-row__button">
                  <img :src="motoIcon" alt="Мототехника" />
                  <span>Мототехника</span>
               </nuxt-link>
            </div>
         </div>
         <div v-show="isCreatePage" class="header-row__title">
            Новое объявление
         </div>
         <Tabs v-show="isCreatePage" />
      </div>
      <DropdownMenu v-model="showDropdown" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserStore } from '~/store/user';
import { useDropdownStore } from '../store/dropdown.js';
import { useCityStore } from '../store/city.js';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import logoMain from '../assets/images/logo.svg';
import { getImageUrl } from '~/services/imageUtils.js';
import { useLoginModalStore } from '~/store/loginModal.js';
import { useUserMenuStore } from '~/store/userMenuStore';
import avatarPhoto from '../assets/icons/avatar-revers.svg';
import carIcon from '../assets/icons/car.svg';
import discIcon from '../assets/icons/disc.svg';
import motoIcon from '../assets/icons/moto.svg';
import editIcon from '@/assets/icons/edit-w.svg';
import editIconB from '@/assets/icons/edit.svg';

const loginModalStore = useLoginModalStore();
const userMenuStore = useUserMenuStore();
const dropdownStore = useDropdownStore();
const showDropdown = computed({
   get: () => dropdownStore.showDropdown,
   set: (value) => dropdownStore.showDropdown = value
});

const userAvatar = computed(() => getImageUrl(userStore.photo?.arr_title_size.preview, avatarPhoto));

const isWithMargin = ref(true);
const searchQuery = ref("");
const searchInput = ref(null);
const isDesktop = ref(false);
const isInputFocused = ref(false);

const userStore = useUserStore();
const cityStore = useCityStore();
const router = useRouter();
const route = useRoute();
const isAuthorizationPage = computed(() => route.path.startsWith('/authorization'));
const isProfilePage = computed(() => route.path.startsWith('/profile'));
const isCreatePage = computed(() => route.path.startsWith('/create'));

const isLoggedIn = computed(() => userStore.isLoggedIn);
const searchPlaceholder = computed(() => {
   const cityName = cityStore.selectedCity.name || 'вашем городе';
   return `Поиск в г. ${cityName}`;
});

const toggleUserMenu = () => userMenuStore.toggleMenu();
const toggleCategories = () => dropdownStore.toggleDropdown();
const toggleLoginModal = () => !isAuthorizationPage.value && loginModalStore.toggleLoginModal();
const clearSearch = () => {
   searchQuery.value = "";
   nextTick(() => searchInput.value?.focus());
};

const handleSearch = async () => {
   const query = searchQuery.value.trim();
   if (!query) return;

   if (router.currentRoute.value.path !== '/search') {
      try {
         await router.push({ path: '/search', query: { query } });
      } catch (error) {
         console.error('Ошибка при поиске:', error);
      }
   } else {
      router.replace({ path: '/search', query: { query } });
   }
};

const handleInputFocus = (focused) => isInputFocused.value = focused;
const handleScroll = () => isWithMargin.value = document.documentElement.scrollTop === 0;

onMounted(() => {
   updateIsDesktop();
   window.addEventListener('resize', updateIsDesktop);
   window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
   window.removeEventListener('resize', updateIsDesktop);
   window.removeEventListener('scroll', handleScroll);
});

const updateIsDesktop = () => {
   if (typeof window !== 'undefined') {
      isDesktop.value = window.innerWidth >= 768;
   }
};
</script>

<style scoped lang="scss">
.header-row {
   position: fixed;
   z-index: 11;
   display: flex;
   align-items: center;
   padding: 0 16px;
   font-size: 14px;
   background-color: #fff;
   width: 100%;
   margin: 0 auto;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   transform: translateY(0);
   transition: transform 0.2s ease-in-out;

   &--with-margin {
      transform: translateY(44px);
      box-shadow: none;

      @media (max-width: 768px) {
         transform: translateY(0);
      }
   }

   &__title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 22px;
      line-height: 22px;
      font-weight: 700;
      color: #323232;

      @media (max-width: 480px) {
         font-size: 20px;
      }
   }

   &__avatar {
      display: flex;
      height: 34px;
      position: relative;
      align-items: center;
      outline: none;
      border: none;
      min-width: 70px;
      background-color: transparent;
      transition: min-width 0.2s ease-in-out;
      gap: 4px;

      &--active {
         min-width: 174px;
      }

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__edit {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-left: auto;
      margin-right: 16px;
      background-color: #3366FF;
      transform: translateY(-50px);
      position: absolute;
      right: 0;
      transition: transform 0.2s ease-in-out;

      &--active {
         transform: translateY(0);
      }

      &:hover {
         background-color: #5580FF
      }

      &--reversed {
         background-color: #FFF;

         &:hover {
            background-color: #FFF
         }
      }

      .header-row__icon {
         width: 12px;
         height: 12px;
      }
   }

   &__small-text {
      font-size: 12px;
      line-height: 16px;
      color: #3366FF;
      white-space: nowrap;

      @media (max-width: 480px) {
         display: none;
      }
   }

   &__avatar-image {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      object-fit: cover;
   }

   &__search-btn-icon {
      width: 18px;
      height: 18px;

      &--white {
         @media (max-width: 480px) {
            display: none;
         }
      }

      &--blue {
         display: none;

         @media (max-width: 480px) {
            display: block;
         }
      }

      @media (max-width: 480px) {
         width: 14px;
         height: 14px;
      }
   }

   &__icon {
      width: 14px;
      height: 14px;
      transition: transform 0.2s ease;

      &--categories {
         background: url('../assets/icons/menu.svg') no-repeat center;

         @media (max-width: 480px) {
            background: url('../assets/icons/menu-blue.svg') no-repeat center;
         }
      }

      &--cross {
         background: url('../assets/icons/close-white.svg') no-repeat center;

         @media (max-width: 480px) {
            background: url('../assets/icons/close.svg') no-repeat center;
         }
      }
   }

   &__container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px 0;

      &--create {
         flex-wrap: wrap;
         gap: 24px;
         justify-content: flex-start;

         @media (max-width: 768px) {
            gap: 16px;
         }
      }
   }

   &__logo-section {
      display: flex;
      align-items: center;
      height: 34px;
      margin-right: 24px;
      outline: none;

      @media (max-width: 480px) {
         margin-right: 0;
         height: 28px;
         margin-right: 12px;
      }
   }

   &__logo {
      height: 34px;

      @media (max-width: 480px) {
         margin-right: 0;
         height: 28px;
      }
   }

   &__controls {
      display: flex;
      flex-grow: 1;
      position: relative;
      width: 100%;
      align-items: center;
      gap: 16px;

      @media (max-width: 768px) {
         gap: 12px;
      }
   }

   &__controls-text {
      @media (max-width: 991px) {
         display: none;
      }
   }

   &__btn {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
      padding: 0 12px;
      height: 34px;
      font-size: 14px;
      background-color: $main-button;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.2s ease-in-out;

      @media (max-width: 768px) {
         display: none;
      }

      &--post-ad {
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

         @media (max-width: 991px) {
            background-image: url(../assets/icons/add.svg);
            background-position: center;
            background-repeat: no-repeat;
            background-size: 16px 16px;
            min-width: 34px;

            span {
               display: none;
            }
         }

         @media (max-width: 480px) {
            background-image: url(../assets/icons/addad-blue.svg);
            background-size: 18px 18px;
            max-width: 18px;
            min-width: 18px;
         }
      }

      &:hover {
         background-color: $main-button-hover;

         @media (max-width: 480px) {
            background-color: #fff;
         }
      }
   }

   &__search-bar {
      display: flex;
      flex-grow: 1;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
      align-items: center;
      width: 100%;
   }

   &__search {
      display: flex;
      align-items: center;
      flex-grow: 1;
      width: 100%;
      height: 34px;
      font-size: 14px;
      padding: 0;
      border: 2px solid #d6d6d6;
      border-right: none;
      border-radius: 6px 0 0 6px;
      transition: border-color 0.2s ease-in-out;

      @media (max-width: 480px) {
         height: 36px;
      }

      &:focus-within {
         border-color: #3366FF;
      }
   }

   &__search-input {
      margin-left: 16px;
      border: none;
      display: flex;
      flex-grow: 1;
      align-items: center;
      width: 100%;
      overflow: hidden;
      outline: none;

      @media (max-width: 480px) {
         margin-left: 8px;
      }
   }

   &__buttons {
      display: flex;
      gap: 24px;
      width: 100%;

      @media (max-width: 820px) {
         gap: 0;
         justify-content: space-between;
      }
   }

   &__button {
      display: flex;
      align-items: center;
      background: none;
      gap: 6px;
      height: 32px;
      padding: 0 8px;
      font-size: 14px;
      color: #3366FF;
      border: none;
      cursor: pointer;
      border-radius: 18px;
      transition: background-color 0.2s ease-in-out;

      img {
         height: 14px;
      }

      &:hover {
         background-color: #D6EFFF;
      }
   }

   &__search-btn {
      display: flex;
      height: 34px;
      align-items: center;
      justify-content: center;
      padding: 0 36px;
      background-color: $main-button;
      border: none;
      border-radius: 0 6px 6px 0;
      transition: border-color 0.2s ease-in-out;

      @media (max-width: 991px) {
         min-width: 34px;
         padding: 0;
      }

      @media (max-width: 480px) {
         background-color: #fff;
         border: 2px solid #d6d6d6;
         height: 36px;
         border-left: none;
      }

      &--focused {
         border-color: #3366FF;
      }

      &:hover {
         background-color: $main-button-hover;

         @media (max-width: 480px) {
            background-color: #fff;
         }
      }
   }
}

.clear-icon {
   cursor: pointer;
   transition: opacity 0.3s ease;
   margin-right: 12px;
   height: 12px;
   width: 12px;
}
</style>
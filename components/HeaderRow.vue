<template>
   <div class="header-row"
      :class="{ 'header-row--expanded': showDropdown || !isWithMargin, 'header-row--with-margin': isWithMargin }">
      <div class="header-row__container">
         <nuxt-link to="/" class="header-row__logo-section" @click="() => showDropdown = false">
            <img :src="logoMain" alt="Logo" class="header-row__logo" />
         </nuxt-link>
         <div class="header-row__controls">
            <button class="header-row__btn" @click.stop="toggleCategories">
               <div :class="iconClass"></div>
               <span class="header-row__controls-text">{{ $t('header.allCategories') }}</span>
            </button>
            <div class="header-row__search-bar">
               <div class="header-row__search">
                  <input type="text" v-model="searchQuery" :placeholder="searchPlaceholder"
                     class="header-row__search-input" ref="searchInput" />
                  <img v-if="searchQuery" src="../assets/icons/close-blue.svg" class="clear-icon" alt="Clear Icon"
                     @click="clearSearch" />
               </div>
               <button class="header-row__search-btn" @click="handleSearch">
                  <img class="header-row__search-btn-icon header-row__search-btn-icon--white"
                     src="../assets/icons/search.svg" alt="">
                  <img class="header-row__search-btn-icon header-row__search-btn-icon--blue"
                     src="../assets/icons/search-button-blue.svg" alt="">
               </button>
            </div>
            <client-only>
               <nuxt-link v-if="isLoggedIn" to="/createAd" class="header-row__btn header-row__btn--post-ad">
                  <span>{{ $t('header.postAd') }}</span>
               </nuxt-link>
               <button v-else class="header-row__btn header-row__btn--post-ad" @click="toggleLoginModal">
                  <span>{{ $t('header.postAd') }}</span>
               </button>
            </client-only>
            <button v-if="isLoggedIn && !isWithMargin" class="header-row__avatar" @click.stop="toggleUserMenu">
               <img :src="getImageUrl(userStore.photo.path)" alt="User Avatar" class="header-row__avatar-image" />
               <div class="header-row__small-text">{{ userStore.username || userStore.phoneNumber || userStore.email
                  }}</div>
               <UserMenuPopup v-if="isUserMenuOpen && isDesktop" :compact="true" @close-userMenu="toggleUserMenu" />
            </button>
            <button v-if="!isLoggedIn && !isWithMargin" class="header-row__avatar" @click="toggleLoginModal">
               <img src="../assets/icons/avatar-revers.svg" alt="User Avatar" class="header-row__avatar-image" />
               <div class="header-row__small-text">Вход</div>
            </button>
         </div>
      </div>
      <DropdownMenu v-if="showDropdown" @close="closeCategories" />
      <LoginModal v-if="modalLoginOpen" @close-loginModal="toggleLoginModal" />
      <UserMenuBurger v-model="isSideMenuOpen" :isRight="false" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserStore } from '~/store/user';
import { useCityStore } from '../store/city.js';
import { useRouter } from 'vue-router';
import logoMain from '../assets/images/logo.svg';
import { getImageUrl } from '~/services/imageUtils.js';

const showDropdown = ref(false);
const isWithMargin = ref(true);
const modalLoginOpen = ref(false);
const searchQuery = ref("");
const searchInput = ref(null);
const isUserMenuOpen = ref(false);
const isDesktop = ref(false);

const userStore = useUserStore();
const cityStore = useCityStore();
const router = useRouter();

const isLoggedIn = computed(() => userStore.isLoggedIn);
const searchPlaceholder = computed(() => {
   const cityName = cityStore.selectedCity.name || 'вашем городе';
   return `Поиск в г. ${cityName}`;
});

const isSideMenuOpen = ref(false);

const toggleSideMenu = () => {
   isSideMenuOpen.value = !isSideMenuOpen.value;
};

const toggleUserMenu = () => {
   if (isDesktop.value) {
      isUserMenuOpen.value = !isUserMenuOpen.value;
      console.log('wedwed')
   } else {
      toggleSideMenu();
   }
};

const updateIsDesktop = () => {
   if (typeof window !== 'undefined') {
      isDesktop.value = window.innerWidth >= 768;
   }
};

const iconClass = computed(() =>
   showDropdown.value
      ? 'header-row__icon header-row__icon--cross'
      : 'header-row__icon header-row__icon--categories'
);

const toggleCategories = () => {
   showDropdown.value = !showDropdown.value;
};

const closeCategories = () => {
   showDropdown.value = false;
};

const toggleLoginModal = () => {
   modalLoginOpen.value = !modalLoginOpen.value;
};

const clearSearch = () => {
   searchQuery.value = "";
   nextTick(() => searchInput.value?.focus());
};

const handleSearch = async () => {
   const query = searchQuery.value.trim();
   if (!query) return;

   try {
      await router.push({ path: '/search', query: { query } });
   } catch (error) {
      console.error('Ошибка при поиске:', error);
   }
};

const handleScroll = () => {
   isWithMargin.value = window.scrollY === 0;

   if (isUserMenuOpen.value) {
      isUserMenuOpen.value = false;
   }
};

onMounted(() => {
   updateIsDesktop();
   window.addEventListener('resize', updateIsDesktop);
   window.addEventListener('scroll', handleScroll);
});


onUnmounted(() => {
   window.removeEventListener('resize', updateIsDesktop);
   window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.header-row {
   position: fixed;
   z-index: 5;
   display: flex;
   align-items: center;
   padding: 16px;
   font-size: 14px;
   background-color: #fff;
   width: 100%;
   max-width: 100vw;
   margin: 0 auto;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   transition: all 0.2s ease-in-out;

   &__avatar {
      display: flex;
      height: 34px;
      position: relative;
      align-items: center;
      outline: none;
      border: none;
      background-color: transparent;
      gap: 4px;
   }

   &__small-text {
      font-size: 12px;
      line-height: 16px;
      color: #3366FF;

      @media (max-width: 480px) {
         display: none;
      }
   }

   &__avatar-image {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      object-fit: cover;
   }

   &--with-margin {
      margin-top: 44px;
      box-shadow: none;
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
      transition: transform 0.3s ease;

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
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
   }

   &__logo-section {
      display: flex;
      align-items: flex-start;
      height: 34px;
      margin-right: 24px;
      transition: margin-right 0.2s ease-in-out;

      @media (max-width: 480px) {
         margin-right: 0;
      }
   }

   &__logo {
      height: 34px;

      @media (max-width: 480px) {
         display: none;
      }
   }

   &__controls {
      display: flex;
      position: relative;
      width: 100%;
      align-items: center;
      gap: 16px;
      transition: gap 0.2s ease;

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
      padding: 0 12px;
      height: 34px;
      font-size: 14px;
      background-color: $main-button;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      line-height: 1;
      transition: background-color 0.3s ease;

      @media (max-width: 480px) {
         background-color: #fff;
         padding: 0;
      }

      &--post-ad {
         @media (max-width: 991px) {
            background-image: url(../assets/icons/add.svg);
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
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
      align-items: center;
      width: 100%;
      transition: width 0.3s ease;
   }

   &__search {
      display: flex;
      align-items: center;
      width: 100%;
      height: 34px;
      font-size: 14px;
      padding: 0;
      border: 2px solid #d6d6d6;
      border-right: none;
      border-radius: 6px 0 0 6px;

      &:focus-within {
         border-color: #003bce;

         @media (max-width: 480px) {
            border-color: #d6d6d6;
         }
      }
   }

   &__search-input {
      flex-grow: 1;
      margin-left: 16px;
      border: none;

      @media (max-width: 480px) {
         margin-left: 8px;
      }

      &:focus {
         outline: none;
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

      @media (max-width: 991px) {
         min-width: 34px;
         padding: 0;
      }

      @media (max-width: 480px) {
         background-color: #fff;
         border: 2px solid #d6d6d6;
         border-left: none;
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
}
</style>
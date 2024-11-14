<template>
   <div class="header-row" :class="{
      'header-row--expanded': showDropdown || !isWithMargin,
      'header-row--with-margin': isWithMargin
   }">
      <div class="header-row__container">
         <nuxt-link to="/" class="header-row__logo-section" @click="() => showDropdown = false">
            <img :src="logoMain" alt="Logo" class="header-row__logo" />
            <span v-show="!showDropdown && isWithMargin" class="header-row__small-text">{{ $t('header.slogan') }}</span>
         </nuxt-link>
         <div class="header-row__controls">
            <button class="header-row__btn" @click.stop @click="toggleCategories">
               <i :class="iconClass"></i>
               <span class="header-row__controls-text">{{ $t('header.allCategories') }}</span>
            </button>
            <div class="header-row__search-bar">
               <div class="header-row__search">
                  <img src="../assets/icons/a-logo.svg" class="search-icon" alt="Search Icon">
                  <input type="text" v-model="searchQuery" :placeholder="searchPlaceholder"
                     class="header-row__search-input" ref="searchInput" />
                  <img v-if="searchQuery" src="../assets/icons/close-blue.svg" class="clear-icon" alt="Clear Icon"
                     @click="clearSearch" />
               </div>
               <button class="header-row__search-btn" @click="handleSearch">
                  <svg class="header-row__search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                     <path d="M4.85742 9.35718C4.85742 6.8719 6.87214 4.85718 9.35742 4.85718" stroke="white"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                     <path d="M19 19.0002L13 13.0002" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                  </svg>
               </button>
            </div>
            <client-only>
               <nuxt-link to="/createAd" v-show="isLoggedIn" class="header-row__btn header-row__btn--post-ad">
                  <span>{{ $t('header.postAd') }}</span>
                  <svg class="header-row__post-ad-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                     <path d="M7.00024 10H13.0002" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M10 7V13" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M10 1C17.2 1 19 2.8 19 10C19 17.2 17.2 19 10 19C2.8 19 1 17.2 1 10C1 2.8 2.8 1 10 1Z"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </nuxt-link>
               <button v-show="!isLoggedIn" class="header-row__btn header-row__btn--post-ad" @click="toggleLoginModal">
                  <span>{{ $t('header.postAd') }}</span>
                  <svg class="header-row__post-ad-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                     <path d="M7.00024 10H13.0002" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M10 7V13" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M10 1C17.2 1 19 2.8 19 10C19 17.2 17.2 19 10 19C2.8 19 1 17.2 1 10C1 2.8 2.8 1 10 1Z"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </button>
            </client-only>
         </div>
      </div>
      <DropdownMenu v-show="showDropdown" @close="closeCategories" />
      <LoginModal v-if="modalLoginOpen" @close-loginModal="toggleLoginModal" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserStore } from '~/store/user';
import { useCityStore } from '../store/city.js'
import { useRouter } from 'vue-router';
import logoMain from '../assets/images/logo.svg';

const showDropdown = ref(false)
const isWithMargin = ref(true)
const modalLoginOpen = ref(false);
const lastScrollTop = ref(0)
const userStore = useUserStore();
const cityStore = useCityStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const searchQuery = ref("");
const searchInput = ref(null);
const router = useRouter();

const searchPlaceholder = computed(() => {
   const cityName = cityStore.selectedCity.name || 'вашем городе';
   return `Поиск в г. ${cityName}`;
});

const iconClass = computed(() =>
   showDropdown.value ? 'header-row__icon header-row__icon--cross' : 'header-row__icon header-row__icon--categories'
)

const toggleCategories = () => {
   showDropdown.value = !showDropdown.value
}

const closeCategories = () => {
   showDropdown.value = false;
}

const toggleLoginModal = () => {
   modalLoginOpen.value = !modalLoginOpen.value;
};

const handleScroll = () => {
   const currentScrollTop = window.scrollY || document.documentElement.scrollTop
   isWithMargin.value = currentScrollTop === 0
   lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop
}

const clearSearch = () => {
   searchQuery.value = "";
   nextTick(() => {
      searchInput.value.focus();
   });
}

const handleSearch = async () => {
   if (!searchQuery.value.trim()) {
      return;
   }

   try {
      router.push({ path: '/search', query: { query: searchQuery.value } });
   } catch (error) {
      console.error('Ошибка при поиске:', error);
   }
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.header-row {
   position: fixed;
   z-index: 5;
   display: flex;
   align-items: center;
   transition: all 0.2s ease-in-out;
   padding: 16px;
   background-color: #fff;
   width: 100%;
   margin: 0 auto;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);

   &--with-margin {
      margin-top: 44px;
      box-shadow: none;
      padding: 16px;
   }

   &--expanded {
      padding: 16px;
   }

   &__container {
      display: flex;
      width: 100%;
      max-width: 1280px;
      justify-content: space-between;
      margin: 0 auto;
   }

   &__logo-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      outline: none;
      margin-right: 48px;
      transition: all 0.2s ease-in-out;

      @media screen and (max-width: 991px) {
         margin-right: 24px;
      }

      @media screen and (max-width: 480px) {
         margin-right: 0;
      }
   }

   &__logo {
      transition: all 0.2s ease-in-out;

      @media screen and (max-width: 991px) {
         height: 34px;
      }

      @media screen and (max-width: 480px) {
         display: none;
      }
   }

   &__small-text {
      font-size: 10px;
      letter-spacing: 3px;
      word-spacing: 4px;
      color: #003bce;
      text-transform: uppercase;
      white-space: nowrap;
      text-decoration: none;
      transition: all 0.2s ease-in-out;

      @media screen and (max-width: 991px) {
         display: none;
      }
   }

   &__controls {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      gap: 16px;
      transition: gap 0.2s ease;

      @media (max-width: 768px) {
         gap: 10px;
      }
   }

   &__btn {
      display: flex;
      font-size: 16px;
      align-items: center;
      padding: 0 10px;
      height: 40px;
      background-color: $main-button;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease, height 0.3s ease, padding 0.3s ease;
      white-space: nowrap;

      @media screen and (max-width: 991px) {
         padding: 0 9px;
         width: 34px;
         justify-content: center;
         align-items: center;
         border-radius: 6px;
         font-size: 14px;
         height: 34px;
      }

      @media screen and (max-width: 480px) {
         background-color: #fff;
         padding: 0;
      }

      &:hover {
         background-color: $main-button-hover;

         @media screen and (max-width: 480px) {
            background-color: white;
         }
      }

      &--post-ad {
         span {
            @media screen and (max-width: 600px) {
               display: none;
            }
         }
      }
   }

   &__post-ad-icon {
      display: none;

      @media screen and (max-width: 600px) {
         display: inline-block;
         height: 18px;
         width: 18px;
      }

      @media screen and (max-width: 480px) {
         path {
            stroke: #3366ff;
         }
      }
   }

   &__controls-text {
      @media screen and (max-width: 991px) {
         display: none;
      }
   }

   &__icon {
      margin-right: 0.5rem;
      transition: all 0.3s ease, margin-right 0.3s ease;

      @media screen and (max-width: 991px) {
         margin: 0;
      }

      &--categories {
         background: url('../assets/icons/menu.svg') no-repeat center center;
         width: 16px;
         height: 16px;

         @media screen and (max-width: 480px) {
            background: url('../assets/icons/menu-blue.svg') no-repeat center center;
            margin-right: auto;
         }
      }

      &--cross {
         background: url('../assets/icons/close-white.svg') no-repeat center center;
         width: 16px;
         height: 16px;

         @media screen and (max-width: 480px) {
            background: url('../assets/icons/close-blue.svg') no-repeat center center;
            margin-right: auto;
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
      padding: 0;
      border: 2px solid #d6d6d6;
      font-size: 14px;
      height: 40px;
      border-radius: 4px 0 0 4px;
      width: 100%;
      border-right: none;
      transition: height 0.3s ease, width 0.3s ease;

      .search-icon {
         display: none;
         width: 14px;
         height: 19px;
         display: none;
         margin-left: 8px;

         @media screen and (max-width: 480px) {
            display: none;
         }
      }

      @media screen and (max-width: 991px) {
         border-radius: 6px 0 0 6px;
         height: 34px;
         font-size: 12px;
      }

      @media screen and (max-width: 480px) {
         border-right: none;
      }
   }

   &__search-input {
      border: none;
      width: calc(100% - 40px);
      margin-left: 16px;
      transition: margin-left 0.3s ease;

      @media screen and (max-width: 480px) {
         margin-left: 8px;
      }

      &:focus {
         outline: none;
      }
   }

   &__search-btn {
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background-color: $main-button;
      transition: background-color 0.3s ease, height 0.3s ease, padding 0.3s ease;
      border-radius: 0 4px 4px 0;
      height: 40px;

      @media screen and (max-width: 991px) {
         height: 34px;
         padding: 10px 9px;
         border-radius: 0 6px 6px 0;
      }

      @media screen and (max-width: 480px) {
         background-color: #fff;
         border: 2px solid #d6d6d6;
         border-left: none;
      }

      &:hover {
         background-color: $main-button-hover;
      }
   }

   &__search-icon {
      width: 16px;
      height: 16px;

      @media screen and (max-width: 480px) {
         path {
            stroke: #3366ff;
         }
      }
   }

   &--expanded &__logo {
      height: 34px;
   }

   &--expanded &__btn {
      height: 34px;
   }

   &--expanded &__search {
      height: 34px;
   }

   &--expanded &__search-btn {
      height: 34px;
   }
}

.clear-icon {
   cursor: pointer;
   transition: opacity 0.3s ease;
}
</style>
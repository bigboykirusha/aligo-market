<template>
  <div>
    <header :class="{ 'header--hidden': isHeaderHidden }" class="header">
      <div :class="containerClasses">
        <!-- Навигация -->
        <nav class="header__nav" aria-label="Primary">
          <ul class="header__nav-list" v-show="!isMyselfRoute || isDesktop">
            <nuxt-link to="/" class="header__nav-item header__nav-item--mobile">
              <img class="header__nav--logo" src="@/assets/images/logo-white.svg" alt="Logo">
            </nuxt-link>
            <li class="header__nav-item">
              <button class="header__nav-link" @click="toggleModal">
                <img :src="defaultLocationIcon" alt="Location icon" class="header__icon">
                <span class="header__text header__text--hidden">{{ translatedCityName }}</span>
              </button>
              <LocationPopup v-if="modalOpen" @open-modal="toggleModal" />
            </li>
            <li class="header__nav-item">
              <nuxt-link to="/business" class="header__nav-link">
                <img src="@/assets/icons/business.svg" alt="Business icon" class="header__icon">
                <span class="header__text header__text--hidden">{{ $t('nav.business') }}</span>
              </nuxt-link>
            </li>
          </ul>
        </nav>
        <!-- Логотип для мобильной версии -->
        <div v-show="isMyselfRoute && !isDesktop" class="header__images">
          <img src="@/assets/icons/white-logo.svg" alt="Logo">
        </div>
        <!-- Кнопка добавления объявления -->
        <nuxt-link to="/createAd" v-show="isMyselfRoute" class="header__actions">
          <button class="header__nav-link header__nav-link--add">
            <img src="@/assets/icons/add.svg" alt="Add icon" class="header__icon">
            <span class="header__text header__text--add">Разместить объявление</span>
          </button>
        </nuxt-link>
        <!-- Аватар пользователя -->
        <img class="header__user-avatar" v-show="isMyselfRoute && !isDesktop" :src="userAvatar" alt="Menu"
          @click="toggleSideMenu" />
        <!-- Действия пользователя -->
        <div v-show="!isMyselfRoute" class="header__actions">
          <template v-if="isLoggedIn">
            <div class="header__user-info">
              <div class="header__user-block">
                <IconLink v-for="icon in userIcons" :key="icon.to" :to="icon.to" :icon-src="icon.src"
                  :icon-count="icon.count" />
              </div>
              <div class="header__menu" @click.stop="toggleUserMenu">
                <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="header__user-avatar">
                <span v-else class="header__user-circle">{{ initial }}</span>
                <span class="header__user-name">{{ displayName }}</span>
              </div>
              <UserMenuPopup v-if="isUserMenuOpen && isDesktop" @close-userMenu="toggleUserMenu" />
            </div>
          </template>
          <button v-else class="header__nav-link" @click="toggleLoginModal">
            <img src="@/assets/icons/user.svg" alt="Login icon" class="header__icon header__icon--large">
            <span class="header__text">{{ $t('nav.login') }}</span>
          </button>
        </div>
      </div>
    </header>
    <component :is="currentPageComponent" />
    <LocationModal v-if="modalOpen" @close-modal="toggleModal" />
    <UserMenuBurger v-model="isSideMenuOpen" :isRight="!isMyselfRoute" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { getImageUrl } from '../services/imageUtils';
import { useCityStore } from '~/store/city';
import { useUserStore } from '~/store/user';
import { useLoginModalStore } from '~/store/loginModal.js';  // Import the store

const loginModalStore = useLoginModalStore();  // Initialize the store

import HeaderRow from './HeaderRow.vue';
import HeaderRowNew from './HeaderRowNew.vue';
import HeaderRowMyself from './HeaderRowMyself.vue';

import defaultLocationIcon from '../assets/icons/location.svg';
import avatarPhoto from '../assets/icons/user.svg';
import favoritesIcon from '../assets/icons/favorites.svg';
import mailIcon from '../assets/icons/mail.svg';
import messageIcon from '../assets/icons/message.svg';

const modalOpen = ref(false);
const modalLoginOpen = ref(false);
const isUserMenuOpen = ref(false);
const isHeaderHidden = ref(false);
const route = useRoute();
const cityStore = useCityStore();
const userStore = useUserStore();
const isClient = ref(false);
const isDesktop = ref(false);
const isSideMenuOpen = ref(false);

const toggleSideMenu = () => {
  isSideMenuOpen.value = !isSideMenuOpen.value;
};

const toggleModal = () => {
  modalOpen.value = !modalOpen.value;
};

const toggleUserMenu = () => {
  if (isDesktop.value) {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  } else {
    toggleSideMenu();
  }
};

const toggleLoginModal = () => {
  loginModalStore.toggleLoginModal();
};

const updateIsDesktop = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 768;
  }
};

const translatedCityName = computed(() => cityStore.selectedCity.name);

const handleScroll = () => {
  const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
  isHeaderHidden.value = currentScrollTop !== 0;

  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
};

const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.username || userStore.login);
const userAvatar = computed(() => getImageUrl(userStore.photo?.path, avatarPhoto));
const initial = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() : '');
const displayName = computed(() => userName.value ? capitalizedUserName.value : formattedPhoneNumber.value);

const capitalizedUserName = computed(() => userName.value.charAt(0).toUpperCase() + userName.value.slice(1));
const formattedPhoneNumber = computed(() => userStore.phoneNumber || userStore.email);

const userIcons = computed(() => [
  { to: '/myself/favorites', src: favoritesIcon, count: userStore.countFavorites },
  { to: '/myself/notifications', src: mailIcon, count: userStore.countUnreadNotify },
  { to: '/myself/messages', src: messageIcon, count: userStore.count_new_messages },
]);

const currentPageComponent = computed(() => {
  if (route.path.startsWith('/createAd')) {
    return HeaderRowNew;
  }
  if (route.path.startsWith('/myself')) {
    return isDesktop.value ? HeaderRowMyself : HeaderRow;
  }
  return HeaderRow;
});

const containerClasses = computed(() => ({
  'header__container': true,
  'header__container--small': isMyselfRoute.value && !isDesktop.value,
}));

const isMyselfRoute = computed(() => route.path.startsWith('/myself'));

onMounted(() => {
  if (userStore.isLoggedIn) userStore.fetchUserCounts();
  isClient.value = true;
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
.header {
  background: $main-button;
  transition: $transition-1;
  position: fixed;
  width: 100%;
  max-width: 100vw;
  top: 0;
  z-index: 12;
  padding: 0 16px;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    display: none;
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &__images {
    display: flex;
    gap: 24px;
    margin-right: auto;

    img:last-child {
      height: 24px;
    }
  }

  &__user-avatar {
    height: 24px;
    width: 24px;
    object-fit: cover;
    border-radius: 50%;
  }

  &__container {
    display: flex;
    height: 44px;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px;
    margin: 0 auto;

    &--small {
      height: 56px;
      gap: 12px;

      .header__nav {
        display: none;
      }
    }
  }

  &__nav {
    display: flex;
    align-items: center;

    &-list {
      display: flex;
      list-style: none;
      gap: 24px;

      @media (max-width: 768px) {
        gap: 16px;
      }
    }

    &--logo {
      height: 20px;
    }

    &-item {
      display: flex;
      align-items: center;
      position: relative;

      &--mobile {
        display: none;
        outline: none;

        @media (max-width: 480px) {
          display: flex;
        }
      }
    }
  }

  &__nav-link {
    display: flex;
    align-items: center;
    color: $white;
    font-weight: 400;
    font-size: 12px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    transition: $transition-1;

    .header__icon {

      @media (max-width: 768px) {
        margin-right: 0px;
      }
    }

    &--add {
      padding: 5px 8px;
      border-radius: 12px;

      @media (max-width: 768px) {
        padding: 0;
        border-radius: 0;
      }

      &:hover {
        background-color: #0c41e0;
      }

      .header__icon {
        margin-right: 7px;
        height: 16px;
        width: 16px;

        @media (max-width: 768px) {
          height: 18px;
          width: 18px;
          margin-right: 0;
        }
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  &__icon {
    &--large {
      width: 24px;
      height: 24px;
    }
  }

  &__icon-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 24px;
    padding: 0 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    border-radius: 12px;
    transition: $transition-1;

    &--active {
      background-color: #144DF8;
    }

    &:hover {
      background-color: #0c41e0;
    }
  }

  &__user-info {
    display: flex;
    position: relative;
    height: 44px;
    gap: 24px;
    align-items: center;
    cursor: pointer;
  }

  &__user-block {
    height: 44px;
    display: flex;
    align-items: center;
    gap: 24px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__menu {
    display: flex;
    height: 44px;
    position: relative;
    align-items: center;
    gap: 5px;
  }

  &__user-circle {
    background-color: $white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $main-button;
    font-size: 16px;
    font-weight: bold;
  }

  &__user-name {
    color: white;
    font-size: 12px;
    font-weight: 400;

    @media (max-width: 480px) {
      display: none;
    }
  }

  &__text {
    margin-left: 8px;

    &--add {
      @media screen and (max-width: 768px) {
        display: none;
      }
    }

    &--hidden {
      display: none;

      @media screen and (min-width: 768px) {
        display: inline;
      }
    }
  }
}
</style>

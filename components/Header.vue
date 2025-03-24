<template>
  <header :class="{ 'header--hidden': isHeaderHidden }" class="header">
    <div class="header__container">
      <nav class="header__nav" aria-label="Primary">
        <ul class="header__nav-list">
          <li class="header__nav-item">
            <button class="header__nav-link" @click="toggleModal">
              <img :src="locationIcon" alt="Location icon" class="header__icon" />
              <span class="header__text header__text--hidden">{{ selectedCityName }}</span>
            </button>
            <LocationPopup @open-modal="toggleModal" />
          </li>
          <li class="header__nav-item">
            <nuxt-link to="/business" class="header__nav-link">
              <img :src="businessIcon" alt="Business icon" class="header__icon" />
              <span class="header__text header__text--hidden">{{ $t('nav.business') }}</span>
            </nuxt-link>
          </li>
        </ul>
      </nav>

      <nuxt-link v-show="isProfilePage" to="/create" class="header__actions">
        <button class="header__nav-link header__nav-link--add">
          <img :src="addIcon" alt="Add icon" class="header__icon" />
          <span class="header__text header__text--add">Разместить объявление</span>
        </button>
      </nuxt-link>

      <div v-show="!isProfilePage" class="header__actions">
        <div v-if="isLoggedIn" class="header__user-info">
          <div class="header__user-block">
            <IconLink v-for="icon in userIcons" :key="icon.to" :to="icon.to" :icon-src="icon.src"
              :icon-count="icon.count" />
          </div>
          <div class="header__menu" :class="{ 'header__menu--active': userMenuStore.isActive }"
            @click.stop="toggleUserMenu">
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="header__user-avatar" />
            <span v-else class="header__user-circle">{{ userInitial }}</span>
            <span class="header__user-name">{{ displayName }}</span>
            <nuxt-link v-if="userMenuStore.isActive"
              :class="{ 'header__edit--active': userMenuStore.isActive, 'header__edit--reversed': !userStore.username }"
              to="/profile/edit" class="header__edit">
              <img :src="userStore.username ? editIcon : editIconW" alt="Add icon" :class="{ 'header__icon': true }" />
            </nuxt-link>
          </div>
          <UserMenuPopup :isRevers="!isHeaderHidden" @close-userMenu="toggleUserMenu" />
        </div>

        <button v-else class="header__nav-link" @click="loginModalStore.toggleLoginModal">
          <img :src="defaultUserAvatar" alt="Login icon" class="header__icon header__icon--large" />
          <span class="header__text">{{ $t('nav.login') }}</span>
        </button>
      </div>
    </div>
  </header>
  <HeaderRow />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getImageUrl } from '../services/imageUtils';
import { useCityStore } from '~/store/city';
import { useUserStore } from '~/store/user';
import { useLoginModalStore } from '~/store/loginModal';
import { useUserMenuStore } from '~/store/userMenuStore';
import { useLocationModalStore } from '~/store/locationModalStore';

import locationIcon from '@/assets/icons/location.svg';
import businessIcon from '@/assets/icons/business.svg';
import addIcon from '@/assets/icons/add.svg';
import defaultUserAvatar from '@/assets/icons/user.svg';
import favoritesIcon from '@/assets/icons/favorites.svg';
import mailIcon from '@/assets/icons/mail.svg';
import messageIcon from '@/assets/icons/message.svg';
import editIcon from '@/assets/icons/edit.svg';
import editIconW from '@/assets/icons/edit-w.svg';

const route = useRoute();
const cityStore = useCityStore();
const userStore = useUserStore();
const loginModalStore = useLoginModalStore();
const userMenuStore = useUserMenuStore();
const locationModalStore = useLocationModalStore();

const screenWidth = ref(window.innerWidth);

const isHeaderHidden = ref(false);

const isLoggedIn = computed(() => userStore.isLoggedIn);
const isProfilePage = computed(() => route.path.startsWith('/profile'));
const selectedCityName = computed(() => cityStore.selectedCity.name);

const userAvatar = computed(() => getImageUrl(userStore.photo?.arr_title_size?.preview, defaultUserAvatar));
const userInitial = computed(() => userStore.username?.charAt(0).toUpperCase() || '');
const displayName = computed(() => userStore.username || userStore.phoneNumber || userStore.email);

const userIcons = computed(() => [
  { to: '/profile/favorites/ads', src: favoritesIcon, count: userStore.countFavorites },
  { to: '/profile/notifications', src: mailIcon, count: userStore.countUnreadNotify },
  { to: '/profile/messages', src: messageIcon, count: userStore.count_new_messages }
]);

const toggleModal = () => { locationModalStore.toggleMenu(); };
const toggleUserMenu = () => { userMenuStore.toggleMenu(); };

const handleScroll = () => { isHeaderHidden.value = document.documentElement.scrollTop !== 0; };

const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateWidth);
});
</script>

<style scoped lang="scss">
.header {
  background: $main-button;
  transition: transform 0.2s ease-in-out;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 100vw;
  z-index: 12;
  padding: 0 16px;

  @media (max-width: 768px) {
    transform: translateY(-100%);
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px;
    margin: 0 auto;
    height: 44px;
  }

  &__nav {
    display: flex;
    align-items: center;

    &-list {
      display: flex;
      gap: 24px;
      list-style: none;
    }

    &-item {
      display: flex;
      align-items: center;
      position: relative;
    }
  }

  &__nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $white;
    font-size: 12px;
    font-weight: 400;
    padding: 0 8px;
    height: 24px;
    border-radius: 12px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    transition: $transition-1;

    &:hover {
      background-color: #0c41e0;
    }
  }

  &__actions {
    display: flex;
    position: relative;
    align-items: center;
    gap: 7px;
  }

  &__icon {
    width: 16px;
    height: 16px;

    &--large {
      width: 24px;
      height: 24px;
    }
  }

  &__user-info {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 44px;
    cursor: pointer;
  }

  &__user-block {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__menu {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 50px;
    transition: min-width 0.2s ease-in-out;

    &--active {
      min-width: 174px;
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
    background-color: #FFFFFF;
    transform: translateY(-50px);
    position: absolute;
    right: 0;
    transition: transform 0.2s ease-in-out;

    &--active {
      transform: translateY(0);
    }

    &:hover {
      background-color: #EEEEEE
    }

    &--reversed {
      background-color: #3366FF;

      &:hover {
        background-color: #3366FF
      }
    }

    .header__icon {
      width: 12px;
      height: 12px;
    }
  }

  &__user-avatar,
  &__user-circle {
    width: 24px;
    height: 24px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__user-avatar {
    object-fit: cover;
  }

  &__user-circle {
    background-color: $white;
    color: $main-button;
    font-size: 16px;
    font-weight: bold;
  }

  &__user-name {
    color: $white;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
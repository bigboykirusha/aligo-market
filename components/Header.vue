<template>
  <div>
    <header :class="{ 'header--hidden': isHeaderHidden }" class="header">
      <div :class="containerClasses">
        <nav class="header__nav" aria-label="Primary">
          <ul class="header__nav-list" v-show="!isMyselfRoute || isDesktop">
            <nuxt-link to="/" class="header__nav-item header__nav-item--mobile">
              <img class="header__nav--logo" src="../assets/images/logo-white.svg" alt="">
            </nuxt-link>
            <li class="header__nav-item">
              <LanguageSwitcher />
            </li>
            <li class="header__nav-item">
              <button class="header__nav-link" @click="toggleModal">
                <img :src="defaultLocationIcon" alt="location icon" class="header__icon">
                <span class="header__text header__text--hidden">{{ translatedCityName }}</span>
              </button>
              <LocationPopup @open-modal="toggleModal" />
            </li>
            <li class="header__nav-item">
              <nuxt-link to="business" class="header__nav-link">
                <img src="../assets/icons/business.svg" alt="business icon" class="header__icon">
                <span class="header__text header__text--hidden">{{ $t('nav.business') }}</span>
              </nuxt-link>
            </li>
          </ul>
        </nav>
        <div v-show="isMyselfRoute && !isDesktop" class="header__images">
          <img src="../assets/icons/menu.svg" alt="Image 2" @click="toggleSideMenu" />
          <img src="../assets/icons/white-logo.svg" alt="Image 1" />
        </div>
        <nuxt-link to="/createAd" v-show="route.path.startsWith('/myself')" class="header__actions">
          <button class="header__nav-link header__nav-link--add header__nav">
            <img src="../assets/icons/add.svg" alt="custom icon" class="header__icon">
            <span class="header__text header__text--add">Разместить объявление</span>
          </button>
        </nuxt-link>
        <div v-show="!route.path.startsWith('/myself')" class="header__actions">
          <div v-show="isLoggedIn" class="header__user-info">
            <div class="header__user-block">
              <nuxt-link to="/myself/favorites"
                :class="['header__icon-wrapper', { 'header__icon-wrapper--active': countFavorites }]">
                <img src="../assets/icons/favorites.svg" alt="favorites icon" class="header__icon">
                <span v-show="countFavorites > 0" class="header__icon-count">{{ countFavorites }}</span>
              </nuxt-link>
              <nuxt-link to="/myself/notifications"
                :class="{ 'header__icon-wrapper': true, 'header__icon-wrapper--active': countUnreadNotify }">
                <img src="../assets/icons/mail.svg" alt="message icon" class="header__icon">
                <span v-show="countUnreadNotify > 0" class="header__icon-count">{{ countUnreadNotify }}</span>
              </nuxt-link>
              <nuxt-link to="/myself/messages"
                :class="{ 'header__icon-wrapper': true, 'header__icon-wrapper--active': countMessage }">
                <img src="../assets/icons/message.svg" alt="user__icon" class="header__icon">
                <span v-show="countMessage > 0" class="header__icon-count">{{ countMessage }}</span>
              </nuxt-link>
            </div>
            <client-only>
              <div class="header__menu" v-if="userStore.photo?.path" @click.stop="toggleUserMenu">
                <img :src="userAvatar" alt="user avatar" class="header__user-avatar" />
                <span v-if="capitalizedUserName" class="header__user-name">{{ capitalizedUserName }}</span>
                <span v-else class="header__user-name">{{ formattedPhoneNumber }}</span>
                <UserMenuPopup v-if="isUserMenuOpen" @close-userMenu="toggleUserMenu" />
              </div>
              <div class="header__menu" v-else-if="userName" @click.stop="toggleUserMenu">
                <span class="header__user-circle">{{ initial }}</span>
                <span class="header__user-name">{{ capitalizedUserName }}</span>
                <UserMenuPopup v-if="isUserMenuOpen" @close-userMenu="toggleUserMenu" />
              </div>
              <div class="header__menu" v-else @click.stop="toggleUserMenu">
                <img :src="userAvatar" alt="user avatar" class="header__user-avatar" />
                <span v-if="isClient" class="header__user-name">{{ formattedPhoneNumber }}</span>
                <UserMenuPopup v-if="isUserMenuOpen" @close-userMenu="toggleUserMenu" />
              </div>
            </client-only>
          </div>
          <button v-show="!isLoggedIn" class="header__nav-link" @click="toggleLoginModal">
            <img src="../assets/icons/user.svg" alt="logi__icon" class="header__icon header__icon--large">
            <span class="header__text">{{ $t('nav.login') }}</span>
          </button>
        </div>
      </div>
    </header>
    <component :is="currentPageComponent" />
    <LocationModal v-if="modalOpen" @close-modal="toggleModal" />
    <LoginModal v-if="modalLoginOpen" @close-loginModal="toggleLoginModal" />
    <UserMenuBurger v-if="isSideMenuOpen" @close-burgerMenu="toggleSideMenu" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { getImageUrl } from '../services/imageUtils'
import HeaderRow from './HeaderRow.vue';
import HeaderRowNew from './HeaderRowNew.vue';
import HeaderRowMyself from './HeaderRowMyself.vue';
import { useCityStore } from '~/store/city';
import { useUserStore } from '~/store/user';
import defaultLocationIcon from '../assets/icons/location.svg';
import avatarPhoto from '../assets/icons/user.svg'

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

const updateIsDesktop = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 768;
  }
};

const toggleModal = () => {
  modalOpen.value = !modalOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const toggleLoginModal = () => {
  modalLoginOpen.value = !modalLoginOpen.value;
};

const translatedCityName = computed(() => cityStore.selectedCity.name);

const handleScroll = () => {
  const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
  isHeaderHidden.value = currentScrollTop !== 0;
};

const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.username || userStore.login);
const phoneNumber = computed(() => userStore.phoneNumber);
const userAvatar = computed(() => getImageUrl(userStore.photo?.path, avatarPhoto));
const initial = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() : '');
const capitalizedUserName = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() + userName.value.slice(1) : '');

const formattedPhoneNumber = computed(() => {
  if (phoneNumber.value) {
    return phoneNumber.value;
  } else {
    return userStore.email;
  }
});

const currentPageComponent = computed(() => {
  if (route.path.startsWith('/createAd')) {
    return HeaderRowNew;
  } else if (route.path.startsWith('/myself')) {
    return HeaderRowMyself;
  } else {
    return HeaderRow;
  }
});

const containerClasses = computed(() => {
  return {
    'header__container': true,
    'header__container--small': isMyselfRoute.value && !isDesktop.value
  };
});

const isMyselfRoute = computed(() => route.path.startsWith('/myself'));

onMounted(() => {
  if (userStore.isLoggedIn) {
    userStore.fetchUserCounts();
  }
  isClient.value = true;
  updateIsDesktop();
  window.addEventListener('resize', updateIsDesktop);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsDesktop);
  window.removeEventListener('scroll', handleScroll);
});

const countFavorites = computed(() => userStore.countFavorites);
const countUnreadNotify = computed(() => userStore.countUnreadNotify);
const countMessage = computed(() => userStore.count_new_messages);
</script>

<style scoped lang="scss">
.header {
  background: $main-button;
  transition: $transition-1;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9;
  padding: 0 16px;
  transition: transform 0.3s ease-in-out;

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
    }
  }

  &__nav {
    display: flex;
    align-items: center;

    &-list {
      display: flex;
      list-style: none;
      gap: 40px;

      @media screen and (max-width: 1024px) {
        gap: 16px;
      }

      @media screen and (max-width: 480px) {
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
    cursor: pointer;
    text-decoration: none;
    transition: $transition-1;

    .header__icon {
      margin-right: 8px;

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
    height: 12px;

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
    height: 44px;
    gap: 16px;
    align-items: center;
    cursor: pointer;
  }

  &__user-block {
    height: 44px;
    display: flex;
    align-items: center;
    gap: 16px;

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

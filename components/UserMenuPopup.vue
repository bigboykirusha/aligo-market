<template>
   <div class="user-menu" :class="{ 'user-menu--reversed': isRevers, 'active': isActive }" ref="userMenuRef">
      <ul class="user-menu__list">
         <li v-for="item in menuItems" :key="item.path" class="user-menu__item">
            <nuxt-link :to="item.path">
               {{ item.label }}
               <div v-if="item.count" class="user-menu__count">{{ item.count }}</div>
            </nuxt-link>
         </li>
         <li class="user-menu__item user-menu__item--logout" @click="logout"><span>Выйти</span></li>
      </ul>
   </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useUserStore } from '~/store/user';
import { useLoginModalStore } from '~/store/loginModal';
import { useFavoritesStore } from '~/store/favorites';
import { useUserMenuStore } from '~/store/userMenuStore';
import { useRouter } from '#app';

const props = defineProps({ isRevers: Boolean });

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const loginModalStore = useLoginModalStore();
const userMenuStore = useUserMenuStore();
const router = useRouter();
const userMenuRef = ref(null);

const isActive = computed(() => userMenuStore.isActive);

const handleClickOutside = () => {
   if (userMenuStore.isActive) {
      userMenuStore.closeMenu();
   }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const menuItems = computed(() => [
   { path: '/profile/ads/all', label: 'Мои объявления', count: userStore.countAds },
   { path: '/profile/ads/drafts', label: 'Черновики', count: userStore.countDrafts },
   { path: '/profile/favorites/ads', label: 'Избранное', count: favoritesStore.countFavorites },
   { path: '/profile/messages', label: 'Сообщения', count: userStore.count_new_messages },
   { path: '/profile/notifications', label: 'Оповещения', count: userStore.countUnreadNotify },
   { path: '/profile/reviews/mine', label: 'Отзывы', count: userStore.count_new_reviews_about_myself }
]);

const logout = () => {
   userStore.clearUserdata();
   loginModalStore.hideCodeField();
   userMenuStore.closeMenu();
   router.push('/');
};
</script>

<style scoped lang="scss">
.user-menu {
   position: absolute;
   z-index: -1;
   background: #FFFFFF;
   border-top: none;
   border-radius: 0 0 12px 12px;
   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
   top: -158px;
   right: 0;
   width: 190px;
   transition: background-color 0.1s ease, transform 0.2s ease-in-out, top 0.1s ease;
   transform-origin: top;
   transform: translate(0, 100%) scaleY(0);

   &.active {
      transform: translate(0, 100%) scaleY(1);
   }

   &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -16px;
      width: 16px;
      height: 16px;
      background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 0,16 A 16,16 0 0 1 16,0 L 16,16 Z" fill="transparent"/><path d="M 0,0 A 16,16 0 0 1 16,16 L 16,0 Z" fill="white"/></svg>');
      background-repeat: no-repeat;
      z-index: 5;
   }

   &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -16px;
      width: 16px;
      height: 16px;
      background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-90, 8, 8)"><path d="M 0,16 A 16,16 0 0 1 16,0 L 16,16 Z" fill="transparent"/><path d="M 0,0 A 16,16 0 0 1 16,16 L 16,0 Z" fill="white"/></g></svg>');
      background-repeat: no-repeat;
      z-index: 5;
   }

   @media (max-width: 1420px) {
      margin-left: auto;
   }

   &__list {
      width: 100%;
      padding: 8px 0;
   }

   &__item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #323232;
      align-items: center;
      height: 36px;
      margin: 0 8px;
      padding: 6px 8px;
      border-radius: 18px;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;

      &--logout {
         span {
            padding-left: 4px;
         }
      }

      &:hover {
         background-color: #D6EFFF;
         color: #3366FF;
      }

      a {
         color: inherit;
         text-decoration: none;
         display: flex;
         outline: none;
         align-items: center;
         justify-content: space-between;
         width: 100%;
         padding-left: 4px;
      }
   }

   &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #FFFFFF;
      font-weight: 700;
      background: #3366FF;
      border-radius: 12px;
      height: 24px;
      width: 24px;
      font-size: 12px;
   }

   &--reversed {
      background-color: #3366FF;
      color: #FFFFFF;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.14);
      top: -224px;

      &::before {
         background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M 0,16 A 16,16 0 0 1 16,0 L 16,16 Z" fill="transparent"/><path d="M 0,0 A 16,16 0 0 1 16,16 L 16,0 Z" fill="%233366FF"/></svg>');
      }

      &::after {
         background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-90, 8, 8)"><path d="M 0,16 A 16,16 0 0 1 16,0 L 16,16 Z" fill="transparent"/><path d="M 0,0 A 16,16 0 0 1 16,16 L 16,0 Z" fill="%233366FF"/></g></svg>');
      }

      .user-menu__item {
         color: #FFFFFF;

         &:hover {
            background-color: #5580FF;
         }

         a {
            color: inherit;
         }

         &--logout {
            border-top: none;

            &:hover {
               background-color: #5580FF;
            }
         }
      }

      .user-menu__count {
         background: #FFFFFF;
         color: #3366FF;
      }
   }
}
</style>
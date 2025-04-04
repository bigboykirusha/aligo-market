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
   z-index: 200;
   border: none;
   border-top: none;
   background: #FFFFFF;
   border-radius: 0 0 8px 8px;
   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
   top: -170px;
   right: 0;
   width: 190px;
   transition: background-color 0.15s ease, transform 0.2s ease-in-out, top 0.15s ease;
   transform-origin: top;
   transform: translate(0, 100%) scaleY(0);

   &.active {
      transform: translate(0, 100%) scaleY(1);
   }

   @media (max-width: 1420px) {
      margin-left: auto;
   }

   &__list {
      width: 100%;
   }

   &__item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #323232;
      align-items: center;
      margin: 0;
      padding: 8px;
      height: 40px;
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
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.14);
      top: -239px;
      border: 1px solid #3366FF;
   }
}
</style>
<template>
   <client-only>
      <div class="burger-menu">
         <img class="burger-menu__icon" @click="toggleSidebar" src="../assets/icons/menu.svg" alt="">
         <div class="burger-menu__logo-section" :class="{ 'is-open': isSidebarOpen }">
            <img :src="aligoIcon" alt="Logo" class="burger-menu__logo" />
            <div class="burger-menu__role">Администратор</div>
         </div>
      </div>
      <div class="admin-layout">
         <aside :class="['admin-layout__sidebar', { 'is-open': isSidebarOpen }]">
            <div class="admin-layout__profile-section">
               <div class="admin-layout__logo-section" :class="{ 'is-open': isSidebarOpen }">
                  <img :src="isSidebarOpen ? aligoIcon : aIcon" alt="Logo" class="admin-layout__logo" />
                  <img src="../assets/icons/sidemenu.svg" alt="Toggle Sidebar" class="admin-layout__burger-icon"
                     @click="toggleSidebar" :class="{ rotated: isSidebarOpen, hidden: !isSidebarOpen }" />
               </div>
               <div class="admin-layout__role" :class="{ 'is-open': isSidebarOpen }">Администратор
               </div>
               <div class="admin-layout__divider"></div>
               <div :class="['admin-layout__avatar-section', { 'is-open': isSidebarOpen }]">
                  <img v-show="avatarUrl" :src="avatarUrl" alt="Avatar"
                     :class="['admin-layout__avatar', { 'is-open': isSidebarOpen }]" />
                  <p class="admin-layout__username" :class="{ 'is-open': isSidebarOpen }">
                     {{ isSidebarOpen ? userStore.username : userStore.username.charAt(0) }}
                  </p>
                  <div class="admin-layout__edit-profile">
                     {{ isSidebarOpen ? 'Редактировать профиль' : 'Ред.' }}
                  </div>
               </div>
               <div class="admin-layout__divider"></div>
            </div>

            <nav class="admin-layout__menu">
               <ul class="admin-layout__menu-list">
                  <li class="admin-layout__menu-item" v-for="item in menuItems" :key="item.name">
                     <div class="admin-layout__menu-link" :class="{ 'is-open': isSidebarOpen }">
                        <img :src="item.icon" alt="" class="icon-16" />
                        <span v-if="isSidebarOpen">{{ item.label }}</span>
                     </div>
                  </li>
               </ul>
            </nav>
            <button :class="{ 'is-open': isSidebarOpen }" class="admin-layout__logout-button">
               <img src="../assets/icons/leave.svg" alt="" class="icon-16" />
               <span v-if="isSidebarOpen">Выйти</span>
            </button>
         </aside>

         <main :class="['admin-layout__content', { 'sidebar-open': isSidebarOpen }]">
            <slot />
         </main>
      </div>
   </client-only>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../store/user';
import { getImageUrl } from '~/services/imageUtils';
import avatarPhoto from "../assets/icons/avatar-revers.svg";
import aIcon from "../assets/icons/a-logo.svg";
import aligoIcon from "../assets/images/logo-white.svg";
import peopleIcon from "../assets/icons/peoples.svg";
import mailIcon from "../assets/icons/mail.svg";

const userStore = useUserStore();
const avatarUrl = ref(getImageUrl(userStore.photo?.path, avatarPhoto));
const isSidebarOpen = ref(true);

const menuItems = [
   { name: 'users', label: 'Пользователи', icon: peopleIcon },
   { name: 'notifications', label: 'Оповещения', icon: mailIcon },
];

const checkSidebarDefaultState = () => {
   const width = window.innerWidth;
   isSidebarOpen.value = !(width >= 1024 && width <= 1566);
};

onMounted(() => {
   checkSidebarDefaultState();
});

const toggleSidebar = () => {
   isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped lang="scss">
.admin-layout {
   display: flex;
   min-height: 100vh;
   position: relative;

   @media (max-width: 1024px) {
      width: 100%;
      min-height: calc(100vh - 60px);
   }

   &__sidebar {
      width: 260px;
      background-color: #3366FF;
      color: #ffffff;
      padding: 16px 8px;
      display: flex;
      position: fixed;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      transition: width 0.3s ease;

      @media (max-width: 1024px) {
         width: 100%;
         padding: 0;
         z-index: 999;
         height: calc(100% - 60px);
      }

      &.is-open {
         padding: 16px 34px;

         @media (max-width: 1024px) {
            padding: 16px 24px;
            padding-top: 0;
         }
      }

      &:not(.is-open) {
         width: 56px;

         @media (max-width: 1024px) {
            width: 0;
         }
      }

      &:not(.is-open):hover .admin-layout__burger-icon.hidden {
         opacity: 1;
         pointer-events: auto;
      }
   }

   &__burger-icon {
      height: 12px;
      cursor: pointer;
      transform: rotate(180deg);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 1;

      @media (min-width: 1024px) and (max-width: 1440px) {
         display: none;
      }

      &.rotated {
         transform: rotate(0);
      }

      &.hidden {
         opacity: 0;
         pointer-events: none;
      }
   }

   &__role {
      opacity: 0;
      font-size: 14px;

      @media (max-width: 1024px) {
         display: none;
      }

      &.is-open {
         opacity: 1;
      }
   }

   &__content {
      flex-grow: 1;
      padding: 16px 24px;
      background-color: #ffffff;
      border-radius: 8px;
      transition: margin-left 0.3s ease;
      margin-left: 56px;

      @media (max-width: 1024px) {
         margin-left: 0;
         display: none;
         box-shadow: none;
      }

      &.sidebar-open {
         margin-left: 260px;

         @media (max-width: 1024px) {
            margin-left: 0;
         }
      }
   }

   &__logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-left: 12px;

      @media (min-width: 1024px) and (max-width: 1440px) {
         margin-left: 0;
      }

      @media (max-width: 1024px) {
         display: none;
      }

      &.is-open {
         justify-content: space-between;
         margin-left: 0;
      }
   }

   &__logo {
      height: 24px;
      transition: width 0.3s ease;
   }

   &__avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 16px 0;

      &.is-open {
         align-items: flex-start;
      }
   }

   &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-bottom: 16px;
      object-fit: cover;

      &.is-open {
         width: 48px;
         height: 48px;
         margin-bottom: 8px;
      }
   }

   &__username {
      font-size: 20px;
      line-height: 20px;
      font-weight: 700;
      margin-bottom: 4px;

      &.is-open {
         font-size: 16px;
      }
   }

   &__edit-profile {
      font-size: 14px;
      line-height: 18px;
      color: #ffffff;
      cursor: pointer;
      text-decoration: none;

      &:hover {
         text-decoration: underline;
      }
   }

   &__divider {
      width: 100%;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 16px 0;
   }

   &__menu {
      flex-grow: 1;
      margin-top: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
   }

   &__menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
   }

   &__menu-item {
      margin-bottom: 16px;
   }

   &__menu-link {
      display: flex;
      justify-content: center;
      gap: 8px;
      align-items: center;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;

      &.is-open {
         justify-content: flex-start;
      }
   }

   &__logout-button {
      display: flex;
      align-items: center;
      color: #ffffff;
      background: none;
      border: none;
      font-size: 14px;
      justify-content: center;
      cursor: pointer;
      padding: 8px 0;
      border-radius: 4px;
      transition: background-color 0.3s ease;
      gap: 8px;

      &.is-open {
         justify-content: flex-start;
      }
   }
}

.icon-16 {
   width: 16px;
}

.burger-menu {
   display: none;

   @media (max-width: 1024px) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 60px;
      background-color: #3366FF;
      padding: 0 24px;
   }

   &__icon {}

   &__logo-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
   }

   &__logo {
      height: 20px;
   }

   &__role {
      font-size: 12px;
      color: #ffffff;
      ;
   }

}
</style>
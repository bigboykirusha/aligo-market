<template>
   <nav class="bottom-toolbar" :class="{ 'bottom-toolbar--hidden': showDropdown || isCreatePage || isChat }">
      <client-only>
         <ul class="bottom-toolbar__list">
            <li class="bottom-toolbar__item" v-for="item in menuItems" :key="item.title"
               :class="{ 'bottom-toolbar__item--active': isActive(item.path, item.icon) }">
               <div v-if="(item.icon !== 'catalog') && (item.icon !== 'profile')" class="bottom-toolbar__link"
                  @click="handleMenuClick(item)">
                  <svg v-if="item.icon === 'post'" class="bottom-toolbar__icon"
                     :class="{ 'icon--active': isActive(item.path, item.icon) }" width="22" height="22"
                     viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M7.66699 11H14.3337" stroke="#A8A8A8" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M11 7.66663V14.3333" stroke="#A8A8A8" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M11 1C19 1 21 3 21 11C21 19 19 21 11 21C3 21 1 19 1 11C1 3 3 1 11 1Z" stroke="#A8A8A8"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <svg v-if="item.icon === 'chats'" class="bottom-toolbar__icon"
                     :class="{ 'icon--active': isActive(item.path, item.icon) }" width="22" height="22"
                     viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M1 21L2.44332 16.1314C1.1959 14.057 0.744636 11.6004 1.17344 9.2184C1.60225 6.83639 2.88194 4.69107 4.77458 3.18131C6.66723 1.67155 9.04403 0.900098 11.4631 1.01038C13.8821 1.12066 16.1788 2.10518 17.926 3.78088C19.6733 5.45658 20.7523 7.70943 20.9623 10.1206C21.1724 12.5317 20.4992 14.937 19.068 16.8893C17.6368 18.8416 15.545 20.2081 13.1814 20.7345C10.8178 21.261 8.3434 20.9117 6.21816 19.7516L1 21"
                        stroke="#A8A8A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <svg v-if="item.icon === 'favorites'" class="bottom-toolbar__icon"
                     :class="{ 'icon--active': isActive(item.path, item.icon) }" width="22" height="22"
                     viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                        d="M19.3383 11.7216L11.0093 21L2.68024 11.7216M2.68024 11.7216C2.13086 11.1203 1.69813 10.3976 1.40928 9.59892C1.12044 8.80027 0.981741 7.943 1.00193 7.08109C1.02211 6.21918 1.20074 5.37131 1.52656 4.59087C1.85239 3.81043 2.31835 3.11432 2.89511 2.54638C3.47187 1.97844 4.14693 1.55098 4.87778 1.2909C5.60863 1.03083 6.37944 0.943779 7.14167 1.03524C7.9039 1.12669 8.64104 1.39467 9.30666 1.82231C9.97229 2.24994 10.552 2.82796 11.0093 3.51996C11.4685 2.83298 12.0489 2.26001 12.714 1.83692C13.3792 1.41382 14.1149 1.14971 14.875 1.06112C15.635 0.972517 16.4032 1.06134 17.1314 1.32202C17.8596 1.5827 18.5321 2.00963 19.1068 2.57609C19.6815 3.14255 20.1461 3.83634 20.4715 4.61405C20.7969 5.39175 20.976 6.23663 20.9978 7.0958C21.0195 7.95497 20.8833 8.80993 20.5978 9.60719C20.3122 10.4044 19.8834 11.1268 19.3383 11.7291"
                        stroke="#A8A8A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div v-if="item.icon === 'chats' && count_new_messages > 0" class="bottom-toolbar__badge">{{
                     count_new_messages
                  }}</div>
                  <div v-if="item.icon === 'favorites' && countFavorites > 0" class="bottom-toolbar__badge">{{
                     countFavorites }}</div>
                  <span class="bottom-toolbar__text">{{ item.title }}</span>
               </div>
               <div v-else-if="item.icon === 'catalog'" @click.stop="toggleDropdown" class="bottom-toolbar__link">
                  <svg class="bottom-toolbar__icon" :class="{ 'icon--active': isActive(item.path, item.icon) }"
                     width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1 1H21" stroke="#A8A8A8" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M1 10.9999H21" stroke="#A8A8A8" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                     <path d="M1 21H14.75" stroke="#A8A8A8" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                  </svg>
                  <span class="bottom-toolbar__text">{{ item.title }}</span>
               </div>
               <div v-else-if="item.icon === 'profile'" @click.stop="toggleMenu" class="bottom-toolbar__link">
                  <svg class="bottom-toolbar__icon" :class="{ 'icon--active': isActive(item.path, item.icon) }"
                     width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <circle cx="11" cy="11" r="10" stroke="#A8A8A8" stroke-width="2" />
                     <path
                        d="M17.2325 16.2788C16.8895 15.35 16.2759 14.6671 15.3275 14.3115C14.8316 14.1245 14.315 13.9903 13.8088 13.8318C13.5134 13.7383 13.22 13.6347 12.9761 13.4396C12.7633 13.2709 12.5856 13.0676 12.5691 12.7892C12.5505 12.464 12.5629 12.1368 12.567 11.8096C12.567 11.773 12.5856 11.7262 12.6125 11.6998C13.0671 11.2689 13.3914 10.7649 13.5361 10.1572C13.5443 10.1227 13.5795 10.084 13.6105 10.0718C13.7737 10.0129 13.8832 9.89705 13.9473 9.74665C14.0051 9.60438 14.0568 9.45602 14.0857 9.30562C14.1415 9.00889 14.1311 8.72029 13.8584 8.49672C14.1002 7.96219 14.1704 7.40938 14.1229 6.83827C14.0774 6.35049 13.9824 5.87694 13.7241 5.45013C13.4782 5.04771 13.1394 4.7835 12.6414 4.75911C12.6022 4.75708 12.5526 4.71236 12.5278 4.67578C12.2612 4.27336 11.8831 4.04573 11.41 3.95834C10.9802 3.87908 10.5546 3.92176 10.1351 4.01118C9.40368 4.16565 8.79622 4.52945 8.41397 5.16966C7.80444 6.1879 7.68667 7.26711 8.09577 8.389C8.12264 8.46014 8.12264 8.50688 8.06478 8.56989C7.99866 8.64102 7.94908 8.73248 7.91808 8.82394C7.83543 9.06376 7.89742 9.29952 7.96561 9.53122C8.03586 9.77307 8.13917 9.99258 8.4119 10.0779C8.43463 10.084 8.45323 10.1267 8.45943 10.1552C8.59786 10.7527 8.91399 11.2445 9.34996 11.6734C9.39128 11.714 9.42434 11.7852 9.42641 11.8441C9.43467 12.1327 9.43674 12.4193 9.42641 12.7079C9.42434 12.8115 9.39955 12.9213 9.35616 13.0148C9.18053 13.3989 8.84167 13.6042 8.45736 13.7322C7.98627 13.8907 7.50691 14.0208 7.03375 14.1672C5.94693 14.5025 5.17417 15.1732 4.77539 16.2382"
                        stroke="#A8A8A8" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  <span class="bottom-toolbar__text">{{ item.title }}</span>
               </div>
            </li>
         </ul>
      </client-only>
   </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
import { useDropdownStore } from '@/store/dropdown';
import { useLoginModalStore } from '~/store/loginModal.js';
import { useBurgerStore } from '~/store/burger';
import { useChatStore } from '~/store/chatStore';

const loginModalStore = useLoginModalStore();
const burgerStore = useBurgerStore();
const chatStore = useChatStore();

const dropdownStore = useDropdownStore();
const showDropdown = computed(() => dropdownStore.showDropdown);
const showMenu = computed(() => burgerStore.isOpen);
const isCreatePage = computed(() => route.path.startsWith('/create'));
const isChat = computed(() => route.path.startsWith('/profile/messages') && chatStore.currentChat);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { count_new_messages, countFavorites, isLoggedIn: loggedIn } = storeToRefs(userStore);
const isAuthorizationPage = computed(() => route.path.startsWith('/authorization'));

const menuItems = computed(() =>
   [
      { title: 'Каталог', path: '/auto', icon: 'catalog' },
      { title: 'Разместить', path: '/create', icon: 'post' },
      { title: 'Чаты', path: '/profile/messages', icon: 'chats' },
      { title: 'Избранное', path: '/profile/favorites/ads', icon: 'favorites' },
      { title: loggedIn.value ? 'Профиль' : 'Вход', path: '/profile/edit', icon: 'profile' },
   ]
);

const isActive = (path, icon) => {
   if (icon === 'catalog') {
      return showDropdown.value;
   }
   if (icon === 'profile') {
      return showMenu.value;
   }
   return route.path.startsWith(path);
};

const toggleDropdown = () => {
   dropdownStore.toggleDropdown();
   burgerStore.closeBurger();
};

const toggleMenu = () => {
   if (!loggedIn.value) {
      toggleLoginModal();
   } else {
      burgerStore.toggleBurger();
      closeCategories();
   }
};

const closeCategories = () => {
   dropdownStore.setDropdownState(false);
};

const closeAllMenus = () => {
   closeCategories();
   burgerStore.closeBurger();
};

const toggleLoginModal = () => {
   if (!isAuthorizationPage.value) {
      loginModalStore.toggleLoginModal();
   }
};

const handleMenuClick = (item) => {
   if (!loggedIn.value && item.icon !== 'catalog') {
      modalLoginOpen.value = true;
   } else {
      router.push(item.path);
      closeAllMenus();
   }
};
</script>

<style lang="scss" scoped>
.bottom-toolbar {
   position: fixed;
   display: none;
   bottom: 0;
   left: 0;
   width: 100%;
   background-color: #FFFFFF;
   z-index: 104;
   justify-content: center;
   box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
   transition: transform 0.2s ease-in-out;
   padding-bottom: env(safe-area-inset-bottom);

   &--hidden {
      transform: translateY(100%);

   }

   @media (max-width: 768px) {
      display: flex;
   }

   &__list {
      display: flex;
      justify-content: space-around;
      background-color: #FFFFFF;
      width: 100%;
      padding: 16px 0;
      margin: 0;
      list-style: none;
   }

   &__item {
      flex: 1;
      text-align: center;

      &--active {
         .bottom-toolbar__link {
            color: #3366FF;
         }

         .bottom-toolbar__icon {

            path,
            circle {
               stroke: #3366FF;
            }
         }
      }
   }

   &__link {
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #323232;
      font-size: 14px;
      border: none;
      outline: none;
   }

   &__icon-wrapper {
      position: relative;
      display: inline-block;
   }

   &__icon {
      margin-bottom: 4px;
      height: 20px;
      width: 20px;
   }

   &__badge {
      position: absolute;
      display: flex;
      line-height: 1;
      align-items: center;
      top: -4px;
      transform: translateX(60%);
      background-color: #3366FF;
      color: #fff;
      font-size: 10px;
      font-weight: 400;
      border-radius: 12px;
      height: 14px;
      padding: 0 6px;
   }

   &__text {
      font-size: 10px;
   }
}
</style>
<template>
   <div>
      <div class="side-menu-overlay" @click="closeMenu"></div>
      <LocationModal v-if="modalOpen" @close-modal="toggleModal" />
      <div class="side-menu" ref="userMenuRef">
         <div class="user-menu">
            <div class="user-menu__header">
               <client-only>
                  <template v-if="userName">
                     <div class="user-menu__block">
                        <ul class="user-menu__nav-list">
                           <li class="user-menu__nav-item">
                              <LanguageSwitcher />
                           </li>
                           <li class="user-menu__nav-item">
                              <button class="user-menu__nav-link" @click="toggleModal">
                                 <img :src="defaultLocationIcon" alt="location icon">
                                 <span class="user-menu__text user-menu__text--hidden">{{ translatedCityName }}</span>
                              </button>
                              <LocationPopup @open-modal="toggleModal" />
                           </li>
                           <li class="user-menu__nav-item">
                              <button class="side-menu__close-button" @click="toggleMenu">
                                 <img src="../assets/icons/close-white.svg" alt="Close" />
                              </button>
                           </li>
                        </ul>
                        <img :src="avatarUrl || avatarRevers" alt="login icon" class="user-menu__icon">
                        <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                           style="display: none" />
                        <img src="../assets/icons/change-ava.svg" alt="login icon" class="user-menu__icon-change"
                           @click="triggerFileInput">
                        <a class="user-menu__user-name">{{ capitalizedUserName }}</a>
                        <div v-if="rating === null" class="user-menu__rating-text">
                           О вас нет отзывов
                        </div>
                        <a v-else class="user-menu__profile-button">
                           <div class="user-menu__rating">
                              <div class="user-menu__rating-text">{{ rating }}</div>
                              <NuxtRating :rating-value="Number(rating)" :rating-count="5" :rating-size="10"
                                 :rating-spacing="6" :active-color="'#FFFFFF'" :inactive-color="'#3366FF'"
                                 :border-color="'#FFFFFF'" :border-width="2" :rounded-corners="true"
                                 :read-only="true" />
                           </div>{{ countReviews }} отзыва
                        </a>
                        <nuxt-link @click="toggleMenu" to="/myself/editProfile"
                           class="user-menu__profile-button">Управление
                           профилем</nuxt-link>
                     </div>
                  </template>
                  <template v-else>
                     <div class="user-menu__block">
                        <ul class="user-menu__nav-list">
                           <li class="user-menu__nav-item">
                              <LanguageSwitcher />
                           </li>
                           <li class="user-menu__nav-item">
                              <button class="user-menu__nav-link" @click="toggleModal">
                                 <img :src="defaultLocationIcon" alt="location icon">
                                 <span class="user-menu__text user-menu__text--hidden">{{ translatedCityName }}</span>
                              </button>
                              <LocationPopup @open-modal="toggleModal" />
                           </li>
                           <li class="user-menu__nav-item">
                              <button class="side-menu__close-button" @click="toggleMenu">
                                 <img src="../assets/icons/close-white.svg" alt="Close" />
                              </button>
                           </li>
                        </ul>
                        <img :src="avatarUrl || avatarRevers" alt="login icon" class="user-menu__icon">
                        <input type="file" id="avatarUpload" ref="avatarUpload" @change="handleAvatarChange"
                           style="display: none" />
                        <img src="../assets/icons/change-ava.svg" alt="login icon" class="user-menu__icon-change"
                           @click="triggerFileInput">
                        <a class="user-menu__user-name">{{ formattedPhoneNumber }}</a>
                        <a class="user-menu__profile-button">{{ countReviews }} {{ pluralizeReview(Number(countReviews)) }}</a>
                        <nuxt-link @click="toggleMenu" to="/myself/editProfile"
                           class="user-menu__profile-button">Управление
                           профилем</nuxt-link>
                     </div>
                  </template>
               </client-only>
            </div>
            <ul class="user-menu__list">
               <li class="user-menu__item user-menu__item--search">
                  <nuxt-link @click="toggleMenu" to="/"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
                           stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.85742 9.35718C4.85742 6.8719 6.87214 4.85718 9.35742 4.85718" stroke="white"
                           stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19 19.0002L13 13.0002" stroke="white" stroke-width="1" stroke-linecap="round"
                           stroke-linejoin="round" />
                     </svg>
                     Поиск объявлений </nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link to="/myself/ads"><img src="../assets/icons/ad.svg" />Мои
                     объявления <div v-show="countAds" class="user-menu__count">{{ countAds }}</div></nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link to="/myself/favorites"><img src="../assets/icons/fav.svg" />Избранное <div
                        v-show="countFavorites" class="user-menu__count">{{ countFavorites }}</div></nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link to="/myself/reviews"><img src="../assets/icons/reviews.svg" />Отзывы</nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link to="/myself/notifications">
                     <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M15.2222 1H2.77778C1.79594 1 1 1.76751 1 2.71429V11.2857C1 12.2325 1.79594 13 2.77778 13H15.2222C16.2041 13 17 12.2325 17 11.2857V2.71429C17 1.76751 16.2041 1 15.2222 1Z"
                           stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M1 2.71436L9 7.85721L17 2.71436" stroke="white" stroke-linecap="round"
                           stroke-linejoin="round" />
                     </svg>
                     Оповещения <div v-show="countUnreadNotify" class="user-menu__count">{{ countUnreadNotify }}</div>
                  </nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link to="/myself/messages"><img src="../assets/icons/mail-menu.svg" />Сообщения <div
                        v-show="countMessage" class="user-menu__count">{{ countMessage }}</div></nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link to="/myself/favorites"><img src="../assets/icons/send.svg" />Поддержка</nuxt-link>
               </li>
               <li class="user-menu__item" @click="toggleMenu">
                  <nuxt-link @click="toggleModal" to="/myself/business"><svg width="15" height="14" viewBox="0 0 15 14"
                        fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           d="M12.5556 3.55298H2.44444C1.6467 3.55298 1 4.18661 1 4.96823V11.3369C1 12.1185 1.6467 12.7521 2.44444 12.7521H12.5556C13.3533 12.7521 14 12.1185 14 11.3369V4.96823C14 4.18661 13.3533 3.55298 12.5556 3.55298Z"
                           stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                           d="M4.61133 3.55291V2.13766C4.61133 1.76231 4.76351 1.40234 5.0344 1.13693C5.30528 0.871518 5.67268 0.722412 6.05577 0.722412H8.94466C9.32775 0.722412 9.69515 0.871518 9.96604 1.13693C10.2369 1.40234 10.3891 1.76231 10.3891 2.13766V3.55291"
                           stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.5 7.09106V7.09877" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                           d="M1 7.79858C3.01614 8.79399 5.24235 9.3125 7.5 9.3125C9.75765 9.3125 11.9839 8.79399 14 7.79858"
                           stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                     </svg>
                     Для бизнеса</nuxt-link>
               </li>
               <li class="user-menu__item user-menu__item--logout" @click="logout">
                  Выйти
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getImageUrl } from '../services/imageUtils'
import { useUserStore } from '~/store/user';
import { useCityStore } from '~/store/city';
import { getUserCount } from '~/services/apiClient.js';
import defaultLocationIcon from '../assets/icons/location.svg';
import avatarRevers from '../assets/icons/avatar-revers.svg'

const userStore = useUserStore();
const cityStore = useCityStore();
const route = useRoute();

const userName = computed(() => userStore.username || userStore.login);
const initial = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() : '');
const avatarUrl = ref(getImageUrl(userStore.photo?.path));
const phoneNumber = computed(() => userStore.phoneNumber);
const modalOpen = ref(false);
const translatedCityName = computed(() => cityStore.selectedCity.name);

const countFavorites = computed(() => userStore.countFavorites);
const countAds = computed(() => userStore.countAds);
const countUnreadNotify = computed(() => userStore.countUnreadNotify);
const countReviews = computed(() => userStore.countReviews);
const countMessage = computed(() => userStore.count_new_messages);

const formattedPhoneNumber = computed(() => {
   if (phoneNumber.value) {
      return phoneNumber.value;
   } else {
      return userStore.email;
   }
});

const capitalizedUserName = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() + userName.value.slice(1) : '');
const activeItem = ref('ads');
const userMenuRef = ref(null);
const rating = computed(() => userStore.grade);

const emit = defineEmits(['close-burgerMenu', 'itemSelected']);

const toggleMenu = () => {
   emit('close-burgerMenu');
};

function pluralizeReview(count) {
   const lastDigit = count % 10;
   const lastTwoDigits = count % 100;

   if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'отзывов';
   }

   if (lastDigit === 1) {
      return 'отзыв';
   }

   if (lastDigit >= 2 && lastDigit <= 4) {
      return 'отзыва';
   }

   return 'отзывов';
};

const closeMenu = () => {
   emit('close-burgerMenu');
};

const toggleModal = () => {
   modalOpen.value = !modalOpen.value;
};

const logout = () => {
   userStore.clearUserdata();
   closeMenu();
};

const fetchUserCounts = async () => {
   try {
      const data = await getUserCount();
      userStore.countFavorites = data.count_favorites;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
   }
};

watch(() => route.params.title, (newTitle) => {
   activeItem.value = newTitle || 'ads';
});

onMounted(() => {
   activeItem.value = route.params.title || 'ads';
   fetchUserCounts();
});

const handleAvatarChange = async (event) => {
   const file = event.target.files[0];
   if (file) {
      try {
         const formData = new FormData();
         formData.append('photo', file);

         await userStore.updateProfile({ photo: file });

         avatarUrl.value = URL.createObjectURL(file);
      } catch (error) {
         console.error('Ошибка при загрузке аватара: ', error);
      }
   }
};

const triggerFileInput = () => {
   const fileInput = userMenuRef.value?.querySelector('#avatarUpload');
   if (fileInput) {
      fileInput.click();
   }
};
</script>

<style scoped lang="scss">
.side-menu-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   background-color: rgba(0, 0, 0, 0.5);
   z-index: 10;
}

.side-menu {
   position: fixed;
   top: 0;
   left: 0;
   width: 85%;
   height: 100%;
   background-color: #ffffff;
   display: flex;
   flex-direction: column;
   z-index: 4000;
   align-items: center;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   animation: slide-left 0.3s ease-out forwards;
}

.side-menu__close-button {
   background: transparent;
   border: none;
   cursor: pointer;
}

.user-menu {
   display: flex;
   flex-direction: column;
   background-color: #ffffff;
   width: 100%;
   height: 100%;

   &__header {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      position: relative;
   }

   &__nav-list {
      display: flex;
      position: relative;
      align-items: center;
      list-style: none;
      gap: 40px;
      width: calc(100% + 44px);
      height: 56px;
      margin: 0 -24px;
   }

   &__nav-item {
      display: flex;
      align-items: center;
      position: relative;

      &:last-child {
         margin-left: auto;
      }
   }

   &__rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
   }

   .user-menu__rating-text {
      font-size: 14px;
      color: #ffffff;
      margin-right: 6px;
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

      img {
         margin-right: 7px;
      }
   }

   &__block {
      display: flex;
      background-color: #3366FF;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 40px;
      gap: 10px;
      width: 100%;
      padding-bottom: 40px;
   }

   &__user-circle {
      background-color: #007bff;
      color: #ffffff;
      font-size: 18px;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: bold;
   }

   &__user-name {
      font-size: 18px;
      font-weight: 600;
      color: white;
   }

   &__profile-button {
      font-size: 14px;
      color: white;
      background: transparent;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
         color: #0056b3;
         text-decoration: underline;
      }
   }

   &__icon {
      object-fit: cover;
      width: 64px;
      height: 64px;
      border-radius: 50%;
   }

   &__icon-change {
      position: absolute;
      left: 85px;
      top: 105px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      padding: 0 5px;
      background-color: white;
      object-fit: contain;
      cursor: pointer;
      border: 1px solid #eeeeee;

      &:hover {
         background-color: #D6EFFF;
      }
   }

   &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background-color: white;
      border-radius: 0 0 4px 4px;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 40px;
   }

   &__item {

      &--search {
         border-bottom: 1px solid #EEEEEE;
         padding-bottom: 24px
      }

      a {
         display: flex;
         justify-content: flex-start;
         outline: none;
         gap: 10px;
         align-items: center;
         font-size: 14px;
         color: #3366FF;
         cursor: pointer;
         transition: all 0.2s;

         svg {
            width: 16px;

            path {
               stroke: #3366FF;
            }
         }

         &:hover {
            text-decoration: underline;
         }
      }
   }

   &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #3366FF;
      background: #EEF9FF;
      border-radius: 12px;
      width: fit-content;
      padding: 0 7px;
      line-height: 1;
      height: 20px;
   }

   &__item--logout {
      color: #323232;
      padding-top: 24px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 0 0 4px 4px;
      border-top: 1px solid #EEEEEE;
      transition: all 0.2s;

      &:hover {
         color: red;
         text-decoration: underline;
      }
   }
}

@keyframes slide-left {
   from {
      transform: translateX(-100%);
   }

   to {
      transform: translateX(0);
   }
}
</style>

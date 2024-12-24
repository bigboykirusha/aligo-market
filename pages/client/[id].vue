<template>
   <div class="profile">
      <div class="profile__header">
         <button @click="goBack" class="profile__back-button">
            <img :src="backIcon" alt="Назад" class="profile__back-icon" />
         </button>
         <div class="profile__info">{{ user ? `${user.username} (#${user.unique_code})` : 'Загрузка...' }}</div>
      </div>

      <div class="profile__switcher">
         <div v-for="(item, index) in switcherItems" :key="index" class="profile__item"
            :class="{ 'profile__item--active': selectedItem === item }" @click="handleSwitch(item)">
            {{ item }}
         </div>
         <div class="profile__indicator" :style="indicatorStyle"></div>
      </div>

      <div class="profile__wrapper">
         <component :is="currentComponent" :userId="route.params.id" />
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserOtherInfo } from '../services/apiClient';
import backIcon from '../assets/icons/back-wide.svg';

import InfoAdmin from '~/components/InfoAdmin.vue';
import AdsAdmin from '~/components/AdsAdmin.vue';
import CommentsAdmin from '~/components/CommentsAdmin.vue';
import FavoritesAdmin from '~/components/FavoritesAdmin.vue';
import FunnelsAdmin from '~/components/FunnelsAdmin.vue';
import LogAdmin from '~/components/LogAdmin.vue';

definePageMeta({
   layout: 'admin-custom'
})

const route = useRoute();
const router = useRouter();
const user = ref(null);

const switcherItems = ['Инфо', 'Объявления', 'Комментарии', 'Избранное', 'Воронки', 'Лог'];
const selectedItem = ref(switcherItems[0]);

const fetchUserData = async () => {
   try {
      const response = await getUserOtherInfo(route.params.id);
      user.value = response;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
   }
};

const goBack = () => {
   router.back();
};

const indicatorStyle = computed(() => {
   const index = switcherItems.indexOf(selectedItem.value);
   const percentage = (index / switcherItems.length) * 100;
   return {
      width: `${100 / switcherItems.length}%`,
      left: `${percentage}%`,
   };
});

const handleSwitch = (item) => {
   selectedItem.value = item;
};

const currentComponent = computed(() => {
   switch (selectedItem.value) {
      case 'Инфо':
         return InfoAdmin;
      case 'Объявления':
         return AdsAdmin;
      case 'Комментарии':
         return CommentsAdmin;
      case 'Избранное':
         return FavoritesAdmin;
      case 'Воронки':
         return InfoAdmin;
      case 'Лог':
         return LogAdmin;
      default:
         return InfoAdmin;
   }
});

onMounted(fetchUserData);
</script>

<style lang="scss" scoped>
.profile {
   padding: 16px;
   display: flex;
   flex-direction: column;
   height: 100%;
   border-radius: 6px;
   box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

   &__header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
   }

   &__wrapper {
      height: 100%;
   }

   &__back-button {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #D6EFFF;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 16px;
      transition: background-color 0.3s;

      &:hover {
         background-color: #A4DCFF;
      }
   }

   &__back-icon {
      width: 14px;
   }

   &__info {
      flex-grow: 1;
      color: #003BCE;
      font-size: 16px;
      font-weight: 700;
   }

   &__switcher {
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      gap: 20px;
      padding: 0 20px;
      min-height: 40px;
      margin-bottom: 16px;
      overflow: hidden;

      @media screen and (max-width: 768px) {
         padding: 0;
         margin-bottom: 16px;
      }
   }

   &__item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #323232;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;

      &--active {
         color: #3366ff;
         font-weight: 700;
      }

      &:hover {
         color: #003bce;
      }
   }

   &__indicator {
      position: absolute;
      bottom: 0;
      height: 4px;
      background-color: #3366ff;
      transition: left 0.2s ease, width 0.2s ease;
   }

   &__detail {
      margin-bottom: 8px;
      color: #000;

      strong {
         color: inherit;
      }
   }

   &__photo {
      margin-bottom: 16px;
   }

   &__image {
      width: 100px;
      height: auto;
      border-radius: 50%;
   }
}
</style>

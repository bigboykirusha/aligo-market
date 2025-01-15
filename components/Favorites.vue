<template>
   <div class="favorites">
      <h1 class="favorites__title">Избранное</h1>
      <div class="favorites__switcher">
         <div v-for="(item, index) in switcherItems" :key="index" class="favorites__item"
            :class="{ 'favorites__item--active': selectedItem === item }" @click="handleSwitch(item)">
            {{ item }}
         </div>
         <div class="favorites__indicator" :style="indicatorStyle"></div>
      </div>
      <FavoritesList v-if="loading && selectedItem === 'Объявления'" :ads="[]" />
      <FavoritesList v-show="!loading && selectedItem === 'Объявления' && favorites.length" :ads="favorites" />
      <div v-show="!loading && selectedItem === 'Объявления' && !favorites.length" class="favorites__placeholder">
         <svg height="64" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M12.003 7.47126L7.00555 13.0714L2.00814 7.47126M2.00814 7.47126C1.67852 7.10833 1.41888 6.67211 1.24557 6.19006C1.07226 5.70802 0.989044 5.1906 1.00116 4.67037C1.01327 4.15015 1.12044 3.6384 1.31594 3.16735C1.51143 2.69629 1.79101 2.27614 2.13707 1.93335C2.48312 1.59056 2.88816 1.33255 3.32667 1.17558C3.76518 1.01861 4.22766 0.966067 4.685 1.02127C5.14234 1.07647 5.58462 1.23821 5.984 1.49632C6.38338 1.75443 6.73119 2.1033 7.00555 2.52098C7.2811 2.10633 7.62932 1.76051 8.02842 1.50514C8.42752 1.24977 8.86892 1.09036 9.32497 1.03689C9.78103 0.983412 10.2419 1.03702 10.6788 1.19436C11.1157 1.3517 11.5192 1.60938 11.8641 1.95128C12.2089 2.29318 12.4877 2.71194 12.6829 3.18134C12.8781 3.65074 12.9856 4.16068 12.9987 4.67925C13.0117 5.19782 12.93 5.71385 12.7587 6.19505C12.5873 6.67625 12.3301 7.11226 12.003 7.47578"
               stroke="#D6D6D6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
         </svg>
         <p class="favorites__placeholder-text">Сохраненных объявлений нет</p>
         <p class="favorites__placeholder-description">
            Используйте <img src="../assets/icons/fav.svg" />, чтобы
            сохранить объявление в избранное
         </p>
      </div>
      <div v-show="!loading && selectedItem === 'Поиски'" class="favorites__placeholder">
         <svg height="64" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M12.003 7.47126L7.00555 13.0714L2.00814 7.47126M2.00814 7.47126C1.67852 7.10833 1.41888 6.67211 1.24557 6.19006C1.07226 5.70802 0.989044 5.1906 1.00116 4.67037C1.01327 4.15015 1.12044 3.6384 1.31594 3.16735C1.51143 2.69629 1.79101 2.27614 2.13707 1.93335C2.48312 1.59056 2.88816 1.33255 3.32667 1.17558C3.76518 1.01861 4.22766 0.966067 4.685 1.02127C5.14234 1.07647 5.58462 1.23821 5.984 1.49632C6.38338 1.75443 6.73119 2.1033 7.00555 2.52098C7.2811 2.10633 7.62932 1.76051 8.02842 1.50514C8.42752 1.24977 8.86892 1.09036 9.32497 1.03689C9.78103 0.983412 10.2419 1.03702 10.6788 1.19436C11.1157 1.3517 11.5192 1.60938 11.8641 1.95128C12.2089 2.29318 12.4877 2.71194 12.6829 3.18134C12.8781 3.65074 12.9856 4.16068 12.9987 4.67925C13.0117 5.19782 12.93 5.71385 12.7587 6.19505C12.5873 6.67625 12.3301 7.11226 12.003 7.47578"
               stroke="#D6D6D6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
         </svg>
         <p class="favorites__placeholder-text">Сохраненных поисков нет</p>
         <p class="favorites__placeholder-description">
            Используйте <img src="../assets/icons/fav.svg" />, чтобы
            сохранить поиск в избранное
         </p>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getFavorites } from '~/services/apiClient';

const favorites = ref([]);
const loading = ref(true);

const switcherItems = ['Объявления', 'Поиски'];
const selectedItem = ref(switcherItems[0]);

const fetchFavorites = async () => {
   try {
      loading.value = true;
      if (selectedItem.value === 'Объявления') {
         const Ads = await getFavorites();
         favorites.value = Ads.map((item) => item.ads_show);
      } else {
         favorites.value = [];
      }
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      loading.value = false;
   }
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
   fetchFavorites();
};

onMounted(() => {
   fetchFavorites();
});
</script>

<style scoped lang="scss">
.favorites {
   margin-bottom: 40px;

   &__title {
      color: #3366ff;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 24px;
   }

   &__switcher {
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      gap: 20px;
      padding: 0 20px;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;

      @media (max-width: 768px) {
         padding: 0;
         margin-bottom: 16px;
         height: 34px;
         overflow-x: auto;
         gap: 16px;
         scrollbar-width: none;

         &::-webkit-scrollbar {
            display: none;
         }
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
      transition: color 0.3s ease, font-weight 0.3s ease;
      height: 100%;

      @media (max-width: 768px) {
         min-width: none;
         padding: 0 16px;
      }

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
      transition: transform 0.3s ease;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 450px;
      width: 320px;
      margin: 0 auto;
      color: #636363;
   }

   &__placeholder-text {
      font-size: 14px;
      font-weight: 700;
      color: #323232;
   }

   &__placeholder-description {
      font-size: 14px;
      color: #323232;
   }
}
</style>

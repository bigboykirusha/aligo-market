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
      <FavoritesList :ads="favorites" :XTotalCount="totalCount" :isLoading="loading" :pageType="ROUTE_MAP[selectedItem]"
         :type="selectedItem" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFavorites, getUserSavedFilters } from '~/services/apiClient';
import { getFavoritesHeaders, getUserSavedFiltersHeaders } from '~/services/apiHeaders';

const switcherItems = ['Объявления', 'Поиски'];
const ROUTE_MAP = { 'Объявления': 'favorites/ads', 'Поиски': 'favorites/searches' };
const ITEM_MAP = Object.fromEntries(Object.entries(ROUTE_MAP).map(([key, value]) => [value, key]));

const route = useRoute();
const selectedItem = ref(switcherItems[0]);
const favorites = ref([]);
const loading = ref(false);
const activeIndex = ref(0);
const totalCount = ref(2);

const fetchFunctions = {
   'Объявления': () => getFavorites().then((data) => data.map((item) => item.ads_show || [])),
   'Поиски': () => getUserSavedFilters().then((data) => data || []),
};

const fetchHeadersFunctions = {
   'Объявления': () => getFavoritesHeaders(),
   'Поиски': () => getUserSavedFiltersHeaders(),
};

const fetchFavorites = async () => {
   const savedCount = localStorage.getItem(`favorites_total_${selectedItem.value}`);
   favorites.value = [];

   if (savedCount !== null) {
      totalCount.value = Number(savedCount);
   }

   // Устанавливаем загрузку только если нет сохранённых данных или количество больше 0
   if (!savedCount || totalCount.value > 0) {
      loading.value = true;
   }

   try {
      const [headers, data] = await Promise.all([
         fetchHeadersFunctions[selectedItem.value](),
         fetchFunctions[selectedItem.value](),
      ]);

      totalCount.value = parseInt(headers['x-count-on-page'], 10) || 0;
      localStorage.setItem(`favorites_total_${selectedItem.value}`, totalCount.value);

      favorites.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   } finally {
      setTimeout(() => {
         loading.value = false;
      }, 100);
   }
};

const handleSwitch = (item) => {
   if (selectedItem.value === item) return;

   activeIndex.value = switcherItems.indexOf(item);
   selectedItem.value = item;

   const url = `/profile/${ROUTE_MAP[item]}`;
   history.replaceState({ ...history.state, forward: null, back: null }, '', url);
   fetchFavorites();
};

const indicatorStyle = computed(() => ({
   width: `${100 / switcherItems.length}%`,
   left: `${(activeIndex.value / switcherItems.length) * 100}%`,
   transition: 'left 0.3s ease',
}));

const updateSelectedItem = () => {
   const slug = route.params.title || '';
   const newItem = ITEM_MAP[slug] || switcherItems[0];
   activeIndex.value = switcherItems.indexOf(newItem);
   selectedItem.value = newItem;
   fetchFavorites();
};

onMounted(updateSelectedItem);
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
      // border: 1px solid #d6d6d6;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      border-radius: 6px;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
   }

   &__item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      height: 100%;
      position: relative;
      color: #333;
      transition: color 0.3s ease, font-weight 0.3s ease, background-color 0.3s ease;

      &--active {
         color: #3366ff;
         font-weight: 700;
      }

      &:hover {
         color: #3366ff;
         background-color: rgba(51, 102, 255, 0.1);
      }
   }

   &__indicator {
      position: absolute;
      bottom: 0;
      height: 4px;
      background-color: #3366ff;
      transition: left 0.3s ease, width 0.3s ease;
   }
}
</style>

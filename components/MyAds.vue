<template>
   <div class="my-ads">
      <div class="my-ads__title">Мои объявления</div>
      <div class="my-ads__switcher">
         <div v-for="(item, index) in SWITCHER_ITEMS" :key="item" class="my-ads__item"
            :class="{ 'my-ads__item--active': selectedItem === item }" @click="handleSwitch(item, index)">
            {{ item }}
         </div>
         <div class="my-ads__indicator" :style="indicatorStyle"></div>
      </div>
      <MyAdsList :adsMain="adsMain" :xCountOnPage="xCountOnPage" @updateSort="handleSortChange" @refreshAds="fetchAds"
         @deleteAd="deleteAdById" :isLoading="isLoading" :pageType="ROUTE_MAP[selectedItem]" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMyAds, getDrafts, getArchives, getCancelledAds } from '../services/apiClient';
import { getMyAdsHeaders, getDraftsHeaders, getArchivesHeaders, getCancelledAdsHeaders } from '../services/apiHeaders';
import { useSelectedAdsStore } from '~/store/selectedAds';
import { useSelectedDraftsStore } from '~/store/selectedDrafts';

const SWITCHER_ITEMS = ['Все', 'Черновики', 'Архив', 'Отклоненные'];
const ROUTE_MAP = {
   'Все': 'all',
   'Черновики': 'drafts',
   'Архив': 'archive',
   'Отклоненные': 'canceled'
};
const ITEM_MAP = Object.fromEntries(Object.entries(ROUTE_MAP).map(([key, value]) => [value, key]));

const route = useRoute();
const selectedItem = ref(SWITCHER_ITEMS[0]);
const adsMain = ref([]);
const isLoading = ref(false);
const activeIndex = ref(0);
const order_by = ref(null);
const selectedAdsStore = useSelectedAdsStore();
const selectedDraftsStore = useSelectedDraftsStore();
const xCountOnPage = ref(2);

// Функция для сохранения xCountOnPage в localStorage
const saveCountToStorage = (key, count) => {
   localStorage.setItem(`xCountOnPage_${key}`, count);
};

// Функция для загрузки xCountOnPage из localStorage
const loadCountFromStorage = (key) => {
   return parseInt(localStorage.getItem(`xCountOnPage_${key}`), 10) || 0;
};

// Функция для установки задержки при загрузке
const setLoadingWithDelay = (isLoadingRef) => {
   setTimeout(() => {
      isLoadingRef.value = false;
   }, 100);
};

// Функции для получения данных в зависимости от типа объявления
const fetchFunctions = {
   'Все': (isPublished) => getMyAds(isPublished),
   'Черновики': () => getDrafts().then((data) => data.map((item) => item.ads_show || {})),
   'Архив': () => getArchives().then((data) => data.map((item) => ({ ...item.ads_show || {}, main_id: item.id }))),
   'Отклоненные': () => getCancelledAds().then((data) => data.map((item) => item.ads_show || {})),
};

// Функция для получения заголовков перед основным запросом
const fetchHeaders = async () => {
   try {
      let headers = null;
      if (selectedItem.value === 'Все') {
         headers = await getMyAdsHeaders();
      } else if (selectedItem.value === 'Черновики') {
         headers = await getDraftsHeaders();
      } else if (selectedItem.value === 'Архив') {
         headers = await getArchivesHeaders();
      } else if (selectedItem.value === 'Отклоненные') {
         headers = await getCancelledAdsHeaders();
      }
      const count = parseInt(headers['x-count-on-page'], 10);
      xCountOnPage.value = count;
      saveCountToStorage(selectedItem.value, count);
   } catch (error) {
      console.error('Ошибка при получении заголовков:', error);
      xCountOnPage.value = 0;
   }
};

const fetchAds = async (isPublished = null) => {
   xCountOnPage.value = loadCountFromStorage(selectedItem.value);
   adsMain.value = [];
   if (xCountOnPage.value > 0) {
      isLoading.value = true;
   }

   await fetchHeaders();
   try {
      adsMain.value = await fetchFunctions[selectedItem.value](isPublished);
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   } finally {
      selectedAdsStore.deselectAll();
      selectedDraftsStore.deselectAll();
      setLoadingWithDelay(isLoading);
   }
};

const deleteAdById = (id) => {
   const index = adsMain.value.findIndex(ad => ad.id === id);
   if (index !== -1) {
      adsMain.value.splice(index, 1);
   }
};

// Переключение между типами
const handleSwitch = async (item, index) => {
   if (selectedItem.value === item) return;

   activeIndex.value = index;
   selectedItem.value = item;
   xCountOnPage.value = loadCountFromStorage(item);

   const url = `/profile/ads/${ROUTE_MAP[item]}`;
   history.replaceState({ ...history.state, forward: null, back: null }, '', url);

   fetchAds(order_by.value);
};

const indicatorStyle = computed(() => ({
   width: `${100 / SWITCHER_ITEMS.length}%`,
   left: `${(activeIndex.value / SWITCHER_ITEMS.length) * 100}%`,
   transition: 'left 0.3s ease',
}));

// Обновление выбранного элемента при монтировании
const updateSelectedItem = async () => {
   const slug = route.params.slug || [];
   console.log('Slug:', slug);
   const newItem = ITEM_MAP[slug[1]] || SWITCHER_ITEMS[0];
   activeIndex.value = SWITCHER_ITEMS.indexOf(newItem);
   selectedItem.value = newItem;
   xCountOnPage.value = loadCountFromStorage(newItem);
   await fetchAds(order_by.value);
};

// Обработка изменения сортировки
const handleSortChange = (orderBy) => {
   const isPublished = orderBy !== null ? parseInt(orderBy) : null;
   order_by.value = orderBy !== null ? parseInt(orderBy) : null;
   fetchAds(isPublished);
};

onMounted(updateSelectedItem);
</script>

<style lang="scss" scoped>
.my-ads {
   width: 100%;

   &__title {
      color: #3366ff;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
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

      @media (max-width: 768px) {
         overflow-x: scroll;
         white-space: nowrap;
         -webkit-overflow-scrolling: touch;
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
      font-size: 14px;
      cursor: pointer;
      height: 100%;
      position: relative;
      color: #333;
      transition: color 0.3s ease, font-weight 0.3s ease, background-color 0.3s ease;

      @media (max-width: 768px) {
         padding: 0 10px;
      }

      &:hover {
         color: #3366ff;
         background-color: rgba(51, 102, 255, 0.1);

         @media (max-width: 768px) {
            color: #323232;
            background-color: #fff;
         }
      }

      &--active {
         color: #3366ff;
         font-weight: 700;
      }

   }

   &__indicator {
      position: absolute;
      bottom: 0;
      height: 4px;
      background-color: #3366ff;
      transition: left 0.3s ease, width 0.3s ease;

      @media (max-width: 768px) {
         display: none;
      }
   }
}
</style>
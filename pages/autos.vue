<template>
   <div class="container">
      <AutosFilters @updateSort="handleSortUpdate" />
      <div class="wrap">
         <CardListWithBanner :showTitle="false" :adsMain="adsMain" :pageSize="count" :isLoading="isLoading"
            @updateSort="handleSortUpdate">
            <template #banner>
               <AutosBanner />
            </template>
         </CardListWithBanner>
         <Pagination v-if="totalItems > getAdsCount()" :totalItems="totalItems" :pageSize="count"
            :currentPage="currentPage" @changePage="changePage" />
         <CardList v-show="adsMain.length == 0" isFour :title="'Это может быть интересно'" :ads="ads"
            :isLoading="isLoading" />
      </div>
   </div>
   <div class="wrap2">
      <CardList v-show="ads.length > 0" :title="title3" :ads="ads" :isLoading="isLoading" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCars } from '../../services/apiClient';
import { useFiltersStore } from '../../store/filters';
import { useCityStore } from '../../store/city';

const { t } = useI18n();
const filtersStore = useFiltersStore();
const cityStore = useCityStore();

const titleBase = "Купить автомобиль в г. ";
const title3 = t('titles.title3');
const city = ref(cityStore.selectedCity.name);

const computedTitle = computed(() => {
   const { selectedCondition } = filtersStore;
   if (selectedCondition === 2) return `Купить автомобили с пробегом в г. `;
   if (selectedCondition === 1) return `Купить новые автомобили в г. `;
   return `${titleBase}`;
});

const getAdsCount = () => {
   if (typeof window !== 'undefined') return window.innerWidth < 1000 ? 12 : 16;
   return 16;
};

const ads = ref([]);
const adsMain = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const count = getAdsCount();

const fetchAds = async () => {
   try {
      isLoading.value = true;
      const { data, totalCount } = await getCars({ count: 5, order_by: 'desc' });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
   }
};

const fetchAdsMain = async () => {
   try {
      isLoading.value = true;
      const { data, totalCount } = await filtersStore.fetchFilteredCars({ page: currentPage.value, count });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
   }
};

const setLoadingWithDelay = () => {
   setTimeout(() => {
      isLoading.value = false;
   }, 1000);
};

const changePage = async (page) => {
   if (page < 1 || page > Math.ceil(totalItems.value / count)) return;
   currentPage.value = page;
   await fetchAdsMain();
};

const handleSortUpdate = () => {
   currentPage.value = 1;
   fetchAdsMain();
};

onMounted(() => {
   fetchAds();
   fetchAdsMain();
});
</script>

<style scoped lang="scss">
.container {
   max-width: 1312px;
   width: 100%;
   padding: 0 16px;
   margin: 0 auto;
   margin-top: 142px;
   display: flex;
   gap: 40px;
   justify-content: space-between;

   @media (max-width: 1250px) {
      flex-direction: column;
      gap: 32px;
      margin-top: 124px;
   }

   @media(max-width: 768px) {
      margin-top: calc(66px + 24px);
      margin-bottom: 40px;
   }
}

.autos-title {
   color: #323232;
}

.wrap {
   width: 100%;

   @media screen and (max-width: 1250px) {
      max-width: 100%;
   }
}

.autos-title {
   font-size: 20px;
   font-weight: bold;
   color: #323232;
   margin-bottom: 20px;
}

.wrap2 {
   width: 100%;
   display: flex;
   flex-direction: column;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;
}
</style>

<template>
   <div class="container">
      <AutosFilters @updateSort="handleSortUpdate" />
      <div class="wrap">
         <CardListWithBanner v-if="adsMain.length > 0" v-show="adsMain" :showTitle="false" :adsMain="adsMain"
            :pageSize="count" @updateSort="handleSortUpdate">
            <template #banner>
               <AutosBanner />
            </template>
         </CardListWithBanner>
         <NoResults v-else />
         <Pagination v-if="adsMain.length > 0" :totalItems="totalItems" :pageSize="count" :currentPage="currentPage"
            @changePage="changePage" />
      </div>
   </div>
   <div class="wrap2">
      <CardList v-show="ads" :title="title3" :ads="ads" />
      <InfoBanner />
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCars } from '../../services/apiClient';
import { useFiltersStore } from '../../store/filters';

import cardImage1 from '../assets/images/other/cat-card-1.png';
import cardImage2 from '../assets/images/other/cat-card-2.png';
import cardImage3 from '../assets/images/other/cat-card-3.png';
import cardImage4 from '../assets/images/other/cat-card-4.png';
import cardImage5 from '../assets/images/other/cat-card-5.png';
import cardImage6 from '../assets/images/other/cat-card-6.png';

const { t } = useI18n();
const titleBase = "Купить автомобиль в г. ";

const computedTitle = computed(() => {
   if (filtersStore.selectedCondition === 2) {
      return `Купить автомобили с пробегом в г. `;
   } else if (filtersStore.selectedCondition === 1) {
      return `Купить новые автомобили в г. `;
   }
   return titleBase;
});

const title3 = t('titles.title3');

const getAdsCount = () => {
   if (typeof window !== 'undefined') {
      if (window.innerWidth < 1000) return 12;
      return 16;
   }
   return 16;
};

const ads = ref([]);
const adsMain = ref([]);
const filtersStore = useFiltersStore();
const currentPage = ref(1);
const totalItems = ref(0);
const count = getAdsCount();

const sliderData = [
   { id: 1, title: 'Легковые автомобили', imageUrl: cardImage1, backgroundColor: '#F7D3C7' },
   { id: 2, title: 'Мотоциклы', imageUrl: cardImage2, backgroundColor: '#C7E9F7' },
   { id: 3, title: 'Транспорт и перевозки', imageUrl: cardImage3, backgroundColor: '#E5C7F7' },
   { id: 4, title: 'Внедорожники из Грузии', imageUrl: cardImage4, backgroundColor: '#CEF7C7' },
   { id: 5, title: 'Авто из Эмиратов', imageUrl: cardImage5, backgroundColor: '#F7C7E5' },
   { id: 6, title: 'Микроавтобусы и минивены', imageUrl: cardImage6, backgroundColor: '#C7F7E5' },
   { id: 7, title: 'Легковые автомобили', imageUrl: cardImage1, backgroundColor: '#F7D3C7' },
   { id: 8, title: 'Мотоциклы', imageUrl: cardImage2, backgroundColor: '#C7E9F7' },
];

const fetchAds = async () => {
   try {
      const { data, totalCount } = await getCars({ count: 5, order_by: 'desc' });
      ads.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

const fetchDefaultAds = async () => {
   try {
      const { data, totalCount } = await getCars({ count, order_by: 'desc' });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

const fetchAdsMain = async () => {
   try {
      const { data, totalCount } = await filtersStore.fetchFilteredCars({ page: currentPage.value, count });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
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
   fetchDefaultAds();
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
   gap: 60px;
   justify-content: space-between;

   @media (max-width: 1250px) {
      flex-direction: column;
      gap: 32px;
      margin-top: 124px;
   }

   @media(max-width: 768px) {
      margin-top: 116px;
   }
}

.wrap {
   width: 100%;

   @media screen and (max-width: 1250px) {
      max-width: 100%;
   }
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
<template>
   <div class="cards-wrapper">
      <template v-if="query">
         <CardListWithBanner :title="`«${query}»: объявления в г. ${savedCity.name}`" :query="query" :adsMain="adsMain"
            :pageSize="pageSize" :XTotalCount="5" :isLoading="isLoading">
            <template #banner>
               <DubaiBanner />
            </template>
         </CardListWithBanner>
         <Pagination v-if="totalItems > pageSize" :totalItems="totalItems" :pageSize="pageSize"
            :currentPage="currentPage" @changePage="changePage" />
      </template>
      <CardList title="Свежие объявления" :ads="ads" :isLoading="isLoading" :XTotalCount="10" />
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCityStore } from '~/store/city';
import { getCarsSearch, getCars } from '~/services/apiClient.js';

const route = useRoute();
const cityStore = useCityStore();
const savedCity = computed(() => cityStore.selectedCity);

const query = ref(route.query.query || '');
const adsMain = ref([]);
const ads = ref([]);
const currentPage = ref(1);
const totalItems = ref(0);
const isLoading = ref(true);

const pageSize = computed(() => {
   const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
   return width < 1000 ? 12 : width < 1200 ? 16 : 20;
});


const fetchMainAds = async () => {
   if (!query.value) return;
   isLoading.value = true;
   try {
      const { data, totalCount } = await getCarsSearch({
         searchQuery: query.value,
         page: currentPage.value,
         count: pageSize.value,
      });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   } finally {
      setTimeout(() => (isLoading.value = false), 1000);
   }
};

const fetchAds = async () => {
   isLoading.value = true;
   try {
      const { data } = await getCars({ count: 10 });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   } finally {
      setTimeout(() => (isLoading.value = false), 1000);
   }
};

const changePage = async (page) => {
   if (page < 1 || page > Math.ceil(totalItems.value / pageSize.value)) return;
   currentPage.value = page;
   await fetchMainAds();
};

watch(() => route.query.query, (newQuery) => {
   query.value = newQuery || '';
   currentPage.value = 1;
   fetchMainAds();
});

onMounted(() => {
   fetchAds();
   fetchMainAds();
});
</script>

<style lang="scss" scoped>
.cards-wrapper {
   display: flex;
   flex-direction: column;
   gap: 40px;
   margin: 134px auto auto;
   padding: 0 16px;
   max-width: 1312px;
   width: 100%;

   @media (max-width: 768px) {
      margin-top: 70px;
      gap: 32px;
   }
}

.search {
   &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
   }

   &__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
   }

   &__text {
      font-size: 24px;
      font-weight: 700;
      color: #323232;
      display: flex;
      align-items: center;
      gap: 16px;

      @media (max-width: 768px) {
         font-size: 24px;
      }
   }

   &__count {
      height: 28px;
      padding: 4px 10px;
      border-radius: 12px;
      background: #D6EFFF;
      font-size: 14px;
      color: #3366FF;
   }
}
</style>
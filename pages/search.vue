<template>
   <div class="cards-wrapper">
      <div class="search__title">
         <div class="search__block" v-if="query">
            <div class="search__text">
               «{{ query }}»: объявления в г. {{ cityStore.selectedCity.name }}
            </div>
            <span v-if="totalItems > 0" class="search__count">{{ totalItems }}</span>
         </div>
      </div>

      <template v-if="query">
         <CardListWithBanner v-if="totalItems > 0" title="Результаты поиска" :showTitle="true" :adsMain="adsMain"
            :pageSize="pageSize">
            <template #banner>
               <DubaiBanner />
            </template>
         </CardListWithBanner>

         <div v-else class="no-results">
            <div class="no-results__content">
               <img src="/assets/icons/sad-smile.svg" alt="Поиск" class="no-results__icon" />
               <div class="no-results__text">
                  <p>По вашему запросу ничего не найдено, попробуйте сформулировать иначе</p>
                  <p><span>Подпишитесь на обновления</span> и мы уведомим вас, когда объявление появится</p>
               </div>
            </div>
         </div>

         <Pagination v-if="totalItems > 0" :totalItems="totalItems" :pageSize="pageSize" :currentPage="currentPage"
            @changePage="changePage" />
      </template>

      <CardList title="Свежие объявления" :ads="ads" />
      <InfoBanner />
   </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import CardList from '~/components/CardList.vue';
import { getCarsSearch, getCars } from '~/services/apiClient.js';
import { useCityStore } from '~/store/city';

const route = useRoute();
const query = ref(route.query.query || '');
const adsMain = ref([]);
const ads = ref([]);
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(getAdsCount());

const cityStore = useCityStore();

function getAdsCount() {
   const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
   return width < 1000 ? 12 : width < 1200 ? 16 : 20;
}

const fetchMainAds = async () => {
   try {
      const { data, totalCount } = await getCarsSearch({
         searchQuery: query.value,
         page: currentPage.value,
         count: pageSize.value, 
      });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

const fetchAds = async () => {
   try {
      const { data } = await getCars({ count: 10 });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

const changePage = async (page) => {
   const totalPages = Math.ceil(totalItems.value / pageSize.value);
   if (page < 1 || page > totalPages) return;
   currentPage.value = page;
   await fetchMainAds();
};

watch(() => route.query.query, (newQuery) => {
   query.value = newQuery || '';
   currentPage.value = 1;
   fetchMainAds();
}, { immediate: true });

onMounted(() => {
   fetchAds();
   fetchMainAds();
});
</script>

<style lang="scss" scoped>
.cards-wrapper {
   display: flex;
   flex-direction: column;
   gap: 24px;
   margin: 0 auto;
   margin-top: 134px;
   padding: 0 16px;
   max-width: 1312px;
   width: 100%;

   @media (max-width: 768px) {
      margin-top: 118px;
   }
}

.search {
   &__title {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 40px;
   }

   &__block {
      display: flex;
      align-items: center;
      gap: 16px;
   }

   &__text {
      color: #323232;
      font-size: 32px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 16px;

      @media (max-width: 768px) {
         font-size: 24px;
      }
   }

   &__count {
      display: flex;
      align-items: center;
      height: 24px;
      justify-content: center;
      padding: 4px 10px;
      position: relative;
      border-radius: 12px;
      background: #EEF9FF;
      font-weight: 400;
      font-size: 14px;
      color: #3366FF;
   }
}

.no-results {
   display: flex;
   flex-direction: column;
   width: 100%;
   font-size: 28px;
   gap: 10px;
   font-weight: 700;
   color: #323232;
   margin-bottom: 24px;

   @media screen and (max-width: 768px) {
      font-size: 24px;
   }

   &__content {
      display: flex;
      align-items: center;
      gap: 16px;
   }

   &__icon {
      height: 64px;
      width: 64px;
   }

   &__text {
      display: flex;
      flex-direction: column;
      font-weight: 400;
      max-width: 600px;
      font-size: 14px;

      span {
         text-decoration: underline;
         color: #3366FF;
         cursor: pointer;
      }
   }

   img {
      height: 40px;
      width: 40px;
   }
}
</style>

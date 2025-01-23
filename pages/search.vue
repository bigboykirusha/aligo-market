<template>
   <div class="cards-wrapper">
      <div class="search__title">
         <div class="search__block" v-if="query">
            <div class="search__text">
               «{{ query }}»: объявления в г. {{ savedCity }}
            </div>
            <span v-if="totalItems > 0" class="search__count">{{ totalItems }}</span>
         </div>
         <!-- Кнопка "Сохранить поиск" -->
         <button class="save-search-button" @click="toggleSaved">
            <img :src="isSaved ? savedIcon : unsavedIcon" alt="Save Icon" />
            <span>{{ isSaved ? 'Поиск сохранён' : 'Сохранить поиск' }}</span>
         </button>
      </div>

      <template v-if="query">
         <CardListWithBanner v-if="totalItems > 0" title="Результаты поиска" :showTitle="true" :adsMain="adsMain"
            :pageSize="pageSize" :isLoading="isLoading">
            <template #banner>
               <DubaiBanner />
            </template>
         </CardListWithBanner>

         <div v-else class="no-results" v-if="!isLoading">
            <div class="no-results__content">
               <img src="/assets/icons/sad-smile.svg" alt="Поиск" class="no-results__icon" />
               <div class="no-results__text">
                  <p>По вашему запросу ничего не найдено, попробуйте сформулировать иначе</p>
                  <p><span>Подпишитесь на обновления</span> и мы уведомим вас, когда объявление появится</p>
               </div>
            </div>
         </div>

         <Pagination v-if="totalItems > getAdsCount()" :totalItems="totalItems" :pageSize="pageSize"
            :currentPage="currentPage" @changePage="changePage" />
      </template>

      <CardList title="Свежие объявления" :ads="ads" :isLoading="isLoading" />
   </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import CardList from '~/components/CardList.vue';
import { getCarsSearch, getCars } from '~/services/apiClient.js';
import { useCityStore } from '~/store/city';
import unsavedIcon from '../assets/icons/fav.svg'
import savedIcon from '../assets/icons/check-icon.svg'

const route = useRoute();
const query = ref(route.query.query || '');
const adsMain = ref([]);
const ads = ref([]);
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(getAdsCount());
const isLoading = ref(true);

const cityStore = useCityStore();
const savedCity = computed(() => cityStore.selectedCity.name);

function getAdsCount() {
   const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
   return width < 1000 ? 12 : width < 1200 ? 16 : 20;
}

const setLoadingWithDelay = () => {
   setTimeout(() => {
      isLoading.value = false;
   }, 1000);
};

const isSaved = ref(false);

const toggleSaved = () => {
   isSaved.value = !isSaved.value;
};

const fetchMainAds = async () => {
   try {
      isLoading.value = true;
      const { data, totalCount } = await getCarsSearch({
         searchQuery: query.value,
         page: currentPage.value,
         count: pageSize.value,
      });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
   }
};

const fetchAds = async () => {
   try {
      isLoading.value = true;
      const { data } = await getCars({ count: 10 });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
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
      margin-top: 70px;
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
      align-items: center;
      gap: 16px;
   }

   &__text {
      color: #323232;
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
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
      height: 28px;
      justify-content: center;
      padding: 4px 10px;
      position: relative;
      border-radius: 12px;
      background: #D6EFFF;
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

.save-search-button {
   display: flex;
   align-items: center;
   gap: 8px;
   background: none;
   border: none;
   cursor: pointer;
   color: #3366FF;
   font-size: 14px;
   font-weight: 400;

   img {
      width: 14px;
      height: 14px;
   }

   &:hover {
      text-decoration: underline;
   }
}
</style>

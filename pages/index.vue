<template>
  <CategoryList />
  <div class="cards-wrapper">
    <CardListWithBanner :adsMain="adsMain" :XTotalCount="XTotalCountMain" :pageSize="pageSize"
      :isLoading="isLoadingMain">
      <template #banner>
        <DubaiBanner />
      </template>
    </CardListWithBanner>

    <Pagination v-if="totalItems > pageSize" :totalItems="totalItems" :pageSize="pageSize" :currentPage="currentPage"
      @changePage="changePage" />

    <CardList v-if="Array.isArray(adsSimilar)" :XTotalCount="XTotalCountSimilar" :title="title1" :ads="adsSimilar"
      :isLoading="isLoadingSimilar" />

    <BannerTemplate v-if="bannerContent" :content="bannerContent" />

    <CardList v-if="isLoggedIn && Array.isArray(adsHistory)" :XTotalCount="XTotalCountHistory" :title="title2"
      :ads="adsHistory" :isLoading="isLoadingHistory" />

    <InfoBanner />
  </div>
</template>

<script setup>
import { getAdsSimilar, getAdsHistory } from '../services/apiClient';
import { getAdsHistoryHeaders, getAdsSimilarHeaders } from '../services/apiHeaders';
import { useCityStore } from '~/store/city';
import { useUserStore } from '~/store/user';
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import desktopImage from '../assets/images/bg/banner-2.png';
import mobileImage from '../assets/images/bg/banner-2-m.png';

const { t } = useI18n();
const cityStore = useCityStore();
const userStore = useUserStore();

const isLoggedIn = ref(userStore.isLoggedIn);

const title1 = "Объявления в других городах";
const title2 = t('titles.title2');

const pageSize = computed(() => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 1000) return 12;
    if (window.innerWidth < 1200) return 16;
  }
  return 20;
});

const adsMain = ref([]);
const adsHistory = ref([]);
const adsSimilar = ref([]);
const currentPage = ref(1);
const totalItems = ref(0);

const isLoadingMain = ref(true);
const isLoadingHistory = ref(true);
const isLoadingSimilar = ref(true);

const XTotalCountHistory = ref(10);
const XTotalCountSimilar = ref(10);
const XTotalCountMain = ref(10);

const loadSavedCounts = () => {
  XTotalCountMain.value = Number(localStorage.getItem('XTotalCountMain')) || 0;
  XTotalCountHistory.value = Number(localStorage.getItem('XTotalCountHistory')) || 0;
  XTotalCountSimilar.value = Number(localStorage.getItem('XTotalCountSimilar')) || 0;
};

const saveCounts = () => {
  localStorage.setItem('XTotalCountMain', XTotalCountMain.value);
  localStorage.setItem('XTotalCountHistory', XTotalCountHistory.value);
  localStorage.setItem('XTotalCountSimilar', XTotalCountSimilar.value);
};

const bannerContent = computed(() => ({
  headerText: t('bannerRent.headerText'),
  desktopImage,
  mobileImage,
  altText: t('bannerRent.altText'),
  titleText: t('bannerRent.titleText'),
  isMoscow: false,
}));

const handleError = (error, message) => {
  console.error(`${message}: `, error);
  alert(`${message}. Попробуйте снова.`);
};

const setLoadingWithDelay = (isLoadingRef) => {
  setTimeout(() => {
    isLoadingRef.value = false;
  }, 500);
};

const fetchData = async (apiFunction, params, isLoadingRef) => {
  isLoadingRef.value = true;
  try {
    const { data, totalCount } = await apiFunction(params);
    return { data, totalCount };
  } catch (error) {
    handleError(error, 'Ошибка при получении данных');
    return { data: [], totalCount: 0 };
  } finally {
    setLoadingWithDelay(isLoadingRef);
  }
};

const fetchMainAds = async () => {
  try {
    const headers = await getAdsSimilarHeaders({
      city: cityStore.selectedCity.id,
      page: currentPage.value,
      count: pageSize.value,
      order_by: 'desc',
    });

    if (headers['x-count-on-page']) {
      XTotalCountMain.value = Number(headers['x-count-on-page']);
      saveCounts();
    }

    const { data } = await fetchData(getAdsSimilar, {
      city: cityStore.selectedCity.id,
      page: currentPage.value,
      count: pageSize.value,
      order_by: 'desc',
    }, isLoadingMain);

    adsMain.value = data;
  } catch (error) {
    handleError(error, 'Ошибка при загрузке объявлений');
  }
};

const fetchAdsHistory = async () => {
  if (!isLoggedIn.value) return;
  try {
    const headers = await getAdsHistoryHeaders();
    if (headers['x-count-on-page']) {
      XTotalCountHistory.value = Number(headers['x-count-on-page']);
      saveCounts();
    }

    const { data } = await fetchData(getAdsHistory, {}, isLoadingHistory);
    adsHistory.value = data.map(item => item.ads_show);
  } catch (error) {
    handleError(error, 'Ошибка при загрузке истории объявлений');
  }
};

const fetchAdsSimilar = async () => {
  try {
    const headers = await getAdsSimilarHeaders({
      not_in_this_city: cityStore.selectedCity.id,
    });

    if (headers['x-count-on-page']) {
      XTotalCountSimilar.value = Number(headers['x-count-on-page']);
      saveCounts();
    }

    const { data } = await fetchData(getAdsSimilar, {
      not_in_this_city: cityStore.selectedCity.id,
    }, isLoadingSimilar);

    adsSimilar.value = data;
  } catch (error) {
    handleError(error, 'Ошибка при загрузке похожих объявлений');
  }
};

const maxPage = computed(() => Math.ceil(totalItems.value / pageSize.value));

const changePage = async (page) => {
  if (page < 1 || page > maxPage.value) return;
  currentPage.value = page;
  await fetchMainAds();
};

let prevCityId = cityStore.selectedCity.id;
watch(() => cityStore.selectedCity.id, (newCityId) => {
  if (newCityId !== prevCityId) {
    fetchAdsSimilar();
    fetchMainAds();
    prevCityId = newCityId;
  }
});

onMounted(() => {
  loadSavedCounts();
  fetchMainAds();
  fetchAdsSimilar();
  if (isLoggedIn.value) {
    fetchAdsHistory();
  }
});
</script>

<style lang="scss" scoped>
.cards-wrapper {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }
}
</style>

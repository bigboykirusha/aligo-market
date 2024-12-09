<template>
  <CategoryList />
  <div class="cards-wrapper">
    <CardListWithBanner :showTitle="true" :adsMain="adsMain" :pageSize="pageSize" :isLoading="isLoadingMain">
      <template #banner>
        <DubaiBanner />
      </template>
    </CardListWithBanner>

    <Pagination v-if="totalItems > getAdsCount()" :totalItems="totalItems" :pageSize="pageSize"
      :currentPage="currentPage" @changePage="changePage" />

    <CardList :title="title1" :ads="adsSimilar.slice(0, MAX_ADS_COUNT)" :isLoading="isLoadingSimilar" />

    <BannerTemplate :content="bannerContent" />

    <CardList v-if="isLoggedIn" :title="title2" :ads="adsHistory.slice(0, MAX_ADS_COUNT)"
      :isLoading="isLoadingHistory" />
  </div>
</template>

<script setup>
import desktopImage from '../assets/images/bg/banner-2.png';
import mobileImage from '../assets/images/bg/banner-2-m.png';
import { getCars, getAdsHistory, getAdsSimilar } from '../services/apiClient';
import { useCityStore } from '~/store/city';
import { useUserStore } from '~/store/user';
import { ref, onMounted, watch, computed, onUnmounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const cityStore = useCityStore();
const userStore = useUserStore();

const isLoggedIn = ref(userStore.isLoggedIn);

const title1 = t('titles.title1');
const title2 = t('titles.title2');

const getAdsCount = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 1000) return 12;
    if (window.innerWidth < 1200) return 16;
  }
  return 20;
};

const adsMain = ref([]);
const adsHistory = ref([]);
const adsSimilar = ref([]);
const currentPage = ref(1);
const pageSize = ref(getAdsCount());
const totalItems = ref(0);

const isLoadingMain = ref(false);
const isLoadingHistory = ref(false);
const isLoadingSimilar = ref(false);

const MAX_ADS_COUNT = 5;

const bannerContent = computed(() => ({
  headerText: t('bannerRent.headerText'),
  desktopImage,
  mobileImage,
  altText: t('bannerRent.altText'),
  titleText: t('bannerRent.titleText'),
  isMoscow: cityStore.selectedCity.name === 'Moscow',
}));

const handleError = (error, message) => {
  console.error(`${message}: `, error);
};

const setLoadingWithDelay = (isLoadingRef) => {
  const timeoutId = setTimeout(() => {
    isLoadingRef.value = false;
  }, 1000);

  onBeforeUnmount(() => {
    clearTimeout(timeoutId);
  });
};

const fetchMainAds = async () => {
  isLoadingMain.value = true;
  pageSize.value = getAdsCount();
  try {
    const { data, totalCount } = await getCars({ page: currentPage.value, count: pageSize.value, order_by: 'desc' });
    adsMain.value = data;
    totalItems.value = totalCount;
  } catch (error) {
    handleError(error, 'Ошибка при получении данных');
  } finally {
    setLoadingWithDelay(isLoadingMain);
  }
};

const fetchAdsHistory = async () => {
  if (!isLoggedIn.value) return;

  isLoadingHistory.value = true;
  try {
    const newAdsHistory = await getAdsHistory(cityStore.selectedCity.name);
    adsHistory.value = newAdsHistory.map(item => item.ads_show);
  } catch (error) {
    handleError(error, 'Ошибка при получении истории объявлений');
  } finally {
    setLoadingWithDelay(isLoadingHistory);
  }
};

const fetchAdsSimilar = async (newCity) => {
  if (!cityStore.selectedCity.name) {
    isLoadingSimilar.value = false;
    return;
  }

  isLoadingSimilar.value = true;
  try {
    adsSimilar.value = await getAdsSimilar(newCity);
  } catch (error) {
    handleError(error, 'Ошибка при получении похожих объявлений');
  } finally {
    setLoadingWithDelay(isLoadingSimilar);
  }
};

const changePage = async (page) => {
  if (page < 1 || page > Math.ceil(totalItems.value / pageSize.value)) return;
  currentPage.value = page;
  await fetchMainAds();
};

const handleResize = () => {
  pageSize.value = getAdsCount();
};

window.addEventListener('resize', handleResize);

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

onMounted(() => {
  fetchMainAds();
  if (isLoggedIn.value) {
    fetchAdsHistory();
  }
  fetchAdsSimilar(cityStore.selectedCity.name);
});
</script>

<style>
.cards-wrapper {
  padding: 0 16px;
}
</style>

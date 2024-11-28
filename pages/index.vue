<template>
  <CategoryList />
  <div class="cards-wrapper">
    <CardListWithBanner :showTitle="true" :adsMain="adsMain" :pageSize="pageSize">
      <template #banner>
        <DubaiBanner />
      </template>
    </CardListWithBanner>

    <Pagination v-if="totalItems > 0" :totalItems="totalItems" :pageSize="pageSize" :currentPage="currentPage"
      @changePage="changePage" />

    <!-- <CardList v-if="isLoggedIn && adsHistory.length" :title="title1" :ads="adsHistory.slice(0, 5)" /> -->

    <BannerTemplate :content="bannerContent" />

    <CardList v-if="adsSimilar.length && isLoggedIn" :title="title2" :ads="adsSimilar.slice(0, 5)" />

    <InfoBanner />
  </div>
</template>

<script setup>
import desktopImage from '../assets/images/bg/banner-2.png';
import mobileImage from '../assets/images/bg/banner-2-m.png';
import { getCars, getAdsHistory, getAdsSimilar } from '../services/apiClient';
import { useCityStore } from '~/store/city';
import { useUserStore } from '~/store/user';
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const cityStore = useCityStore();
const userStore = useUserStore();

const isLoggedIn = ref(userStore.isLoggedIn);

const title1 = t('titles.title1');
const title2 = t('titles.title2');
const ads = ref([]);
const adsMain = ref([]);
const adsHistory = ref([]);
const adsSimilar = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);

const getAdsCount = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 1000) return 12;
    if (window.innerWidth < 1200) return 16;
  }
  return 20;
};

const bannerContent = {
  headerText: t('bannerRent.headerText'),
  desktopImage,
  mobileImage,
  altText: t('bannerRent.altText'),
  titleText: t('bannerRent.titleText'),
  isMoscow: false,
};

const fetchMainAds = async () => {
  pageSize.value = getAdsCount();
  try {
    const { data } = await getCars({ page: currentPage.value, count: pageSize.value, order_by: 'desc' });
    adsMain.value = data;
  } catch (error) {
    console.error('Ошибка при получении данных: ', error);
  }
};

const fetchAds = async () => {
  try {
    const { data, totalCount } = await getCars({ count: 5 });
    totalItems.value = totalCount;
    ads.value = data;
  } catch (error) {
    console.error('Ошибка при получении данных: ', error);
  }
};

const fetchAdsHistory = async () => {
  if (!isLoggedIn.value) return;

  try {
    const newAdsHistory = await getAdsHistory(cityStore.selectedCity.name);
    adsHistory.value = newAdsHistory.map(item => item.ads_show);
  } catch (error) {
    console.error('Ошибка при получении данных: ', error);
  }
};

const fetchAdsSimilar = async (newCity) => {
  if (cityStore.selectedCity.name) {
    try {
      const newAdsHistory = await getAdsSimilar(newCity);
      adsSimilar.value = newAdsHistory;
    } catch (error) {
      console.error('Ошибка при получении данных: ', error);
    }
  }
};

const changePage = async (page) => {
  if (page < 1 || page > Math.ceil(totalItems.value / pageSize)) return;
  currentPage.value = page;
  await fetchMainAds();
};

watch(
  () => cityStore.selectedCity.name,
  (newCity) => {
    fetchAdsSimilar(newCity);
  }
);

onMounted(() => {
  fetchAds();
  if (isLoggedIn.value) {
    fetchAdsHistory();
  }
  fetchMainAds();
  fetchAdsSimilar(cityStore.selectedCity.name);
});
</script>

<style>
.cards-wrapper {
  padding: 0 16px;
}
</style>

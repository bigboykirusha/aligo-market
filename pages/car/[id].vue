<template>
   <div class="cont">
      <CarToolbar v-if="car && car.id_user_owner_ads == userStore.userId" v-bind="{
         id: car.id,
         is_published: car.is_published || undefined,
         is_in_archive: car.is_in_archive || undefined,
         count_go_ad_page: car.statistic_view.count_go_ad_page || undefined,
         count_add_to_favorite: car.statistic_view.count_add_to_favorite || undefined,
         count_who_view_seller_contact: car.statistic_view.count_who_view_seller_contact || undefined,
         main_id: car.main_id || undefined
      }" />
      <div class="wrapper">
         <CarInfo v-if="car" :car="car" />
         <CarContact v-if="car" :id_user_owner_ads="car.id_user_owner_ads"
            :brand="car.auto_technical_specifications[0].brand.title"
            :model="car.auto_technical_specifications[0].model.title"
            :year="car.auto_technical_specifications[0].year_release.title" :amount="car.ads_parameter.amount"
            :username="car.ads_parameter?.username || car.ads_parameter?.login || 'Имя не указано'"
            :place="car.ads_parameter.place_inspection || 'Не указано'" :id="car.id"
            :is_in_favorites="car.is_in_favorites" :latitude="car.ads_parameter.latitude"
            :longitude="car.ads_parameter.longitude" :photos="car.photos" />
      </div>
      <div class="wrapper2">
         <CardList v-if="adsSimilar.length" :title="title3" :ads="adsSimilar.slice(0, 5)" />
         <BannerTemplate :content="bannerContent" />
         <InfoBanner />
      </div>

   </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useI18n } from 'vue-i18n';
import { getCarById, getCars, getAdsSimilar } from '../../services/apiClient';
import desktopImage from '../assets/images/bg/banner-2-auto.png';
import mobileImage from '../assets/images/bg/baner-mob-5.png';

const route = useRoute();
const car = ref(null);
const ads = ref([]);
const adsSimilar = ref([]);
const userStore = useUserStore();
const { t } = useI18n();
const title3 = t('titles.title3');

const bannerContent = {
   headerText: t('bannerRent.headerTextMoscow'),
   desktopImage: desktopImage,
   mobileImage: mobileImage,
   altText: t('bannerRent.altText'),
   titleText: t('bannerRent.titleText'),
   isMoscow: true,
};

const fetchCarDetails = async (id) => {
   try {
      const data = await getCarById(id);
      car.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных автомобиля:', error);
   }
};

const fetchAds = async () => {
   try {
      const { data } = await getCars({ count: 10, order_by: 'desc' });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

const fetchAdsSimilar = async (city) => {
   try {
      const newAdsHistory = await getAdsSimilar(city);
      adsSimilar.value = newAdsHistory;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

watch(car, (newCar) => {
   if (newCar && newCar.ads_parameter && newCar.ads_parameter.city) {
      fetchAdsSimilar(newCar.ads_parameter.city);
   }
});

onMounted(() => {
   const carId = route.params.id;
   fetchAds();
   fetchCarDetails(carId);
   fetchAdsSimilar('Тбилиси');
});
</script>

<style lang="scss">
.cont {
   margin-top: 152px;

   @media screen and (max-width: 768px) {
      margin-top: 110px;
   }
}

.wrapper {
   display: flex;
   width: 100%;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;

   column-gap: 125px;

   @media (max-width: 1100px) {
      flex-direction: column-reverse;
   }
}

.wrapper2 {
   width: 100%;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;
}
</style>

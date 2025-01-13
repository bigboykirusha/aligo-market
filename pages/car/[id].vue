<template>
   <div class="container">
      <CarToolbar v-if="isOwner" v-bind="toolbarProps" />
      <div class="info-wrapper">
         <CarInfoSkeleton v-if="isLoading" />
         <CarInfo v-else :car="car" />
         <div class="car-contact-wrapper">
            <CarContactSkeleton v-if="isLoading" />
            <CarContact v-else :id_user_owner_ads="car.id_user_owner_ads"
               :brand="car.auto_technical_specifications[0].brand.title"
               :model="car.auto_technical_specifications[0].model.title"
               :year="car.auto_technical_specifications[0].year_release.title" :amount="car.ads_parameter.amount"
               :username="car.ads_parameter?.username || car.ads_parameter?.login || 'Имя не указано'"
               :place="car.ads_parameter.place_inspection || 'Не указано'" :id="car.id"
               :is_in_favorites="car.is_in_favorites" :latitude="car.ads_parameter.latitude"
               :longitude="car.ads_parameter.longitude" :photos="car.photos" />
         </div>
      </div>
      <div class="ads-wrapper">
         <CardList :title="title3" :ads="adsSimilar.slice(0, 5)" :isLoading="isLoading" />
         <BannerTemplate :content="bannerContent" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useI18n } from 'vue-i18n';
import { getCarById, getAdsSimilar } from '../../services/apiClient';
import desktopImage from '../assets/images/bg/banner-2-auto.png';
import mobileImage from '../assets/images/bg/baner-mob-5.png';

const route = useRoute();
const userStore = useUserStore();
const { t } = useI18n();

const car = ref(null);
const adsSimilar = ref([]);
const isLoading = ref(true);
const title3 = t('titles.title3');

const bannerContent = {
   headerText: t('bannerRent.headerTextMoscow'),
   desktopImage,
   mobileImage,
   altText: t('bannerRent.altText'),
   titleText: t('bannerRent.titleText'),
   isMoscow: true,
};

const toolbarProps = computed(() => ({
   id: car.value?.id,
   is_published: car.value?.is_published || undefined,
   is_in_archive: car.value?.is_in_archive || undefined,
   count_go_ad_page: car.value?.statistic_view?.count_go_ad_page || undefined,
   count_add_to_favorite: car.value?.statistic_view?.count_add_to_favorite || undefined,
   count_who_view_seller_contact: car.value?.statistic_view?.count_who_view_seller_contact || undefined,
   main_id: car.value?.main_id || undefined,
}));

const isOwner = computed(() => car.value && car.value.id_user_owner_ads === userStore.userId);

const setLoadingWithDelay = () => {
   setTimeout(() => {
      isLoading.value = false;
   }, 1000); 
};

const fetchCarDetails = async (id) => {
   try {
      isLoading.value = true;
      car.value = await getCarById(id);
   } catch (error) {
      console.error('Ошибка при получении данных автомобиля:', error);
   } finally {
      setLoadingWithDelay(); 
   }
};

const fetchAdsSimilar = async (city) => {
   try {
      isLoading.value = true; 
      adsSimilar.value = await getAdsSimilar(city);
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay(); 
   }
};

watch(car, (newCar) => {
   if (newCar?.ads_parameter?.city) {
      fetchAdsSimilar(newCar.ads_parameter.city);
   }
});

onMounted(() => {
   const routePath = route.path;
   const carId = routePath.split('-').pop();
   fetchCarDetails(carId);
   fetchAdsSimilar('Тбилиси');
});
</script>

<style lang="scss" scoped>
.container {
   margin-top: 134px;

   @media (max-width: 768px) {
      margin-top: 67px;
   }
}

.info-wrapper {
   display: flex;
   width: 100%;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;
   column-gap: 125px;
   justify-content: space-between;

   @media (max-width: 1280px) {
      flex-direction: column-reverse;
   }
}

.car-contact-wrapper {
   max-width: 416px;
   width: 100%;

   @media (max-width: 1280px) {
      display: none;
   }
}

.ads-wrapper {
   width: 100%;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;
}
</style>

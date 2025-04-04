<template>
   <template v-if="fetchError">
      <NotFound />
   </template>
   <template v-else>
      <div class="car-page">
         <CarToolbar v-if="isOwner" v-bind="toolbarProps" />
         <div class="car-page__info">
            <CarInfo :car="car" />
            <div class="car-page__contact">
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
         <div class="car-page__ads">
            <CardList :title="title3" :ads="adsSimilar" :XTotalCount="5" :isLoading="isLoadingSimilar" />
            <BannerTemplate :content="bannerContent" />
         </div>
      </div>
   </template>
   <PhotoViewer />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';
import { getImageUrl } from '~/services/imageUtils';
import { useI18n } from 'vue-i18n';
import { getCarById, getAdsSimilar } from '~/services/apiClient';
import { useHead } from '@vueuse/head';
import desktopImage from '../assets/images/bg/banner-2-auto.png';
import mobileImage from '../assets/images/bg/baner-mob-5.png';

const route = useRoute();
const userStore = useUserStore();
const { t } = useI18n();

const car = ref(null);
const adsSimilar = ref([]);
const isLoading = ref(true);
const isLoadingSimilar = ref(true);
const title3 = t('titles.title3');

const bannerContent = {
   headerText: t('bannerRent.headerTextMoscow'),
   desktopImage,
   mobileImage,
   altText: t('bannerRent.altText'),
   titleText: t('bannerRent.titleText'),
   isMoscow: true,
};

const toolbarProps = computed(() => car.value ? ({
   id: car.value.id,
   is_published: car.value.is_published,
   is_in_archive: car.value.is_in_archive,
   is_moderation: car.value.is_moderation,
   count_go_ad_page: car.value.statistic_view?.count_go_ad_page,
   count_add_to_favorite: car.value.statistic_view?.count_add_to_favorite,
   count_who_view_seller_contact: car.value.statistic_view?.count_who_view_seller_contact,
   main_id: car.value.main_id,
}) : {});

const isOwner = computed(() => car.value?.id_user_owner_ads === userStore.userId);

const setLoadingWithDelay = (isLoadingRef) => new Promise(resolve => {
   setTimeout(() => {
      isLoadingRef.value = false;
      resolve();
   }, 100);
});

const getHeadMeta = (car) => ({
   title: `${car.auto_technical_specifications[0].brand.title} ${car.auto_technical_specifications[0].model.title} ${car.auto_technical_specifications[0].year_release.title}`,
   meta: [
      { name: 'description', content: car.ads_parameter.ads_description || 'Описание автомобиля' },
      { property: 'og:title', content: `${car.auto_technical_specifications[0].brand.title} ${car.auto_technical_specifications[0].model.title} ${car.auto_technical_specifications[0].year_release.title}` },
      { property: 'og:description', content: car.ads_parameter.ads_description || 'Описание автомобиля' },
      { property: 'og:image', content: getImageUrl(car.photos[0], desktopImage) },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
   ],
});

const fetchData = async (apiFunction, params) => {
   try {
      return await apiFunction(params);
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return { data: [], totalCount: 0 };
   }
};

const fetchError = ref(false);

const fetchCarDetails = async (id) => {
   isLoading.value = true;
   fetchError.value = false;

   try {
      const carData = await getCarById(id);
      if (!carData) throw new Error('Данные не получены');

      car.value = carData;
      useHead(getHeadMeta(carData));

      if (carData?.ads_parameter?.city?.id) {
         await fetchAdsSimilar(carData.ads_parameter.city.id);
      }

   } catch (error) {
      console.error('Ошибка при получении данных:', error);
      fetchError.value = true;
   } finally {
      isLoading.value = false;
   }
};

const fetchAdsSimilar = async (cityId) => {
   isLoadingSimilar.value = true;
   const { data } = await fetchData(getAdsSimilar, {
      city: cityId,
      page: 1,
      count: 10,
      order_by: 'desc',
   });
   adsSimilar.value = data;
   await setLoadingWithDelay(isLoadingSimilar);
};

onMounted(() => {
   const carId = route.path.split('-').pop();
   fetchCarDetails(carId);
});

onBeforeRouteLeave(() => {
   useHead({
      title: 'Aligo | Доска объявлений',
      meta: [
         { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
         { name: 'apple-mobile-web-app-title', content: 'Aligo' },
         { name: 'description', content: 'Aligo — удобная доска объявлений для поиска и размещения товаров.' },
         { name: 'keywords', content: 'Aligo, объявления, товары, услуги' },
         { property: 'og:title', content: 'Aligo | Доска объявлений' },
         { property: 'og:description', content: 'Aligo — удобная доска объявлений для поиска и размещения товаров.' },
         { property: 'og:image', content: '../../public/favicons/favicon.svg' },
         { property: 'og:url', content: 'https://aligo.ru' },
         { property: 'og:type', content: 'website' },
         { property: 'og:locale', content: 'ru_RU' },
      ],
   });
});
</script>

<style lang="scss" scoped>
.car-page {
   max-width: 1312px;
   width: 100%;
   margin: 134px auto 0;
   display: flex;
   flex-direction: column;

   @media (max-width: 768px) {
      margin: 67px auto 0;
   }

   &__info {
      display: flex;
      width: 100%;
      padding: 0 16px;
      column-gap: 70px;
      justify-content: space-between;

      @media (max-width: 1280px) {
         flex-direction: column;
         column-gap: 0;
      }
   }

   &__contact {
      width: 100%;
      max-width: 420px;

      @media (max-width: 1280px) {
         display: none;
      }
   }

   &__ads {
      width: 100%;
      max-width: 1312px;
      display: flex;
      flex-direction: column;
      gap: 40px;
      padding: 0 16px;

      @media (max-width: 768px) {
         gap: 32px;
      }
   }
}
</style>
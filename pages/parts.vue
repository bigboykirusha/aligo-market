<template>
   <div class="wrapper">
      <PlaceholderBanner :title="bannerTitle" :description="bannerDescription" :backgroundImage="placeimage"
         tg="Перейти в Telegram" />
      <VerticalLinesText :firstText="firstText" :secondText="secondText" />
      <CardList :title="title5" :XTotalCount="5" :ads="ads" :isLoading="isLoadingMain" />
   </div>
</template>

<script setup>
import placeimage from "../assets/icons/disc_car.svg";
import { getCars } from '../services/apiClient';
import { onMounted, ref } from 'vue';

const ads = ref([]);
const title5 = "Примеры объявления, которые будут размещаться в разделе:";

const bannerTitle = "Автотовары в вашем городе";
const bannerDescription = `Раздел находится в разработке. Мы делаем все возможное, чтобы запустить его как можно скорее. Следить за обновлениями можно через наш Telegram.`;
const firstText = `Скоро в этом разделе появятся предложения о продаже всевозможных товаров для вашего автомобиля от частных лиц и компаний. Здесь вы сможете найти шины и диски подходящих размеров и марок, договориться о покупке запчастей и технической остнастки, всевозможной автохимии и аксессуаров для авто.`;
const secondText = `Также в разделе будет представлена всевозможная автоэлектроника, навигаторы и противоугонные устройства. Все объявления проходят модерацию нашей системой безопасности, что позволяет защитить пользователей от мошенников и недобросовестных людей.`;

const isLoadingMain = ref(false);

const setLoadingWithDelay = (isLoadingRef) => {
   const timeoutId = setTimeout(() => {
      isLoadingRef.value = false;
   }, 1000);

   onBeforeUnmount(() => {
      clearTimeout(timeoutId);
   });
};

const fetchAds = async () => {
   isLoadingMain.value = true;
   try {
      const { data } = await getCars({ count: 5, order_by: 'desc' });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay(isLoadingMain);
   }
};

onMounted(() => {
   fetchAds();
});
</script>

<style scoped lang="scss">
.wrapper {
   padding: 0 16px;
   margin-top: 134px;

   @media (max-width: 768px) {
      margin-top: 86px;
   }
}
</style>

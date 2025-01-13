<template>
   <div class="wrapper">
      <PlaceholderBanner :title="bannerTitle" :description="bannerDescription" :backgroundImage="placeimage"
         tg="Перейти в Telegram" />
      <VerticalLinesText :firstText="firstText" :secondText="secondText" />
      <CardList :title="title5" :ads="ads" :isLoading="isLoadingMain" />
   </div>
</template>

<script setup>
import placeimage from "../assets/icons/moto_car.svg";
import { getCars } from '../services/apiClient';
import { onMounted, ref } from 'vue';

const ads = ref([]);
const title5 = "Примеры объявления, которые будут размещаться в разделе:";

const bannerTitle = "Мототехника в вашем городе";
const bannerDescription = `Раздел находится в разработке. Мы делаем все возможное, чтобы запустить его как можно скорее. Следить за обновлениями можно через наш Telegram.`;
const firstText = `Если вы ищите или хотите продать мотоцикл, квадроцикл, снегоход и другую мототехнику, то у нас отличные новости, в ближайшее время мы откроем новый раздел на сайте, где вы сможете это сделать. Новые мотоциклы и с пробегом, скутеры и мопеды, багги и картинг, а так же экипировка, оснастка и другие`;
const secondText = `товары - все это можно будет покупать и продавать, разместив объявление на нашем сайте. Для покупателей предусмотрена удобная система поиска и подбора объявлений. А если вы не смогли найти нужный товар сейчас, подпишитесь на обновления и мы предупредим, когда он появится.`;

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
      const { data } = await getCars({ count: 10, order_by: 'desc' });
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

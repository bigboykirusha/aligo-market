<template>
   <div class="wrapper">
      <PlaceholderBanner :title="bannerTitle" :description="bannerDescription" :backgroundImage="placeimage"
         tg="Перейти в Telegram" />
   </div>
   <VerticalLinesText :firstText="firstText" :secondText="secondText" />
   <CardList :title="title5" :ads="ads" />
   <InfoBanner />
</template>

<script setup>
import placeimage from "../assets/images/services.svg";
import { getCars } from '../services/apiClient';
import { onMounted, ref } from 'vue';

const ads = ref([]);
const title5 = "Примеры объявления, которые будут размещаться в разделе:";

const bannerTitle = "Услуги в вашем городе";
const bannerDescription =
   "Раздел находится в разработке. Мы делаем все возможное, чтобы запустить его как можно скорее. Следить за обновлениями можно через наш Telegram.";
const firstText =
   "Скоро в этом разделе появятся предложения об оказании услуг от компаний и частных лиц. Здесь вы сможете найти специалистов по ремонту и отделке квартир, подобрать репетитора для себя или вашего ребенка, нанять водителей или охрану, найти сиделку или садовника, договориться о уборке дома или офиса.";
const secondText =
   "Условия работы и более подробную информацию о вакансии можно будет посмотреть на странице объявления. Объявления на сайте смогут размещать не только работодатели, но и соискатели работы, а удобный интерфейс и система подбора и фильтрации позволят быстро решить вашу проблему.";

const fetchAds = async () => {
   try {
      const { data } = await getCars({ count: 10, order_by: 'desc' });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
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
   margin-bottom: 32px;
}
</style>
<template>
   <div class="wrapper">
      <PlaceholderBanner :title="bannerTitle" :description="bannerDescription" :backgroundImage="placeimage"
         tg="Перейти в Telegram" />
      <VerticalLinesText :firstText="firstText" :secondText="secondText" />
      <CardList :title="title5" :ads="ads" />
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
const firstText = `Если вы ищите работу в своем городе или подбираете сотрудника в компанию, для вас отличные новости: в ближайшее время мы запустим раздел, в котором будут публиковаться объявления от работодателей и соискателей вакансий. Объявления можно будет фильтровать по сфере деятельности и по уровню зарплат.`;
const secondText = `Вы сможете найти работу недалеко от дома или с более удобным графиком, а компании смогут подобрать подходящего специалиста. Все объявления проходят модерацию нашей системой безопасности, что позволяет защитить пользователей от мошенников и недобросовестных людей.`;

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

   @media (max-width: 768px) {
      margin-top: 86px;
   }
}
</style>

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
import placeimage from "../assets/images/realty.svg";
import { getCars } from '../services/apiClient';
import { onMounted, ref } from 'vue';

const ads = ref([]);
const title5 = "Примеры объявления, которые будут размещаться в разделе:";

const bannerTitle = "Недвижимость в вашем городе";
const bannerDescription = `Раздел находится в разработке. Мы делаем все возможное, чтобы запустить его как можно скорее. Следить за обновлениями можно через наш Telegram.`;
const firstText = `В этом разделе будут публиковаться объявления об аренде и продаже недвижимости на любой вкус. Вы сможете подобрать себе квартиру, апартаменты, загородный дом или коммерческую недвижимость для вашего бизнеса как на вторичном рынке, так и в новостройках.`;
const secondText = `Удобная система поиска и фильтрации объявлений поможет найти нужное не просматривая огромное количество страниц. Так же, без лишних усилий вы сможете разместить собственное объявление на сайте, которое будет опубликовано после проверки системой безопасности, ведь мы заботимся о наших пользователях.`;

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

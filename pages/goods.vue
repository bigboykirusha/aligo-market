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
import placeimage from "../assets/images/goods.svg";
import { getCars } from '../services/apiClient';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const ads = ref([]);
const title5 = "Примеры объявления, которые будут размещаться в разделе:";

const bannerTitle = "Бытовые товары в вашем городе";
const bannerDescription = `Раздел находится в разработке. Мы делаем все возможное, чтобы запустить его как можно скорее. Следить за обновлениями можно через наш Telegram.`;
const firstText = `В ближайшее время в этом разделе появятся объявление о продаже личных вещей и бытовых товаров. Вы сможете продать или купить всё, начиная с одежды, аксессуаров и обуви для детей и взрослых, заканчивая мебелью для вашего дома или офиса, велосипедами и ювелирными украшениями.`;
const secondText = `Так же это раздел может быть интересным для мастеров и мелких производителей, желающих продать свои бытовые товары. Связаться с продавцом можно прямо на сайте или использую контактные данные продавца, а понравившиеся объявления можно добавить в избранное и вернуться к ним позже.`;

const fetchAds = async () => {
   try {
      const { data } = await getCars({ count: 5, order_by: 'desc' });
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

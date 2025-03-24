<template>
   <div class="ads-admin__header">
      <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" placeholder="Все" />
   </div>
   <div class="ads-admin">
      <div class="ads-admin__main">
         <MyAdsCardSkeleton v-if="loading" v-for="index in 2" :key="index" />
         <AdsAdminCard v-else v-for="ad in ads" :key="ad.id" v-bind="mapAdProps(ad)" />
      </div>
      <div v-if="ads && ads.length === 0 && !loading" class="ads-admin__placeholder">
         <img src="../assets/icons/ad-sad.svg" alt="Заглушка" />
         <div class="ads-admin__placeholder--text">Объявлений пока нет.</div>
         <div class="ads-admin__placeholder--description">Здесь будут отображаться все объявления пользователя.</div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserOtherAds } from '../services/apiClient';

const props = defineProps({
   userId: {
      type: String,
      required: true,
   },
});

const ads = ref([]);
const loading = ref(true);

const sortOptions = [
   { label: 'Сначала свежие', value: 'desc' },
   { label: 'Сначала старые', value: 'asc' },
   { label: 'Публикуемые', value: 'asc' },
   { label: 'Снятые с публикации', value: 'desc' },
   { label: 'Архивные', value: 'all' },
];

const handleSortUpdate = (order_by) => {
   console.log(order_by);
};

const mapAdProps = (ad) => ({
   id: ad.id,
   images: ad.photos || ['../assets/icons/placeholder.png'],
   description: ad.ads_parameter.ads_description || undefined,
   price: ad.ads_parameter.amount || "Цена не указана",
   place: ad.ads_parameter.place_inspection || undefined,
   brand: ad.auto_technical_specifications[0]?.brand?.title || undefined,
   model: ad.auto_technical_specifications[0]?.model?.title || undefined,
   year: ad.auto_technical_specifications[0]?.year_release?.title || undefined,
   is_published: ad.is_published || undefined,
   count_go_ad_page: ad.statistic_view.count_go_ad_page || undefined,
   count_add_to_favorite: ad.statistic_view.count_add_to_favorite || undefined,
   count_who_view_seller_contact: ad.statistic_view.count_who_view_seller_contact || undefined,
   main_id: ad.main_id || undefined,
   created_at: ad.created_at
});

const fetchAds = async () => {
   try {
      loading.value = true;
      const data = await getUserOtherAds(props.userId, 'published');
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении объявлений: ', error);
   } finally {
      loading.value = false;
   }
};

onMounted(() => {
   fetchAds();
});
</script>

<style scoped lang="scss">
.ads-admin {
   width: 100%;

   &__header {
      margin-bottom: 16px;
   }

   &__item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #323232;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;

      &--active {
         color: #3366ff;
         font-weight: 700;
      }

      &:hover {
         color: #003bce;
      }
   }

   &__main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      width: 100%;
      max-height: calc(100vh - 236px);
      overflow-y: auto;
   }

   &__placeholder {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      margin: 72px auto;

      &--text {
         font-size: 14px;
         line-height: 18px;
         font-weight: 700;
         color: #323232;
      }

      &--description {
         font-size: 14px;
         color: #323232;
      }
   }
}
</style>

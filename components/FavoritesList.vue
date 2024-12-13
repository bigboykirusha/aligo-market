<template>
   <div class="cards__main">
      <FavoritesCardSkeleton v-if="loading" v-for="index in 4" :key="index" />
      <FavoritesCard v-else v-for="ad in ads" :key="ad.id" :id="ad.id" :description="ad.ads_parameter.ads_description"
         :price="ad.ads_parameter.amount" :place="ad.ads_parameter.place_inspection || 'Не указано'"
         :callNumber="ad.ads_parameter.phone" :messageEmail="ad.ads_parameter.email"
         :brand="ad.auto_technical_specifications[0].brand.title"
         :model="ad.auto_technical_specifications[0].model.title"
         :year="ad.auto_technical_specifications[0].year_release.title"
         :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'"
         :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at" />
   </div>
</template>

<script setup>

const props = defineProps({
   ads: {
      type: Array,
      required: true,
   },
});

const loading = ref(true);

watch(() => props.ads, (newAds) => {
   loading.value = !newAds.length;
});

</script>

<style scoped lang="scss">
.cards {
   &__title {
      font-size: 24px;
      font-weight: bold;
      margin-top: 0;
   }

   &__main {
      display: grid;
      padding: 8px;
      margin: -8px;
      grid-template-columns: 1fr;
      gap: 16px;
      height: auto;
      overflow-y: auto;
   }
}
</style>
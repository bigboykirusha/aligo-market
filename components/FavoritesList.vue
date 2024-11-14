<template>
   <div class="cards">
      <div class="cards__main">
         <FavoritesCardSkeleton v-if="loading" v-for="index in 4" :key="index" />
         <FavoritesCard v-else v-for="ad in ads" :key="ad.id" :id="ad.id"
            :description="ad.ads_parameter.ads_description" :price="ad.ads_parameter.amount"
            :place="ad.ads_parameter.place_inspection || 'Не указано'" :callNumber="ad.ads_parameter.phone"
            :messageEmail="ad.ads_parameter.email" :brand="ad.auto_technical_specifications[0].brand.title"
            :model="ad.auto_technical_specifications[0].model.title"
            :year="ad.auto_technical_specifications[0].year_release.title" :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'" 
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"/>
      </div>
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
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;

   &__title {
      font-size: 24px;
      font-weight: bold;
      margin-top: 0;
   }

   &__main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      height: auto;
      max-height: calc(100vh - 350px);
      overflow-y: auto;
      padding: 2px 0;
      padding-right: 16px;

      @media screen and (max-width: 480px) {
         max-height: calc(100vh - 320px);
      }
   }
}
</style>
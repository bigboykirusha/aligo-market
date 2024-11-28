<template>
   <div class="cards">
      <h2 class="cards__title">{{ title }}</h2>
      <div class="cards__main">
         <CardSkeleton v-if="loading" v-for="index in 5" :key="index" />
         <Card v-else v-for="ad in ads" :key="ad.id" :id="ad.id"
            :description="ad.ads_parameter?.ads_description" :price="ad.ads_parameter?.amount"
            :place="ad.ads_parameter?.place_inspection || 'Адрес не указан'" :callNumber="ad.ads_parameter?.phone"
            :messageEmail="ad.ads_parameter?.email" :brand="ad.auto_technical_specifications?.[0]?.brand?.title"
            :model="ad.auto_technical_specifications?.[0]?.model?.title"
            :year="ad.auto_technical_specifications?.[0]?.year_release?.title"
            :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'"
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"
            :id_user_owner_ads="ad.id_user_owner_ads" />
      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   title: {
      type: String,
      required: true,
   },
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
      grid-template-columns: repeat(5, 1fr);
      gap: 40px;

      @media screen and (max-width: 1300px) {
         grid-template-columns: repeat(4, 1fr);
      }

      @media screen and (max-width: 1040px) {
         grid-template-columns: repeat(3, 1fr);
         gap: 24px;
      }

      @media screen and (max-width: 800px) {
         grid-template-columns: repeat(2, 1fr);
      }

      @media screen and (max-width: 500px) {
         grid-template-columns: 1fr;
      }
   }
}
</style>
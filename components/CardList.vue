<template>
   <div class="cards">
      <h1 v-if="isLoading || ads.length > 0" class="cards__title">{{ title }}</h1>
      <div class="cards__main" :class="{ 'cards__main--four': isFour }">
         <CardSkeleton v-if="isLoading" v-for="index in XTotalCount" :key="index" />
         <Card v-else v-for="ad in ads" :key="ad.id" :id="ad.id" :description="ad.ads_parameter?.ads_description"
            :price="ad.ads_parameter?.amount" :place="ad.ads_parameter?.place_inspection || 'Адрес не указан'"
            :callNumber="ad.ads_parameter?.phone" :messageEmail="ad.ads_parameter?.email"
            :brand="ad.auto_technical_specifications?.[0]?.brand?.title"
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
   isLoading: {
      type: Boolean,
      required: true,
   },
   isFour: {
      type: Boolean,
      default: false,
   },
   XTotalCount: { type: Number, default: 0 }
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
      color: #323232;
      margin-bottom: 24px;
   }

   &__main {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 40px;

      &--four {
         grid-template-columns: repeat(4, 1fr);
         column-gap: 30px;
      }

      @media (max-width: 1300px) {
         grid-template-columns: repeat(4, 1fr);

         &--four {
            grid-template-columns: repeat(4, 1fr);
            column-gap: 30px;
         }
      }

      @media (max-width: 1040px) {
         grid-template-columns: repeat(3, 1fr);
         gap: 24px;

         &--four {
            grid-template-columns: repeat(3, 1fr);
         }
      }

      @media (max-width: 800px) {
         grid-template-columns: repeat(2, 1fr);

         &--four {
            grid-template-columns: repeat(2, 1fr);
         }
      }

      @media (max-width: 480px) {
         grid-template-columns: 1fr;

         &--four {
            grid-template-columns: 1fr;
         }
      }
   }
}
</style>

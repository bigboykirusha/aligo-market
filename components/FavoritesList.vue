<template>
   <div class="cards__main">
      <div v-if="!isLoading && !ads.length" class="favorites__placeholder">
         <svg height="64" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M12.003 7.47126L7.00555 13.0714L2.00814 7.47126M2.00814 7.47126C1.67852 7.10833 1.41888 6.67211 1.24557 6.19006C1.07226 5.70802 0.989044 5.1906 1.00116 4.67037C1.01327 4.15015 1.12044 3.6384 1.31594 3.16735C1.51143 2.69629 1.79101 2.27614 2.13707 1.93335C2.48312 1.59056 2.88816 1.33255 3.32667 1.17558C3.76518 1.01861 4.22766 0.966067 4.685 1.02127C5.14234 1.07647 5.58462 1.23821 5.984 1.49632C6.38338 1.75443 6.73119 2.1033 7.00555 2.52098C7.2811 2.10633 7.62932 1.76051 8.02842 1.50514C8.42752 1.24977 8.86892 1.09036 9.32497 1.03689C9.78103 0.983412 10.2419 1.03702 10.6788 1.19436C11.1157 1.3517 11.5192 1.60938 11.8641 1.95128C12.2089 2.29318 12.4877 2.71194 12.6829 3.18134C12.8781 3.65074 12.9856 4.16068 12.9987 4.67925C13.0117 5.19782 12.93 5.71385 12.7587 6.19505C12.5873 6.67625 12.3301 7.11226 12.003 7.47578"
               stroke="#D6D6D6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
         </svg>
         <p class="favorites__placeholder-text">Сохраненных пока нет</p>
         <p class="favorites__placeholder-description">
            Используйте <img src="../assets/icons/fav.svg" /> чтобы
            сохранить в избранное
         </p>
      </div>
      <FavoritesCardSkeleton v-if="isLoading" v-for="index in XTotalCount" :key="index" />
      <FavoritesCard v-else v-for="ad in ads" :key="ad.id" :id="ad.id" :id_user_owner_ads="ad.id_user_owner_ads"
         :description="ad.ads_parameter.ads_description" :price="ad.ads_parameter.amount"
         :place="ad.ads_parameter.place_inspection || 'Не указано'" :callNumber="ad.ads_parameter.phone"
         :messageEmail="ad.ads_parameter.email" :brand="ad.auto_technical_specifications[0].brand.title"
         :model="ad.auto_technical_specifications[0].model.title"
         :year="ad.auto_technical_specifications[0].year_release.title"
         :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'"
         :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :is_published="ad.is_published" :created_at="ad.created_at" />
   </div>
</template>

<script setup>
const props = defineProps({
   ads: {
      type: Array,
      required: true,
   },
   isLoading: {
      type: Boolean,
      required: true,
   },
   XTotalCount: { type: Number, default: 0 }
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
      grid-template-columns: 1fr;
      gap: 16px;
   }
}

.favorites {
   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 350px;
      width: 320px;
      margin: 0 auto;
      color: #636363;
   }

   &__placeholder-text {
      font-size: 14px;
      font-weight: 700;
      color: #323232;
   }

   &__placeholder-description {
      font-size: 14px;
      color: #323232;
   }

}
</style>
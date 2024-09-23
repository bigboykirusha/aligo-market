<template>
   <div class="cards">
      <h2 class="cards__title">{{ title }}</h2>

      <div class="cards__switcher">
         <div v-for="(item, index) in switcherItems" :key="index" class="cards__item"
            :class="{ 'cards__item--active': selectedItem === item }" @click="handleSwitch(item)">
            {{ item }}
         </div>
         <div class="cards__indicator" :style="indicatorStyle"></div>
      </div>

      <div class="cards__main">
         <CardSkeleton v-if="loading" v-for="index in 4" :key="index" />
         <Card v-else-if="ads && ads.length > 0" v-for="ad in ads" :key="ad.id" :id="ad.id"
            :description="ad.ads_parameter?.ads_description" :price="ad.ads_parameter?.amount"
            :place="ad.ads_parameter?.place_inspection || 'Адрес не указан'" :callNumber="ad.ads_parameter?.phone"
            :messageEmail="ad.ads_parameter?.email" :brand="ad.auto_technical_specifications?.[0]?.brand?.title"
            :model="ad.auto_technical_specifications?.[0]?.model?.title"
            :year="ad.auto_technical_specifications?.[0]?.year_release?.title"
            :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'"
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"
            :id_user_owner_ads="ad.id_user_owner_ads" />
      </div>
      <div v-if="ads && ads.length === 0 && !loading" class="cards__placeholder">
         <img src="../assets/icons/ad-sad.svg" alt="Заглушка" />
         <div class="cards__placeholder--text">Объявлений пока нет. </div>
         <div class="cards__placeholder--description">Здесь будут отображаться все публикации пользователя.</div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getUserOtherAds } from '../services/apiClient';

const props = defineProps({
   title: {
      type: String,
      required: true,
   },
   userId: {
      type: String,
      required: true,
   },
});

const ads = ref([]);
const loading = ref(true);
const switcherItems = ['Активные', 'Закрытые'];
const selectedItem = ref(switcherItems[0]);

const fetchAds = async (type) => {
   try {
      loading.value = true;
      const status = type === 'Активные' ? 'published' : 'closed';
      const data = await getUserOtherAds(props.userId, status);
      console.log('Полученные объявления:', data);
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении объявлений: ', error);
   } finally {
      loading.value = false;
   }
};

const indicatorStyle = computed(() => {
   const index = switcherItems.indexOf(selectedItem.value);
   const percentage = (index / switcherItems.length) * 100;
   return {
      width: `${100 / switcherItems.length}%`,
      left: `${percentage}%`,
   };
});

const handleSwitch = (item) => {
   selectedItem.value = item;
   fetchAds(item);
};

onMounted(() => {
   fetchAds(selectedItem.value);
});
</script>

<style scoped lang="scss">
.cards {
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;

   &__title {
      font-size: 20px;
      font-weight: bold;
      color: #003BCE;
      margin-top: 0;
      margin-bottom: 24px;
      line-height: 20px;
   }

   &__switcher {
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      gap: 20px;
      padding: 0 20px;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;

      @media screen and (max-width: 768px) {
         padding: 0;
         margin-bottom: 16px;
      }
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

   &__indicator {
      position: absolute;
      bottom: 0;
      height: 4px;
      background-color: #3366ff;
      transition: left 0.2s ease, width 0.2s ease;
   }

   &__main {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;

      @media screen and (max-width: 1350px) {
         grid-template-columns: repeat(3, 1fr);
      }

      @media screen and (max-width: 1100px) {
         grid-template-columns: repeat(2, 1fr);
      }

      @media screen and (max-width: 480px) {
         grid-template-columns: 1fr;
      }
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
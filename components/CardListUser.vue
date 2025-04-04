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
         <CardSkeleton v-if="isLoading" v-for="index in xCountOnPage" :key="index" />
         <Card v-else-if="!isLoading && ads.length" v-for="ad in ads" :key="ad.id" :id="ad.id"
            :description="ad.ads_parameter?.ads_description" :price="ad.ads_parameter?.amount"
            :place="ad.ads_parameter?.place_inspection || 'Адрес не указан'" :callNumber="ad.ads_parameter?.phone"
            :messageEmail="ad.ads_parameter?.email" :brand="ad.auto_technical_specifications?.[0]?.brand?.title"
            :model="ad.auto_technical_specifications?.[0]?.model?.title"
            :year="ad.auto_technical_specifications?.[0]?.year_release?.title"
            :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'"
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"
            :id_user_owner_ads="ad.id_user_owner_ads" />
      </div>
      <div v-if="!ads.length && !isLoading" class="cards__placeholder">
         <img :src="adSadIcon" alt="Заглушка" />
         <div class="cards__placeholder--text">Объявлений пока нет.</div>
         <div class="cards__placeholder--description">Здесь будут отображаться все публикации пользователя.</div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserOtherAds } from '../services/apiClient';
import { getUserOtherAdsHeaders } from '../services/apiHeaders';
import adSadIcon from "../assets/icons/ad-sad.svg";

const props = defineProps({
   title: {
      type: String,
      required: true,
   },
   userId: {
      type: Number,
      required: true,
   },
});

const route = useRoute();
const ads = ref([]);
const isLoading = ref(false);
const switcherItems = ['Активные', 'Закрытые'];
const selectedItem = ref(switcherItems[0]);
const xCountOnPage = ref(4);

const saveCountToStorage = (key, count) => {
   localStorage.setItem(`xCountOnPage_${key}`, count);
};

const loadCountFromStorage = (key) => {
   return parseInt(localStorage.getItem(`xCountOnPage_${key}`), 10) || 0;
};

const setLoadingWithDelay = (isLoadingRef) => new Promise(resolve => {
   setTimeout(() => {
      isLoadingRef.value = false;
      resolve();
   }, 100);
});

const fetchHeaders = async (status) => {
   let headers = null;
   try {
      headers = await getUserOtherAdsHeaders(props.userId, status);
      const count = parseInt(headers['x-count-on-page'], 10);
      xCountOnPage.value = count;
      saveCountToStorage(status, count);
   } catch (error) {
      console.error('Ошибка при получении заголовков:', error);
      xCountOnPage.value = 0;
   }
};

const fetchAds = async (status) => {
   xCountOnPage.value = loadCountFromStorage(status);
   ads.value = [];
   if (xCountOnPage.value > 0) {
      isLoading.value = true;
   }
   await fetchHeaders(status);
   try {
      const data = await getUserOtherAds(props.userId, status);
      return data;
   } catch (error) {
      console.error('Ошибка при получении объявлений: ', error);
      return [];
   } finally {
      setLoadingWithDelay(isLoading);
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

// Обработка переключения вкладок
const handleSwitch = async (item) => {
   if (selectedItem.value === item) return;

   selectedItem.value = item;
   const newPath = item === 'Закрытые' ? `/user/${props.userId}/closed-ads` : `/user/${props.userId}`;
   history.replaceState(null, '', newPath);

   const status = item === 'Активные' ? 'published' : 'closed';
   const data = await fetchAds(status);
   ads.value = data;
};

// Загрузка данных при монтировании компонента
onMounted(() => {
   const initialStatus = route.path.includes('closed-ads') ? 'closed' : 'published';
   selectedItem.value = initialStatus === 'closed' ? 'Закрытые' : 'Активные';
   fetchAds(initialStatus).then((data) => {
      ads.value = data;
   });
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
      color: #3366ff;
      margin-top: 0;
      margin-bottom: 24px;
      line-height: 20px;
   }

   &__switcher {
      display: flex;
      align-items: center;
      position: relative;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      border-radius: 6px;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
   }

   &__item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      height: 100%;
      position: relative;
      color: #333;
      transition: color 0.3s ease, font-weight 0.3s ease, background-color 0.3s ease;

      &--active {
         color: #3366ff;
         font-weight: 700;
      }

      &:hover {
         color: #3366ff;
         background-color: rgba(51, 102, 255, 0.1);
      }
   }

   &__indicator {
      position: absolute;
      bottom: 0;
      height: 4px;
      background-color: #3366ff;
      transition: left 0.3s ease, width 0.3s ease;
   }

   &__main {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;

      @media (max-width: 1350px) {
         grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 1100px) {
         grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 480px) {
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

      @media (max-width: 480px) {
         grid-template-columns: 1fr;
         max-width: 80%;
      }

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

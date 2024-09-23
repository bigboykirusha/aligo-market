<template>
   <div class="my-ads">
      <h1 class="my-ads__title">Мои объявления</h1>
      <div class="my-ads__switcher">
         <div v-for="(item, index) in switcherItems" :key="index" class="my-ads__item"
            :class="{ 'my-ads__item--active': selectedItem === item }" @click="handleSwitch(item)">
            {{ item }}
         </div>
         <div class="my-ads__indicator" :style="indicatorStyle"></div>
      </div>
      <div class="my-ads__content">
         <MyAdsList v-if="loading" :adsMain="[]" @updateSort="handleSortChange" />
         <MyAdsList v-show="!loading && adsMain.length" :adsMain="adsMain" @updateSort="handleSortChange"
            @refreshAds="updateAds" />
         <div v-show="!loading && !adsMain.length" class="my-ads__placeholder">
            <svg height="64" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M8.71484 1V4.42857C8.71484 4.6559 8.80515 4.87392 8.9659 5.03466C9.12664 5.19541 9.34466 5.28571 9.57199 5.28571H13.0006"
                  stroke="#D6D6D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
               <path
                  d="M11.2857 16.4286H2.71429C2.25963 16.4286 1.82359 16.248 1.5021 15.9265C1.18061 15.605 1 15.1689 1 14.7143V2.71429C1 2.25963 1.18061 1.82359 1.5021 1.5021C1.82359 1.18061 2.25963 1 2.71429 1H8.71429L13 5.28571V14.7143C13 15.1689 12.8194 15.605 12.4979 15.9265C12.1764 16.248 11.7404 16.4286 11.2857 16.4286Z"
                  stroke="#D6D6D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="my-ads__placeholder-text">{{ placeholderText.text }}</p>
            <p class="my-ads__placeholder-description">{{ placeholderText.description }}</p>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMyAds, getDrafts, getArchives } from '../services/apiClient';

const route = useRoute();
const router = useRouter();

const switcherItems = ['Все', 'Черновики', 'Архив'];
const selectedItem = ref(switcherItems[0]);
const adsMain = ref([]);
const loading = ref(true);

const placeholderText = ref({
   text: 'Объявлений пока нет',
   description: 'У вас пока нет объявлений в этой категории. Вы можете создать новое объявление, нажав на кнопку «Разместить объявление».',
});

const updatePlaceholderText = () => {
   switch (selectedItem.value) {
      case 'Черновики':
         placeholderText.value = {
            text: 'Черновиков пока нет',
            description: 'Вы пока не создали черновики. Нажмите на кнопку «Разместить объявление», чтобы добавить черновик.',
         };
         break;
      case 'Архив':
         placeholderText.value = {
            text: 'Архив пуст',
            description: 'В архиве пока нет объявлений. Вы можете добавить объявления, чтобы они появились здесь.',
         };
         break;
      default:
         placeholderText.value = {
            text: 'Объявлений пока нет',
            description: 'У вас пока нет объявлений в этой категории. Вы можете создать новое объявление, нажав на кнопку «Разместить объявление».',
         };
   }
};

const fetchAds = async (is_published) => {
   try {
      loading.value = true;
      if (selectedItem.value === 'Все') {
         adsMain.value = await getMyAds(is_published);
      } else if (selectedItem.value === 'Черновики') {
         adsMain.value = (await getDrafts()).map(item => item.ads_show || {});
      } else if (selectedItem.value === 'Архив') {
         adsMain.value = (await getArchives()).map(item => ({
            ...item.ads_show || {},
            main_id: item.id,
         }));
      }
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
      adsMain.value = [];
   } finally {
      loading.value = false;
   }
};

const updateAds = () => {
   fetchAds();
};

const handleSortChange = (orderBy) => {
   const isPublished = orderBy ? parseInt(orderBy) : undefined;
   fetchAds(isPublished);
};

const updateSelectedItem = () => {
   const title = route.params.title;
   selectedItem.value = {
      'ads': 'Все',
      'drafts': 'Черновики',
      'archive': 'Архив'
   }[title] || switcherItems[0];
   nextTick(updatePlaceholderText);
   fetchAds();
};

onMounted(updateSelectedItem);
watch(() => route.params.title, updateSelectedItem);

const handleSwitch = (item) => {
   selectedItem.value = item;
   nextTick(() => {
      updatePlaceholderText();
      setTimeout(() => {
         router.push(`/myself/${item === 'Все' ? 'ads' : item === 'Черновики' ? 'drafts' : 'archive'}`);
      }, 300);
   });
};

const indicatorStyle = computed(() => {
   const index = switcherItems.indexOf(selectedItem.value);
   const percentage = (index / switcherItems.length) * 100;
   return {
      width: `${100 / switcherItems.length}%`,
      left: `${percentage}%`,
   };
});
</script>

<style lang="scss" scoped>
.my-ads {
   width: 100%;

   &__title {
      color: #3366ff;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
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
      transition: color 0.3s ease, font-weight 0.3s ease;

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
      transition: transform 0.3s ease;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;

      @media (max-width: 480px) {
         margin-bottom: 0;
      }
   }

   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 300px;
      width: 320px;
      margin: 0 auto;
      color: #636363;
   }

   &__placeholder-icon {
      height: 64px;
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

   &__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #636363;
      font-size: 18px;
   }
}
</style>
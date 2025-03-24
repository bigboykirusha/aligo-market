<template>
   <div class="cards">
      <!-- Заголовок и кнопка сохранения поиска -->
      <div class="cards__nav">
         <h1 v-if="title" class="cards__title">{{ title }}</h1>
         <button v-if="hasAds && isSearchPage" class="cards__save-button" @click="toggleSaved">
            <img :src="saveButtonIcon" alt="Save Icon" />
            <span>{{ saveButtonText }}</span>
         </button>
         <div v-if="isAutoPage" class="cards__block">
            <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" :defaultValue="'desc'" />
            <div class="switcher">
               <div v-for="(image, index) in images" :key="image.alt" class="switcher__item"
                  :class="{ 'switcher__item--active': activeIndex === index }" @click="setActiveIndex(index)">
                  <img :src="activeIndex === index ? image.active : image.inactive" :alt="image.alt" />
               </div>
            </div>
         </div>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" :class="loadingClass">
         <CardSkeleton v-for="index in XTotalCount" :key="index" :isHorizontal="activeIndex === 1" />
      </div>

      <!-- Отображение карточек объявлений -->
      <div v-else>
         <NoResults v-if="!hasAds" />
         <div :class="mainClass">
            <template v-if="adsMain.length < 10">
               <Card v-for="ad in adsMain" :key="ad.id" v-bind="mapCardProps(ad)" />
            </template>
            <template v-else>
               <Card v-for="ad in firstHalf" :key="ad.id" v-bind="mapCardProps(ad)" />
               <slot name="banner" />
               <Card v-for="ad in secondHalf" :key="ad.id" v-bind="mapCardProps(ad)" />
            </template>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFiltersStore } from '~/store/filters';
import { useLoginModalStore } from '~/store/loginModal';
import { useUserStore } from '~/store/user';
import { useRoute } from 'vue-router';
import list from '../assets/icons/list.svg';
import listNone from '../assets/icons/list-none.svg';
import tile from '../assets/icons/tile.svg';
import tileNone from '../assets/icons/tile-none.svg';
import unsavedIcon from '../assets/icons/fav.svg';
import savedIcon from '../assets/icons/check-icon.svg';

const props = defineProps({
   adsMain: { type: Array, required: true },
   pageSize: { type: Number, default: 20 },
   title: { type: String, default: 'Свежие объявления' },
   isLoading: { type: Boolean, required: true },
   XTotalCount: { type: Number, default: 0 }
});

const emit = defineEmits(['updateSort']);
const activeIndex = ref(0);
const filtersStore = useFiltersStore();
const loginModalStore = useLoginModalStore();
const userStore = useUserStore();
const route = useRoute();
const isSearchPage = computed(() => route.path.startsWith('/search'));
const isAutoPage = computed(() => route.path.startsWith('/auto'));
const isSaved = ref(false);

const sortOptions = [
   { label: 'Сначала свежие', value: 'desc' },
   { label: 'Сначала старые', value: 'asc' },
];

const images = [
   { active: tile, inactive: tileNone, alt: 'Tile' },
   { active: list, inactive: listNone, alt: 'List' }
];

const hasAds = computed(() => props.adsMain.length > 0);
const saveButtonIcon = computed(() => isSaved.value ? savedIcon : unsavedIcon);
const saveButtonText = computed(() => isSaved.value ? 'Поиск сохранён' : 'Сохранить поиск');
const loadingClass = computed(() => [
   'cards__main',
   { 'cards__main--four': isAutoPage.value, 'cards__main--list': activeIndex.value === 1 }
]);
const mainClass = computed(() => [
   'cards__main',
   { 'cards__main--four': isAutoPage.value, 'cards__main--list': activeIndex.value === 1 }
]);

const firstHalf = computed(() => props.adsMain.slice(0, Math.ceil(props.adsMain.length / 2)));
const secondHalf = computed(() => props.adsMain.slice(Math.ceil(props.adsMain.length / 2)));

const toggleSaved = () => {
   if (userStore.isLoggedIn) {
      isSaved.value = !isSaved.value;
   } else {
      loginModalStore.openLoginModal();
   }
};

const handleSortUpdate = (order_by) => {
   filtersStore.setFilter('orderBy', order_by);
   emit('updateSort');
};

const mapCardProps = (ad) => ({
   id: ad.id,
   description: ad.ads_parameter?.ads_description || 'Нет описания',  
   price: ad.ads_parameter?.amount || 'Цена не указана',  
   place: ad.ads_parameter?.place_inspection || 'Адрес не указан',  
   callNumber: ad.ads_parameter?.phone || 'Номер не указан',  
   year: ad.auto_technical_specifications?.[0]?.year_release?.title || 'Год не указан',  
   messageEmail: ad.ads_parameter?.email || 'Электронная почта не указана',  
   horizontal: activeIndex.value === 1,
   brand: ad.auto_technical_specifications?.[0]?.brand?.title || 'Не указан',  
   model: ad.auto_technical_specifications?.[0]?.model?.title || 'Не указан', 
   username: ad.ads_parameter?.username || 'Не указано',  
   is_in_favorites: ad.is_in_favorites,
   images: ad.photos || [],
   created_at: ad.created_at || 'Дата не указана', 
   id_user_owner_ads: ad.id_user_owner_ads
});

const setActiveIndex = (index) => {
   activeIndex.value = index;
   if (isAutoPage.value) {
      sessionStorage.setItem('activeIndex', index);
   }
};

onMounted(() => {
   if (isAutoPage.value) {
      const savedIndex = sessionStorage.getItem('activeIndex');
      if (savedIndex !== null) {
         activeIndex.value = parseInt(savedIndex, 10);
      }
   }
});
</script>

<style scoped lang="scss">
.cards {
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;

   &__block {
      display: flex;
      gap: 44px;
      justify-content: flex-end;

      @media (max-width: 768px) {
         gap: 24px;
         justify-content: flex-start;
      }
   }

   &__nav {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;

      @media (max-width: 768px) {
         flex-direction: column;
      }
   }

   &__title {
      font-weight: bold;
      font-size: 24px;
      color: #323232;
      margin: 0;
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

      &--list {
         grid-template-columns: 1fr;
      }
   }

   &__save-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      color: #3366FF;
      font-size: 14px;

      img {
         width: 14px;
         height: 14px;
      }

      &:hover {
         text-decoration: underline;
      }
   }
}

.switcher {
   display: flex;
   box-sizing: content-box;
   background-color: #EEEEEE;
   border-radius: 6px;
   width: fit-content;

   &__item {
      padding: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: #EEEEEE;
      transition: all 0.3s ease;

      &:hover {
         background-color: #D6EFFF;
      }

      &:first-child {
         border: 1px solid #D6D6D6;
         border-radius: 4px 0 0 4px;
         border-right: none;
      }

      &:last-child {
         border: 1px solid #D6D6D6;
         border-radius: 0 4px 4px 0;
      }

      &--active {
         background-color: #fff;

         &:hover {
            background-color: #ffffff;
         }
      }

      img {
         width: 14px;
         height: 14px;
         object-fit: cover;
      }
   }
}
</style>
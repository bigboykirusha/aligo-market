<template>
   <div class="cards">
      <h2 v-show="showTitle" class="cards__title">{{ props.title }}</h2>
      <div v-show="!showTitle" class="cards__block">
         <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" :defaultValue="'desc'" />
         <div class="switcher">
            <div class="switcher__item" :class="{ 'switcher__item--active': activeIndex === 0 }"
               @click="activeIndex = 0">
               <img :src="activeIndex === 0 ? images[0].active : images[0].inactive" :alt="images[0].alt" />
            </div>
            <div class="switcher__item" :class="{ 'switcher__item--active': activeIndex === 1 }"
               @click="activeIndex = 1">
               <img :src="activeIndex === 1 ? images[1].active : images[1].inactive" :alt="images[1].alt" />
            </div>
         </div>
      </div>

      <div v-if="isLoading"
         :class="['cards__main', { 'cards__main--four': !showTitle, 'cards__main--list': activeIndex === 1 }]">
         <CardSkeleton v-for="index in 10" :key="index" />
      </div>

      <div v-else>
         <template v-if="!adsMain.length">
            <NoResults />
         </template>

         <div :class="['cards__main', { 'cards__main--four': !showTitle, 'cards__main--list': activeIndex === 1 }]">
            <!-- Когда объявлений меньше 10 -->
            <template v-if="adsMain.length < 10">
               <Card v-for="ad in adsMain" :key="ad.id" v-bind="mapCardProps(ad)" />
            </template>

            <!-- Когда объявлений 10 и больше -->
            <template v-else>
               <!-- Первая половина -->
               <Card v-for="ad in firstHalf" :key="ad.id" v-bind="mapCardProps(ad)" />

               <!-- Баннер между двумя частями -->
               <slot name="banner" />

               <!-- Вторая половина -->
               <Card v-for="ad in secondHalf" :key="ad.id" v-bind="mapCardProps(ad)" />
            </template>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useFiltersStore } from '~/store/filters';
import list from '../assets/icons/list.svg';
import listNone from '../assets/icons/list-none.svg';
import tile from '../assets/icons/tile.svg';
import tileNone from '../assets/icons/tile-none.svg';

const props = defineProps({
   showTitle: { type: Boolean, default: true },
   adsMain: { type: Array, required: true },
   pageSize: { type: Number, default: 20 },
   title: { type: String, default: 'Свежие объявления' },
   isLoading: { type: Boolean, required: true }
});

const emit = defineEmits(['updateSort']);
const activeIndex = ref(0);
const filtersStore = useFiltersStore();

const sortOptions = [
   { label: 'Сначала свежие', value: 'desc' },
   { label: 'Сначала старые', value: 'asc' },
];

const images = [
   { active: tile, inactive: tileNone, alt: 'Tile' },
   { active: list, inactive: listNone, alt: 'List' }
];

const firstHalf = ref([]);
const secondHalf = ref([]);

watch(() => props.adsMain, (newAdsMain) => {
   if (newAdsMain.length) {
      const midIndex = Math.ceil(newAdsMain.length / 2);
      firstHalf.value = newAdsMain.slice(0, midIndex);
      secondHalf.value = newAdsMain.slice(midIndex);
   }
}, { immediate: true });

const handleSortUpdate = (order_by) => {
   filtersStore.setOrderBy(order_by);
   emit('updateSort');
};

const mapCardProps = (ad) => ({
   id: ad.id,
   description: ad.ads_parameter.ads_description,
   price: ad.ads_parameter.amount,
   place: ad.ads_parameter.place_inspection || 'Адрес не указан',
   callNumber: ad.ads_parameter.phone,
   messageEmail: ad.ads_parameter.email,
   horizontal: activeIndex.value === 1,
   brand: ad.auto_technical_specifications[0].brand.title,
   model: ad.auto_technical_specifications[0].model.title,
   year: ad.auto_technical_specifications[0].year_release.title,
   username: ad.ads_parameter.username,
   is_in_favorites: ad.is_in_favorites,
   images: ad.photos,
   created_at: ad.created_at,
   id_user_owner_ads: ad.id_user_owner_ads
});
</script>

<style scoped lang="scss">
.cards {
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;
   margin-bottom: 40px;

   &__block {
      display: flex;
      gap: 44px;
      justify-content: flex-end;

      @media screen and (max-width: 768px) {
         gap: 24px;
      }
   }

   &__title {
      font-size: 24px;
      font-weight: bold;
      color: #323232;
      margin-top: 0;
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
}

.switcher {
   display: flex;
   box-sizing: content-box;
   background-color: #EEEEEE;
   border-radius: 4px;
   margin-bottom: 26px;
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
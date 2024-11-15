<template>
   <div class="cards">
      <h2 v-if="showTitle" class="cards__title">{{ props.title }}</h2>
      <div v-if="!showTitle" class="cards__block">
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
      <div v-if="adsMain.length < 10"
         :class="['cards__main', { 'cards__main--four': !showTitle, 'cards__main--list': activeIndex === 1 }]">
         <CardSkeleton v-if="loading" v-for="index in 10" :key="index" />
         <Card v-for="ad in filteredAds" :key="ad.id" :id="ad.id" :description="ad.ads_parameter.ads_description"
            :price="ad.ads_parameter.amount" :place="ad.ads_parameter.place_inspection || 'Адрес не указан'"
            :callNumber="ad.ads_parameter.phone" :messageEmail="ad.ads_parameter.email" :horizontal="activeIndex === 1"
            :brand="ad.auto_technical_specifications[0].brand.title"
            :model="ad.auto_technical_specifications[0].model.title"
            :year="ad.auto_technical_specifications[0].year_release.title" :username="ad.ads_parameter.username"
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"
            :id_user_owner_ads="ad.id_user_owner_ads" />
         <slot v-if="adsMain.length > 3" name="banner" />
      </div>
      <div v-else :class="['cards__main', { 'cards__main--four': !showTitle, 'cards__main--list': activeIndex === 1 }]"
         v-auto-animate>
         <CardSkeleton v-if="loading" v-for="index in 10" :key="index" />
         <Card v-for="ad in firstHalf" :id="ad.id" :key="ad.id" :description="ad.ads_parameter.ads_description"
            :price="ad.ads_parameter.amount" :place="ad.ads_parameter.place_inspection || 'Адрес не указан'"
            :callNumber="ad.ads_parameter.phone" :messageEmail="ad.ads_parameter.email" :horizontal="activeIndex === 1"
            :brand="ad.auto_technical_specifications[0].brand.title"
            :model="ad.auto_technical_specifications[0].model.title"
            :year="ad.auto_technical_specifications[0].year_release.title" :username="ad.ads_parameter.username"
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"
            :id_user_owner_ads="ad.id_user_owner_ads" />
         <slot name="banner" />
         <CardSkeleton v-if="loading" v-for="index in 10" :key="index" />
         <Card v-for="ad in secondHalf" :id="ad.id" :key="ad.id" :description="ad.ads_parameter.ads_description"
            :price="ad.ads_parameter.amount" :place="ad.ads_parameter.place_inspection || 'Адрес не указан'"
            :callNumber="ad.ads_parameter.phone" :messageEmail="ad.ads_parameter.email" :horizontal="activeIndex === 1"
            :brand="ad.auto_technical_specifications[0].brand.title"
            :model="ad.auto_technical_specifications[0].model.title"
            :year="ad.auto_technical_specifications[0].year_release.title" :username="ad.ads_parameter.username"
            :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at"
            :id_user_owner_ads="ad.id_user_owner_ads" />
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
import { vAutoAnimate } from '@formkit/auto-animate';

const props = defineProps({
   showTitle: {
      type: Boolean,
      default: true,
   },
   adsMain: {
      type: Array,
      required: true,
   },
   pageSize: {
      type: Number,
   },
   title: {
      type: String,
      default: 'Свежие объявления',
   }
});

const emit = defineEmits(['updateSort']);

const activeIndex = ref(0);

const filtersStore = useFiltersStore();

const loading = ref(true);

watch(() => props.adsMain, (newAds) => {
   loading.value = !newAds.length;
});

const sortOptions = [
   { label: 'Сначала свежие', value: 'desc' },
   { label: 'Сначала старые', value: 'asc' },
];

const images = [
   { active: tile, inactive: tileNone, alt: 'Tile' },
   { active: list, inactive: listNone, alt: 'List' },
];

const filteredAds = computed(() => {
   return props.adsMain.filter(ad => ad.id !== 170);
});

const firstHalf = computed(() => {
   const total = filteredAds.value.length;
   if (total <= props.pageSize / 2) {
      return filteredAds.value.slice(0, Math.ceil(total / 4));
   } else if (total > props.pageSize / 2 && total < props.pageSize) {
      return filteredAds.value.slice(0, Math.ceil(props.pageSize / 2));
   } else {
      return filteredAds.value.slice(0, Math.ceil(total / 2));
   }
});

const secondHalf = computed(() => {
   const total = filteredAds.value.length;
   if (total <= props.pageSize / 2) {
      return filteredAds.value.slice(Math.ceil(total / 4));
   } else if (total > props.pageSize / 2 && total < props.pageSize) {
      return filteredAds.value.slice(Math.ceil(props.pageSize / 2));
   } else {
      return filteredAds.value.slice(Math.ceil(total / 2));
   }
});

const handleSortUpdate = (order_by) => {
   filtersStore.setOrderBy(order_by);
   emit('updateSort');
};
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

      @media screen and (max-width: 1200px) {
         grid-template-columns: repeat(4, 1fr);

         &--four {
            grid-template-columns: repeat(4, 1fr);
         }
      }

      @media screen and (max-width: 1000px) {
         grid-template-columns: repeat(3, 1fr);
         column-gap: 34px;
         row-gap: 40px;

         &--four {
            grid-template-columns: repeat(3, 1fr);
         }
      }

      @media screen and (max-width: 800px) {
         grid-template-columns: repeat(2, 1fr);

         &--four {
            grid-template-columns: repeat(2, 1fr);
         }
      }

      @media screen and (max-width: 500px) {
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
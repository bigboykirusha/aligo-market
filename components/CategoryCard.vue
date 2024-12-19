<template>
   <div class="card">
      <nuxt-link :to="category.href" class="card__cover" :style="{ backgroundImage: 'url(' + category.imgSrc + ')' }"
         @click.native="handleMainClick">
         <div class="card__content">
            <span class="card__title">{{ category.title }}</span>
            <ul class="card__list">
               <li v-for="(subcategory, index) in category.subcategories" :key="index" class="card__list-item"
                  @click.stop="handleSubcategoryClick(subcategory)">
                  <nuxt-link :to="subcategory.href" class="card__list-item-link">
                     {{ subcategory.title }}<span v-if="index === category.subcategories.length - 1"> ...</span>
                  </nuxt-link>
               </li>
            </ul>
         </div>
      </nuxt-link>
   </div>
</template>

<script setup>
import { useFiltersStore } from '../store/filters.js';
const filtersStore = useFiltersStore();

const props = defineProps({
   category: {
      type: Object,
      required: true,
   },
});

const handleMainClick = () => {
   filtersStore.setSelectedCondition(null);
};

const handleSubcategoryClick = (subcategory) => {
   if (subcategory.title === 'Подержанные авто') {
      filtersStore.setSelectedCondition(2);
   } else if (subcategory.title === 'Новые авто') {
      filtersStore.setSelectedCondition(1);
   }
};
</script>

<style scoped lang="scss">
.card {
   display: flex;
   flex-direction: column;
   gap: 15px;
   width: 100%;

   &__cover {
      display: flex;
      justify-content: space-between;
      width: 100%;
      background-color: #d6efff;
      border-radius: 6px;
      padding: 16px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 100% 100%;
      overflow: hidden;
      transition: opacity 0.3s;
      text-decoration: none;
      height: 100px;

      &:hover {
         opacity: 0.7;
      }

      @media (max-width: 991px) {
         flex-direction: column;
         height: 170px;
         background-size: 90%;
      }

      @media (max-width: 600px) {
         flex-direction: column;
         height: 100px;
         padding: 12px 16px;
         background-size: 50%;
      }
   }

   &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      gap: 8px;
      z-index: 1;
   }

   &__title {
      font-weight: 700;
      font-size: 16px;
      color: #3366ff;
      text-decoration: none;

      @media (max-width: 600px) {
         font-size: 14px;
      }
   }

   &__list {
      list-style: none;
      padding: 0;
      margin: 0;
   }

   &__list-item {
      margin-bottom: 4px;
   }

   &__list-item-link {
      font-size: 14px;
      color: #3366ff;
      text-decoration: none;
      border: none;
      transition: opacity 0.3s;

      &:hover {
         opacity: 0.7;
      }
   }
}
</style>

<template>
   <div class="reviews">
      <div class="reviews__title">
         Отзывы
      </div>
      <div class="reviews__switcher">
         <div v-for="(item, index) in switcherItems" :key="index" class="reviews__item"
            :class="{ 'reviews__item--active': selectedItem === item }" @click="handleSwitch(item)">
            {{ item }}
         </div>
         <div class="reviews__indicator" :style="indicatorStyle"></div>
      </div>
      <div class="reviews__content">
         <NotificationCardSkeleton v-if="loading" v-for="index in 3" :key="index" />
         <div v-show="!loading && !reviews.length" class="reviews__placeholder">
            <img src="../assets/icons/reviews-icon.svg" alt="">
            <p class="reviews__placeholder-text">Отзывов пока нет</p>
            <p class="reviews__placeholder-description">
               Здесь будут собираться все отзывы
            </p>
         </div>
         <div class="reviews__container" v-if="!loading && reviews.length">
            <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAboutMeReviews, getLeftToAnotherReviews } from '~/services/apiClient.js';

const reviews = ref([]);
const loading = ref(true);

const switcherItems = ['Обо мне', 'Мои'];
const selectedItem = ref(switcherItems[0]);

const fetchReviews = async (type) => {
   try {
      loading.value = true;
      if (type === 'Обо мне') {
         reviews.value = await getAboutMeReviews();
      } else {
         reviews.value = await getLeftToAnotherReviews();
      }
   } catch (error) {
      console.error('Ошибка при получении отзывов: ', error);
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
   fetchReviews(item);
};

onMounted(() => {
   fetchReviews(selectedItem.value);
});
</script>

<style scoped lang="scss">
.reviews {
   width: 100%;

   ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: auto;
      max-height: calc(100vh - 350px);
      overflow-y: auto;

      @media screen and (max-width: 480px) {
         max-height: calc(100vh - 320px);
      }
   }

   &__title {
      color: #3366ff;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__container {
      display: flex;
      flex-direction: column;
      gap: 16px;
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

   &__placeholder-text {
      font-size: 14px;
      font-weight: 700;
      color: #323232;
   }

   &__placeholder-description {
      font-size: 14px;
      color: #323232;
   }

   &__indicator {
      position: absolute;
      bottom: 0;
      height: 4px;
      background-color: #3366ff;
      transition: left 0.2s ease, width 0.2s ease;
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

      @media (max-width: 768px) {
         padding: 0;
         margin-bottom: 16px;
         height: 34px;
         overflow-x: auto;
         gap: 16px;
         scrollbar-width: none;

         &::-webkit-scrollbar {
            display: none;
         }
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
      height: 100%;

      @media (max-width: 768px) {
         min-width: none;
         padding: 0 16px;
      }

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

      @media (max-width: 768px) {
         display: none;
      }
   }
}
</style>
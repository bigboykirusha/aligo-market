<template>
   <div class="reviews">
      <div class="reviews__title">Отзывы</div>

      <div class="reviews__switcher">
         <div v-for="(item, index) in switcherItems" :key="index" class="reviews__item"
            :class="{ 'reviews__item--active': selectedItem === item }" @click="handleSwitch(item)">
            {{ item }}
         </div>
         <div class="reviews__indicator" :style="indicatorStyle"></div>
      </div>

      <div class="reviews__container">
         <NotificationCardSkeleton v-if="loading" v-for="index in 2" :key="index" />
         <div v-show="!loading && selectedReviews.length === 0" class="reviews__placeholder">
            <img src="../assets/icons/reviews-icon.svg" alt="" />
            <p class="reviews__placeholder-text">Отзывов пока нет</p>
            <p class="reviews__placeholder-description">Здесь будут собираться все отзывы</p>
         </div>
         <ReviewCard v-if="!loading && selectedReviews.length" v-for="review in selectedReviews" :key="review.id"
            :review="review" />
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAboutMeReviews, getLeftToAnotherReviews } from '~/services/apiClient';

const switcherItems = ['Обо мне', 'Мои'];
const ROUTE_MAP = {
   'Обо мне': 'reviews/aboutme',
   'Мои': 'reviews/mine',
};
const ITEM_MAP = Object.fromEntries(
   Object.entries(ROUTE_MAP).map(([key, value]) => [value, key])
);

const route = useRoute();
const selectedItem = ref(switcherItems[0]);
const reviews = ref([]);
const aboutme = ref([]);
const loading = ref(false);
const activeIndex = ref(0);

const fetchFunctions = {
   'Обо мне': getAboutMeReviews,
   'Мои': getLeftToAnotherReviews,
};

const fetchReviews = async () => {
   loading.value = true;
   try {
      if (selectedItem.value === 'Обо мне') {
         aboutme.value = await fetchFunctions['Обо мне']();
      } else {
         reviews.value = await fetchFunctions['Мои']();
      }
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   } finally {
      loading.value = false;
   }
};

const handleSwitch = async (item) => {
   if (selectedItem.value === item) return;

   activeIndex.value = switcherItems.indexOf(item);
   selectedItem.value = item;

   const slug = ROUTE_MAP[item].split('/');
   const url = `/profile/${slug.join('/')}`;
   history.replaceState({ ...history.state, forward: null, back: null }, '', url);
   fetchReviews();
};

const indicatorStyle = computed(() => ({
   width: `${100 / switcherItems.length}%`,
   left: `${(activeIndex.value / switcherItems.length) * 100}%`,
   transition: 'left 0.3s ease',
}));

const selectedReviews = computed(() =>
   selectedItem.value === 'Обо мне' ? aboutme.value : reviews.value
);

const updateSelectedItem = async () => {
   const slug = route.params.slug || [];
   let newItem = switcherItems[0];

   if (slug.length === 2 && slug.join('/') === ROUTE_MAP['Обо мне']) {
      newItem = 'Обо мне';
   } else if (slug.length === 2 && slug.join('/') === ROUTE_MAP['Мои']) {
      newItem = 'Мои';
   }

   activeIndex.value = switcherItems.indexOf(newItem);
   selectedItem.value = newItem;
   fetchReviews();
};

onMounted(updateSelectedItem);
</script>

<style scoped lang="scss">
.reviews {
   width: 100%;
   display: flex;
   flex-direction: column;

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

   &__container {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }
}
</style>

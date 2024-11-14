<template>
   <div v-if="reviews.length" class="review-list">
      <div class="review-list__header">
         <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" placeholder="Все" />
         <div class="review-list__search">
            <img src="../assets/icons/search-blue.svg" alt="Иконка поиска" class="review-list__search-icon" />
            <input type="text" placeholder="Поиск по отзывам..." class="review-list__search-input" />
         </div>
      </div>
      <div class="review-list__cards">
         <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserOtherReviews } from '~/services/apiClient';

const props = defineProps({
   userId: {
      type: String,
      required: true,
   },
});

const reviews = ref([]);

const sortOptions = [
   { label: 'О пользователе', value: 'desc' },
   { label: 'Оставленные пользователем', value: 'asc' },
];

const handleSortUpdate = (order_by) => {
   console.log(order_by);
};


const fetchUserReviews = async () => {
   try {
      const userReviews = await getUserOtherReviews(props.userId);
      reviews.value = userReviews;
   } catch (error) {
      console.error('Ошибка при получении отзывов пользователя:', error);
   }
};

onMounted(() => {
   fetchUserReviews();
});
</script>

<style scoped lang="scss">
.review-list {
   display: flex;
   flex-direction: column;
   gap: 24px;

   &__header {
      display: flex;
      gap: 16px;
   }

   &__search {
      position: relative;
      display: flex;
      align-items: center;
      background-color: #FFFFFF;
      border-radius: 6px;
      height: 34px;
      padding: 0 10px;
      border: 1px solid #d6d6d6;
   }

   &__search-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
   }

   &__search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #323232;

      &::placeholder {
         color: #a0a0a0;
      }
   }

   &__cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }
}
</style>

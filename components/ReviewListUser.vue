<template>
   <div v-if="reviews.length" class="review-list">
      <div v-if="!hideTitle" class="review-list__title">Отзывы пользователя</div>
      <div class="review-list__cards">
         <ReviewCard v-for="review in reviews" :key="review.id" :review="review" :hideOptionsButton="true" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserOtherReviews } from '~/services/apiClient';

const props = defineProps({
   userId: {
      type: Number,
      required: true,
   },
   hideTitle: {
      type: Boolean,
      default: false,
   },
});

const reviews = ref([]);

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

   &__title {
      font-size: 20px;
      line-height: 24px;
      font-weight: bold;
      color: #003BCE;
   }

   &__cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }
}
</style>

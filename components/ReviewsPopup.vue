<template>
   <div class="reviews-popup" v-if="visible">
      <!-- Оверлей для закрытия попапа при клике вне -->
      <div class="reviews-popup__overlay" @click="closePopup"></div>
      <div class="reviews-popup__content">
         <!-- Кнопка закрытия -->
         <button class="reviews-popup__close-button" @click="closePopup">
            <img src="../assets/icons/close.svg" alt="close" />
         </button>

         <!-- Заголовок с разделительной полоской -->
         <div class="reviews-popup__header">
            <div class="reviews-popup__title">
               <span>Отзывы о пользователе</span>
            </div>
            <div class="reviews-popup__border"></div>
         </div>

         <!-- Рейтинг и количество отзывов -->
         <div class="reviews-popup__rating">
            <NuxtRating :rating-value="rating" :rating-count="5" :rating-size="25" :rating-spacing="16"
               :active-color="'#3366FF'" :inactive-color="'#FFFFFF'" :border-color="'#3366FF'" :border-width="2"
               :rounded-corners="true" :read-only="true" />
            <div class="reviews-popup__average-rating">
               <span class="rating-text">Средняя оценка: {{ rating }}</span>
               <span class="rating-average">Всего оценок: {{ count_reviews_about_myself }}</span>
            </div>
         </div>

         <!-- Блок отзывов с прокруткой -->
         <div class="reviews-popup__reviews">
            <ReviewListUser :userId="props.userId" hideTitle />
         </div>
      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   userId: Number,
   visible: Boolean,
   count_reviews_about_myself: Number,
   rating: Number
});

const emit = defineEmits(['update:visible']);

const closePopup = () => {
   emit('update:visible', false);
};
</script>

<style lang="scss" scoped>
.reviews-popup {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
}

.reviews-popup__overlay {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0, 0, 0, 0.5);
}

.reviews-popup__content {
   position: relative;
   background: white;
   padding: 24px 40px;
   border-radius: 8px;
   max-width: 850px;
   max-height: 80vh;
   width: 100%;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
   animation: slide-up 0.3s ease-out;

   @media (max-width: 768px) {
      max-height: calc(100% - 70px);
      margin-bottom: auto;
      border-radius: 0;
      padding: 24px 16px;
   }
}

.reviews-popup__close-button {
   position: absolute;
   top: 10px;
   right: 10px;
   background: none;
   border: none;
   font-size: 18px;
   cursor: pointer;
}

.reviews-popup__close-button img {
   width: 20px;
   height: 20px;
}

.reviews-popup__reviews {
   flex-grow: 1;
   overflow-y: auto;
   padding: 8px;
   margin: -8px;
   margin-top: 16px;
   scrollbar-width: none;
   -ms-overflow-style: none;
}

.reviews-popup__reviews::-webkit-scrollbar {
   display: none;
}

.reviews-popup__header {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
}

.reviews-popup__title {
   font-size: 24px;
   font-weight: bold;
   color: #3366FF;
}

.reviews-popup__border {
   width: 100%;
   height: 1px;
   background-color: #d6d6d6;
   margin-top: 16px;
}

.reviews-popup__rating {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   font-size: 14px;
   margin-top: 16px;
}

.reviews-popup__average-rating {
   display: flex;
   flex-direction: column;
   margin-top: 8px;
   font-size: 14px;
   color: #323232;
}

.reviews-popup__average-rating span {
   margin-right: 12px;
}

.rating-text {
   font-size: 20px;
   font-weight: bold;
   color: #323232;
}

.rating-average {
   margin-top: 4px;
}

@keyframes slide-up {
   from {
      opacity: 0;
      transform: translateY(50%);
   }

   to {
      opacity: 1;
      transform: translateY(0);
   }
}
</style>

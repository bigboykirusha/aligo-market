<template>
   <div id="review-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <form class="modal__form" @submit.prevent="submitResponse">
            <div class="modal__header">
               <h2 class="modal__title">Ответ на отзыв</h2>
            </div>
            <div class="modal__body">
               <textarea v-model="responseText" placeholder="Ваш ответ..." rows="6"></textarea>
            </div>
            <div class="modal__footer">
               <button type="submit" class="modal__button" :disabled="!responseText.trim()">
                  Отправить ответ
               </button>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import closeIcon from '@/assets/icons/close.svg';
import { replyToReview } from '../services/apiClient.js';

const props = defineProps({
   isVisible: Boolean,
   reviewId: Number
});

const emit = defineEmits(['close']);

const responseText = ref('');

const closePopup = () => {
   responseText.value = '';
   emit('close');
};

const submitResponse = async () => {
   if (responseText.value.trim()) {
      try {
         await replyToReview(props.reviewId, responseText.value);
         closePopup();
      } catch (error) {
         console.error('Ошибка при отправке ответа:', error);
      }
   }
};
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 14000;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(3px);
   padding: 32px;
   box-sizing: border-box;

   @media (max-width: 768px) {
      padding: 0;
      align-items: flex-start;
   }

   &__content {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 550px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      padding: 32px;
      box-sizing: border-box;
      animation: slide-up 0.3s ease-out;

      @media (max-width: 768px) {
         border-radius: 0 0 8px 8px;
         padding: 40px;
      }
   }

   &__close-button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.1s ease-in-out;
      width: 16px;
      height: 16px;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;

      @media (max-width: 768px) {
         top: 24px;
         right: 24px;
      }

      img {
         width: 16px;
         height: 16px;
      }
   }

   &__title {
      font-size: 24px;
      line-height: 30px;
      padding-bottom: 24px;
      font-weight: bold;
      color: #3366FF;
      margin: 0;

      @media (max-width: 768px) {
         font-size: 22px;
      }
   }

   &__body {
      padding: 24px 0;
      border-top: 1px solid #eeeeee;
      border-bottom: 1px solid #eeeeee;

      textarea {
         width: 100%;
         padding: 10px;
         height: 140px;
         border: 1px solid #ddd;
         border-radius: 4px;
         font-size: 14px;
         resize: none;

         @media (max-width: 768px) {
            height: 200px;
         }

         &:focus {
            border-color: #3366ff;
            outline: none;
         }
      }
   }

   &__footer {
      padding-top: 24px;
   }

   &__button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: auto;
      width: 200px;
      height: 34px;
      font-size: 14px;
      color: #fff;
      background-color: #3366ff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;

      @media (max-width: 768px) {
         width: 100%;
      }

      &:hover {
         background-color: #0056b3;
      }

      &:disabled {
         background-color: #d3d3d3;
         cursor: not-allowed;
      }
   }
}

@keyframes slide-up {
   from {
      transform: translateY(100%);
   }

   to {
      transform: translateY(0);
   }
}
</style>
<template>
   <div id="review-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <form class="modal__form" @submit.prevent="submitReview">
            <div class="modal__header">
               <h2 class="modal__title">Оценка и комментарий</h2>
            </div>
            <div class="modal__body">
               <div class="rating">
                  <svg v-for="star in 5" :key="star" :class="getStarClass(star)" @click="setRating(star)"
                     @mouseover="hoverRating = star" @mouseleave="hoverRating = 0" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 34 32" fill="none">
                     <path
                        d="M16.7842 25.8744L7.03538 31L8.89765 20.1439L1 12.4563L11.8988 10.8768L16.7732 1L21.6476 10.8768L32.5464 12.4563L24.6487 20.1439L26.511 31L16.7842 25.8744Z"
                        stroke="#3366FF" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </div>
               <textarea v-model="reviewText" placeholder="Ваш отзыв..." rows="6"></textarea>
               <button type="button" class="modal__extra-button" @click="triggerFileInput">
                  <img src="../assets/icons/photo.svg" alt="extra icon" class="modal__extra-icon" />
                  <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" multiple />
                  Добавить фото
               </button>

               <div v-if="uploadedPhotos.length" class="modal__photos">
                  <div class="photos__container">
                     <div v-for="(photo, index) in uploadedPhotos" :key="index" class="photo-wrapper">
                        <img :src="photo" class="uploaded-photo" />
                        <button type="button" class="delete-photo" @click="removePhoto(index)">
                           <img src="../assets/icons/close-white.svg" alt="" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal__footer">
               <button type="submit" class="modal__button" :disabled="!rating || !reviewText.trim()">
                  Оставить комментарий
               </button>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import closeIcon from '@/assets/icons/close.svg';
import { sendReview } from '../services/apiClient.js';

const props = defineProps({
   isVisible: Boolean,
   adsId: Number,
   mainCategoryId: Number
});

const emit = defineEmits(['close']);

const reviewText = ref('');
const rating = ref(0);
const hoverRating = ref(0);
const uploadedPhotos = ref([]);
const selectedFiles = ref([]);

const closePopup = () => {
   reviewText.value = '';
   rating.value = 0;
   hoverRating.value = 0;
   uploadedPhotos.value = [];
   selectedFiles.value = [];
   emit('close');
};

const submitReview = async () => {
   if (rating.value && reviewText.value.trim()) {
      try {
         const response = await sendReview(props.adsId, props.mainCategoryId, rating.value, reviewText.value, selectedFiles.value);
         console.log(response.data);
         closePopup();
      } catch (error) {
         console.error('Ошибка при отправке отзыва:', error);
      }
   }
};

const triggerFileInput = () => {
   if (fileInput.value) {
      fileInput.value.click();
   }
};

const fileInput = ref(null);

const handleFileChange = (event) => {
   const files = Array.from(event.target.files);
   selectedFiles.value.push(...files);

   const newPhotos = files.map(file => URL.createObjectURL(file));
   uploadedPhotos.value.push(...newPhotos);
};

const removePhoto = (index) => {
   uploadedPhotos.value.splice(index, 1);
   selectedFiles.value.splice(index, 1);
};

const setRating = (star) => {
   rating.value = star;
};

const getStarClass = (star) => {
   if (hoverRating.value) {
      return star <= hoverRating.value ? 'rating__star--hover' : '';
   }
   return star <= rating.value ? 'rating__star--filled' : '';
};
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 140000;
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

   &__header,
   &__body {
      padding: 0;
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

      .rating {
         display: flex;
         gap: 16px;
         margin-bottom: 16px;

         svg {
            width: 32px;
            cursor: pointer;

            path {
               fill: #ffffff;
               stroke: #3366FF;
               stroke-width: 1;
               transition: fill 0.2s ease, transform 0.2s ease;
            }

            &.rating__star--filled path {
               fill: #3366FF;
            }

            &.rating__star--hover path {
               fill: #5580FF;
               opacity: 0.8;
            }
         }
      }

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

      .modal__extra-button {
         display: flex;
         align-items: center;
         margin-top: 16px;
         padding: 8px 16px;
         border: none;
         background-color: transparent;
         border-radius: 12px;
         margin-left: -16px;
         cursor: pointer;
         font-size: 14px;
         color: #3366FF;
         transition: $transition-1;

         input[type='file'] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            pointer-events: none;
         }

         &:hover {
            background-color: #D6EFFF;
         }

         .modal__extra-icon {
            height: 14px;
            margin-right: 8px;
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

.modal__photos {
   margin-top: 16px;

   h4 {
      margin-bottom: 8px;
   }

   .photos__container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
   }

   .uploaded-photo {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
   }
}

.photo-wrapper {
   position: relative;

   .delete-photo {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease;

      img {
         width: 10px;
         height: 10px;
      }

      &:hover {
         background-color: rgba(255, 0, 0, 0.8);
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
<template>
   <div v-if="isVisible" class="photo-viewer-overlay" @click.self="closeViewer">
      <div class="photo-viewer-container">
         <button @click="closeViewer" class="close-button"><img src="../assets/icons/close-blue.svg" alt=""></button>
         <div class="main-photo">
            <transition name="fade">
               <img v-if="images.length" :src="getImageUrl(images[currentIndex].path)" alt="Main Image"
                  class="photo-viewer__main-image" />
            </transition>
         </div>

         <div class="thumbnails">
            <button @click="prevImage" class="thumbnail__button thumbnail__button--top"
               :class="{ 'thumbnail__button--disabled': currentIndex === 0 }" :disabled="currentIndex === 0">
               <img src="../assets/icons/down.svg" />
            </button>
            <div class="thumbnail-container">
               <div v-for="(image, index) in images" :key="index"
                  :class="['thumbnail', { 'thumbnail--active': index === currentIndex }]"
                  @click="setActiveImage(index)">
                  <img v-if="image.path" :src="getImageUrl(image.path)" alt="Thumbnail" class="thumbnail__image" />
                  <img v-else src="../assets/icons/placeholder.png" alt="Placeholder Thumbnail"
                     class="thumbnail__image" />
               </div>
            </div>
            <button @click="nextImage" class="thumbnail__button thumbnail__button--bottom"
               :class="{ 'thumbnail__button--disabled': currentIndex === images.length - 1 }"
               :disabled="currentIndex === images.length - 1">
               <img src="../assets/icons/down.svg" />
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getImageUrl } from '../services/imageUtils';

const props = defineProps({
   images: Array,
   activeIndex: Number,
   isVisible: Boolean,
});

const emit = defineEmits(['close']);
const currentIndex = ref(props.activeIndex);

watch(() => props.activeIndex, (newIndex) => {
   currentIndex.value = newIndex;
});

watch(() => props.isVisible, (newVal) => {
   if (newVal) {
      currentIndex.value = props.activeIndex;
   }
});

const closeViewer = () => {
   emit('close');
};

const setActiveImage = (index) => {
   currentIndex.value = index;
};

const prevImage = () => {
   if (currentIndex.value > 0) {
      currentIndex.value--;
   }
};

const nextImage = () => {
   if (currentIndex.value < props.images.length - 1) {
      currentIndex.value++;
   }
};
</script>

<style lang="scss" scoped>
.photo-viewer-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   background: rgba(0, 0, 0, 0.7);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 9999;
}

.photo-viewer-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 16px;
   position: relative;

   .main-photo {
      width: 90vw;
      height: calc(100vh - 150px);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      @media (max-width: 768px) {
         height: 50vh;
      }

      .photo-viewer__main-image {
         width: 100%;
         height: 100%;
         object-fit: cover;
         border-radius: 8px;
         transition: transform 0.4s ease, opacity 0.4s ease;
      }
   }

   .thumbnails {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      width: 100%;
      position: relative;

      .thumbnail-container {
         display: flex;
         gap: 8px;

         .thumbnail {
            width: 90px;
            height: 64px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.3s, transform 0.3s ease;

            &--active {
               opacity: 1;
               border-radius: 6px;
               border: 2px solid #3366ff;
            }

            .thumbnail__image {
               width: 100%;
               height: 100%;
               object-fit: cover;
               border-radius: 4px;
            }
         }
      }
   }

   .thumbnail__button {
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 64px;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #d6d6d6;
      z-index: 1;
      transition: background-color 0.3s;

      &--top {
         top: 0;

         img {
            transform: rotate(90deg);
         }
      }

      &--bottom {
         bottom: 0;

         img {
            transform: rotate(-90deg);
         }
      }

      &:hover {
         background-color: #eef9ff;
      }

      &--disabled {
         cursor: not-allowed;
         opacity: 0.5;
      }
   }

   .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      border: none;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
      transition: color 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 

      &:hover {
         background-color: #EEF9FF;
      }
   }
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.4s ease;
}

.fade-enter,
.fade-leave-to {
   opacity: 0;
   transform: scale(0.95);
}
</style>

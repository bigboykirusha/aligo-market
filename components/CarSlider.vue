<template>
   <div class="gallery-container">
      <div class="main-slide">
         <transition name="fade">
            <img v-if="images.length" :src="getImageUrl(activeImage)"
               alt="Main Slide Image" class="gallery-slider__main-image" />
         </transition>
      </div>

      <div class="thumbnails">
         <button @click="slidePrev" class="thumbnail__button thumbnail__button--top"
            :class="{ 'thumbnail__button--disabled': isPrevDisabled }" :disabled="isPrevDisabled">
            <img src="../assets/icons/down.svg" />
         </button>
         <swiper ref="swiperRef" direction="vertical" :slides-per-view="4" :space-between="16" class="thumbnail-swiper"
            @swiper="onSwiper" @slideChange="updateActiveImage">
            <swiper-slide v-for="(image, index) in images" :key="index"
               :class="['thumbnail', { 'thumbnail--active': image.path === activeImage }]"
               @click="setActiveImage(image.path)">
               <img v-if="image.path" :src="getImageUrl(image.path)" alt="Thumbnail Image"
                  class="thumbnail__image" />
               <img v-else src="../assets/icons/placeholder.png" alt="Placeholder thumbnail"
                  class="thumbnail__image thumbnail__placeholder" />
            </swiper-slide>
         </swiper>
         <button @click="slideNext" class="thumbnail__button thumbnail__button--bottom"
            :class="{ 'thumbnail__button--disabled': isNextDisabled }" :disabled="isNextDisabled">
            <img src="../assets/icons/down.svg" />
         </button>
      </div>
      
      <div class="default-slider">
         <Swiper :modules="[SwiperAutoplay, SwiperPagination]" :slides-per-view="1" :pagination="{ clickable: true }"
            :navigation="false" :loop="true">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <img :src="getImageUrl(image.path)" alt="Slide Image" />
            </SwiperSlide>
            <div class="swiper-pagination"></div>
         </Swiper>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getImageUrl } from '../services/imageUtils'
import 'swiper/swiper-bundle.css';

const props = defineProps({
   images: Array,
});

const activeImage = ref(props.images[0]?.path || '');
const swiperRef = ref(null);
const swiperInstance = ref(null);
const defaultSwiperRef = ref(null);
const defaultSwiperInstance = ref(null);
const isPrevDisabled = ref(true);
const isNextDisabled = ref(false);
const isDefaultSlider = ref(window.innerWidth >= 600);

function slidePrev() {
   if (swiperInstance.value) {
      swiperInstance.value.slidePrev();
   } else {
      console.error('Swiper is not initialized.');
   }
}

function slideNext() {
   if (swiperInstance.value) {
      swiperInstance.value.slideNext();
   } else {
      console.error('Swiper is not initialized.');
   }
}

function setActiveImage(url) {
   activeImage.value = url;
}

function updateActiveImage(swiper) {
   const index = swiper.activeIndex;
   if (props.images[index]) {
      activeImage.value = props.images[index].url;
   }
   updateButtonsState(swiper);
}

function onSwiper(swiper) {
   swiperInstance.value = swiper;
   updateButtonsState(swiper);
}

function updateButtonsState(swiper) {
   isPrevDisabled.value = swiper.activeIndex === 0;
   isNextDisabled.value = swiper.isEnd;
}

function onDefaultSwiper(swiper) {
   defaultSwiperInstance.value = swiper;
}

watch(() => window.innerWidth, (newWidth) => {
   isDefaultSlider.value = newWidth >= 600;
}, { immediate: true });
</script>

<style scoped>
.thumbnail__button--disabled {
   opacity: 0.5;
   cursor: not-allowed;
}
</style>

<style lang="scss" scoped>
.gallery-container {
   display: flex;
   gap: 16px;

   .main-slide {
      flex: 1;
      width: 100%;
      height: 440px;
      display: flex;
      justify-content: center;
      align-items: center;

      .gallery-slider__main-image {
         width: 100%;
         height: 100%;
         border-radius: 6px;
         object-fit: cover;
         transition: transform 0.6s ease, opacity 0.6s ease;
      }
   }

   .thumbnails {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 100px;
      align-items: center;
      position: relative;

      .thumbnail-swiper {
         height: 360px;
         overflow: hidden;
      }

      .thumbnail__button {
         background-color: #ffffff;
         display: flex;
         justify-content: center;
         align-items: center;
         width: 100%;
         color: white;
         height: 32px;
         cursor: pointer;
         border-radius: 6px;
         position: absolute;
         border: 1px solid #d6d6d6;
         z-index: 1;

         &:hover {
            background-color: #eef9ff;
         }

         &--top {
            top: 0;

            img {
               transform: rotate(180deg);
            }
         }

         &--bottom {
            bottom: 0;
         }
      }

      .thumbnail {
         width: 90px;
         height: 60px;
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
            border-radius: 4px;
            object-fit: cover;
         }
      }
   }

   .default-slider {
      display: none;
      width: 100%;
      height: 240px;

      .default-swiper {
         height: 240px;
         width: 100%;
         border-radius: 6px;
      }

      .swiper-slide {
         width: 100%;
         height: 240px;
         object-fit: cover;


         img {
            width: 100%;
            height: 240px;
            object-fit: cover;
            border-radius: none;
            border-radius: 6px;
         }
      }
   }

   @media (max-width: 600px) {
      .thumbnails {
         display: none;
      }

      .main-slide {
         display: none;
      }

      .default-slider {
         display: block;
      }
   }
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
   opacity: 0;
   transform: scale(0.95);
}
</style>

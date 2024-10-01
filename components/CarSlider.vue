<template>
   <PhotoViewer :images="images" :activeIndex="currentIndex" :isVisible="isPhotoViewerVisible"
      @close="closePhotoViewer" />
   <div class="gallery-container">
      <div class="main-slide">
         <transition name="fade">
            <img v-if="images.length" :src="getImageUrl(activeImage)" alt="Main Slide Image" @click="openPhotoViewer"
               class="gallery-slider__main-image" />
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
               <img v-if="image.path" :src="getImageUrl(image.path)" alt="Thumbnail Image" class="thumbnail__image" />
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
               <img :src="getImageUrl(image.path)" alt="Slide Image" @click="openPhotoViewer"/>
            </SwiperSlide>
            <div class="swiper-pagination"></div>
         </Swiper>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getImageUrl } from '../services/imageUtils';
import 'swiper/swiper-bundle.css';

const props = defineProps({
   images: Array,
});

const activeImage = ref(props.images[0]?.path || '');
const swiperRef = ref(null);
const swiperInstance = ref(null);
const isPrevDisabled = ref(true);
const isNextDisabled = ref(false);
const totalImages = ref(props.images.length);
const currentIndex = ref(0);
const isPhotoViewerVisible = ref(false);

function openPhotoViewer() {
   isPhotoViewerVisible.value = true;
}

function closePhotoViewer() {
   isPhotoViewerVisible.value = false;
}

function slidePrev() {
   if (currentIndex.value > 0) {
      currentIndex.value--;
   } else {
      currentIndex.value = totalImages.value - 1;
   }
   updateActiveImage();
}

function slideNext() {
   if (currentIndex.value < totalImages.value - 1) {
      currentIndex.value++;
   } else {
      currentIndex.value = 0;
   }
   updateActiveImage();
}

function setActiveImage(url) {
   activeImage.value = url;
   currentIndex.value = props.images.findIndex((img) => img.path === url);
   scrollToActiveThumbnail();
}

function updateActiveImage() {
   activeImage.value = props.images[currentIndex.value]?.path;
   updateButtonsState();
   scrollToActiveThumbnail();
}

function updateButtonsState() {
   isPrevDisabled.value = currentIndex.value === 0;
   isNextDisabled.value = currentIndex.value === totalImages.value - 1;
}

function scrollToActiveThumbnail() {
   if (swiperInstance.value && swiperRef.value) {
      swiperInstance.value.slideTo(currentIndex.value);
   }
}

function onSwiper(swiper) {
   swiperInstance.value = swiper;
   updateButtonsState();
}
</script>

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
         background-color: #fff;
         display: flex;
         justify-content: center;
         align-items: center;
         width: 100%;
         height: 32px;
         cursor: pointer;
         border-radius: 6px;
         position: absolute;
         border: 1px solid #d6d6d6;
         z-index: 1;
         transition: background-color 0.3s ease;

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

      .swiper-slide img {
         width: 100%;
         height: 240px;
         object-fit: cover;
         border-radius: 6px;
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
   transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter,
.fade-leave-to {
   opacity: 0;
   transform: scale(0.95);
}

.thumbnail__button--disabled {
   opacity: 0.5;
   cursor: not-allowed;
}
</style>
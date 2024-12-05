<template>
   <PhotoViewer :images="images" :activeIndex="currentIndex" :isVisible="isPhotoViewerVisible" :adsId="adsId"
      :userId="userId" @close="closePhotoViewer" />
   <div class="gallery-container" :class="{ 'gallery-container--no-thumbnails': images.length === 1 }">
      <div class="main-slide">
         <div class="clickable-area clickable-area--left" @click="slidePrev"></div>
         <Swiper :slides-per-view="1" :navigation="false" @slideChange="updateActiveImage" :space-between="16"
            @swiper="(swiper) => handleSwiper(swiper, true)">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <div class="main-image-container">
                  <picture>
                     <source :srcset="getImageUrl(image.path_webp)" type="image/webp" />
                     <img :src="getImageUrl(image.path)" alt="Основное изображение" @click="openPhotoViewer"
                        :class="['gallery-slider__main-image']" />
                  </picture>
                  <div class="blurred-background" :style="{
                     backgroundImage: `url(${getImageUrl(image.path)})`,
                     filter: isCover ? 'none' : 'blur(20px)',
                  }"></div>
               </div>
            </SwiperSlide>
         </Swiper>
         <div class="clickable-area clickable-area--right" @click="slideNext"></div>
         <div class="slide-counter">
            {{ currentIndex + 1 }}/{{ images.length }}
         </div>
      </div>

      <!-- Отображаем блок с миниатюрами, если больше одного изображения -->
      <div v-if="images.length > 1" class="thumbnails">
         <button @click="slidePrev" class="thumbnail__button thumbnail__button--top"
            :class="{ 'thumbnail__button--disabled': isPrevDisabled }" :disabled="isPrevDisabled"
            aria-label="Предыдущее изображение">
            <img src="../assets/icons/down.svg" />
         </button>

         <Swiper direction="vertical" :slides-per-view="4" :space-between="16" class="thumbnail-swiper"
            @swiper="(swiper) => handleSwiper(swiper, false)">
            <SwiperSlide v-for="(image, index) in images" :key="image.path"
               :class="['thumbnail', { 'thumbnail--active': index === currentIndex }]" @click="setActiveImage(index)"
               role="button" tabindex="0">
               <picture>
                  <source :srcset="getImageUrl(image.path_webp)" type="image/webp" />
                  <img :src="getImageUrl(image.path)" alt="Миниатюра" class="thumbnail__image" />
               </picture>
            </SwiperSlide>
         </Swiper>

         <button @click="slideNext" class="thumbnail__button thumbnail__button--bottom"
            :class="{ 'thumbnail__button--disabled': isNextDisabled }" :disabled="isNextDisabled"
            aria-label="Следующее изображение">
            <img src="../assets/icons/down.svg" />
         </button>
      </div>
   </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getImageUrl } from '../services/imageUtils';

const props = defineProps({
   images: Array,
   adsId: Number,
   userId: Number,
});

const currentIndex = ref(0);
const isPhotoViewerVisible = ref(false);
const isCover = ref(false);

const swiperInstance = ref(null);
const swiperMainInstance = ref(null);

const isPrevDisabled = computed(() => currentIndex.value === 0);
const isNextDisabled = computed(() => currentIndex.value === props.images.length - 1);

const openPhotoViewer = () => {
   isPhotoViewerVisible.value = true;
};

const closePhotoViewer = () => {
   isPhotoViewerVisible.value = false;
};

const slidePrev = () => {
   swiperMainInstance.value?.slidePrev();
};

const slideNext = () => {
   swiperMainInstance.value?.slideNext();
};

const setActiveImage = (index) => {
   currentIndex.value = index;
   swiperMainInstance.value?.slideTo(currentIndex.value);
   scrollToActiveThumbnail();
};

const updateActiveImage = (swiper) => {
   currentIndex.value = swiper.realIndex;
   scrollToActiveThumbnail();
};

const scrollToActiveThumbnail = () => {
   swiperInstance.value?.slideTo(currentIndex.value);
};

const handleSwiper = (swiper, isMain = false) => {
   if (isMain) {
      swiperMainInstance.value = swiper;
   } else {
      swiperInstance.value = swiper;
   }
};

watch(isPhotoViewerVisible, (newVal) => {
   if (newVal) {
      document.body.style.overflow = 'hidden';
   } else {
      document.body.style.overflow = '';
   }
});
</script>

<style lang="scss" scoped>
.gallery-container {
   display: flex;
   height: 460px;
   max-width: 630px;
   gap: 16px;

   @media (max-width: 1280px) {
      width: calc(100% - 106px);
      max-width: 100%;
   }

   @media (max-width: 600px) {
      width: 100%;
      height: 240px;
   }

   &.gallery-container--no-thumbnails {
      max-width: 739px;
      width: 100%;

      @media (max-width: 1280px) {
         max-width: 100%;
      }

      @media (max-width: 600px) {
         width: 100%;
         height: 240px;
      }
   }

   .main-slide {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .swiper {
         height: 100%;
         overflow: hidden;

         .swiper-slide {
            border-radius: 6px;
            border: 1px solid #d6d6d6;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
         }
      }

      .main-image-container {
         position: relative;
         display: flex;
         justify-content: center;
         width: 100%;
         height: 100%;
         cursor: pointer;
         overflow: hidden;

         .gallery-slider__main-image {
            height: 100%;
            width: 100%;
            margin: 0 auto;
            object-fit: contain;
            transition: transform 0.2s ease, opacity 0.2s ease;
            position: relative;
            z-index: 2;

            &.cover {
               object-fit: cover;
               width: auto;
            }
         }

         .blurred-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            filter: blur(15px);
            z-index: 1;
            opacity: 0.6;
         }
      }

      .clickable-area {
         position: absolute;
         top: 0;
         height: 100%;
         width: 10%;
         cursor: pointer;
         z-index: 3;
      }

      .clickable-area--left {
         left: 0;
      }

      .clickable-area--right {
         right: 0;
      }

      .slide-counter {
         display: none;
         position: absolute;
         bottom: 16px;
         right: 16px;
         background-color: #3366ff;
         color: #fff;
         width: 48px;
         height: 24px;
         border-radius: 12px;
         font-size: 14px;
         line-height: 18px;
         z-index: 4;

         @media (max-width: 600px) {
            display: flex;
            justify-content: center;
            align-items: center;
         }
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
         height: 68px;
         cursor: pointer;
         opacity: 0.8;
         transition: opacity 0.3s, transform 0.3s ease;
         border: 1px solid #d6d6d6;
         border-radius: 6px;

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

   @media (max-width: 600px) {
      .thumbnails {
         display: none;
      }
   }
}

.thumbnail__button--disabled {
   opacity: 0.5;
   cursor: not-allowed;
}
</style>
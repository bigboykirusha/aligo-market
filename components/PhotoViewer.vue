<template>
   <div v-if="isVisible" class="photo-viewer-overlay">
      <div class="wrapper-container" :class="{ 'fullscreen': isFullscreen }" @click.self="closeAndExitFullscreen">
         <div class="gallery-container">
            <div class="main-slide">
               <div class="clickable-area clickable-area--left" @click="slidePrev" :disabled="isPrevDisabled"><img
                     src="..//assets/icons/white-arrow.svg" alt=""></div>

               <!-- Основной слайдер -->
               <Swiper :slides-per-view="1" :navigation="false" @slideChange="updateActiveImage" :space-between="16"
                  @swiper="(swiper) => handleSwiper(swiper, true)" :allowTouchMove="!isZoomed">
                  <SwiperSlide v-for="(image, index) in images" :key="index">
                     <div class="main-image-container" ref="mainImageContainer" @wheel="onWheelZoom"
                        @dblclick="toggleZoom">
                        <picture>
                           <source :srcset="getImageUrl(image.path_webp)" type="image/webp" />
                           <img :src="getImageUrl(image.path)" alt="Основное изображение"
                              class="gallery-slider__main-image"
                              :style="{ transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)' }" />
                        </picture>
                        <div class="blurred-background" :style="{
                           backgroundImage: `url(${getImageUrl(image.path)})`,
                           filter: isCover ? 'none' : 'blur(20px)',
                        }"></div>
                     </div>
                  </SwiperSlide>
               </Swiper>

               <div class="clickable-area clickable-area--right" @click="slideNext" :disabled="isNextDisabled"><img
                     src="..//assets/icons/white-arrow.svg" alt=""></div>

               <!-- Счетчик и кнопки -->
               <div class="slide-counter-actions">
                  <div class="actions">
                     <div class="slide-counter">
                        {{ currentIndex + 1 }}/{{ images.length }}
                     </div>
                     <div class="action-btn" @click="toggleFullscreen">
                        <img :src="isFullscreen ? fullcreenBack : fullcreen" alt="Fullscreen" />
                     </div>
                     <div class="action-btn" @click="toggleZoom">
                        <img :src="isZoomed ? zoomBack : zoom" alt="Zoom" />
                     </div>
                     <div class="close-btn" @click="closeAndExitFullscreen">
                        <img :src="closeWhite" alt="Close" />
                     </div>
                  </div>
               </div>
            </div>

            <div class="thumbnails" v-if="!isFullscreen">
               <div class="thumbnail-list">
                  <Swiper direction="horizontal" :slidesPerView="4" :breakpoints="{
                     768: {
                        slidesPerView: 4,
                     },
                     1024: {
                        slidesPerView: 6,
                     },
                     1025: {
                        slidesPerView: 8,
                     }
                  }" :space-between="16" class="thumbnail-swiper" @swiper="(swiper) => handleSwiper(swiper, false)">
                     <SwiperSlide v-for="(image, index) in images" :key="image.path"
                        :class="['thumbnail', { 'thumbnail--active': index === currentIndex }]"
                        @click="setActiveImage(index)" role="button" tabindex="0">
                        <picture>
                           <source :srcset="getImageUrl(image.path_webp)" type="image/webp" />
                           <img :src="getImageUrl(image.path)" alt="Миниатюра" class="thumbnail__image" />
                        </picture>
                     </SwiperSlide>
                  </Swiper>
               </div>
            </div>
         </div>
         <PhotoInfo v-show="!isFullscreen" :adsId="adsId" :userId="userId" @close-viewer="emit('close')" />
      </div>
   </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getImageUrl } from '../services/imageUtils';
import fullcreenBack from '../assets/icons/fullscreen-back.svg';
import fullcreen from '../assets/icons/fullscreen.svg';
import zoomBack from '../assets/icons/zoom-back.svg';
import zoom from '../assets/icons/zoom.svg';
import closeWhite from '../assets/icons/close-white.svg';

const props = defineProps({
   images: Array,
   activeIndex: Number,
   isVisible: Boolean,
   adsId: Number,
   userId: Number,
});

const emit = defineEmits(['close']);
const currentIndex = ref(props.activeIndex);
const swiperMainInstance = ref(null);
const isCover = ref(false);
const swiperThumbnailInstance = ref(null);
const isZoomed = ref(false);
const zoomLevel = ref(1);
const isFullscreen = ref(false);

const isPrevDisabled = computed(() => currentIndex.value === 0);
const isNextDisabled = computed(() => currentIndex.value === props.images.length - 1);

const slidePrev = () => {
   if (!isPrevDisabled.value) {
      swiperMainInstance.value?.slidePrev();
   }
};

const slideNext = () => {
   if (!isNextDisabled.value) {
      swiperMainInstance.value?.slideNext();
   }
};

const toggleZoom = () => {
   if (zoomLevel.value === 1) {
      zoomLevel.value = 2;
      isZoomed.value = true;
   } else {
      zoomLevel.value = 1;
      isZoomed.value = false;
   }
};

const onWheelZoom = (event) => {
   event.preventDefault();
   const delta = Math.sign(event.deltaY);
   zoomLevel.value = Math.max(1, zoomLevel.value - delta * 0.1);

   isZoomed.value = zoomLevel.value > 1;
};

const toggleFullscreen = () => {
   if (!isFullscreen.value) {
      isFullscreen.value = true;
   } else {
      isFullscreen.value = false;
   }
};

const closeAndExitFullscreen = () => {
   if (isFullscreen.value) {
      isFullscreen.value = false;
   }
   emit('close');
};

const setActiveImage = (index) => {
   currentIndex.value = index;
   swiperMainInstance.value?.slideTo(currentIndex.value);
};

const updateActiveImage = (swiper) => {
   currentIndex.value = swiper.realIndex;
};

const handleSwiper = (swiper, isMain) => {
   if (isMain) {
      swiperMainInstance.value = swiper;
   } else {
      swiperThumbnailInstance.value = swiper;
   }
};

const handleKeydown = (event) => {
   if (event.key === 'Escape') {
      closeAndExitFullscreen();
   } else if (event.key === 'ArrowLeft') {
      slidePrev();
   } else if (event.key === 'ArrowRight') {
      slideNext();
   }
};

onMounted(() => {
   window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
   window.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="scss" scoped>
.wrapper-container {
   display: flex;
   gap: 24px;
   height: 100%;
   width: 100%;
   padding: 56px 72px;
   transition: padding 0.2s ease;

   @media (max-width: 1024px) {
      padding: 48px 40px;
      flex-direction: column;
   }

   @media (max-width: 768px) {
      padding: 48px 16px;
   }

   @media (max-width: 480px) {
      padding: 24px 16px;
   }

   .info-block {
      width: 100%;
      height: 100%;
      background-color: #3366ff;
      border-radius: 6px;
   }

   &.fullscreen {
      padding: 0;
      height: 100vh;

      .info-block {
         opacity: 0;
         transform: translateX(100%);
         transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .gallery-container {
         width: 100%;
         height: 100%;
         transition: width 0.3s ease;
      }

      .thumbnails {
         opacity: 0;
         transform: translateY(100%);
         transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .main-slide {
         height: 100%;

         .clickable-area {
            background-color: #323232;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            width: 72px;
            transition: opacity 0.2s ease;
            cursor: pointer;

            @media (max-width: 768px) {
               width: 42px;
            }

            &:hover {
               opacity: 0.3;
            }

            img {
               display: block;
               height: 16px;
            }

            &--left img {
               transform: rotate(180deg);
            }
         }
      }
   }
}

.gallery-container {
   display: flex;
   flex-direction: column;
   width: calc(100% - 320px);
   height: 100%;
   gap: 16px;
   position: relative;
   transition: width 0.3s ease, height 0.3s ease;

   @media (max-width: 1024px) {
      width: 100%;
      height: calc(100% - 306px);
   }

   @media (max-width: 768px) {
      width: 100%;
      height: calc(100% - 230px);
   }

   .main-slide {
      width: 100%;
      height: calc(100% - 76px);
      position: relative;
      transition: height 0.3s ease;

      .swiper {
         height: 100%;
         overflow: hidden;
         border-radius: 8px;
         transition: height 0.3s ease, border-radius 0.3s ease;
      }

      .main-image-container {
         position: relative;
         display: flex;
         justify-content: center;
         width: 100%;
         background-color: #fff;
         height: 100%;
         overflow: hidden;
         border-radius: 8px;
         transition: height 0.3s ease, border-radius 0.3s ease;

         .gallery-slider__main-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.2s ease, opacity 0.2s ease;
            will-change: transform, opacity;
            position: relative;
            z-index: 2;
         }

         .blurred-background {
            position: absolute;
            background-color: #fff;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            filter: blur(15px);
            z-index: 1;
            transition: filter 0.3s ease;
            will-change: filter;
         }
      }

      .clickable-area {
         position: absolute;
         top: 0;
         height: 100%;
         width: 10%;
         cursor: pointer;
         z-index: 3;

         img {
            display: none;
         }

         &--left {
            left: 0;
         }

         &--right {
            right: 0;
         }
      }

      .slide-counter-actions {
         position: absolute;
         top: 16px;
         left: 16px;
         display: flex;
         justify-content: space-between;
         align-items: center;
         width: 100%;
         z-index: 4;

         .actions {
            display: flex;
            gap: 12px;
            width: calc(100% - 32px);
         }

         .action-btn,
         .close-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #3366ff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;

            &:hover {
               background-color: #144DF8;
            }

            img {
               width: 12px;
               height: 12px;
            }
         }

         .close-btn {
            margin-left: auto;
         }
      }

      .slide-counter {
         background-color: #3366ff;
         color: #fff;
         width: 48px;
         height: 24px;
         border-radius: 12px;
         font-size: 14px;
         display: flex;
         justify-content: center;
         align-items: center;
      }
   }

   .thumbnails {
      display: flex;
      height: 60px;
      justify-content: center;
      align-items: center;
      opacity: 1;
      transition: opacity 0.3s ease, transform 0.3s ease;

      .thumbnail-list {
         display: flex;
         touch-action: pan-x;
         overflow-x: hidden;
         width: 100%;
      }

      .thumbnail {
         max-width: 90px;
         min-width: 90px;
         height: 60px;
         cursor: pointer;
         transition: opacity 0.3s ease, transform 0.3s ease;
         border-radius: 6px;

         &--active {
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
}

.photo-viewer-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.7);
   pointer-events: auto;
   z-index: 100;
}
</style>

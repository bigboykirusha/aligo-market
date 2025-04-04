<template>
   <div v-show="photoViewerStore.isVisible" class="photo-viewer-overlay">
      <div class="wrapper-container" :class="{ 'fullscreen': isFullscreen }" @click.self="closeAndExitFullscreen">
         <div class="gallery-container">
            <div class="main-slide">
               <div class="clickable-area clickable-area--left" @click="slidePrev" :disabled="isPrevDisabled">
                  <img src="../assets/icons/white-arrow.svg" alt="" />
               </div>

               <Swiper :slides-per-view="1" :navigation="false" @slideChange="updateActiveImage" :space-between="16"
                  @swiper="(swiper) => handleSwiper(swiper, true)" :allowTouchMove="!isZoomed">
                  <SwiperSlide v-for="(image, index) in images" :key="index">
                     <div class="main-image-container" ref="mainImageContainer" @wheel="onWheelZoom"
                        @dblclick="toggleZoom">
                        <img draggable="false" @contextmenu.prevent :src="getImageUrl(image.arr_title_size.default)"
                           alt="Основное изображение" class="gallery-slider__main-image"
                           :style="{ transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)' }" />
                        <div class="blurred-background" :style="{
                           backgroundImage: `url(${getImageUrl(image.arr_title_size.preview)})`,
                        }"></div>
                     </div>
                  </SwiperSlide>
               </Swiper>

               <div class="clickable-area clickable-area--right" @click="slideNext" :disabled="isNextDisabled">
                  <img src="../assets/icons/white-arrow.svg" alt="" />
               </div>

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

            <div class="thumbnails" v-if="!isFullscreen && images.length > 0">
               <div class="thumbnail-list">
                  <Swiper direction="horizontal" :slidesPerView="4" :breakpoints="{
                     768: { slidesPerView: 4 },
                     1024: { slidesPerView: 6 },
                     1025: { slidesPerView: 8 }
                  }" :space-between="16" class="thumbnail-swiper" @swiper="(swiper) => handleSwiper(swiper, false)">
                     <SwiperSlide v-for="(image, index) in images" :key="image.arr_title_size.preview"
                        :class="['thumbnail', { 'thumbnail--active': index === currentIndex }]"
                        @click="setActiveImage(index)" role="button" tabindex="0">
                        <img draggable="false" @contextmenu.prevent :src="getImageUrl(image.arr_title_size.preview)"
                           alt="Миниатюра" class="thumbnail__image" />
                     </SwiperSlide>
                  </Swiper>
               </div>
            </div>
         </div>
         <PhotoInfo v-show="!isFullscreen" :adsId="photoViewerStore.adsId" :carData="photoViewerStore.carData"
            :userId="photoViewerStore.userId" @close-viewer="closeAndExitFullscreen" />
      </div>
   </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getImageUrl } from '@/services/imageUtils';
import { usePhotoViewerStore } from '@/store/photoViewerStore';
import fullcreenBack from '@/assets/icons/fullscreen-back.svg';
import fullcreen from '@/assets/icons/fullscreen.svg';
import zoomBack from '@/assets/icons/zoom-back.svg';
import zoom from '@/assets/icons/zoom.svg';
import closeWhite from '@/assets/icons/close-white.svg';

const photoViewerStore = usePhotoViewerStore();

const currentIndex = computed(() => photoViewerStore.activeIndex);
const swiperMainInstance = ref(null);
const swiperThumbnailInstance = ref(null);
const isZoomed = ref(false);
const zoomLevel = ref(1);
const isFullscreen = ref(false);

const images = computed(() => photoViewerStore.images);
const carData = computed(() => photoViewerStore.carData);
const adsId = computed(() => photoViewerStore.adsId);
const userId = computed(() => photoViewerStore.userId);

const isPrevDisabled = computed(() => currentIndex.value === 0);
const isNextDisabled = computed(() => currentIndex.value === images.value.length - 1);

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
   zoomLevel.value = zoomLevel.value === 1 ? 2 : 1;
   isZoomed.value = zoomLevel.value > 1;
};

const onWheelZoom = (event) => {
   if (event.target.closest('input, textarea, select')) return;
   event.preventDefault();
   const delta = Math.sign(event.deltaY);
   zoomLevel.value = Math.max(1, Math.min(3, zoomLevel.value - delta * 0.1));
   isZoomed.value = zoomLevel.value > 1;
};

const toggleFullscreen = () => {
   isFullscreen.value = !isFullscreen.value;
};

const closeAndExitFullscreen = () => {
   if (isFullscreen.value) {
      isFullscreen.value = false;
   }
   photoViewerStore.close();
};

const setActiveImage = (index) => {
   photoViewerStore.activeIndex = index;
   swiperMainInstance.value?.slideTo(index);
};

const updateActiveImage = (swiper) => {
   photoViewerStore.activeIndex = swiper.realIndex;
};

const handleSwiper = (swiper, isMain) => {
   if (isMain) {
      swiperMainInstance.value = swiper;
      if (photoViewerStore.activeIndex !== undefined) {
         swiperMainInstance.value.slideTo(photoViewerStore.activeIndex, 0);
      }
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
      padding: 16px;
      padding-bottom: 0;
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
      height: 100dvh;

      @media (max-width: 768px) {
         height: 100%;
      }

      .info-block {
         opacity: 0;
         transform: translateX(100%);
         transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .gallery-container {
         width: 100%;
         height: 100%;
         transition: width 0.3s ease;
         border-radius: 0;
      }

      .thumbnails {
         opacity: 0;
         transform: translateY(100%);
         transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .main-slide {
         height: 100%;
         border-radius: 0;

         .main-image-container {
            border-radius: 0;
         }

         .swiper {
            border-radius: 0;
         }

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
      height: 100%;
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
   background: rgba(0, 0, 0, 0.6);
   pointer-events: auto;
   z-index: 150;
}
</style>

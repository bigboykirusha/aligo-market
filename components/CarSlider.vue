<template>
   <div v-if="images.length" class="gallery-container"
      :class="{ 'gallery-container--no-thumbnails': images.length === 1 }">
      <div class="main-slide">
         <div class="clickable-area clickable-area--left" @click="slidePrev"></div>
         <Swiper :slides-per-view="1" :navigation="false" @slideChange="updateActiveImage" :space-between="16"
            @swiper="handleMainSwiper">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <div class="main-image-container">
                  <NuxtImg :src="getImageUrl(image.arr_title_size.slider)" alt="Основное изображение"
                     @click="openPhotoViewer" @load="onImageLoad(index)" draggable="false" @contextmenu.prevent class="gallery-slider__main-image"
                     format="webp" />
                  <div class="blurred-background"
                     :style="{ backgroundImage: `url(${getImageUrl(image.arr_title_size.preview)})` }"></div>
               </div>
            </SwiperSlide>
         </Swiper>
         <div class="clickable-area clickable-area--right" @click="slideNext"></div>
         <div class="slide-counter">{{ currentIndex + 1 }}/{{ images.length }}</div>
      </div>

      <div v-show="images.length > 1" class="thumbnails">
         <button @click="slidePrev" class="thumbnail__button thumbnail__button--top"
            :class="{ 'thumbnail__button--disabled': isPrevDisabled }" :disabled="isPrevDisabled">
            <img :src="downicon" />
         </button>

         <Swiper direction="vertical" :slides-per-view="images.length < 5 ? images.length : 5" :space-between="6"
            class="thumbnail-swiper" @swiper="handleThumbnailSwiper">
            <SwiperSlide v-for="(image, index) in images" :key="image.path"
               :class="['thumbnail', { 'thumbnail--active': index === currentIndex }]" @click="setActiveImage(index)">
               <NuxtImg :src="getImageUrl(image.arr_title_size.preview)" draggable="false" @contextmenu.prevent alt="Миниатюра" class="thumbnail__image"
                  @load="onImageLoad(index)" format="webp" width="90" height="68" />
            </SwiperSlide>
         </Swiper>

         <button @click="slideNext" class="thumbnail__button thumbnail__button--bottom"
            :class="{ 'thumbnail__button--disabled': isNextDisabled }" :disabled="isNextDisabled">
            <img :src="downicon" />
         </button>
      </div>
   </div>

   <div class="gallery-container gallery-container--no-thumbnails" v-else>
      <div class="gallery-container__placeholder"></div>
   </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getImageUrl } from '../services/imageUtils';
import downicon from "../assets/icons/down.svg";
import { usePhotoViewerStore } from '~/store/photoViewerStore';

const photoViewerStore = usePhotoViewerStore();

const props = defineProps({
   images: Array,
   adsId: Number,
   userId: Number,
   carData: {
      type: Object,
   },
});

const currentIndex = ref(0);
const isPhotoViewerVisible = computed(() => photoViewerStore.isVisible);
const swiperInstance = ref(null);
const swiperMainInstance = ref(null);

const loadingImages = ref([]);

onMounted(() => {
   loadingImages.value = props.images.map(() => true);
});

const onImageLoad = (index) => {
   loadingImages.value[index] = false;
};

const isPrevDisabled = computed(() => currentIndex.value === 0);
const isNextDisabled = computed(() => currentIndex.value === props.images.length - 1);

const openPhotoViewer = () => {
   photoViewerStore.open(props.images, props.carData, currentIndex.value, props.adsId, props.userId);
};

const slidePrev = () => {
   swiperMainInstance.value?.slidePrev();
};

const slideNext = () => {
   swiperMainInstance.value?.slideNext();
};

const setActiveImage = (index) => {
   if (currentIndex.value !== index) {
      currentIndex.value = index;
      swiperMainInstance.value?.slideTo(currentIndex.value);
   }
};

const updateActiveImage = (swiper) => {
   currentIndex.value = swiper.realIndex;
   swiperInstance.value?.slideTo(currentIndex.value);
};

const handleMainSwiper = (swiper) => {
   swiperMainInstance.value = swiper;
};

const handleThumbnailSwiper = (swiper) => {
   swiperInstance.value = swiper;
};

watch(isPhotoViewerVisible, (newVal) => {
   document.body.style.overflow = newVal ? 'hidden' : '';
});
</script>

<style lang="scss" scoped>
.gallery-container {
   display: flex;
   max-width: 100%;
   max-height: 100%;
   width: 100%;
   height: 100%;
   gap: 16px;

   &__placeholder {
      background-color: #D6EFFF;
      border-radius: 6px;
   }

   .main-slide {
      position: relative;
      border-radius: 6px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      .swiper {
         height: 100%;
         width: 100%;
      }

      .main-image-container {
         position: relative;
         width: 100%;
         height: 100%;
         cursor: pointer;

         .gallery-slider__main-image {
            height: 100%;
            width: 100%;
            object-fit: contain;
            box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
            position: relative;
            z-index: 2;
         }

         .blurred-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            filter: blur(8px);
            background-position: center;
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

         &--left {
            left: 0;
         }

         &--right {
            right: 0;
         }
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
      align-items: center;
      position: relative;
      gap: 6px;
      max-height: calc(100% - 76px);
      height: 100%;

      @media (max-width: 768px) {
         display: none;
      }

      .thumbnail-swiper {
         height: auto;
         max-height: 100%;
      }

      .thumbnail {
         width: 92px;
         max-height: 62px;
         cursor: pointer;
         opacity: 0.8;
         transition: opacity 0.2s ease-in-out;
         border: 1px solid #d6d6d6;
         border-radius: 6px;
         flex-shrink: 0;

         &__button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 34px;
            cursor: pointer;
            border-radius: 6px;
            border: 1px solid #d6d6d6;
            z-index: 1;
            transition: background-color 0.3s ease;

            &--top {
               img {
                  transform: rotate(180deg);
               }
            }

            &:hover {
               background-color: #eef9ff;
            }
         }

         &--active {
            opacity: 1;
            border-radius: 6px;
            border: 2px solid #3366ff;
         }

         .thumbnail__image {
            width: 100%;
            flex-shrink: 0;
            height: 100%;
            border-radius: 4px;
            object-fit: cover;
         }
      }
   }
}

.gallery-slider__loader {
   position: absolute;
   top: 50%;
   left: 50%;
   width: 50px;
   height: 50px;
   transform: translate(-50%, -50%);
   border: 5px solid rgba(255, 255, 255, 0.3);
   border-top-color: #fff;
   border-radius: 50%;
   animation: spin 0.8s linear infinite;
   z-index: 3;
}

@keyframes spin {
   from {
      transform: translate(-50%, -50%) rotate(0deg);
   }

   to {
      transform: translate(-50%, -50%) rotate(360deg);
   }
}
</style>
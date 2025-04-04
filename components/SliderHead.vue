<template>
   <div class="slider__container">
      <div class="swiper__content">
         <div class="swiper__title">
            {{ title }}{{ selectedCityName }} <span class="swiper__count">{{ adsCount }}</span>
         </div>
      </div>
      <Swiper :breakpoints="{
         768: {
            slidesPerView: 3,
            spaceBetween: 16,
         },
         991: {
            slidesPerView: 4,
            spaceBetween: 16,
         },
         1200: {
            slidesPerView: 5,
            spaceBetween: 16,
         },
         1400: {
            slidesPerView: 6,
            spaceBetween: 16,
         }
      }" :spaceBetween="16" slidesPerView="auto" @swiper="onSwiperUpdate">
         <SwiperSlide v-for="item in sliderData" :key="item.id">
            <CardHead :title="item.title" :imageUrl="item.imageUrl" :backgroundColor="item.backgroundColor" />
         </SwiperSlide>
      </Swiper>
   </div>
</template>

<script setup>
import { useCityStore } from '~/store/city';
import { computed } from 'vue'

const cityStore = useCityStore();
const selectedCityName = computed(() => cityStore.selectedCity.name);

const props = defineProps({
   title: {
      type: String,
      required: true
   },
   adsCount: {
      type: Number,
      required: true
   },
   sliderData: {
      type: Array,
      required: true
   }
});

const onSwiperUpdate = () => {
   console.log('Swiper updated');
}
</script>

<style lang="scss" scoped>
.slider__container {
   margin-top: 142px;
   margin-bottom: 40px;
   position: relative;
   overflow: hidden;

   @media (max-width: 768px) {
      margin-top: 134px;
   }
}

.swiper {
   padding: 0 25px;

   &__title {
      color: #003BCE;
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
   }

   &__content {
      display: flex;
      align-items: center;
      margin: 0 auto 24px;
      gap: 10px;
      max-width: 1312px;
      padding: 0 16px;

      @media (max-width: 768px) {
         flex-direction: column;
         align-items: flex-start;
      }
   }

   &__count {
      display: inline-flex;
      align-items: flex-start;
      justify-content: center;
      padding: 4px 10px;
      position: relative;
      top: -5px;
      border-radius: 12px;
      background: #EEF9FF;
      font-weight: 400;
      font-size: 14px;
      color: #3366FF;
   }
}

.swiper-slide {
   @media (max-width: 768px) {
      width: auto !important;
   }
}
</style>

<template>
   <div class="header-row" :class="{
      'header-row--expanded': showDropdown || !isWithMargin,
      'header-row--with-margin': isWithMargin
   }">
      <div class="header-row__container">
         <nuxt-link to="/" class="header-row__logo-section">
            <img src="../assets/images/logo.svg" alt="Logo" class="header-row__logo" />
         </nuxt-link>
         <div class="header-row__controls">
            <div class="header-row__buttons">
               <nuxt-link to="/auto" class="header-row__button">
                  <img :src="carIcon" alt="Автомобили" />
                  <span>Автомобили</span>
               </nuxt-link>
               <nuxt-link to="/parts" class="header-row__button">
                  <img :src="discIcon" alt="Недвижимость" />
                  <span>Автотовары</span>
               </nuxt-link>
               <nuxt-link to="/moto" class="header-row__button">
                  <img :src="motoIcon" alt="Работа" />
                  <span>Мототехника</span>
               </nuxt-link>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import carIcon from '../assets/icons/car.svg';
import discIcon from '../assets/icons/disc.svg';
import motoIcon from '../assets/icons/moto.svg';

const showDropdown = ref(false);
const isWithMargin = ref(true);
const lastScrollTop = ref(0);

const handleScroll = () => {
   const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
   isWithMargin.value = currentScrollTop === 0;
   lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.header-row {
   position: fixed;
   z-index: 16;
   display: flex;
   align-items: center;
   padding: 16px;
   padding-bottom: 0;
   background-color: #fff;
   width: 100%;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   transform: translateY(0);
   transition: transform 0.3s ease;

   @media (max-width: 768px) {
      display: none;
   }

   &--with-margin {
      transform: translateY(44px);
      box-shadow: none;

      @media (max-width: 768px) {
         transform: translateY(0);
      }
   }

   &__container {
      display: flex;
      width: 100%;
      max-width: 1280px;
      justify-content: flex-start;
      padding-bottom: 16px;
      gap: 40px;
      margin: 0 auto;
   }

   &__logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      outline: none;
   }

   &__logo {
      transition: height $transition-1;
      height: 34px;
   }

   &__controls {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 22px;
      line-height: 32px;
      color: #323232;
      width: 100%;
   }

   &__buttons {
      display: flex;
      gap: 24px;
      width: 100%;

      @media (max-width: 820px) {
         gap: 0;
         justify-content: space-between;
      }
   }

   &__button {
      display: flex;
      align-items: center;
      background: none;
      gap: 6px;
      padding: 0 8px;
      font-size: 14px;
      color: #3366FF;
      border: none;
      cursor: pointer;
      transition: $transition-1;

      img {
         height: 14px;
      }

      &:hover {
         background-color: #D6EFFF;
         border-radius: 12px;
      }
   }
}
</style>

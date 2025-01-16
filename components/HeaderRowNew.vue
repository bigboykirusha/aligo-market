<template>
   <div class="header-row" :class="{ 'header-row--with-margin': isWithMargin }">
      <div class="header-row__container">
         <nuxt-link to="/" class="header-row__logo-section">
            <img src="../assets/images/logo.svg" alt="Logo" class="header-row__logo" />
         </nuxt-link>
         <div class="header-row__controls">
            Новое объявление
         </div>
         <Tabs />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isWithMargin = ref(true)
const lastScrollTop = ref(0)

const handleScroll = () => {
   const currentScrollTop = window.scrollY || document.documentElement.scrollTop
   isWithMargin.value = currentScrollTop === 0
   lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop
}

onMounted(() => {
   window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.header-row {
   position: fixed;
   z-index: 8;
   display: flex;
   align-items: center;
   transition: $transition-1;
   padding: 16px;
   background-color: #fff;
   width: 100%;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
   transform: translateY(0);
   transition: transform 0.3s ease;

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
      gap: 24px;
      max-width: 1280px;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin: 0 auto;

      @media (max-width: 768px) {
         gap: 16px;
      }
   }

   &__logo-section {
      display: flex;
      align-items: center;
      outline: none;
   }

   &__logo {
      height: 34px;

      @media (max-width: 991px) {
         height: 20px;
      }

   }

   &__controls {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 22px;
      font-weight: 700;
      color: #323232;

      @media (max-width: 480px) {
         font-size: 20px;
      }
   }
}
</style>
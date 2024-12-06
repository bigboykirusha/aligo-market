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
            Новое объявление
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showDropdown = ref(false)
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
   z-index: 15;
   display: flex;
   align-items: center;
   transition: $transition-1;
   padding: 16px;
   padding-bottom: 0;
   background-color: #fff;
   width: 100%;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);

   @media (max-width: 768px) {
      z-index: 5;
   }

   &--with-margin {
      margin-top: 44px;
      box-shadow: none;

      @media (max-width: 768px) {
         margin-top: 0;
      }

      .header-row__container {
         border-bottom: 1px solid #d6d6d6;
      }
   }

   &__container {
      display: flex;
      width: 100%;
      max-width: 1280px;
      justify-content: flex-start;
      padding-bottom: 16px;
      border-bottom: 1px solid #d6d6d6;
      margin: 0 auto;
   }

   &__logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      outline: none;
      margin-right: 24px;

      @media (max-width: 991px) {
         margin-right: 16px;
         justify-content: center;
         padding-left: 2px;
      }
   }

   &__logo {
      transition: height $transition-1;
      height: 34px;

      @media screen and (max-width: 991px) {
         height: 20px;
      }

   }

   &__controls {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 22px;
      line-height: 32px;
      font-weight: 700;
      color: #323232;

      @media screen and (max-width: 480px) {
         font-size: 20px;
      }
   }
}
</style>
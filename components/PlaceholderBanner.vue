<template>
   <div class="banner" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="banner__content">
         <h1 class="banner__title">{{ title }}</h1>
         <p class="banner__description">{{ description }}</p>
         <button class="banner__button">{{ tg }}</button>
      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   title: String,
   description: String,
   backgroundImage: String,
   tg: String
});
</script>

<style lang="scss" scoped>
.banner {
   position: relative;
   display: flex;
   align-items: center;
   justify-content: flex-start;
   padding: 0 40px;
   max-width: 1280px;
   width: 100%;
   height: 260px;
   margin: 0 auto;
   border-radius: 6px;
   background-size: contain;
   background-repeat: no-repeat;
   background-position: right;
   background-color: #D6EFFF;
   transition: background-position 0.3s ease;

   @media (max-width: 1200px) {
      background-position: 120%;
   }

   @media (max-width: 1100px) {
      background-position: 140%;
   }

   @media (max-width: 1000px) {
      background-position: 160%;
   }

   @media (max-width: 900px) {
      background-position: 240%;
   }

   @media (max-width: 800px) {
      background-position: 280%;
   }

   @media (max-width: 768px) {
      height: 400px;
      padding: 32px;
      align-items: flex-start;
      background-position: center bottom;
   }

   &__content {
      max-width: 550px;
      text-align: left;
   }

   &__title {
      font-size: 28px;
      font-weight: 700;
      color: #003BCE;
      margin-bottom: 16px;
      line-height: 1;

      @media (max-width: 768px) {
         font-size: 24px;
      }
   }

   &__description {
      font-size: 16px;
      color: #003BCE;
      margin-bottom: 26px;

      @media (max-width: 1200px) {
         max-width: 450px;
      }
   }

   &__button {
      font-size: 16px;
      color: #fff;
      background-color: #3366FF;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      cursor: pointer;

      &:hover {
         background-color: #2555cc;
      }
   }
}
</style>
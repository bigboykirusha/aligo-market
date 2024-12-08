<template>
   <div class="banner" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="banner__content">
         <div class="banner__title">{{ title }}</div>
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
   background-position: bottom right;
   background-color: #D6EFFF;
   transition: background-position 0.3s ease;

   @media (max-width: 1024px) {
      background-position: calc(100% + 300px) bottom;
   }

   @media (max-width: 768px) {
      height: 420px;
      padding: 32px 24px;
      align-items: flex-start;
      background-position: right bottom; 
   }

   &__content {
      max-width: 530px;
      padding-right: 24px;
      text-align: left;
   }

   &__title {
      font-size: 32px;
      font-weight: 700;
      color: #003BCE;
      margin-bottom: 16px;

      @media (max-width: 768px) {
         font-size: 24px;
      }
   }

   &__description {
      font-size: 16px;
      color: #003BCE;
      margin-bottom: 24px;

      @media (max-width: 768px) {
         margin-bottom: 16px;
         font-size: 14px;
      }
   }

   &__button {
      font-size: 14px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: #3366FF;
      border: none;
      border-radius: 6px;
      padding: 0 20px;
      cursor: pointer;

      &:hover {
         background-color: #2555cc;
      }
   }
}
</style>
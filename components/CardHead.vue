<template>
   <nuxt-link :to="link" class="cardhead" :style="{ backgroundColor: backgroundColor }">
      <img class="cardhead__icon" src="../assets/icons/search-head.svg">
      <div class="cardhead__title">{{ title }}</div>
      <img :src="imageUrl" class="cardhead__bg-img" />
   </nuxt-link>
</template>

<script setup>
const props = defineProps({
   title: String,
   imageUrl: String,
   backgroundColor: String,
});

const link = '/autos';
</script>

<style lang="scss" scoped>
.cardhead {
   position: relative;
   display: flex;
   align-items: center;
   padding: 16px;
   border-radius: 4px;
   overflow: hidden;
   text-decoration: none;
   width: auto;
   height: 75px;
   transition: opacity 0.3s;

   @media screen and (max-width: 768px) {
      padding: 10px;
      height: 32px;
      width: fit-content;
   }

   &:hover {
      opacity: 0.85;
   }

   &__title {
      position: relative;
      z-index: 1;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.25em;
      max-width: 120px;
      color: #323232;

      @media screen and (max-width: 768px) {
         font-size: 14px;
         max-width: none;
         max-width: fit-content;
         white-space: nowrap;
      }
   }

   &__icon {
      display: none;
      margin-right: 10px;

      @media screen and (max-width: 768px) {
         display: block;
      }
   }

   &__bg-img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      max-width: 100px;
      object-fit: contain;
      object-position: right bottom;

      @media screen and (max-width: 768px) {
         display: none;
      }
   }
}
</style>

<template>
   <div class="banner-1">
      <div class="banner-1__bg">
         <img :src="bannerImage" class="banner-1__bg-img" />
      </div>
   </div>
</template>

<script setup>
import bannerImage from '../assets/images/banner-autos.png';
</script>

<style lang="scss" scoped>
.banner-1 {
   position: relative;
   width: 100%;
   height: 140px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 4px;
   overflow: hidden;
   grid-column: 1 / -1;

   @media screen and (max-width: 600px) {
      padding-top: 22px;
   }

   &__bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
   }

   &__bg-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
   }
}
</style>

<template>
   <div class="banner-1">
      <div class="banner-1__bg">
         <img src="@/assets/images/bg/banner-1.png" alt="Премиальные авто из Эмиратов" class="banner-1__bg-img" />
      </div>
      <div class="banner-1__row">
         <div class="banner-1__col">
            <p class="banner-1__text">
               {{ $t('dubai_banner.headerText') }}
            </p>
            <a href="/?ref=id2" class="button-3 banner-1__link">
               {{ $t('dubai_banner.buttonText') }} >
            </a>
         </div>
      </div>
   </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.banner-1 {
   position: relative;
   width: 100%;
   height: 100px;
   padding: 16px;
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
      background-color: #050721;
   }

   &__bg-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
   }

   &__row {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
   }

   &__col {
      width: 100%;
      max-width: 300px;

      @media screen and (max-width: 600px) {
         max-width: 380px;
      }
   }

   &__text {
      font-weight: 700;
      font-size: 18px;
      line-height: 1.22em;
      color: #fff;
      margin-bottom: 6px;
      max-width: 200px;
      ;

      @media screen and (max-width: 600px) {
         margin-bottom: 2px;
      }
   }

   &__link {
      color: #fff;
      text-decoration: none;
   }
}
</style>

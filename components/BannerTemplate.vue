<template>
   <div class="banner" :class="{ 'banner--moscow': content.isMoscow }">
      <div v-show="false" class="banner__row">
         <div class="banner__col banner__col--empty"></div>
         <div class="banner__col">
            <p class="banner__text" v-html="content.headerText"></p>
            <a href="/?ref=id1" class="banner__button">{{ $t('bannerRent.buttonText') }}</a>
         </div>
      </div>
   </div>
</template>

<script setup>
defineProps({
   content: {
      type: Object,
      required: true,
      default: () => ({
         headerText: '',
         desktopImage: '',
         mobileImage: '',
         altText: '',
         titleText: '',
         isMoscow: Boolean
      })
   }
});
</script>

<style lang="scss" scoped>
.banner {
   position: relative;
   width: 100%;
   height: 300px;
   overflow: hidden;
   max-width: 1280px;
   margin: 0 auto;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   background-color: #D6EFFF;

   &--moscow {
      margin-bottom: 0;

      .banner__text {
         font-weight: 400;
         color: white;
      }

      .banner__row {
         grid-template-columns: 2fr 1fr;

         @media (max-width: 600px) {
            grid-template-columns: 1fr;
         }
      }

      @media (max-width: 600px) {
         height: 500px !important;
      }
   }

   @media (max-width: 600px) {
      height: 260px;
      border-radius: 6px;
   }

   &__bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;

      img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         filter: brightness(80%);
      }

      .banner__bg-img {
         display: block;
      }

      .banner__bg-img--mobile {
         display: none;
      }

      @media (max-width: 600px) {
         .banner__bg-img {
            display: none;
         }

         .banner__bg-img--mobile {
            display: block;
         }
      }
   }

   &__row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      padding: 19px 40px;
      position: relative;
      z-index: 1;
      height: 100%;

      @media (max-width: 1000px) {
         gap: 18px;
      }

      @media (max-width: 600px) {
         grid-template-columns: 1fr;
         padding-top: 1px;
         align-content: baseline;
         margin-top: 16px;
      }
   }

   &__col {
      display: flex;
      flex-direction: column;
      align-self: center;

      @media (max-width: 600px) {
         align-self: start;
      }

      &--empty {
         width: 0;
         height: 0;
      }
   }

   &__text {
      font-weight: 700;
      font-size: 32px;
      line-height: 1em;
      color: #003BCE;
      margin-bottom: 0.69em;
      max-width: 290px;


      @media (max-width: 600px) {
         text-align: center;
         margin-bottom: 0.62em;
      }
   }

   &__button {
      background-color: #3366FF;
      color: $color-block;
      text-decoration: none;
      padding: 9px 10px;
      border-radius: 6px;
      white-space: nowrap;
      width: fit-content;
      display: inline-block;

      @media screen and (max-width: 600px) {
         margin: 0 auto;
      }
   }
}
</style>

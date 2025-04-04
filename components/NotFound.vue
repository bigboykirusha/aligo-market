<template>
   <div class="error">
      <div class="error__404">
         <div class="error__404-left">
            <h1>{{ $t('error.ups') }}</h1>
            <h2>{{ $t('error.error404') }}</h2>
            <p>{{ $t('error.pageNotFound') }}</p>
            <nuxt-link to="/">{{ $t('error.homeLink') }}</nuxt-link>
         </div>
         <div class="error__404-right">
            <img src="@/assets/images/bg/404.png" />
         </div>
      </div>
      <div class="error__blue-bar"></div>
   </div>
</template>

<style scoped lang="scss">
.error {
   max-width: 630px;
   margin: auto;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 30px 40px 70px;
   width: 100%;
   height: 100vh;

   &__404 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      text-align: center;

      @media (max-width: 480px) {
         display: flex;
         flex-direction: column;
         width: 100%;
      }
   }

   &__404-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;
      margin-top: 72px;

      @media (max-width: 991px) {
         margin-top: 49px;
      }

      @media (max-width: 768px) {
         margin-top: 22px;
      }

      @media (max-width: 480px) {
         margin-top: 0;
      }

      h1 {
         font-size: 64px;
         color: #3366ff;
         line-height: 110%;
         margin: 0;
         margin-bottom: 10px;
      }

      h2 {
         font-size: 32px;
         color: #3366ff;
         line-height: 110%;
         margin: 0 0 10px 0;
      }

      p {
         font-size: 14px;
         color: #323232;
         margin: 0 0 25px 0;
      }

      a {
         display: inline-block;
         background-color: #3366ff;
         color: white;
         padding: 10px 20px;
         border-radius: 6px;
         text-decoration: none;
         width: 132px;
         text-align: center;
         transition: $transition-1;

         &:hover {
            background-color: #144DF8;
         }
      }
   }

   &__404-right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 320px;

      @media (max-width: 991px) {
         width: 270px;
      }

      @media (max-width: 768px) {
         width: 230px;
      }

      @media (max-width: 480px) {
         margin: 0 auto;
      }

      img {
         height: 100%;
         width: 100%;
      }
   }

   &__blue-bar {
      height: 16px;
      background-color: #d6efff;
      width: 100%;

      @media screen and (max-width: 991px) {
         width: calc(100% + 100px);
      }

      @media screen and (max-width: 768px) {
         width: calc(100% + 50px);
      }

      @media screen and (max-width: 768px) {
         width: 100%;
      }
   }
}
</style>

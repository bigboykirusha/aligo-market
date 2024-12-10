<template>
   <div class="business">
      <div class="business__block">
         <div class="business__block-right">
            <img class="business__block-right--logo" src="../assets/icons/logo-text.svg" alt="">
            <img src="../assets/icons/send-complite.svg" alt="Картинка" />
         </div>
         <div class="business__block-left">
            <div class="business__block-left--text">Поздравляем! Ваше объявление отправлено на модерацию. <br /><br />
               Следить за объявления можно не только на сайте, но
               и через
               бота в телегаме.</div>
            <div class="telegram">Перейти в Telegram</div>
            <nuxt-link to="/">{{ $t('business.homeLink') }}</nuxt-link>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.business {
   position: absolute;
   width: 100vw;
   background-color: #FFF;
   z-index: 2000;
   height: calc(100vh - 44px);
   top: 44px;

   @media (max-width: 768px) {
      top: 0;
      height: calc(100vh - 70px);
   }

   &__block {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      padding: 40px;
      padding-top: 0;
      height: 100%;

      @media (max-width: 768px) {
         display: flex;
         padding: 24px;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         width: 100%;
      }
   }

   &__block-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;

      &--text {
         font-size: 14px;
         line-height: 18px;
         color: #323232;
         font-weight: 700;
         width: 250px;
         margin-bottom: 26px;
         text-align: left;

         @media (max-width: 768px) {
            width: 100%;
            text-align: center;
         }
      }

      a {
         display: flex;
         align-items: center;
         justify-content: center;
         color: #3366ff;
         text-decoration: none;
         width: 100%;

         @media (max-width: 480px) {
            margin: 0 auto;
         }
      }
   }

   &__block-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 250px;

      @media (max-width: 480px) {
         width: 270px;
      }

      img {
         height: 100%;
         width: 100%;
      }

      &--logo {
         display: none;
         margin-bottom: 24px;
         max-width: 150px;

         @media (max-width: 768px) {
            display: block;
         }
      }
   }

   .telegram {
      background-color: #3366FF;
      color: white;
      width: 100%;
      height: 40px;
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      margin-bottom: 24px;

      @media (max-width: 768px) {
         width: 250px;
         margin: 0 auto;
         margin-bottom: 24px;
      }
   }
}
</style>

<template>
   <div class="business">
      <div class="business__block">
         <div class="business__block-right">
            <img src="../assets/icons/send-complite.svg" alt="Картинка" />
         </div>
         <div class="business__block-left">
            <h2>Поздравляем! Ваше объявление отправлено на модерацию. Следить за объявления можно не только на сайте, но
               и через
               бота в телегаме.</h2>
            <div class="telegram">Перейти в Telegram</div>
            <nuxt-link to="/">{{ $t('business.homeLink') }}</nuxt-link>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.business {
   width: 600px;
   height: 60vh;
   margin: 0 auto;
   margin-top: 300px;

   @media screen and (max-width: 768px) {
      width: 100%;
      height: 85vh;
      margin: 0 auto;
      margin-top: 150px;
   }

   &__block {
      display: flex;
      gap: 40px;
      padding: 40px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;

      @media screen and (max-width: 768px) {
         display: flex;
         flex-direction: column;
         align-items: center;
         width: 100%;
      }
   }

   &__block-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;

      h2 {
         font-size: 14px;
         color: #323232;
         line-height: 18px;
         font-weight: 700;
         width: 250px;
         margin-bottom: 26px;
         text-align: left;
      }

      a {
         display: flex;
         align-items: center;
         justify-content: center;
         color: #3366ff;
         text-decoration: none;
         width: 100%;

         @media screen and (max-width: 480px) {
            margin: 0 auto;
         }
      }
   }

   &__block-right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 215px;

      img {
         height: 100%;
         width: 100%;
      }
   }

   .telegram {
      background-color: #3366FF;
      color: white;
      width: 232px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      margin-bottom: 26px;
   }
}
</style>

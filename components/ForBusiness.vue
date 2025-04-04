<template>
   <div class="business">
      <div class="business__block">
         <div class="business__block-left">
            <h2>Скоро мы расскажем как наш сервис поможет заработать вашему бизнесу больше!</h2>
            <nuxt-link to="/">{{ $t('business.homeLink') }}</nuxt-link>
         </div>
         <div class="business__block-right">
            <img src="../assets/images/bg/for-business.png" alt="Картинка" />
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.business {
   max-width: 750px;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 30px 40px 70px;
   width: 100%;

   @media (max-width: 590px) {
      justify-content: flex-start;
      min-height: 90vh;
   }

   &__block {
      display: grid;
      align-items: center;
      justify-content: center;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      text-align: center;
      height: 80vh;

      @media (max-width: 590px) {
         display: flex;
         flex-direction: column;
         gap: 40px;
         width: 100%;
      }
   }

   &__block-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;

      h2 {
         position: relative;
         font-size: 24px;
         color: #3366ff;
         line-height: 110%;
         margin: 0 0 32px 0;
         text-align: left;

         @media (max-width: 991px) {
            font-size: 20px;
            margin: 0 0 24px 0;
         }

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

   &__block-right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 350px;

      @media (max-width: 991px) {
         width: 280px;
      }

      @media (max-width: 590px) {
         width: 80%;
         margin: 0 auto;
      }

      img {
         margin-top: auto;
         height: 100%;
         width: 100%;
         object-fit: contain;
      }
   }

   &__blue-bar {
      height: 16px;
      background-color: #d6efff;
      width: 100%;

      @media (max-width: 991px) {
         width: calc(100% + 100px);
      }

      @media (max-width: 768px) {
         width: 100%;
      }
   }
}
</style>

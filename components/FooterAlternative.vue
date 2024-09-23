<template>
   <footer class="footer">
      <div class="footer__row">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li><nuxt-link to="/autos">{{ $t('footer.links.rules') }}</nuxt-link></li>
                  <li><nuxt-link to="/autos">{{ $t('footer.links.agreement') }}</nuxt-link></li>
                  <li><nuxt-link to="/autos">{{ $t('footer.links.privacy') }}</nuxt-link></li>
               </ul>
               <div class="footer__text">
                  Аligo corporate co ltd. 2024г. Мы делаем Грузию мобильнее.
               </div>
            </div>
            <nuxt-link to="/" class="footer__logo">
               <img src="../assets/icons/white-logo.svg" alt="Логотип">
            </nuxt-link>
         </div>
      </div>
   </footer>
</template>

<style scoped lang="scss">
.footer {
   &__row {
      background: #3366FF;
   }

   &__container {
      max-width: 1312px;
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      padding: 0 16px;

      @media screen and (max-width: 768px) {
         align-items: flex-start;
      }
   }

   &__logo {
      transition: $transition-1;
      outline: none;
      height: 24px;
      margin: 16px 0;

      @media screen and (max-width: 768px) {
         position: absolute;
         top: 0;
         right: 16px;
         height: 16px;
      }

      img {
         height: 24px;

         @media screen and (max-width: 768px) {
            height: 16px;
         }
      }
   }

   &__bottom {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: 16px 0;

      @media screen and (max-width: 768px) {
         gap: 10px;
      }
   }

   &__links {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 16px;

      @media screen and (max-width: 768px) {
         flex-direction: column;
         align-items: flex-start;
         gap: 8px;
      }

      li a {
         color: $white;
         font-weight: 400;
         font-size: 12px;
         text-decoration: underline;
         transition: $transition-1;
         line-height: 1;
         vertical-align: middle;

         &:hover {
            text-decoration: none;
         }
      }
   }

   &__text {
      font-weight: 400;
      font-size: 10px;
      color: #D6EFFF;
   }
}
</style>

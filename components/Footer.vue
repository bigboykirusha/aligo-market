<template>
   <footer class="footer">
      <div class="footer__row footer__row--1">
         <div class="footer__container">
            <div class="footer__top">
               <ul class="footer__menu">
                  <li><nuxt-link to="/autos">{{ $t('footer.menu.auto') }}</nuxt-link></li>
                  <li><nuxt-link to="/realty">{{ $t('footer.menu.realty') }}</nuxt-link></li>
                  <li><nuxt-link to="/job">{{ $t('footer.menu.job') }}</nuxt-link></li>
                  <li><nuxt-link to="/services">{{ $t('footer.menu.service') }}</nuxt-link></li>
                  <li><nuxt-link to="/goods">{{ $t('footer.menu.product') }}</nuxt-link></li>
               </ul>
               <nuxt-link to="/" class="footer__logo">
                  <img src="../assets/images/logo-white.svg" alt="Логотип">
               </nuxt-link>
            </div>
         </div>
      </div>
      <div class="footer__row footer__row--2">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li><nuxt-link to="/autos">{{ $t('footer.links.rules') }}</nuxt-link></li>
                  <li><nuxt-link to="/autos">{{ $t('footer.links.privacy') }}</nuxt-link></li>
                  <li><nuxt-link to="/autos">{{ $t('footer.links.agreement') }}</nuxt-link></li>
               </ul>
               <span class="footer__copyright">
                  {{ $t('footer.copyright') }}
               </span>
            </div>
         </div>
      </div>
   </footer>
</template>

<style scoped lang="scss">
.footer {
   &__row {
      &--1 {
         background: $main-button;
         padding: 24px 0;
      }

      &--2 {
         background: #003BCE;
         height: 40px;
         display: flex;
         align-items: center;

         @media screen and (max-width: 1000px) {
            height: fit-content;
            padding: 16px 0;
         }
      }
   }

   &__container {
      max-width: 1312px;
      width: 100%;
      margin: 0 auto;
      padding: 0 16px;
   }

   &__logo {
      transition: $transition-1;

      img {
         height: 46px;

         @media screen and (max-width: 1000px) {
            height: 32px;
         }
      }
   }

   &__top,
   &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;

      @media screen and (max-width: 1000px) {
         gap: 24px;
         padding: 0 16px ;
      }
   }

   &__top {
      @media screen and (max-width: 768px) {
         flex-direction: column;
      }

      @media screen and (max-width: 480px) {
         padding: 0;
      }
   }

   &__bottom {
      @media screen and (max-width: 1000px) {
         flex-direction: column;
         gap: 30px;
      }

      @media screen and (max-width: 480px) {
         padding: 20px 0;
      }
   }

   &__menu,
   &__links {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;

      @media screen and (max-width: 1000px) {
         flex-wrap: wrap;
         justify-content: center;
      }
   }

   &__menu {
      gap: 32px;

      @media screen and (max-width: 1000px) {
         gap: 18px;
      }

      li {

         a,
         nuxt-link {
            color: $white;
            text-decoration: none;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            transition: $transition-1;

            &:hover {
               text-decoration: underline;
            }
         }
      }
   }

   &__links {
      gap: 44px;

      @media screen and (max-width: 1000px) {
         justify-content: space-between;
         width: 100%;
         gap: 12px;
      }

      @media screen and (max-width: 620px) {
         flex-direction: column;
         justify-content: center;
         width: 100%;
      }

      li {

         a,
         nuxt-link {
            color: $white;
            font-weight: 400;
            font-size: 14px;
            line-height: 19px;
            text-decoration: none;
            transition: $transition-1;

            &:hover {
               text-decoration: underline;
            }
         }
      }
   }

   &__copyright {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: $white;
      text-align: center;
   }
}
</style>

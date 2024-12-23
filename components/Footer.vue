<template>
   <footer class="footer">
      <div class="footer__row footer__row--1">
         <div class="footer__container">
            <div class="footer__top">
               <ul class="footer__menu">
                  <li><nuxt-link to="/autos">Автомобили</nuxt-link></li>
                  <li><nuxt-link to="/parts">Автотовары</nuxt-link></li>
                  <li><nuxt-link to="/moto">Мототехника</nuxt-link></li>
               </ul>
               <nuxt-link to="/" class="footer__logo">
                  <img src="../assets/images/logo-white.svg" alt="Логотип" />
               </nuxt-link>
            </div>
         </div>
      </div>
      <div class="footer__row footer__row--2">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li><a @click.prevent="downloadDocument(1)">{{ $t('footer.links.rules') }}</a></li>
                  <li><a @click.prevent="downloadDocument(2)">{{ $t('footer.links.privacy') }}</a></li>
                  <li><a @click.prevent="downloadDocument(3)">{{ $t('footer.links.agreement') }}</a></li>
               </ul>
               <span class="footer__copyright">
                  {{ $t('footer.copyright') }}
               </span>
            </div>
         </div>
      </div>
   </footer>
</template>

<script setup>
import { getSiteDocumentById } from '@/services/apiClient';

const downloadDocument = async (id) => {
   try {
      const { success, data } = await getSiteDocumentById(id);

      if (success && data.is_file) {
         const link = document.createElement('a');
         link.href = `https://dev.aligo.pro/${data.path}`;
         link.download = data.title;
         link.click();
      } else {
         console.error('Файл не найден или не является документом.');
      }
   } catch (error) {
      console.error('Ошибка при загрузке документа:', error);
   }
};
</script>

<style scoped lang="scss">
.footer {
   width: 100%;
   background-color: $main-button;
   margin-top: 40px;

   @media (max-width: 768px) {
      margin-bottom: 70px;
   }

   &__row {
      &--1 {
         background: $main-button;
         padding: 16px 0;

         @media (max-width: 768px) {
            padding: 12px 0;
         }
      }

      &--2 {
         background: #003bce;
         padding: 16px 0;
         display: flex;
         align-items: center;

         @media (max-width: 768px) {
            padding: 12px 0;
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
      img {
         height: 46px;
         transition: $transition-1;

         @media (max-width: 768px) {
            height: 30px;
         }
      }
   }

   &__top,
   &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (max-width: 768px) {
         flex-direction: column;
         gap: 12px;
      }
   }

   &__menu,
   &__links {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;

      @media (max-width: 768px) {
         flex-wrap: wrap;
         justify-content: center;
         gap: 12px;
      }
   }

   &__menu {
      gap: 24px;

      @media (max-width: 768px) {
         gap: 16px;
      }

      li {
         cursor: pointer;

         a {
            color: $white;
            font-size: 14px;
            line-height: 18px;
            transition: $transition-1;
            cursor: pointer;

            &:hover {
               text-decoration: underline;
            }
         }
      }
   }

   &__links {
      gap: 24px;

      @media (max-width: 768px) {
         justify-content: center;
         gap: 12px;
      }

      li {

         a,
         nuxt-link {
            color: $white;
            font-size: 12px;
            line-height: 16px;
            text-decoration: underline;
            cursor: pointer;

            &:hover {
               text-decoration: underline;
            }
         }
      }
   }

   &__copyright {
      font-size: 12px;
      line-height: 16px;
      color: $white;
      text-align: center;

      @media (max-width: 768px) {
         margin-top: 8px;
      }
   }
}
</style>
<template>
   <footer class="footer">
      <div class="footer__row footer__row--1">
         <div class="footer__container">
            <div class="footer__top">
               <ul class="footer__menu">
                  <li><nuxt-link to="/auto">Автомобили</nuxt-link></li>
                  <li><nuxt-link to="/parts">Автотовары</nuxt-link></li>
                  <li><nuxt-link to="/moto">Мототехника</nuxt-link></li>
               </ul>
               <nuxt-link to="/" class="footer__logo">
                  <img :src="logoIcon" alt="Логотип" />
               </nuxt-link>
            </div>
         </div>
      </div>
      <div class="footer__row footer__row--2">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li v-for="document in footerDocuments" :key="document.id">
                     <a :href="`https://api.aligo.ru/${document.path}`" :download="document.title">
                        {{ document.title }}
                     </a>
                  </li>
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
import { ref, onMounted } from 'vue';
import { getSiteDocumentById } from '@/services/apiClient';
import logoIcon from "../assets/images/logo-white.svg";

const footerDocuments = ref([]);

const loadFooterDocuments = async () => {
   const cachedDocuments = localStorage.getItem('footerDocuments');
   if (cachedDocuments) {
      footerDocuments.value = JSON.parse(cachedDocuments).slice(0, 3);
      return;
   }

   try {
      const { data } = await getSiteDocumentById();
      localStorage.setItem('footerDocuments', JSON.stringify(data));
      footerDocuments.value = data.slice(0, 3);
   } catch (error) {
      console.error('Ошибка при загрузке документов:', error);
   }
};

onMounted(loadFooterDocuments);
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
            outline: none;
            border: none;
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
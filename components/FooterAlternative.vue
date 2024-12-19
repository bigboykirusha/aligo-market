<template>
   <footer class="footer" v-if="!isCreateAdPage">
      <div class="footer__row">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li><nuxt-link to="/autos">Правила</nuxt-link></li>
                  <li><nuxt-link to="/autos">Соглашение</nuxt-link></li>
                  <li><nuxt-link to="/autos">Конфиденциальность</nuxt-link></li>
               </ul>
               <div class="footer__text">
                  Aligo corporate co ltd. 2024г. Мы делаем Россию мобильнее.
               </div>
            </div>
            <nuxt-link to="/" class="footer__logo">
               <img src="../assets/icons/white-logo.svg" alt="Логотип">
            </nuxt-link>
         </div>
      </div>
   </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isCreateAdPage = ref(false);
const route = useRoute();

isCreateAdPage.value = route.name === 'createAd';
</script>

<style scoped lang="scss">
.footer {
   position: relative;
   width: 100%;
   z-index: 10000;

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

      @media (max-width: 768px) {
         display: none;
         align-items: flex-start;
         padding: 0 12px;
         margin-bottom: 70px;
      }
   }

   &__logo {
      outline: none;
      height: 24px;
      margin: 16px 0;

      @media (max-width: 768px) {
         position: absolute;
         top: 0;
         right: 16px;
         height: 16px;
      }

      img {
         height: 24px;

         @media (max-width: 768px) {
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

      @media (max-width: 768px) {
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

      @media (max-width: 768px) {
         flex-direction: column;
         align-items: flex-start;
         gap: 8px;
      }

      li a {
         color: $white;
         font-weight: 400;
         font-size: 12px;
         text-decoration: underline;
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

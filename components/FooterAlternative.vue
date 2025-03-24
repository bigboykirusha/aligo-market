<template>
   <footer class="footer" v-if="!isCreateAdPage">
      <div class="footer__row">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li v-for="document in footerDocuments" :key="document.id">
                     <a :href="`https://api.aligo.ru/${document.path}`" :download="document.title">
                        {{ document.title }}
                     </a>
                  </li>
               </ul>
               <div class="footer__text">
                  Aligo corporate co ltd. 2025г. Мы делаем Россию мобильнее.
               </div>
            </div>
            <nuxt-link to="/" class="footer__logo">
               <img src="../assets/icons/white-logo.svg" alt="Логотип" />
            </nuxt-link>
         </div>
      </div>
   </footer>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { getSiteDocumentById } from '@/services/apiClient';

const isCreateAdPage = ref(false);
const route = useRoute();
const footerDocuments = ref([]);

watchEffect(() => {
   isCreateAdPage.value = route.path.startsWith('/create');
});

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
         cursor: pointer;
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

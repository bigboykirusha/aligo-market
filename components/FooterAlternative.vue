<template>
   <footer class="footer" v-if="!isCreateAdPage">
      <div class="footer__row">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li><a @click.prevent="downloadDocument(1)">{{ $t('footer.links.rules') }}</a></li>
                  <li><a @click.prevent="downloadDocument(2)">{{ $t('footer.links.agreement') }}</a></li>
                  <li><a @click.prevent="downloadDocument(3)">{{ $t('footer.links.privacy') }}</a></li>
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
import { getSiteDocumentById } from '@/services/apiClient';

const isCreateAdPage = ref(false);
const route = useRoute();

isCreateAdPage.value = route.name === 'createAd';

const downloadDocument = async (id) => {
   try {
      const { success, data } = await getSiteDocumentById(id);

      if (success && data.is_file) {
         const link = document.createElement('a');
         link.href = `${process.env.API_BASE_URL}/${data.path}`;
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

<template>
   <div v-if="showPopup" class="cookie-popup">
      <div class="cookie-popup__content">
         <button class="cookie-popup__close-button" @click="acceptCookies">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <p class="cookie-popup__message">
            Мы используем <span class="cookie-popup__message--underline" @click="downloadCookiePolicy">файлы
               cookie</span>, чтобы сайт был удобней и
            лучше для Вас.
         </p>
         <button class="cookie-popup__button" @click="acceptCookies">Ок, понятно</button>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import closeIcon from '../assets/icons/close-white.svg';
import { getSiteDocumentById } from '@/services/apiClient';

const showPopup = ref(false);

const acceptCookies = () => {
   localStorage.setItem('cookiesAccepted', 'true');
   showPopup.value = false;
};

const downloadCookiePolicy = async () => {
   try {
      const { success, data } = await getSiteDocumentById(4);

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

onMounted(() => {
   if (!localStorage.getItem('cookiesAccepted')) {
      showPopup.value = true;
   }
});
</script>

<style scoped lang="scss">
.cookie-popup {
   position: fixed;
   bottom: 24px;
   right: 24px;
   background-color: #3366FF;
   color: #fff;
   width: 324px;
   border-radius: 6px;
   padding: 24px;
   padding-right: 36px;
   font-size: 14px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   z-index: 100000;

   @media (max-width: 768px) {
      width: calc(100% - 32px);
      bottom: 86px;
      right: 0;
      left: 16px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
   }

   &__message {
      font-weight: 700;

      &--underline {
         text-decoration: underline;
         cursor: pointer;
      }

      margin-bottom: 16px;
   }

   &__close-button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.1s ease-in-out;
      width: 12px;
      height: 12px;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;

      img {
         width: 12px;
         height: 12px;
      }
   }

   &__button {
      background-color: #fff;
      color: #3366FF;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      width: 142px;
      height: 34px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;

      &:hover {
         background-color: #EEF9FF;
      }

      @media (max-width: 768px) {
         color: #fff;
         height: auto;
         background-color: #3366FF;
         text-decoration: underline;
         justify-content: flex-start;

         &:hover {
            background-color: #3366FF;
         }
      }
   }
}
</style>
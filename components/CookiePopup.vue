<template>
   <Transition name="fade-slide">
      <div v-if="showPopup" class="cookie-popup">
         <div class="cookie-popup__content">
            <button class="cookie-popup__close-button" @click="acceptCookies">
               <img :src="closeIcon" alt="Закрыть" />
            </button>
            <p class="cookie-popup__message">
               Мы используем <span class="cookie-popup__message--underline" @click="downloadCookiePolicy">файлы
                  cookie</span>, чтобы сайт был удобнее и лучше для Вас.
            </p>
            <button class="cookie-popup__button" @click="acceptCookies">Ок, понятно</button>
         </div>
      </div>
   </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import closeIcon from '@/assets/icons/close-white.svg';
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
         link.href = `https://api.aligo.ru/${data.path}`;
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
      setTimeout(() => {
         showPopup.value = true;
      }, 500);
   }
});
</script>

<style scoped lang="scss">
.cookie-popup {
   position: fixed;
   bottom: 40px;
   right: 24px;
   background-color: #3366FF;
   color: #fff;
   width: 420px;
   border-radius: 10px;
   padding: 20px;
   padding-right: 36px;
   font-size: 14px;
   box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
   z-index: 1000;
   opacity: 1;
   transform: translateY(20px);
   transition: all 0.3s ease-out;

   @media (max-width: 768px) {
      width: calc(100% - 32px);
      bottom: 106px;
      right: 16px;
      left: 16px;
   }

   &__content {
      display: flex;
      width: 90%;
      flex-direction: column;
      align-items: flex-start;
   }

   &__message {
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.4;

      &--underline {
         text-decoration: underline;
         cursor: pointer;
      }
   }

   &__close-button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      transition: transform 0.2s;

      img {
         width: 14px;
         height: 14px;
      }
   }

   &__button {
      background-color: #fff;
      color: #3366FF;
      border: none;
      width: 150px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background-color 0.3s ease, transform 0.1s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;

      &:active {
         transform: scale(0.95);
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

/* Анимация появления */
.fade-slide-enter-active {
   transition: opacity 0.3s ease, transform 0.3s ease-out;
}

.fade-slide-leave-active {
   transition: opacity 0.3s ease, transform 0.3s ease-in;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
   opacity: 0;
   transform: translateY(20px);
}
</style>

<template>
   <div v-if="showPopup" class="cookie-popup">
      <div class="cookie-popup__content">
         <button class="cookie-popup__close-button" @click="acceptCookies">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <p class="cookie-popup__message">
            Мы используем <span class="cookie-popup__message--underline">файлы cookie</span>, чтобы сайт был удобней и
            лучше для Вас.
         </p>
         <button class="cookie-popup__button" @click="acceptCookies">Ок, понятно</button>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import closeIcon from '../assets/icons/close-white.svg';

const showPopup = ref(false)

const acceptCookies = () => {
   localStorage.setItem('cookiesAccepted', 'true')
   showPopup.value = false
}

onMounted(() => {
   if (!localStorage.getItem('cookiesAccepted')) {
      showPopup.value = true
   }
})
</script>

<style scoped lang="scss">
.cookie-popup {
   position: fixed;
   bottom: 20px;
   right: 20px;
   background-color: #3366FF;
   color: #fff;
   width: 324px;
   border-radius: 6px;
   padding: 24px;
   font-size: 14px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   z-index: 1000;

   &__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
   }

   &__message {
      &--underline {
         text-decoration: underline;
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
      font-weight: 400;
      transition: $transition-1;
   }

   &__button:hover {
      background-color: #EEF9FF;
   }
}
</style>
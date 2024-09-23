<template>
   <div class="modal" v-if="isVisible">
      <div class="modal__content">
         <img class="modal__image" :src="handIcon" alt="hand icon" />

         <h2 class="modal__title">Как вас представить собеседнику?</h2>

         <input v-model="username" placeholder="Введите ваше имя" />

         <div class="modal__footer">
            <button class="modal__button" @click="confirmUsername" :disabled="!username">Начать чат</button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '~/store/user';
import handIcon from '../assets/icons/hand.svg';

const props = defineProps({
   isVisible: Boolean
});

const emit = defineEmits(['close']);

const username = ref('');
const userStore = useUserStore();

function confirmUsername() {
   if (username.value.trim() !== '') {
      userStore.updateUsername(username.value);
      emit('close');
   } else {
      alert('Пожалуйста, введите имя.');
   }
}

function closePopup() {
   emit('close');
}
</script>

<style scoped lang="scss">
.modal {
   position: relative;
   z-index: 14000;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background: #fff;
   padding: 32px;
   box-sizing: border-box;

   @media (max-width: 768px) {
      padding: 0;
      align-items: flex-start;
   }

   &__content {
      background: #fff;
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 350px;
      padding: 32px;
      box-sizing: border-box;

      @media (max-width: 768px) {
         border-radius: 0;
         max-width: 100%;
         padding: 40px;
      }

      input {
         width: 100%;
         height: 34px;
         border-radius: 4px;
         border: 1px solid #D6D6D6;
         font-size: 14px;
         color: #323232;
         padding: 0 10px;
         box-sizing: border-box;
         outline: none;

         &:focus {
            border-color: #3366FF;
         }
      }
   }

   &__image {
      width: 60px;
      height: 60px;
      display: block;
      margin: 0 auto 16px;
   }

   &__title {
      font-size: 16px;
      line-height: 20px;
      padding-bottom: 24px;
      font-weight: 400;
      color: #323232;
      margin: 0;
      text-align: center;

      @media (max-width: 768px) {
         font-size: 22px;
      }
   }

   &__footer {
      padding-top: 40px;
      display: flex;
      justify-content: center;
   }

   &__button {
      padding: 8px 16px;
      border: none;
      width: 180px;
      margin: 0 auto;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease-in;
      color: white;
      background-color: #3366ff;

      &:hover {
         background-color: #0056b3;
      }

      &:disabled {
         background-color: #d3d3d3;
         cursor: not-allowed;
      }
   }
}
</style>
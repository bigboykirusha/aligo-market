<template>
   <div id="report-history-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <div class="modal__header">
            <h2 class="modal__title">История отчётов</h2>
         </div>
         <div class="modal__body">
            <!-- Добавляем текст с инструкцией -->
            <p class="modal__instruction">Выберите версию отчета, к которому хотите вернуться:</p>

            <div v-for="item in reportVersions" :key="item.date" class="report-version">
               <span class="report-version__date">{{ item.date }}</span>
               <button class="report-version__button" @click="openReport(item)">
                  Открыть
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import closeIcon from '@/assets/icons/close.svg';

const props = defineProps({
   isVisible: Boolean,
});

const emit = defineEmits(['close']);

const reportVersions = ref([
   { date: '14.12.2024 | 23:03' },
   { date: '14.12.2023 | 23:03' },
   { date: '14.12.2023 | 23:03' },
]);

const closePopup = () => {
   emit('close');
};

const openReport = (item) => {
   console.log(`Открытие отчёта для версии: ${item.date}`);
};
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 140000;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(3px);
   padding: 32px;
   box-sizing: border-box;

   @media (max-width: 768px) {
      padding: 0;
      align-items: flex-end;
   }

   &__content {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      padding: 32px;
      box-sizing: border-box;
      animation: slide-up 0.2s ease-out;

      @media (max-width: 768px) {
         border-radius: 8px 8px 0 0;
         padding: 24px 16px;
      }
   }

   &__close-button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.1s ease-in-out;
      width: 16px;
      height: 16px;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;

      @media (max-width: 768px) {
         top: 24px;
         right: 24px;
      }

      img {
         width: 16px;
         height: 16px;
      }
   }

   &__title {
      font-size: 24px;
      line-height: 30px;
      padding-bottom: 24px;
      font-weight: bold;
      color: #3366FF;
      margin: 0;

      @media (max-width: 768px) {
         font-size: 22px;
      }
   }

   &__body {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 0;
      border-top: 1px solid #eeeeee;

      @media (max-width: 768px) {
      padding-bottom: 50%;
   }
   }

   &__instruction {
      font-size: 14px;
      color: #323232;
      margin-bottom: 16px;
   }
}

.report-version {
   display: flex;
   justify-content: space-between;
   align-items: center;
   font-size: 14px;

   &__date {
      color: #323232;
   }

   &__button {
      background-color: #fff;
      color: #3366FF;
      border: none;
      cursor: pointer;
      font-size: 14px;

      &:hover {
         text-decoration: underline;
      }
   }
}

@keyframes slide-up {
   from {
      transform: translateY(100%);
   }

   to {
      transform: translateY(0);
   }
}
</style>
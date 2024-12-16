<template>
   <div id="language-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <div class="modal__header">
            <h2 class="modal__title">Перевести на...</h2>
         </div>
         <div class="modal__body">
            <div class="language-text">Выберете язык, на который надо перевести сообщения в чате:</div>
            <div class="language-options">
               <label v-for="(language, index) in languages" :key="index" class="language-option">
                  <input type="radio" name="language" :value="language.code" v-model="selectedLanguage"
                     class="language-option__radio" />
                  <div :class="{ 'language-option__content--selected': selectedLanguage === language.code }"
                     class="language-option__content">
                     <img :src="language.icon" alt="icon" class="language-icon" />
                     {{ language.name }}
                  </div>
               </label>
            </div>
         </div>
         <div class="modal__footer">
            <button @click="confirmLanguage" class="modal__button" :disabled="!selectedLanguage">Перевести</button>
            <button @click="closePopup" class="modal__button modal__button--cancel">Отмена</button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLanguageStore } from '../store/language';
import closeIcon from '@/assets/icons/close.svg';
import ruIcon from '@/assets/icons/ru.svg';
import enIcon from '@/assets/icons/en.png';


const props = defineProps({
   isVisible: Boolean,
   adsId: Number,
});

const emit = defineEmits(['close']);
const languageStore = useLanguageStore();

const selectedLanguage = ref(null);

const languages = [
   { code: 'ru', name: 'Русский', icon: ruIcon },
   { code: 'en', name: 'Английский', icon: enIcon },
];

const closePopup = () => {
   selectedLanguage.value = null;
   emit('close');
};

const selectLanguage = (languageCode) => {
   selectedLanguage.value = languageCode;
};

const confirmLanguage = () => {
   if (selectedLanguage.value) {
      languageStore.setLanguage(selectedLanguage.value);
      emit('language-selected', selectedLanguage.value); 
      closePopup();
   }
};
</script>

<style lang="scss" scoped>
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
      align-items: flex-start;
   }

   &__content {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 360px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      padding: 32px;
      box-sizing: border-box;
      animation: slide-up 0.3s ease-out;

      @media (max-width: 768px) {
         max-width: 100%;
         ;
         border-radius: 0 0 8px 8px;
         padding: 40px;
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

   &__header,
   &__body {
      padding: 0;
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
      padding-top: 0;
      border-bottom: 1px solid #eeeeee;

      .language-options {
         display: flex;
         flex-direction: column;
         gap: 8px;

         .language-option {
            display: flex;
            align-items: center;
            cursor: pointer;
            border-radius: 6px;
            padding: 8px;
            transition: background-color 0.3s;

            &:hover {
               background-color: #D6EFFF;
            }

            &__radio {
               margin-right: 12px;
               cursor: pointer;
            }

            &__content {
               display: flex;
               align-items: center;
               gap: 8px;
               color: #323232;
               font-size: 14px;

               img.language-icon {
                  width: 12px;
                  height: 12px;
               }
            }
         }
      }
   }

   &__footer {
      display: flex;
      gap: 16px;
      padding-top: 24px;
   }

   &__button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: auto;
      width: 200px;
      height: 34px;
      font-size: 14px;
      color: #fff;
      background-color: #3366ff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;

      @media (max-width: 768px) {
         width: 100%;
      }

      &:hover {
         background-color: #0056b3;
      }

      &:disabled {
         background-color: #d3d3d3;
         cursor: not-allowed;
      }
   }
}

.language-text {
   font-size: 14px;
   color: #323232;
   margin-bottom: 24px;
   max-width: 80%;
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
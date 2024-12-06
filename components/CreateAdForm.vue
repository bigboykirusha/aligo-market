<template>
   <div class="create-ad-form">
      <div class="create-ad-form__tabs">
         <div class="create-ad-form__tab" :class="setTabClass(1)" @click="selectTab(1)">
            <img v-if="activeTab > 1" src="../assets/icons/check.svg" alt="" class="create-ad-form__tab-icon" />
            <b v-if="activeTab === 1">1</b>
            <span v-if="activeTab === 1"> • Характеристики</span>
         </div>
         <div class="create-ad-form__arrow" :class="{ 'create-ad-form__arrow--active': activeTab >= 2 }">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 7L1 7" :stroke="activeTab >= 2 ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 1" :stroke="activeTab >= 2 ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 13" :stroke="activeTab >= 2 ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
            </svg>
         </div>
         <div class="create-ad-form__tab" :class="setTabClass(2)" @click="selectTab(2)">
            <img v-if="activeTab > 2" src="../assets/icons/check.svg" alt="" class="create-ad-form__tab-icon" />
            <b v-if="activeTab <= 2">2</b>
            <span v-if="activeTab === 2"> • Опции</span>
         </div>
         <div class="create-ad-form__arrow" :class="{ 'create-ad-form__arrow--active': activeTab >= 3 }">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 7L1 7" :stroke="activeTab >= 3 ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 1" :stroke="activeTab >= 3 ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 13" :stroke="activeTab >= 3 ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
            </svg>
         </div>
         <div class="create-ad-form__tab" :class="setTabClass(3)">
            <b>3</b>
            <span v-if="activeTab === 3"> • Объявление</span>
         </div>
      </div>

      <div class="create-ad-form__content">
         <div v-if="activeTab === 1">
            <Characteristics />
         </div>
         <div v-if="activeTab === 2">
            <Options />
         </div>
         <div v-if="activeTab === 3">
            <Ad />
         </div>
      </div>

      <div class="create-ad-form__actions">
         <div class="create-ad-form__overlay">
            <button class="create-ad-form__button create-ad-form__button--save" @click="saveAndExit">
               Сохранить и выйти
            </button>
            <button v-if="activeTab === 3" class="create-ad-form__button create-ad-form__button--continue"
               @click="publishAndExit" :disabled="!isPublishEnabled">
               Опубликовать
            </button>
            <button v-else class="create-ad-form__button create-ad-form__button--continue" @click="continueToNextTab"
               :disabled="!isNextEnabled">
               Продолжить
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCreateStore } from '../store/create';

const activeTab = ref(1);
const createStore = useCreateStore();

const emit = defineEmits(['sendAd']);

const setTabClass = (tabIndex) => ({
   'create-ad-form__tab--active': activeTab.value === tabIndex,
   'create-ad-form__tab--completed': activeTab.value > tabIndex,
});

const selectTab = (tab) => {
   if (tab < activeTab.value) {
      activeTab.value = tab;
   }
};

const saveAndExit = () => {
   createStore.is_draft = 1;
};

const publishAndExit = () => {
   createStore.is_draft = 0;
   emit('sendAd');
};

const continueToNextTab = () => {
   if (activeTab.value < 3) {
      activeTab.value += 1;
   }
};

const isNextEnabled = computed(() => {
   if (activeTab.value === 1) {
      return createStore.isCharacteristicFieldsFilled;
   }
   return true;
});

const isPublishEnabled = computed(() => {
   if (activeTab.value === 3) {
      return createStore.isAdFieldsFilled;
   }
   return true;
});
</script>

<style lang="scss" scoped>
.create-ad-form {
   display: flex;
   flex-direction: column;
   border: 1px solid #e0e0e0;
   border-radius: 6px;
   margin-top: 134px;
   margin-bottom: 70px;
   width: 100%;

   @media (max-width: 768px) {
      margin-top: 65px;
      margin-bottom: calc(147px - 16px);
      border-radius: 0;
      border: none;
   }

   &__tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 40px;
      background-color: white;
      z-index: 10;

      @media (max-width: 768px) {
         position: sticky;
         height: 65px;
         top: 0;
         padding: 16px 0;
         margin-bottom: 24px;
      }
   }

   &__tab {
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 10px;
      height: 24px;
      border-radius: 12px;
      background-color: #EEEEEE;
      color: #757575;
      font-weight: 400;
      transition: background-color 0.3s, color 0.3s, transform 0.3s;

      @media (max-width: 768px) {
         height: 18px;
      }

      img {
         padding-right: 3px;
      }

      b {
         font-size: 16px;

         @media (max-width: 480px) {
            font-size: 13px;
         }
      }

      span {
         font-size: 16px;
         padding-left: 3px;

         @media (max-width: 360px) {
            font-size: 13px;
         }
      }

      &--active,
      &--completed {
         background-color: #3366ff;
         font-size: 16px;
         color: #ffffff;
      }

      &__tab-icon {
         width: 16px;
         height: 16px;
         margin-right: 8px;
      }
   }

   &__arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #A8A8A8;
      opacity: 0.6;
      transition: color 0.3s, opacity 0.3s;

      &--active {
         color: #3366ff;
         opacity: 1;
      }

      svg {
         width: 16px;
         height: 14px;
         transition: transform 0.3s;
         transform: rotate(0deg);

         path {
            transition: stroke 0.3s;
         }
      }
   }

   &__content {
      margin: 16px 40px;
      width: 100%;

      @media (max-width: 768px) {
         margin: 0;
      }
   }

   &__overlay {
      max-width: 1280px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      gap: 40px;

      @media (max-width: 768px) {
         gap: 16px;
      }
   }

   &__actions {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 70px;
      padding: 0 40px;
      display: flex;
      align-items: center;
      background-color: white;
      border-top: 1px solid #e0e0e0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 100;

      @media (max-width: 768px) {
         flex-direction: row;
         padding: 24px 16px 40px;
         margin-bottom: 70px;
         box-shadow: none;
         padding: 16px;
         border: none;
         background-color: rgba(#EEF9FF, 0.3);
         backdrop-filter: blur(8px);
         border-radius: 24px 24px 0 0;
      }
   }

   &__info {
      font-size: 12px;
      width: 310px;
   }

   &__button {
      padding: 9px 16px;
      height: 36px;
      width: 50%;
      white-space: nowrap;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

      &--continue {
         background-color: #3366FF;
         color: #ffffff;

         &:hover {
            background-color: darken(#3366FF, 10%);
         }

         &:disabled {
            background-color: #EEEEEE;
            color: #757575;
            cursor: not-allowed;
            box-shadow: none;
         }
      }

      &--save {
         background-color: #D6EFFF;
         color: #3366FF;

         &:hover {
            background-color: lighten(#D6EFFF, 1%);
         }
      }
   }
}
</style>

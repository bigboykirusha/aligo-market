<template>
   <div class="create-ad-form">
      <div class="create-ad-form__tabs">
         <div class="create-ad-form__tab" :class="{
            'create-ad-form__tab--active': activeTab === 1,
            'create-ad-form__tab--completed': activeTab > 1
         }" @click="selectTab(1)" :style="{ cursor: activeTab > 1 ? 'pointer' : 'default' }">
            <img v-if="activeTab > 1 && isMobile" src="../assets/icons/check.svg" alt=""
               class="create-ad-form__tab-icon" />
            <b v-if="!isMobile || activeTab === 1">1</b>
            <span v-if="!isMobile || activeTab === 1"> • Характеристики</span>
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
         <div class="create-ad-form__tab" :class="{
            'create-ad-form__tab--active': activeTab === 2,
            'create-ad-form__tab--completed': activeTab > 2
         }" @click="selectTab(2)" :style="{ cursor: activeTab > 2 ? 'pointer' : 'default' }">
            <img v-if="activeTab > 2 && isMobile" src="../assets/icons/check.svg" alt=""
               class="create-ad-form__tab-icon" />
            <b v-if="!isMobile || activeTab <= 2">2</b>
            <span v-if="!isMobile || activeTab == 2"> • Опции</span>
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
         <div class="create-ad-form__tab" :class="{
            'create-ad-form__tab--active': activeTab === 3
         }">
            <b>3</b>
            <span v-if="!isMobile || activeTab === 3"> • Объявление</span>
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
         <nuxt-link to="/">
            <button class="create-ad-form__button create-ad-form__button--save" @click="saveAndExit">
               Сохранить и выйти
            </button>
         </nuxt-link>
         <div v-if="activeTab === 3">
            <button class="create-ad-form__button create-ad-form__button--continue" @click="publishAndExit"
               :disabled="!isPublishEnabled">
               Разместить объявление
            </button>
            <div class="create-ad-form__info">Вы публикуете объявление и данные в нём, чтобы их мог посмотреть кто
               угодно в интернете. Вы также
               соглашаетесь <span class="rules">правилами</span>.</div>
         </div>
         <button v-else class="create-ad-form__button create-ad-form__button--continue" @click="continueToNextTab"
            :disabled="!isNextEnabled">
            Продолжить
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCreateStore } from '../store/create';

const activeTab = ref(1);
const createStore = useCreateStore();

const emit = defineEmits(['sendAd']);

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

const isMobile = ref(false);

if (typeof window !== 'undefined') {
   const handleResize = () => {
      isMobile.value = window.innerWidth <= 768;
   };

   window.addEventListener('resize', handleResize);
   handleResize();
}
</script>

<style lang="scss" scoped>
.create-ad-form {
   display: flex;
   flex-direction: column;
   border: 1px solid #e0e0e0;
   border-radius: 6px;
   margin-top: 16px;

   &__tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 40px;

      @media screen and (max-width: 768px) {
         padding: 16px;
      }
   }

   &__tab {
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 10px;
      border-radius: 12px;
      background-color: #EEEEEE;
      color: #757575;
      font-weight: 400;
      transition: background-color 0.3s, color 0.3s, transform 0.3s;

      @media screen and (max-width: 768px) {
         height: 26px;
      }

      b,
      img {
         padding-right: 3px;
      }

      b {
         font-size: 16px;

         @media screen and (max-width: 360px) {
            font-size: 12px;
         }
      }

      span {
         font-size: 16px;

         @media screen and (max-width: 360px) {
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
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      border-radius: 6px;
      background-color: #ffffff;
      padding: 40px;

      @media screen and (max-width: 768px) {
         padding: 40px 16px;
      }
   }

   &__actions {
      display: flex;
      justify-content: flex-start;
      gap: 40px;
      padding: 24px 40px 40px;

      @media screen and (max-width: 768px) {
         flex-direction: column;
         gap: 24px;
         padding: 24px 16px 40px;
      }
   }

   &__info {
      padding-top: 8px;
      font-size: 12px;
      width: 310px;
   }

   &__button {
      padding: 9px 0;
      width: 232px;
      height: 40px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;

      @media screen and (max-width: 768px) {
         width: 100%;
      }

      &:hover {
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

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

.rules {
   color: #3366FF;

   &:hover {
      text-decoration: underline;
      cursor: pointer;
   }
}
</style>

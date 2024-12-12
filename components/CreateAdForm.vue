<template>
   <div class="create-ad-form">
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
            <button :disabled="!isSaveandExitEnabled" class="create-ad-form__button create-ad-form__button--save"
               @click="saveAndExit">
               Сохранить и выйти
            </button>
            <button v-if="activeTab === 3" class="create-ad-form__button create-ad-form__button--continue"
               @click="publishAndExit" :disabled="!isPublishEnabled">
               Опубликовать
            </button>
            <button v-else class="create-ad-form__button create-ad-form__button--continue" @click="continueToNextTab">
               Продолжить
            </button>
            <div v-if="activeTab === 3" class="create-ad-form__text">Вы также соглашаетесь с <span>правилами
                  Aligo</span> и публикуете
               информацию, которую увидят другие люди</div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { useCreateStore } from '../store/create';
import { useTabsStore } from '~/store/tabsStore';

const createStore = useCreateStore();
const tabsStore = useTabsStore();

const emit = defineEmits(['sendAd', 'saveAd']);

const activeTab = computed(() => tabsStore.activeTab);

const saveAndExit = () => {
   createStore.setIsDraft(1);
   emit('saveAd');
};

const publishAndExit = () => {
   createStore.setIsDraft(0);
   emit('sendAd');
};

const continueToNextTab = () => {
   if (isNextEnabled.value) {
      if (activeTab.value < 3) {
         tabsStore.setActiveTab(activeTab.value + 1);
      }
   } else {
      alert('Заполните обязательные поля!');
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

const isSaveandExitEnabled = computed(() => {
   return createStore.isAnyFieldFilled;
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
      margin-top: calc(101px + 16px);
      margin-bottom: calc(147px - 16px);
      border-radius: 0;
      border: none;
   }

   &__content {
      margin: 40px;
      width: 100%;

      @media (max-width: 768px) {
         margin: 0;
      }
   }

   &__overlay {
      max-width: 1280px;
      margin: 0 16px;
      width: 100%;
      display: flex;
      gap: 24px;

      @media (max-width: 768px) {
         gap: 16px;
         margin: 0;
         flex-wrap: wrap;
         justify-content: center;
      }
   }

   &__actions {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
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

   &__text {
      color: #787878;
      font-size: 12px;
      line-height: 16px;
      max-width: 400px;
      text-align: center;

      @media (max-width: 768px) {
         max-width: 100%;
      }

      span {
         color: #3366FF;
         cursor: pointer;
         text-decoration: underline;
      }
   }

   &__button {
      padding: 9px 16px;
      height: 36px;
      width: calc(50% - 8px);
      white-space: nowrap;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
      max-width: 200px;

      &--continue {
         background-color: #3366FF;
         color: #ffffff;
         transition: background-color 0.2s ease;

         &:hover {
            background-color: #144DF8;
         }

         &:disabled {
            background-color: #EEEEEE;
            color: #787878;
            cursor: not-allowed;
            box-shadow: none;
         }
      }

      &--save {
         background-color: #D6EFFF;
         color: #3366FF;

         transition: background-color 0.2s ease;

         &:hover {
            background-color: #A4DCFF;
         }

         &:disabled {
            background-color: #EEEEEE;
            color: #787878;
            cursor: not-allowed;
            box-shadow: none;
         }
      }
   }
}
</style>
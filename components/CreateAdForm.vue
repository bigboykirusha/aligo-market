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
               :class="{ 'disabled': props.isPublishing }" @click="saveAndExit">
               <span v-if="props.isSaving" class="spinner"></span>
               <span v-else>Сохранить и выйти</span>
            </button>

            <button v-if="activeTab === 3" class="create-ad-form__button create-ad-form__button--continue"
               :class="{ 'disabled': props.isSaving }" @click="publishAndExit" :disabled="!isPublishEnabled">
               <span v-if="props.isPublishing" class="spinner"></span>
               <span v-else>Опубликовать</span>
            </button>
            <button v-else class="create-ad-form__button create-ad-form__button--continue" @click="continueToNextTab">
               Продолжить
            </button>
            <div v-if="activeTab === 3" class="create-ad-form__text">
               Вы также соглашаетесь с <a :href="rulesLink" :download="rulesTitle">{{ rulesTitle }}</a> и публикуете
               информацию,
               которую увидят другие люди
            </div>
         </div>
      </div>
      <CodeModal v-if="showCodeModal" @confirmed="handleCodeConfirmed" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCreateStore } from '../store/create';
import { useTabsStore } from '~/store/tabsStore';
import { useUserStore } from '~/store/user';
import { getSiteDocumentById } from '@/services/apiClient';
import { usePopupErrorStore } from '~/store/popupErrorStore';

const createStore = useCreateStore();
const tabsStore = useTabsStore();
const userStore = useUserStore();
const popupErrorStore = usePopupErrorStore();

const showCodeModal = ref(false);
const rulesLink = ref('');
const rulesTitle = ref('');

const props = defineProps({
   isPublishing: {
      type: Boolean,
      default: false
   },
   isSaving: {
      type: Boolean,
      default: false
   }
});

const emit = defineEmits(['sendAd', 'saveAd']);

const isConfirmed = computed(() => {
   return !userStore.unconfirmed_email && !!userStore.email;
});

const activeTab = computed(() => tabsStore.activeTab);

const loadRulesDocument = async () => {
   try {
      const { data } = await getSiteDocumentById(2);
      if (data) {
         rulesLink.value = `https://api.aligo.ru/${data.path}`;
         rulesTitle.value = data.title;
      }
   } catch (error) {
      console.error('Ошибка при загрузке документа с правилами:', error);
   }
};

const saveAndExit = () => {
   if (!props.isPublishing && !props.isSaving) {
      emit('saveAd');
   }
};

const publishAndExit = async () => {
   if (!props.isPublishing && !props.isSaving) {

      if (!userStore.username && createStore.username) {
         await userStore.updateProfile({ username: createStore.username });
      }

      if (!userStore.address && createStore.place_inspection) {
         await userStore.updateProfile({ address: createStore.address });
      }

      if (userStore.unconfirmed_email) {
         if (!isConfirmed.value) {
            await userStore.updateProfile({ email: createStore.email });
            showCodeModal.value = true;
         }
      } else {
         emit('sendAd');
      }
   }
};

const handleCodeConfirmed = async () => {
   showCodeModal.value = false;
   emit('sendAd');
};

const continueToNextTab = () => {
   if (isNextEnabled.value) {
      if (activeTab.value < 3) {
         tabsStore.setActiveTab(activeTab.value + 1);
      }
   } else {
      popupErrorStore.showError('Пожалуйста, заполните обязательные поля!');
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

onMounted(() => {
   loadRulesDocument();
});
</script>


<style lang="scss" scoped>
.create-ad-form {
   display: flex;
   flex-direction: column;
   border-radius: 6px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   margin-top: 134px;
   margin-bottom: 70px;
   width: 100%;

   @media (max-width: 768px) {
      margin-top: calc(101px + 16px);
      margin-bottom: calc(82px - 16px);
      border-radius: 0;
      box-shadow: none;
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
      z-index: 100000;

      @media (max-width: 768px) {
         flex-direction: row;
         padding: 24px 16px 40px;
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

      @media (max-width: 768px) {
         max-width: 100%;
         text-align: center;
      }

      a {
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

      &.disabled {
         background-color: #EEEEEE !important;
         color: #787878 !important;
         cursor: not-allowed;
         box-shadow: none;
      }
   }
}

.spinner {
   display: inline-block;
   width: 16px;
   height: 16px;
   border: 2px solid #fff;
   border-top: 2px solid #3366FF;
   border-radius: 50%;
   animation: spin 0.6s linear infinite;
}

@keyframes spin {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
</style>

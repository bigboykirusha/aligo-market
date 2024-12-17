<template>
   <div id="block-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <form class="modal__form" @submit.prevent="submitBlock">
            <div class="modal__header">
               <h2 class="modal__title">Блокировать пользователя «{{ chatStore.currentChat.for_user.id ===
                  userStore.userId ? chatStore.currentChat.from_user.username : chatStore.currentChat.for_user.username
                  }}»</h2>
               <p class="modal__description">
                  Пользователь не сможет отправлять вам сообщения и оставлять комментарии. Укажите причину блокировки:
               </p>
            </div>
            <div class="modal__body">
               <label class="modal__checkbox">
                  <input type="checkbox" :checked="blockReasons.includes('insults_profanity')"
                     @change="toggleReason('insults_profanity')" />
                  <span>Оскорбления и ненормативная лексика</span>
               </label>
               <label class="modal__checkbox">
                  <input type="checkbox" :checked="blockReasons.includes('threat_of_violence')"
                     @change="toggleReason('threat_of_violence')" />
                  <span>Угроза насилием</span>
               </label>
               <label class="modal__checkbox">
                  <input type="checkbox" :checked="blockReasons.includes('suspicion_of_fraud')"
                     @change="toggleReason('suspicion_of_fraud')" />
                  <span>Подозрение в мошенничестве и нарушении законов</span>
               </label>
               <label class="modal__checkbox">
                  <input type="checkbox" :checked="blockReasons.includes('other_reason')"
                     @change="toggleReason('other_reason')" />
                  <span>Напишите свое</span>
               </label>
               <textarea v-if="blockReasons.includes('other_reason')" v-model="customReason"
                  placeholder="Укажите причину..." rows="4"></textarea>
            </div>
            <div class="modal__footer">
               <button type="submit" class="modal__button" :disabled="!blockReasons.length">
                  Заблокировать
               </button>
               <button type="button" class="modal__button modal__button--cancel" @click="closePopup">
                  Отмена
               </button>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import closeIcon from '@/assets/icons/close.svg';
import { useChatStore } from '~/store/chatStore';
import { useUserStore } from '~/store/user.js';
import { blockUser } from '~/services/apiClient.js';

const props = defineProps({
   isVisible: Boolean,
   adsId: Number,
   mainCategoryId: Number,
   user_id: Number
});

const emit = defineEmits(['close']);
const chatStore = useChatStore();
const userStore = useUserStore();

const blockReasons = ref([]);
const customReason = ref('');

const closePopup = () => {
   blockReasons.value = [];
   customReason.value = '';
   emit('close');
};

const submitBlock = async () => {
   if (blockReasons.value.length) {
      const data = {
         blocked_user_id: props.user_id,
         insults_profanity: blockReasons.value.includes('insults_profanity') ? 1 : 0,
         threat_of_violence: blockReasons.value.includes('threat_of_violence') ? 1 : 0,
         suspicion_of_fraud: blockReasons.value.includes('suspicion_of_fraud') ? 1 : 0,
         other_reason: blockReasons.value.includes('other_reason') ? 1 : 0,
         comment: customReason.value || ''
      };

      try {
         await blockUser(data);
         closePopup();
      } catch (error) {
         console.error('Ошибка при блокировке пользователя:', error);
      }
   }
};

const toggleReason = (reason) => {
   if (blockReasons.value.includes(reason)) {
      blockReasons.value = blockReasons.value.filter(r => r !== reason);
   } else {
      blockReasons.value.push(reason);
   }
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
      align-items: flex-start;
   }

   &__content {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
      padding: 32px;
      box-sizing: border-box;
      animation: slide-up 0.3s ease-out;

      @media (max-width: 768px) {
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

   &__description {
      font-size: 14px;
      color: #323232;
   }

   &__body {
      padding: 24px 0;
      padding-top: 16px;
      border-bottom: 1px solid #eeeeee;

      textarea {
         width: 100%;
         padding: 10px;
         border: 1px solid #ddd;
         border-radius: 4px;
         font-size: 14px;
         resize: none;

         @media (max-width: 768px) {
            height: 100px;
         }

         &:focus {
            border-color: #3366ff;
            outline: none;
         }
      }

      .modal__checkbox {
         display: flex;
         align-items: center;
         margin-bottom: 16px;
         font-size: 14px;
         color: #323232;

         input {
            margin-right: 8px;
         }
      }
   }

   &__footer {
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      gap: 24px;

      .modal__button {
         display: flex;
         justify-content: center;
         align-items: center;
         width: 200px;
         height: 34px;
         font-size: 14px;
         color: #fff;
         background-color: #3366ff;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         transition: background-color 0.3s;

         &:disabled {
            background-color: #d3d3d3;
            cursor: not-allowed;
         }

         &--cancel {
            background-color: #D6EFFF;
            color: #3366FF;
         }
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

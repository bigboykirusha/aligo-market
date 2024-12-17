<template>
   <div id="delete-chat-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <div class="modal__body">
            <h2 class="modal__title">Удалить чат с пользователем «{{ chatStore.currentChat.for_user.id ===
                  userStore.userId ? chatStore.currentChat.from_user.username : chatStore.currentChat.for_user.username }}»?</h2>
            <p class="modal__description">
               Внимание, переписка и все данные будут утеряны навсегда. Вы уверены?
            </p>
         </div>
         <div class="modal__footer">
            <button type="button" class="modal__button" @click="confirmDeletion">
               Удалить
            </button>
            <button type="button" class="modal__button modal__button--cancel" @click="closePopup">
               Отмена
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import closeIcon from '@/assets/icons/close.svg';
import { useChatStore } from '~/store/chatStore';
import { useUserStore } from '~/store/user';
import { useMessagesStore } from '~/store/messages';
import { deleteChats } from '~/services/apiClient';

const props = defineProps({
   isVisible: Boolean,
   adsId: Number,
   mainCategoryId: Number,
   user_id: Number
});

const emit = defineEmits(['close', 'delete']);
const chatStore = useChatStore();
const userStore = useUserStore();
const messagesStore = useMessagesStore();

const closePopup = () => {
   emit('close');
};

const confirmDeletion = async () => {
   try {
      const ids = [{ ads_id: props.adsId, main_category_id: props.mainCategoryId, user_id: props.user_id }];
      await deleteChats(ids);
      chatStore.setCurrentChat(null);
      messagesStore.loadLastMessages();
      closePopup();
      emit('delete');
   } catch (error) {
      console.error('Ошибка при удалении чатов:', error);
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
      max-width: 380px;
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
      font-size: 20px;
      line-height: 30px;
      padding-bottom: 24px;
      font-weight: bold;
      color: #3366FF;
      margin: 0;
   }

   &__description {
      font-size: 14px;
      color: #323232;
      margin-top: 4px;
   }

   &__body {
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 24px;

      textarea {
         width: 100%;
         padding: 10px;
         height: 140px;
         border: 1px solid #ddd;
         border-radius: 4px;
         font-size: 14px;
         resize: none;

         @media (max-width: 768px) {
            height: 200px;
         }

         &:focus {
            border-color: #3366ff;
            outline: none;
         }
      }

      .modal__attachments {
         margin-top: 16px;

         .modal__extra-button {
            display: flex;
            align-items: center;
            margin-top: 16px;
            border: none;
            background-color: transparent;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            color: #3366FF;
            transition: background-color 0.3s ease;

            .modal__extra-icon {
               height: 16px;
               margin-right: 8px;
            }
         }
      }

      .modal__checkbox {
         display: flex;
         align-items: center;
         margin-top: 24px;
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

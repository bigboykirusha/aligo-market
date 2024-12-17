<template>
   <div id="complaint-popup" class="modal" v-if="isVisible" @click.self="closePopup">
      <div class="modal__content">
         <button class="modal__close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <form class="modal__form" @submit.prevent="submitComplaintHandler">
            <div class="modal__header">
               <h2 class="modal__title">Жалоба на пользователя «{{ chatStore.currentChat.for_user.id ===
                  userStore.userId ? chatStore.currentChat.from_user.username : chatStore.currentChat.for_user.username
                  }}»</h2>
               <p class="modal__description">
                  Коротко опишите, в чем суть претензии, прикрепите изображения и документы при необходимости.
               </p>
            </div>
            <div class="modal__body">
               <textarea v-model="complaintText" placeholder="Коротко опишите, в чем суть претензии..."
                  rows="6"></textarea>
               <div class="modal__attachments">
                  <button type="button" class="modal__extra-button" @click="triggerFileInput">
                     <img src="../assets/icons/paperclip.svg" alt="attachment icon" class="modal__extra-icon" />
                     Прикрепить
                  </button>
                  <input type="file" ref="fileInput" multiple @change="handleFileChange" style="display: none;" />
               </div>

               <div class="file-preview" v-if="selectedFiles.length > 0">
                  <div v-for="(file, index) in selectedFiles" :key="index" class="file-preview__item">
                     <template v-if="isImage(file)">
                        <img :src="getFilePreview(file)" alt="preview" class="file-preview__image" />
                     </template>
                     <template v-else>
                        <div class="file-preview__icon">
                           <img src="../assets/icons/file-icon.svg" alt="file icon" />
                           <span>{{ file.name }}</span>
                        </div>
                     </template>
                     <button @click="removeFile(index)" class="file-preview__remove">
                        <img src="../assets/icons/close-white.svg" alt="" />
                     </button>
                  </div>
               </div>

               <label class="modal__checkbox">
                  <input type="checkbox" v-model="blockUser" />
                  <span>Заблокировать пользователя</span>
               </label>
            </div>
            <div class="modal__footer">
               <button type="submit" class="modal__button" :disabled="!complaintText.trim()">
                  Отправить
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
import { submitComplaint } from '../services/apiClient.js';
import { useUserStore } from '~/store/user.js';

const props = defineProps({
   isVisible: Boolean,
   adsId: Number,
   mainCategoryId: Number,
   user_id: Number
});

const emit = defineEmits(['close']);

const complaintText = ref('');
const blockUser = ref(false);
const selectedFiles = ref([]);
const chatStore = useChatStore();
const userStore = useUserStore();

const closePopup = () => {
   complaintText.value = '';
   blockUser.value = false;
   selectedFiles.value = [];
   emit('close');
};

const triggerFileInput = () => {
   const fileInput = document.querySelector('#complaint-popup input[type="file"]');
   fileInput.click();
};

const handleFileChange = (event) => {
   const files = event.target.files;
   if (files.length) {
      selectedFiles.value = Array.from(files);
   }
};

const isImage = (file) => {
   return file.type.startsWith('image/');
};

const getFilePreview = (file) => {
   return URL.createObjectURL(file);
};

const removeFile = (index) => {
   selectedFiles.value.splice(index, 1);
};

const submitComplaintHandler = async () => {
   if (complaintText.value.trim()) {
      try {
         const formData = new FormData();
         formData.append('claim_user_id', props.user_id);
         formData.append('comment', complaintText.value);
         formData.append('is_blocked', blockUser.value ? 1 : 0);

         if (selectedFiles.length > 0) {
            selectedFiles.forEach((photo, index) => {
               formData.append(`photos[${index}]`, photo);
            });
         }

         await submitComplaint(formData);
         closePopup();
      } catch (error) {
         console.error('Ошибка при отправке жалобы:', error);
      }
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
      margin-top: 4px;
   }

   &__body {
      padding: 24px 0;
      padding-top: 16px;
      border-bottom: 1px solid #eeeeee;

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

.file-preview {
   margin-top: 16px;
   display: flex;
   flex-wrap: wrap;
   gap: 12px;

   &__item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      height: 80px;
   }

   &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
   }

   &__icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      width: 80px;
      height: 80px;
      background-color: #E6F0FF;
      border-radius: 4px;
      padding: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
      font-size: 12px;
      color: #333;

      img {
         width: 28px;
         height: 28px;
         margin-bottom: 8px;
      }

      span {
         margin: 0;
         max-width: 60px;
         text-overflow: ellipsis;
         overflow: hidden;
         white-space: nowrap;
      }
   }

   &__remove {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease;

      img {
         width: 10px;
         height: 10px;
      }

      &:hover {
         background-color: rgba(255, 0, 0, 0.8);
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

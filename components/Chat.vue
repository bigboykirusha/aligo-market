<template>
   <div v-if="total > 0" class="chat-wrapper" :class="{ 'chat-wrapper--collapsed': chatStore.isCollapsed }">
      <!-- Заголовок чата -->
      <div class="chat-header">
         <!-- Информация о текущем чате -->
         <div v-if="chatStore.currentChat" class="chat-header__info chat-header__info--active">
            <nuxt-link :to="`/user/${relevantUser(chatStore.currentChat).id}`" class="user-info__avatar">
               <img :src="getImageUrl(relevantUser(chatStore.currentChat).photo?.path, avatar)" alt="Avatar"
                  class="chat-header__avatar" />
            </nuxt-link>

            <img :src="getImageUrl(chatStore.currentChat.ads_photo[0]?.path)" alt="Ad Image"
               class="chat-header__ad-image" />
            <div class="chat-header__details">
               <nuxt-link :to="`/user/${relevantUser(chatStore.currentChat).id}`" class="chat-header__username">
                  {{ relevantUserInfo(chatStore.currentChat) }}
               </nuxt-link>
               <nuxt-link :to="`/car/${chatStore.currentChat.ads_id}`" class="chat-header__ad-title">
                  {{ chatStore.currentChat.ads_info }}
               </nuxt-link>
            </div>
         </div>

         <!-- Информация о чате по умолчанию -->
         <div v-else class="chat-header__info">
            <div class="chat-header__avatars">
               <div v-for="(avatar, index) in displayedUsers" :key="index" class="chat-header__ava"
                  :style="{ zIndex: 1 + index }">
                  <img :src="avatar" alt="User Avatar" class="avatar-round" />
               </div>
               <div v-if="remainingCount > 0" class="chat-header__more">+{{ remainingCount }}</div>
            </div>
            <span class="chat-header__title">Сообщения</span>
            <span class="chat-header__count">{{ total }}</span>
         </div>

         <!-- Кнопки в заголовке -->
         <button v-if="chatStore.currentChat && !chatStore.isCollapsed" class="chat-header__close-button"
            @click="closeChat">
            <img src="../assets/icons/arrow-back.svg" alt="Toggle" />
         </button>
         <nuxt-link to="/myself/messages" class="chat-header__close-button" @click="toggleChat">
            <img src="../assets/icons/out.svg" alt="Toggle" />
         </nuxt-link>
         <button class="chat-header__close-button" @click="toggleChat">
            <img class="chat-header__toggle-icon" src="../assets/icons/down.svg" alt="Toggle" />
         </button>
         <button v-if="chatStore.isCollapsed" class="chat-header__close-button chat-header__close-button--remove"
            @click="removeChat">
            <img src="../assets/icons/close.svg" alt="Close" />
         </button>
      </div>

      <!-- Содержимое чата -->
      <div v-if="chatStore.currentChat && !chatStore.isCollapsed" class="chat-wrapper__chat-box">
         <!-- Всплывающее окно для имени пользователя -->
         <UsernamePopup v-if="!userStore.username" :isVisible="true" @close="closePopup" />

         <!-- Блок, если сообщений нет -->
         <div v-else-if="!hasMessages" class="chat-wrapper__no-messages">
            <div class="no-messages-container">
               <img src="../assets/icons/mail-smile.svg" alt="No messages" class="no-messages-image" />
               <p class="no-messages-text">Задайте пользователю свой вопрос</p>
            </div>
         </div>

         <!-- Сообщения чата -->
         <div v-else>
            <div v-if="loading" class="chat-box">
               <div v-for="n in 6" :key="n"
                  :class="['chat-wrapper__message-item', 'chat-wrapper__message-item--skeleton', { 'chat-wrapper__message-item--self': isOdd(n) }]">
                  <template v-if="!isOdd(n)">
                     <div class="chat-wrapper__message-avatar-skeleton"></div>
                     <div class="chat-wrapper__message-bubble-skeleton">
                        <div class="chat-wrapper__message-content-skeleton"></div>
                     </div>
                     <div class="chat-wrapper__message-info-skeleton">
                        <div class="chat-wrapper__message-time-skeleton"></div>
                     </div>
                  </template>
                  <template v-else>
                     <div class="chat-wrapper__message-info-skeleton">
                        <div class="chat-wrapper__message-time-skeleton"></div>
                     </div>
                     <div class="chat-wrapper__message-bubble-skeleton">
                        <div class="chat-wrapper__message-content-skeleton"></div>
                     </div>
                     <div class="chat-wrapper__message-avatar-skeleton"></div>
                  </template>
               </div>
            </div>

            <!-- Отображение сообщений -->
            <div v-else class="chat-wrapper__wrapper">
               <div v-for="(item, index) in groupedMessages" :key="index"
                  :class="{ 'chat-wrapper__date-divider': item.type === 'date' }">
                  <template v-if="item.type === 'date'">
                     <div class="chat-wrapper__date">{{ item.date }}</div>
                  </template>
                  <template v-else>
                     <div :class="['chat-wrapper__message-item', { 'chat-wrapper__message-item--self': item.isSelf }]">
                        <template v-if="!item.isSelf">
                           <img :src="getImageUrl(relevantUser(chatStore.currentChat).photo?.path, avatar)" alt="Avatar"
                              class="chat-wrapper__message-avatar" />
                           <div class="chat-wrapper__message-bubble">
                              <MessagePhotos :photos="item.photos" />
                              <div class="chat-wrapper__message-content">{{ item.message }}</div>
                           </div>
                           <div class="chat-wrapper__message-info">
                              <span class="chat-wrapper__message-time">{{ formatTime(item.created_at) }}</span>
                           </div>
                        </template>
                        <template v-else>
                           <div class="chat-wrapper__message-info">
                              <img src="../assets/icons/checked.svg" class="chat-wrapper__message-icon" />
                              <span class="chat-wrapper__message-time">{{ formatTime(item.created_at) }}</span>
                           </div>
                           <div class="chat-wrapper__message-bubble chat-wrapper__message-bubble--self">
                              <MessagePhotos :photos="item.photos" />
                              <div class="chat-wrapper__message-content">{{ item.message }}</div>
                           </div>
                           <img :src="getImageUrl(userStore.photo?.path, avatar)" alt="Avatar"
                              class="chat-wrapper__message-avatar chat-wrapper__message-avatar--self" />
                        </template>
                     </div>
                  </template>
               </div>
            </div>
         </div>
      </div>

      <!-- Предварительный просмотр файлов -->
      <div v-if="file.length > 0">
         <div class="file-preview__title">Прикрепленные файлы:</div>
         <div class="file-preview">
            <div v-for="(file, index) in file" :key="index" class="file-preview__item">
               <template v-if="isImage(file)">
                  <img :src="getFilePreview(file)" alt="preview" class="file-preview__image" />
               </template>
               <template v-else>
                  <div class="file-preview__icon">
                     <img src="../assets/icons/file-icon.svg" alt="file icon" />
                  </div>
               </template>
               <button @click="removeFile(index)" class="file-preview__remove">
                  <img src="../assets/icons/close-white.svg" alt="Remove" />
               </button>
            </div>
         </div>
      </div>

      <!-- Поле ввода сообщения -->
      <div v-if="chatStore.currentChat && !chatStore.isCollapsed && userStore.username"
         class="chat-wrapper__message-input-container">
         <div class="chat-wrapper__message-icons-left">
            <input type="file" @change="handleFileChange" multiple class="chat-wrapper__file-input" />
            <button class="chat-wrapper__message-icon-left" @click="triggerFileInput">
               <img src="../assets/icons/plus.svg" alt="Upload Photo" />
            </button>
            <button class="chat-wrapper__message-icon-left" @click="triggerFileInput">
               <img src="../assets/icons/photo.svg" alt="Upload Photo" />
            </button>
         </div>
         <input v-model="newMessage" @keyup.enter="handleSendMessage" placeholder="Напишите сообщение"
            class="chat-wrapper__message-input" />
         <button class="chat-wrapper__send-button" @click="handleSendMessage">
            <img src="../assets/icons/send.svg" alt="Send" />
         </button>
      </div>

      <!-- Последние сообщения -->
      <div v-show="!chatStore.isCollapsed && !chatStore.currentChat" class="chat-wrapper__last-messages-container">
         <LastMessages @open-chat="chatStore.setCurrentChat" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useChatStore } from '~/store/chatStore';
import { useUserStore } from '~/store/user';
import { relevantUser, relevantUserInfo} from '../services/userUtils.js'
import { getImageUrl } from '../services/imageUtils';
import { fetchMessages, sendMessage, fetchLastMessages } from '~/services/apiClient';
import avatar from '../assets/icons/avatar-revers.svg';

const userStore = useUserStore();
const chatStore = useChatStore();

const newMessage = ref('');
const file = ref([]);
const total = ref(0);
const loading = ref(true);
const isPopupVisible = ref(false);

const toUserId = computed(() => {
   return chatStore.currentChat.for_user.id === userStore.userId
      ? chatStore.currentChat.from_user.id
      : chatStore.currentChat.for_user.id;
});

const displayedUsers = computed(() => {
   const uniqueAvatars = [...new Set(chatStore.usersWithAvatars
      .filter(user => user.avatarUrl !== avatar)
      .map(user => user.avatarUrl))];
   return uniqueAvatars.slice(0, 2);
});

const remainingCount = computed(() => {
   const uniqueUsers = [...new Set(chatStore.usersWithAvatars)];
   return Math.max(uniqueUsers.length - 2, 0);
});

const messages = computed(() => chatStore.messages);
const hasMessages = computed(() => messages.value.length > 0);

const groupedMessages = computed(() => {
   const grouped = [];
   let lastDate = null;

   messages.value.forEach(message => {
      const messageDate = new Date(message.created_at).toLocaleDateString('ru-RU', {
         day: 'numeric',
         month: 'long',
         year: 'numeric',
      });

      if (messageDate !== lastDate) {
         grouped.push({ type: 'date', date: messageDate });
         lastDate = messageDate;
      }

      grouped.push({ type: 'message', ...message });
   });

   return grouped;
});

const showPopup = () => isPopupVisible.value = true;
const closePopup = () => isPopupVisible.value = false;

function toggleChat() {
   chatStore.toggleChat();
}

function closeChat() {
   chatStore.setCurrentChat(null);
}

function formatTime(dateString) {
   const timePart = dateString.split(' ')[1];
   const [hours, minutes] = timePart.split(':');
   return `${hours}.${minutes}`;
}

async function loadMessages() {
   if (!chatStore.currentChat) return;

   loading.value = true;
   try {
      const targetUserId = toUserId.value;
      const data = await fetchMessages(chatStore.currentChat.ads_id, chatStore.currentChat.main_category_id, targetUserId);

      const formattedMessages = data.map(message => ({
         ...message,
         isSelf: message.from_user_id === userStore.userId,
      }));

      chatStore.setMessages(formattedMessages);
   } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
   } finally {
      loading.value = false;
   }
}

async function handleSendMessage() {
   if (!newMessage.value.trim() && !file.value.length) return;

   if (!userStore.username) {
      showPopup();
      return;
   }

   try {
      const response = await sendMessage(newMessage.value, chatStore.currentChat.ads_id, chatStore.currentChat.main_category_id, toUserId.value, file.value);
      chatStore.messages.push({ ...response.data, isSelf: true });
      resetMessageInput();
   } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
   }
}

function resetMessageInput() {
   newMessage.value = '';
   file.value = [];
}

const isImage = (file) => file.type.startsWith('image/');
const getFilePreview = (file) => URL.createObjectURL(file);

function handleFileChange(event) {
   file.value = Array.from(event.target.files);
}

function removeFile(index) {
   file.value.splice(index, 1);
}

function triggerFileInput() {
   document.querySelector('.chat-wrapper__file-input')?.click();
}

function isOdd(n) {
   return n % 2 === 1;
}

onMounted(async () => {
   try {
      const { totalCount, data } = await fetchLastMessages();
      total.value = totalCount;

      const usersWithAvatars = await Promise.all(data.map(async (message) => {
         const userId = relevantUser(message);
         const avatarUrl = getImageUrl(relevantUser(message).photo?.path, avatar);
         return { userId, avatarUrl };
      }));

      chatStore.setUsersWithAvatars(usersWithAvatars);
   } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
   }
});

watch(() => chatStore.currentChat, loadMessages, { immediate: true });
</script>

<style lang="scss" scoped>
.file-preview {
   padding: 16px 24px;
   padding-top: 0;
   background-color: #EEF9FF;
   display: flex;
   flex-wrap: wrap;
   gap: 8px;

   &__title {
      font-size: 12px;
      background-color: #EEF9FF;
      line-height: 16px;
      font-weight: 400;
      padding: 16px 24px;
      padding-bottom: 12px;
      color: #3366FF;
   }

   &__item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50px;
      height: 50px;
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
      justify-content: center;
      width: 50px;
      height: 50px;
      background-color: #D6EFFF;
      border-radius: 4px;
      padding: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
      font-size: 12px;
      color: #333;

      img {
         width: 20px;
         height: 20px;
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
      top: 2px;
      right: 2px;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease;

      img {
         width: 8px;
         height: 8px;
      }

      &:hover {
         background-color: rgba(255, 0, 0, 0.8);
      }
   }
}

.chat-wrapper {
   position: fixed;
   bottom: 0;
   right: 100px;
   z-index: 40;
   background-color: #f4f4f9;
   width: 420px;
   height: 600px;
   display: flex;
   border-radius: 4px 4px 0 0;
   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08), 0px 0px 6px rgba(0, 0, 0, 0.08);
   flex-direction: column;
   transition: height 0.3s ease;
   max-height: calc(100% + 70px);
   overflow-y: auto;

   @media (max-width: 768px) {
      right: 0;
      width: 100%;
      height: 100%;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08), 0px 0px 6px rgba(0, 0, 0, 0.08);
   }

   &--collapsed {
      height: 70px;
   }

   &__toggle-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      z-index: 201;
      font-size: 14px;
      text-transform: uppercase;
      transition: background-color 0.3s ease;

      &:hover {
         background-color: #0056b3;
      }
   }

   &__chat-box {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 16px;
      padding: 16px;
      padding-top: 82px;
      background: #ffffff;
      overflow-y: auto;

      @media screen and (max-width: 768px) {
         padding: 12px;
         padding-top: 82px;
      }
   }

   &__wrapper {
      display: flex;
      position: relative;
      flex-direction: column;
      gap: 24px;
   }

   &__message-item {
      display: flex;
      align-items: flex-start;
      flex-direction: row;
      justify-content: flex-start;
      gap: 8px;

      &--self {
         justify-content: flex-end;
         align-items: flex-start;
      }
   }

   &__message-avatar {
      width: 32px;
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
   }

   &__message-bubble {
      background-color: #EEEEEE;
      color: #323232;
      border-radius: 12px;
      gap: 8px;
      padding: 12px 16px;
      position: relative;
      display: flex;
      flex-direction: column;
   }

   &__message-bubble--self {
      background-color: #D6EFFF;
      color: #323232;
   }

   &__message-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
   }

   &__message-time {
      font-size: 12px;
      color: #999;

      &--self {
         margin-left: 0;
      }
   }

   &__message-icon {
      width: 18px;
   }

   &__message-avatar--self {
      margin-right: 0;
   }

   &__message-content {
      font-size: 14px;
      word-break: break-all;
   }

   &__message-info {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: #999;
   }

   &__message-input-container {
      position: sticky;
      z-index: 200;
      display: flex;
      bottom: 0;
      width: 100%;
      background: #fff;
      box-shadow: 0px -3px 10px rgba(0, 0, 0, 0.05), 0px -3px 4px rgba(0, 0, 0, 0.02);
      padding: 18px 24px;
      margin-top: auto;
      gap: 16px;

      @media screen and (max-width: 768px) {
         padding: 16px;
      }
   }

   &__message-input {
      width: 100%;
      height: 34px;
      border-radius: 4px;
      border: 1px solid #D6D6D6;
      font-size: 14px;
      color: #787878;
      padding: 0 10px;
      box-sizing: border-box;
      outline: none;
   }

   &__send-button {
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: #D6EFFF;
      padding: 0;
      cursor: pointer;
      height: 34px;
      min-width: 34px;
      border-radius: 4px;
      transition: $transition-1;

      &:hover {
         background-color: #A4DCFF;
      }

      img {
         height: 15px;
      }
   }

   &__file-input {
      display: none;
   }

   &__message-icons-left {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: -8px;
   }

   &__message-icon-left {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 30px;
      background: transparent;
      border-radius: 50%;
      height: 30px;
      outline: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
         background-color: #D6EFFF;
      }

      img {
         height: 15px;
      }
   }

   &__no-messages {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      height: 100%;
      padding: 20px;
      border-radius: 8px;
   }

   &__date-divider {
      display: flex;
      justify-content: center;
   }

   &__date {
      font-size: 14px;
      color: #323232;
   }
}

.chat-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 420px;
   padding: 10px 16px;
   height: 70px;
   border-radius: 4px 4px 0 0;
   box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05), 0px 3px 4px rgba(0, 0, 0, 0.02);
   gap: 6px;
   color: #3366FF;
   background-color: #fff;
   position: fixed;
   z-index: 200;

   @media screen and (max-width: 768px) {
      width: 100%;
   }

   &__info--active {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: auto;
   }

   &__info {
      display: flex;
      position: relative;
      align-items: center;
      gap: 10px;
      margin-right: auto;
   }

   &__avatar {
      width: 34px;
      position: absolute;
      top: -8px;
      left: -11px;
      height: 34px;
      object-fit: cover;
      border-radius: 50%;
      border: 1px solid #fff;
      background-color: #3366FF;
   }

   &__details {
      height: 49px;
      display: flex;
      flex-direction: column;
      gap: 2px;
   }

   &__username {
      font-weight: bold;
      font-size: 16px;
      color: #333;
   }

   &__ad-title {
      font-size: 14px;
      color: #666;
      outline: none;
      text-decoration: none;
   }

   &__ad-image {
      width: 49px;
      height: 49px;
      border-radius: 4px;
      object-fit: cover;
   }

   &__title {
      font-size: 24px;
      font-weight: bold;
   }

   &__count {
      font-size: 14px;
      background: #EEF9FF;
      color: #007bff;
      padding: 3px 8.5px;
      border-radius: 12px;
   }

   &__close-button {
      background: transparent;
      display: flex;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      border: none;
      color: #fff;
      transition: $transition-1;

      &--remove {
         img {
            width: 10px;
            height: 10px
         }
      }

      &:hover {
         background-color: #D6EFFF;
      }

      cursor: pointer;
      transition: color 0.3s ease;

      img {
         width: 12px;
      }
   }

   &__toggle-icon {
      transition: transform 0.3s ease;
   }
}

.chat-wrapper--collapsed {
   .chat-header__toggle-icon {
      transform: rotate(180deg);
   }
}

.no-messages-container {
   text-align: center;
   margin-top: 40px;
   max-width: 400px;
}

.no-messages-text {
   font-size: 16px;
   color: #323232;
   max-width: 200px;
   margin: 0 auto;
}

.no-messages-image {
   margin-bottom: 8px;
}

// skeleton

.chat-wrapper__message-item--skeleton {
   display: flex;
   margin-bottom: 24px;
   align-items: flex-start;
}

.chat-wrapper__message-avatar-skeleton,
.chat-wrapper__message-bubble-skeleton {
   background-color: #e0e0e0;
   border-radius: 8px;
   animation: pulse 1.5s infinite ease-in-out;
}

.chat-wrapper__message-avatar-skeleton {
   width: 32px;
   height: 32px;
   margin-right: 10px;
   border-radius: 50%;
}

.chat-wrapper__message-bubble-skeleton {
   flex: 1;
   padding: 10px;
   margin-right: 10px;
}

.chat-wrapper__message-content-skeleton {
   width: 100%;
   height: 20px;
}

.chat-header__avatars {
   position: relative;
   display: flex;
   padding-left: 20px;
}

.chat-header__ava {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   overflow: hidden;
   margin-left: -20px;
   background-color: #3366FF;
   border: 2px solid white;
   position: relative;
}

.chat-header__more {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   background-color: #3366FF;
   border: 2px solid white;
   color: white;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-left: -20px;
   font-weight: bold;
   font-size: 14px;
   z-index: 10;
}

.avatar-round {
   width: 100%;
   height: 100%;
   object-fit: cover;
}

@keyframes pulse {
   0% {
      background-color: #e0e0e0;
   }

   50% {
      background-color: #c0c0c0;
   }

   100% {
      background-color: #e0e0e0;
   }
}
</style>
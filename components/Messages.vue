<template>
   <div class="messages">
      <div class="messages__title">Сообщения</div>
      <div v-if="!chatStore.currentChat" class="messages__actions">
         <input class="message-checkbox" type="checkbox" id="select-all" v-model="selectAll"
            @change="handleSelectAllChange" />
         <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" placeholder="Выбрать чаты" />
         <button v-if="selectedMessagesStore.selectedMessages.length > 0" @click="handleMarkAllAsRead"
            class="messages__action-button">
            <img src="../assets/icons/done.svg" alt="done" />
            <span> Пометить как прочитанные</span>
         </button>
         <button v-if="selectedMessagesStore.selectedMessages.length > 0" class="messages__action-button">
            <img src="../assets/icons/block.svg" alt="delete" />
            <span>Заблокировать</span>
         </button>
         <button v-if="selectedMessagesStore.selectedMessages.length > 0" @click="handleDeleteAll"
            class="messages__action-button">
            <img src="../assets/icons/delete.svg" alt="delete" />
            <span>Удалить</span>
         </button>
         <button class="messages__action-button">
            <img src="../assets/icons/options.svg" alt="delete" />
         </button>
      </div>
      <div class="messages__content">
         <div>
            <div class="chat-wrapper" :class="{ 'profile-page': chatStore.currentChat }">
               <div v-if="chatStore.currentChat" class="chat-header">
                  <button v-if="chatStore.currentChat" class="chat-header__close-button" @click="closeChat">
                     <img src="../assets/icons/arrow-back.svg" alt="Toggle" />
                  </button>
                  <div class="chat-header__info chat-header__info--active">
                     <img :src="getImageUrl(chatStore.currentChat.ads_photo[0]?.path)" alt="Ad Image"
                        class="chat-header__ad-image" />
                     <img :src="getImageUrl(relevantUser(chatStore.currentChat).photo?.path, avatar)" alt="Avatar"
                        class="chat-header__avatar" />
                     <div class="chat-header__details">
                        <span class="chat-header__username">{{ relevantUserInfo(chatStore.currentChat) }}</span>
                        <nuxt-link :to="`/car/${chatStore.currentChat.ads_id}`" class="chat-header__ad-title">
                           {{ chatStore.currentChat.ads_info }} <div class="chat-header__ad-amount">{{
                              formatNumberWithSpaces(chatStore.currentChat.ads_amount) }}<span
                                 class="chat-header__ad-amount-currency">₽</span>
                           </div>
                        </nuxt-link>
                     </div>
                  </div>
                  <button @click.stop @click="togglePopup" class="messages__options-button">
                     <img v-if="isMobile" src="../assets/icons/down.svg" alt="delete" />
                     <img v-else src="../assets/icons/options.svg" alt="delete" />
                  </button>
                  <PopupChat :isVisible="showPopup" :items="items" @close="showPopup = false" />
               </div>
               <div v-if="showPopup" class="popup-overlay"></div>
               <div v-if="chatStore.currentChat" class="chat-wrapper__chat-box">
                  <!-- Заглушка, когда нет сообщений -->
                  <div v-if="messages.length === 0" class="chat-wrapper__no-messages">
                     <div class="no-messages-container">
                        <h2>Нет сообщений
                           <img src="../assets/icons/sad-smile.svg" alt="No messages" class="no-messages-image" />
                        </h2>
                        <p class="no-messages-text">
                           Напишите сообщение пользователю или задайте интересующий вас вопрос. В чате запрещены
                           оскорбления и информация, нарушающая законодательство.
                        </p>
                     </div>
                  </div>
                  <div v-else>
                     <div v-if="loading" class="chat-box">
                        <div v-for="n in 6" :key="n"
                           :class="['chat-wrapper__message-item', 'chat-wrapper__message-item--skeleton', { 'chat-wrapper__message-item--self': n % 2 == 1 }]">
                           <template v-if="n % 2 !== 1">
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
                     <div class="chat-wrapper__wrapper" v-else>
                        <div v-for="(item, index) in groupedMessages" :key="index"
                           :class="{ 'chat-wrapper__date-divider': item.type === 'date' }">
                           <template v-if="item.type === 'date'">
                              <div class="chat-wrapper__date">{{ item.date }}</div>
                           </template>
                           <template v-else>
                              <div
                                 :class="['chat-wrapper__message-item', { 'chat-wrapper__message-item--self': item.isSelf }]">
                                 <template v-if="!item.isSelf">
                                    <img :src="getImageUrl(relevantUser(chatStore.currentChat).photo?.path, avatar)"
                                       alt="Avatar" class="chat-wrapper__message-avatar">
                                    <div class="chat-wrapper__message-bubble">
                                       <MessagePhotos :photos="item.photos" />
                                       <div class="chat-wrapper__message-content">{{ item.message }}</div>
                                       <div v-if="item.message_translate" class="chat-wrapper__message-translate">
                                          <div class="chat-wrapper__message-translate-title">
                                             Translation ({{ capitalizeFirstLetter(translateTo) }}):
                                          </div>
                                          <div class="chat-wrapper__message-translate-content">
                                             {{ item.message_translate }}
                                          </div>
                                       </div>
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
                                       <div v-if="item.message_translate" class="chat-wrapper__message-translate">
                                          <div class="chat-wrapper__message-translate-title">
                                             Translation ({{ capitalizeFirstLetter(translateTo) }}):
                                          </div>
                                          <div class="chat-wrapper__message-translate-content">
                                             {{ item.message_translate }}
                                          </div>
                                       </div>
                                    </div>
                                    <img :src="getImageUrl(userStore.photo?.path, avatar)" alt="Avatar"
                                       class="chat-wrapper__message-avatar chat-wrapper__message-avatar--self">
                                 </template>
                              </div>
                           </template>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="file-preview" v-if="file.length > 0">
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
                        <img src="../assets/icons/close-white.svg" alt="" />
                     </button>
                  </div>
               </div>
               <div v-if="chatStore.currentChat" class="chat-wrapper__message-input-container">
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
               <div v-show="!chatStore.currentChat" class="chat-wrapper__last-messages-container">
                  <LastMessages isProfilePage @open-chat="setCurrentChat" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <ReviewPopup :isVisible="showReviewPopup" :adsId="chatStore.currentChat?.ads_id"
      :mainCategoryId="chatStore.currentChat?.main_category_id" @close="showReviewPopup = false" />
   <Complaint :isVisible="showComplaintPopup" :adsId="chatStore.currentChat?.ads_id"
      :mainCategoryId="chatStore.currentChat?.main_category_id" @close="showComplaintPopup = false" :user_id="chatStore.currentChat?.for_user.id === userStore.userId
         ? chatStore.currentChat?.from_user.id
         : chatStore.currentChat?.for_user.id" />
   <BlockPopup :isVisible="showBlockPopup" :adsId="chatStore.currentChat?.ads_id" :user_id="chatStore.currentChat?.for_user.id === userStore.userId
      ? chatStore.currentChat?.from_user.id
      : chatStore.currentChat?.for_user.id" :mainCategoryId="chatStore.currentChat?.main_category_id"
      @close="showBlockPopup = false" />
   <DeletePopup :isVisible="showDeletePopup" :adsId="chatStore.currentChat?.ads_id" :user_id="chatStore.currentChat?.for_user.id === userStore.userId
      ? chatStore.currentChat?.from_user.id
      : chatStore.currentChat?.for_user.id" :mainCategoryId="chatStore.currentChat?.main_category_id"
      @close="showDeletePopup = false" />
   <TranslatePopup :isVisible="showTranslatePopup" :adsId="chatStore.currentChat?.ads_id"
      @close="showTranslatePopup = false" @language-selected="setTranslateLanguage" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useChatStore } from '~/store/chatStore';
import { getImageUrl } from '../services/imageUtils';
import { useSelectedMessagesStore } from '~/store/selectedMessages';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { relevantUser, relevantUserInfo } from '../services/userUtils.js'
import { fetchMessages, sendMessage, fetchLastMessages } from '~/services/apiClient';
import { useUserStore } from '~/store/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const chatStore = useChatStore();
const selectedMessagesStore = useSelectedMessagesStore();
const messages = computed(() => chatStore.messages);
const toUserId = computed(() => {
   return chatStore.currentChat.for_user.id === userStore.userId
      ? chatStore.currentChat.from_user.id
      : chatStore.currentChat.for_user.id;
});
const newMessage = ref('');
const total = ref(0);
const lastMessages = ref([]);
const loading = ref(false);
const isMobile = ref(false);
const showPopup = ref(false);
const showReviewPopup = ref(false);
const showComplaintPopup = ref(false);
const showBlockPopup = ref(false);
const showDeletePopup = ref(false);
const showTranslatePopup = ref(false);
const popupRef = ref(null);
const selectAll = ref(false);
const router = useRouter();
const file = ref([]);
const translateTo = ref(null);

import ruIcon from '../assets/icons/ru.svg';
import personIcon from '../assets/icons/person.svg';
import adIcon from '../assets/icons/ad.svg';
import reviewsIcon from '../assets/icons/reviews.svg';
import blockIcon from '../assets/icons/block.svg';
import alertIcon from '../assets/icons/alert.svg';
import deleteIcon from '../assets/icons/delete.svg';
import avatar from '../assets/icons/avatar-revers.svg'

function handleFileChange(event) {
   file.value = Array.from(event.target.files);
}

function removeFile(index) {
   file.value.splice(index, 1);
}

function triggerFileInput() {
   document.querySelector('.chat-wrapper__file-input').click();
}

const closeChat = () => {
   chatStore.setCurrentChat(null);
   translateTo.value = null;
};

const handleMarkAllAsRead = async () => {
   try {
      await selectedMessagesStore.markSelectedChatsAsRead();
   } catch (error) {
      console.error('Ошибка при пометке всех сообщений как прочитанных:', error);
   }
};

const handleDeleteAll = async () => {
   try {
      await selectedMessagesStore.deleteSelectedChats();
   } catch (error) {
      console.error('Ошибка при удалении всех сообщений:', error);
   }
};

const capitalizeFirstLetter = (string) => {
   if (!string) return '';
   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const groupedMessages = computed(() => {
   const grouped = [];
   let lastDate = null;

   messages.value.forEach((message) => {
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

const formatTime = (dateString) => {
   const timePart = dateString.split(' ')[1];
   const [hours, minutes] = timePart.split(':');
   return `${hours}.${minutes}`;
};

const togglePopup = () => {
   showPopup.value = !showPopup.value;
};

const handleSelectAllChange = () => {
   if (selectedMessagesStore.selectedMessages.length === lastMessages.value.length) {
      selectedMessagesStore.deselectAll();
   } else {
      const allMessages = lastMessages.value.map(message => ({
         id: message.id,
         ads_id: message.ads_id,
         main_category_id: message.main_category_id,
         user_id: message.for_user.id,
      }));
      selectedMessagesStore.selectAll(allMessages);
   }
};

const handleClickOutside = (event) => {
   if (popupRef.value && !popupRef.value.contains(event.target)) {
      showPopup.value = false;
   }
};

const openReviewPopup = () => {
   togglePopup();
   showReviewPopup.value = true;
};

const openComplaintPopup = () => {
   togglePopup();
   showComplaintPopup.value = true;
};

const openBlockPopup = () => {
   togglePopup();
   showBlockPopup.value = true;
};

const openDeletePopup = () => {
   togglePopup();
   showDeletePopup.value = true;
};

const openTranslatePopup = () => {
   togglePopup();
   showTranslatePopup.value = true;
};

const setTranslateLanguage = (language) => {
   translateTo.value = language;
   loadMessages();
};

const goToAd = () => {
   router.push(`/car/${chatStore.currentChat.ads_id}`);
};

const goToProfile = () => {
   router.push(`/user/${toUserId.value}`);
};

const leaveReview = () => {
   openReviewPopup();
};

const items = [
   { icon: ruIcon, text: 'Перевести на ...', action: openTranslatePopup },
   { icon: personIcon, text: 'Перейти в профиль', action: goToProfile },
   { icon: adIcon, text: 'Перейти в объявление', action: goToAd },
   { icon: reviewsIcon, text: 'Оставить отзыв', action: leaveReview },
   { icon: blockIcon, text: 'Заблокировать', action: openBlockPopup },
   { icon: alertIcon, text: 'Пожаловаться', action: openComplaintPopup },
   { icon: deleteIcon, text: 'Удалить чат', action: openDeletePopup },
];

const sortOptions = [
   { label: 'Прочитанные', value: '1' },
   { label: 'Не прочитанные', value: '0' },
];

const handleSortUpdate = (order_by) => {
   console.log('Sorting by:', order_by);
};

const checkScreenWidth = () => {
   isMobile.value = window.innerWidth < 768;
};

const isImage = (file) => {
   return file.type.startsWith('image/');
};

const getFilePreview = (file) => {
   return URL.createObjectURL(file);
};

const loadMessages = async () => {
   if (chatStore.currentChat) {
      loading.value = true;
      try {
         const translateParam = translateTo.value ? { translate_to: translateTo.value } : {};
         const data = await fetchMessages(
            chatStore.currentChat.ads_id,
            chatStore.currentChat.main_category_id,
            chatStore.currentChat.for_user.id === userStore.userId
               ? chatStore.currentChat.from_user.id
               : chatStore.currentChat.for_user.id,
            translateParam
         );

         const formattedMessages = data.map(message => ({
            ...message,
            isSelf: message.from_user_id === userStore.userId
         }));

         chatStore.setMessages(formattedMessages);

         return data;
      } catch (error) {
         console.error('Error loading messages:', error);
      } finally {
         loading.value = false;
      }
   }
};

async function handleSendMessage() {
   if (newMessage.value.trim() === '' && file.value.length === 0) return;

   try {
      const response = await sendMessage(
         newMessage.value,
         chatStore.currentChat.ads_id,
         chatStore.currentChat.main_category_id,
         chatStore.currentChat.for_user.id === userStore.userId
            ? chatStore.currentChat.from_user.id
            : chatStore.currentChat.for_user.id,
         file.value
      );

      newMessage.value = '';
      file.value = [];
      const sentMessage = {
         ...response.data,
         isSelf: true
      };
      chatStore.messages.push(sentMessage);
      return sentMessage;
   } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
   }
}

const setCurrentChat = (chat) => {
   chatStore.setCurrentChat(chat);
   loadMessages();
};

onMounted(async () => {
   checkScreenWidth();
   window.addEventListener('resize', checkScreenWidth);
   document.addEventListener('click', handleClickOutside);
   try {
      const { data, totalCount } = await fetchLastMessages();
      total.value = totalCount;
      lastMessages.value = data;
   } catch (error) {
      console.error('Error loading messages count:', error);
   }
});

onBeforeUnmount(() => {
   window.removeEventListener('resize', checkScreenWidth);
   document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.file-preview {
   padding: 8px 16px;
   background-color: #EEF9FF;
   display: flex;
   flex-wrap: wrap;
   gap: 8px;

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

.message-checkbox {
   width: 16px;
   height: 16px;
   margin: auto 0;
   margin-left: 24px;
   accent-color: #3366FF;

   @media (max-width: 991px) {
      display: none;
   }
}

.popup-overlay {
   display: none;
   position: absolute;
   z-index: 9999;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.5);

   @media (max-width: 768px) {
      display: block;
   }
}

.messages {
   width: 100%;

   ul {
      list-style: none;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: auto;
      max-height: calc(100vh - 350px);
      overflow-y: auto;
   }

   &__title {
      color: #003BCE;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media screen and (max-width: 768px) {
         margin-top: 8px;
      }
   }

   &__actions {
      display: flex;
      gap: 16px;
      padding-bottom: 16px;
   }

   &__action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3366FF;
      padding: 5px 10px;
      border-radius: 12px;
      background-color: transparent;
      gap: 8px;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &:last-child {
         display: flex;
         align-items: center;
         justify-content: center;
         margin-left: auto;
         min-width: 34px;
         padding: 0 9px;
         background: #D6EFFF;
         border-radius: 6px;
         height: 34px;
         transition: background-color 0.2s ease-in-out;

         &:hover {
            background-color: #A4DCFF;
         }

         img {
            height: 16px;
         }
      }

      &:not(:last-child) {
         @media (max-width: 480px) {
            display: none;
         }
      }

      &:hover {
         background-color: #D6EFFF;
      }

      img {
         height: 16px;

         @media (max-width: 500px) {
            height: 14px;
         }
      }

      @media (max-width: 991px) {
         min-width: 34px;
         padding: 0 9px;
         background: #D6EFFF;
         border-radius: 6px;
         height: 34px;

         span {
            display: none;
         }
      }
   }

   &__options-button {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      padding: 0 9px;
      background: #D6EFFF;
      border-radius: 6px;
      height: 34px;
      outline: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
         background-color: #A4DCFF;

         @media (max-width: 768px) {
            background-color: transparent;
         }
      }

      img {
         height: 12px;
      }

      @media (max-width: 768px) {
         min-width: 34px;
         background: none;
         height: 34px;


         img {
            height: auto;
            width: 16px;
         }
      }
   }

   &__content {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      word-wrap: break-word;
      text-wrap: wrap;
      max-width: 100%;
      gap: 16px;
      height: 100%;
      max-height: calc(100vh - 350px);
      overflow-y: auto;
      padding: 2px 0;
      padding-right: 16px;

      @media screen and (max-width: 480px) {
         max-height: calc(100vh - 320px);
      }
   }

   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 300px;
      width: 320px;
      margin: 0 auto;
      color: #636363;
   }

   &__placeholder-text {
      font-size: 14px;
      font-weight: 700;
      color: #323232;
   }

   &__placeholder-description {
      font-size: 14px;
      color: #323232;
   }
}

.chat-wrapper {
   max-height: calc(100vh - 350px);
   height: 100vh;
   display: flex;
   border-radius: 4px 4px 0 0;
   flex-direction: column;
   transition: height 0.3s ease;

   @media (max-width: 768px) {
      width: 100%;
   }

   &.profile-page {
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08), 0px 0px 6px rgba(0, 0, 0, 0.08);
      border-radius: 4px;

      @media (max-width: 768px) {
         position: absolute;
         z-index: 13;
         top: 0;
         left: 0;
         max-height: none;
         height: 100vh;
         width: 100%;
      }
   }

   &__date-divider {
      display: flex;
      justify-content: center;
   }

   &__date {
      font-size: 14px;
      color: #323232;
   }

   &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }

   &__chat-box {
      display: flex;
      height: 100%;
      flex-direction: column;
      flex-grow: 1;
      gap: 24px;
      padding: 20px;
      background: #fff;
      overflow-y: auto;
      transition: opacity 0.3s ease;

      @media screen and (max-width: 768px) {
         padding: 16px;
      }
   }

   &__message-item {
      display: flex;
      align-items: flex-start;
      flex-direction: row;
      justify-content: flex-start;
      gap: 8px;

      &--self {
         justify-content: flex-end;
      }
   }

   &__message-avatar {
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 50%;
      object-fit: cover;
   }

   &__message-bubble {
      background-color: #EEEEEE;
      color: #323232;
      border-radius: 12px;
      padding: 16px;
      position: relative;
      display: flex;
      max-width: 500px;
      gap: 8px;
      flex-direction: column;

      .chat-wrapper__message-translate {
         border-top: 1px solid #D6D6D6;
         color: #787878;
         padding-top: 8px;

         &-title {
            font-size: 12px;
         }

         &-content {
            word-wrap: break-word;
            font-size: 14px;
         }
      }
   }

   &__message-bubble--self {
      background-color: #D6EFFF;
      color: #323232;

      .chat-wrapper__message-translate {
         border-top: 1px solid #A4DCFF;
         color: #3366FF;
         padding-top: 8px;

         &-title {
            font-size: 12px;
         }

         &-content {
            word-wrap: break-word;
            font-size: 14px;
         }
      }
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
      word-wrap: break-word;
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
      border-radius: 0 0 4px 4px;
      width: 100%;
      background: #fff;
      box-shadow: 0px -3px 10px rgba(0, 0, 0, 0.05);
      padding: 8px 24px;
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
      align-items: center;
      height: 100%;
      padding: 20px;
      border-radius: 8px;
   }

   &__file-input {
      display: none;
   }
}


.chat-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px 16px;
   border-radius: 4px 4px 0 0;
   box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
   gap: 20px;
   color: #3366FF;
   background-color: #fff;
   position: relative;
   z-index: 10002;

   @media screen and (max-width: 768px) {
      padding: 16px;
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
      height: 34px;
      border-radius: 50%;
      background-color: #3366FF;
      object-fit: cover;

      @media (max-width: 768px) {
         position: absolute;
         top: -5px;
         left: -11px;
      }
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

   &__ad-amount {
      font-weight: 700;
      display: flex;
      color: #323232;
      gap: 3px;
      margin-left: 12px;
   }

   &__ad-title {
      font-size: 14px;
      display: flex;
      color: #666;
      outline: none;
      text-decoration: none;
   }

   &__ad-image {
      width: 53px;
      height: 53px;
      border-radius: 4px;
      object-fit: cover;
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

      &:hover {
         background-color: #D6EFFF;
      }

      cursor: pointer;
      transition: color 0.3s ease;

      img {
         width: 14px;
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
   max-width: 400px;

   h2 {
      font-size: 16px;
      display: flex;
      align-items: center;
      color: #323232;
      margin-bottom: 10px;
      justify-content: center;
      gap: 10px;
   }
}

.no-messages-text {
   font-size: 14px;
   margin-bottom: 16px;
   color: #666666;
}

.no-messages-image {
   width: 18px;
   height: auto;
}

// skeleton

.chat-wrapper__message-item--skeleton {
   display: flex;
   align-items: flex-start;
   margin-bottom: 24px;
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

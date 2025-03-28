<template>
   <div :class="['messages-container', { 'profile-page': isProfilePage }]">
      <!-- Кнопка "Написать в поддержку" -->
      <div class="support-button" :class="{ 'profile-page': isProfilePage }" @click="openSupport">
         <img src="../assets/icons/supp.svg" alt="Support Icon" class="support-icon" />
         <span>Написать в поддержку</span>
      </div>
      <SkeletonMessage v-if="isLoading" v-for="index in 3" :key="index" />
      <div v-else v-for="message in lastMessages" :key="message.id" :class="[
         'message-item',
         { 'unread-message': message.from_user.id !== userStore.userId && !message.read_at, 'profile-page': isProfilePage }
      ]" @click="openChat(message)">
         <CheckboxUI class="message-checkbox" v-if="isProfilePage" :modelValue="isMessageSelected(message)"
            @update:modelValue="toggleMessage(message)" @click.stop />
         <div class="image-container">
            <img v-if="!isProfilePage" :src="getImageUrl(relevantUser(message).photo?.path, avatar)" alt="Avatar"
               class="avatar" />
            <img :src="getImageUrl(message.ads_photo[0]?.arr_title_size.preview)" alt="Ad Image" class="ad-image" />
         </div>

         <div class="message-info">
            <div class="message-info__container">
               <img v-show="isProfilePage" :src="getImageUrl(relevantUser(message).photo?.path, avatar)" alt="Avatar"
                  :class="['avatar', { 'profile-page': isProfilePage }]" />
               <div class="message-info__block">
                  <div class="user-info">
                     {{ relevantUserInfo(message) }}
                  </div>
                  <div class="ad-details">
                     <span>{{ message.ads_info }}</span>
                     <div class="chat-header__ad-amount">
                        {{ formatNumberWithSpaces(message.ads_amount) }}
                        <span class="chat-header__ad-amount-currency">₽</span>
                     </div>
                  </div>
               </div>
               <div v-if="isProfilePage" class="ad-date">
                  {{ formatDate(message.created_at) }}
               </div>
            </div>
            <div class="message-text" v-if="message.message && message.message.trim()">
               {{ messageContent(message) }}
            </div>
            <div class="attachment-placeholder" v-else>
               <img src="../assets/icons/paperclip.svg" alt="Attachment" class="attachment-placeholder" />
               <span>Вложение</span>
            </div>
         </div>
      </div>
      <div v-if="lastMessages.length === 0 && isProfilePage && !isLoading" class="chat-wrapper__no-messages">
         <div class="no-messages-container">
            <h2>Cообщений пока нет
               <img src="../assets/icons/sad-smile.svg" alt="No messages" class="no-messages-image" />
            </h2>
            <p class="no-messages-text">
               Вы можете безопасно переписываться с потенциальными продавцами и покупателями, обмениваться изображениями
               и необходимыми документами на сайте
            </p>
         </div>
      </div>
   </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessagesStore } from '~/store/messages';
import { useChatStore } from '~/store/chatStore';
import { useSelectedMessagesStore } from '~/store/selectedMessages';
import { useUserStore } from '~/store/user.js';
import { relevantUser, relevantUserInfo } from '../services/userUtils.js';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { getImageUrl } from '../services/imageUtils.js';
import avatar from '../assets/icons/avatar-revers.svg';
import suppIcon from '../assets/icons/supp.svg';

const emit = defineEmits(['open-chat', 'open-support']);

const messagesStore = useMessagesStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const selectedMessagesStore = useSelectedMessagesStore();
const { locale } = useI18n();

const lastMessages = computed(() => messagesStore.lastMessages || []);
const isLoading = computed(() => messagesStore.loading);

const props = defineProps({
   isProfilePage: {
      type: Boolean,
      default: false,
   },
});

const formatDate = (dateString) => {
   const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нояб', 'дек'];
   const date = new Date(dateString);
   return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
};

const messageContent = (message) => {
   return locale.value !== 'ru' && message.message_translate ? message.message_translate : message.message;
};

const openChat = (message) => {
   emit('open-chat', message);
   messagesStore.loadLastMessages();
};

const openSupport = () => {
   prepareChatData();
   emit('open-support');
};

const prepareChatData = async () => {
   const chatData = {
      sup_photo: {
         path: suppIcon,
      },
      for_user: {
         username: 'Поддержка',
      },
      is_support: true,
   };

   chatStore.setCurrentChat(chatData);
};

const isMessageSelected = (message) => {
   return selectedMessagesStore.selectedMessages.some((selected) => selected.id === message.id);
};

const toggleMessage = (message) => {
   const messageData = {
      id: message.id,
      ads_id: message.ads_id,
      main_category_id: message.main_category_id,
      user_id: message.for_user.id,
      user_id_alt: message.from_user.id,
   };
   selectedMessagesStore.toggleMessage(messageData);
};

onMounted(() => {
   messagesStore.loadLastMessages(locale.value);
});
</script>


<style lang="scss" scoped>
.messages-container {
   display: flex;
   flex-direction: column;
   height: 100%;
   width: 100%;
   padding-top: 70px;

   &.profile-page {
      gap: 16px;
      padding-top: 0;

      @media (max-width: 768px) {
         gap: 0;
      }
   }
}

.chat-header__ad-amount {
   font-weight: 700;
   display: flex;
   color: #323232;
   gap: 3px;
   margin-left: 12px;
}

.message-item {
   position: relative;
   display: flex;
   width: 100%;
   z-index: 20;
   padding: 16px 24px 16px 16px;
   background: #fff;
   cursor: pointer;
   gap: 16px;
   transition: background-color 0.3s, transform 0.3s;
   overflow: hidden;
   box-sizing: border-box;
   background-color: #fff;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   transition: background-color 0.3s;

   @media (max-width: 991px) {
      padding: 16px;
      padding-left: 24px;
   }

   &.profile-page {
      border-radius: 6px;

      @media (max-width: 991px) {
         border-radius: 0;
         box-shadow: none;

      }
   }

   &.unread-message {
      background-color: #EEF9FF;
   }
}

.message-checkbox {
   width: 16px;
   height: 16px;
   margin: auto 0;
   accent-color: #3366FF;

   @media (max-width: 991px) {
      display: none;
   }
}

.image-container {
   position: relative;
}

.avatar {
   width: 34px;
   height: 34px;
   min-width: 34px;
   min-height: 34px;
   border-radius: 50%;
   border: 1px solid #fff;
   background-color: #3366FF;
   position: absolute;
   object-fit: cover;
   top: -8px;
   left: -11px;

   &.profile-page {
      position: static;
      border: none;

      @media (max-width: 991px) {
         position: absolute;
         border: 1px solid #fff;
         background-color: #3366FF;
         top: 6px;
         left: 11px;
      }
   }
}

.ad-image {
   width: 70px;
   height: 70px;
   border-radius: 4px;
   object-fit: cover;
}

.message-info {
   display: flex;
   flex-direction: column;
   gap: 3px;
   width: 100%;
   max-width: calc(100% - 140px);

   &__container {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
   }

   &__block {
      display: flex;
      flex-direction: column;
      gap: 3px;
      max-width: 100%;
   }
}

.user-info,
.ad-details,
.message-text {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}

.user-info {
   font-weight: 700;
   color: #323232;
   font-size: 16px;
   flex-grow: 1;
}

.ad-details {
   display: flex;
   font-weight: 400;
   color: #323232;
   font-size: 14px;
   line-height: 18px;
   margin-bottom: 3px;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;

   span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }
}

.ad-date {
   color: #323232;
   font-size: 12px;
   align-self: flex-start;
   text-align: right;
   line-height: 24px;
   margin-left: auto;
   width: 100%;

   @media (max-width: 500px) {
      display: none;
   }
}

.message-text {
   color: #787878;
   line-height: 18px;
   font-size: 14px;
   font-weight: 400;
   overflow: hidden;
   text-overflow: ellipsis;
}

.attachment-placeholder {
   display: flex;
   gap: 4px;
   color: #3366FF;
   line-height: 18px;
   font-size: 14px;
   font-weight: 400;

   img {
      height: 16px;
   }
}

.support-button {
   display: flex;
   align-items: center;
   gap: 12px;
   padding: 6px 16px;
   background-color: #eef9ff;
   border-radius: 6px;
   font-weight: 700;
   cursor: pointer;
   font-size: 16px;
   color: #323232;
   margin: 16px;
   transition: background-color 0.2s ease;

   &.profile-page {
      margin: 0;

      @media (max-width: 768px) {
         margin: 16px;
      }
   }

   &:hover {
      background-color: #dceeff;
   }

   .support-icon {
      width: 40px;
      height: 40px;
   }
}

.chat-wrapper__no-messages {
   display: flex;
   justify-content: center;
   align-items: center;
   height: auto;
   min-height: 350px;
   padding: 20px;
   border-radius: 8px;
}

.no-messages-container {
   text-align: center;
   max-width: 400px;
   height: 100%;

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
</style>
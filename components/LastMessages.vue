<template>
   <div :class="['messages-container', { 'profile-page': isProfilePage }]">
      <SkeletonMessage v-if="isLoading" v-for="index in 4" :key="index" />
      <div v-else v-for="message in lastMessages" :key="message.id"
         :class="[
            'message-item',
            { 'unread-message': message.from_user.id !== userStore.userId && !message.read_at, 'profile-page': isProfilePage }]" @click="openChat(message)">
         <input v-if="isProfilePage" @click.stop type="checkbox" class="message-checkbox" :value="message.id"
            :checked="isMessageSelected(message)" @change="toggleMessage(message)" />
         <div class="image-container">
            <img v-if="!isProfilePage" :src="getImageUrl(relevantUser(message).photo?.path, avatar)" alt="Avatar"
               class="avatar" />
            <img :src="getImageUrl(message.ads_photo[0]?.path)" alt="Ad Image" class="ad-image" />
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
            <div class="message-text">
               <div v-if="message.message && message.message.trim()">
                  {{ messageContent(message) }}
               </div>
               <div class="attachment-placeholder" v-else>
                  <img src="../assets/icons/paperclip.svg" alt="Attachment" class="attachment-placeholder" />
                  <span>Вложение</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessagesStore } from '~/store/messages';
import { useSelectedMessagesStore } from '~/store/selectedMessages';
import { useUserStore } from '~/store/user.js';
import { relevantUser, relevantUserInfo } from '../services/userUtils.js';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { getImageUrl } from '../services/imageUtils.js';
import avatar from '../assets/icons/avatar-revers.svg';

const emit = defineEmits(['open-chat']);

const messagesStore = useMessagesStore();
const userStore = useUserStore();
const selectedMessagesStore = useSelectedMessagesStore();
const { locale } = useI18n();

const lastMessages = computed(() => messagesStore.lastMessages)
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
   padding: 16px 24px 16px 16px;
   background: #fff;
   cursor: pointer;
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
   margin-right: 16px;
   accent-color: #3366FF;

   @media (max-width: 991px) {
      display: none;
   }
}

.image-container {
   position: relative;
   margin-right: 15px;
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
</style>
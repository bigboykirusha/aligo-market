<template>
   <div :class="['messages-container', { 'profile-page': isProfilePage }]">
      <SkeletonMessage v-if="loading" v-for="index in 3" :key="index" />
      <div v-else v-for="message in lastMessages" :key="message.id"
         :class="['message-item', { 'unread-message': !message.read_at, 'profile-page': isProfilePage }]"
         @click="openChat(message)">
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
                     {{ message.ads_info }}
                     <div class="chat-header__ad-amount">
                        {{ formatNumberWithSpaces(message.ads_amount) }} <span class="chat-header__ad-amount-currency">₽</span>
                     </div>
                  </div>
               </div>
               <div v-if="isProfilePage" class="ad-date">
                  {{ formatDate(message.created_at) }}
               </div>
            </div>
            <div class="message-text">
               {{ messageContent(message) }}
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getImageUrl } from '../services/imageUtils';
import { fetchLastMessages } from '~/services/apiClient';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { relevantUser, relevantUserInfo} from '../services/userUtils.js'
import { useUserStore } from '~/store/user';
import { useSelectedMessagesStore } from '~/store/selectedMessages';
import avatar from '../assets/icons/avatar-revers.svg';

const userStore = useUserStore();
const selectedMessagesStore = useSelectedMessagesStore();
const emit = defineEmits(['open-chat']);
const lastMessages = ref([]);
const loading = ref(true);
const { locale } = useI18n();

const props = defineProps({
   isProfilePage: {
      type: Boolean,
      default: false,
   },
});

const formatDate = (dateString) => {
   const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нояб', 'дек'];
   const date = new Date(dateString);
   return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
      .toString()
      .padStart(2, '0')}`;
};

const messageContent = (message) => {
   return locale.value !== 'ru' && message.message_translate ? message.message_translate : message.message;
};

const loadLastMessages = async () => {
   loading.value = true;
   try {
      const { data } = await fetchLastMessages(locale.value);
      lastMessages.value = data;
   } catch (error) {
      console.error('Ошибка при загрузке последних сообщений:', error);
   } finally {
      loading.value = false;
   }
};

const openChat = (message) => {
   emit('open-chat', message );
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
   };
   selectedMessagesStore.toggleMessage(messageData);
};

onMounted(loadLastMessages);
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
   padding: 16px 24px;
   background: #fff;
   cursor: pointer;
   transition: background-color 0.3s, transform 0.3s;
   overflow: hidden;
   box-sizing: border-box;
   background-color: #fff;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   transition: background-color 0.3s;

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
   width: calc(100% - 70px);

   &__container {
      display: flex;
      align-items: center;
      gap: 16px;
   }

   &__block {
      display: flex;
      flex-direction: column;
      gap: 3px;
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
}

.ad-details {
   display: flex;
   font-weight: 400;
   color: #323232;
   font-size: 14px;
   line-height: 18px;
   margin-bottom: 3px;
}

.ad-date {
   color: #323232;
   font-size: 12px;
   align-self: flex-start;
   line-height: 24px;
   margin-left: auto;

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
</style>
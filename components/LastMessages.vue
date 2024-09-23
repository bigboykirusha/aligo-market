<template>
   <div :class="['messages-container', { 'profile-page': isProfilePage }]">
      <div v-for="message in lastMessages" :key="message.id"
         :class="['message-item', { 'unread-message': !message.read_at, 'profile-page': isProfilePage }]"
         @click="openChat(message)">
         <input v-if="isProfilePage" @click.stop type="checkbox" class="message-checkbox" :value="message.id"
            :checked="isMessageSelected(message)" @change="toggleMessage(message)" />
         <div class="image-container">
            <img v-if="!isProfilePage" :src="message.avatarUrl || avatar" alt="Avatar" class="avatar" />
            <img :src="message.adImageUrl" alt="Ad Image" class="ad-image" />
         </div>

         <div class="message-info">
            <div class="message-info__container">
               <img v-show="isProfilePage" :src="message.avatarUrl || avatar" alt="Avatar"
                  :class="['avatar', { 'profile-page': isProfilePage }]" />
               <div class="message-info__block">
                  <div class="user-info">{{ getUserInfo(message.user) }}</div>
                  <div class="ad-details">{{ message.adDetails }}
                     <div class="chat-header__ad-amount">{{ message.adAmount }}<span
                           class="chat-header__ad-amount-currency">₽</span></div>
                  </div>
               </div>
               <div v-if="isProfilePage" class="ad-date">{{ formatDate(message.created_at) }}</div>
            </div>
            <div class="message-text">
               {{ locale !== 'ru' && message.message_translate ? message.message_translate :
                  message.message }}
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getImageUrl } from '../services/imageUtils'
import { fetchLastMessages, getUser, getCarById } from '~/services/apiClient';
import { useUserStore } from '~/store/user';
import { useSelectedMessagesStore } from '~/store/selectedMessages';
import avatar from '../assets/icons/avatar-revers.svg';

const userStore = useUserStore();
const selectedMessagesStore = useSelectedMessagesStore();
const emit = defineEmits(['open-chat']);
const lastMessages = ref([]);
const { locale } = useI18n();

const props = defineProps({
   isProfilePage: {
      type: Boolean,
      default: false
   }
});

const formatDate = (dateString) => {
   const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нояб', 'дек'];
   const date = new Date(dateString);
   return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getUserAvatar = async (userId) => {
   const cachedUser = localStorage.getItem(`user-${userId}`);
   if (cachedUser) return JSON.parse(cachedUser);

   try {
      const userData = await getUser(userId);
      const avatarUrl = getImageUrl(userData.photo?.path, avatar);
      const userInfo = { avatarUrl, user: userData };
      localStorage.setItem(`user-${userId}`, JSON.stringify(userInfo));
      return userInfo;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      return { avatarUrl: '', user: null };
   }
};

const getAdImageUrl = async (adId) => {
   const cachedAd = localStorage.getItem(`ad-${adId}`);
   if (cachedAd) return JSON.parse(cachedAd);

   try {
      const adData = await getCarById(adId);
      const adImageUrl = getImageUrl(adData.photos[0]?.path);
      const adAmount = adData.ads_parameter.amount;
      const adDetails = `${adData.auto_technical_specifications[0].brand.title} ${adData.auto_technical_specifications[0].model.title} ${adData.auto_technical_specifications[0].year_release.title}`;
      const adInfo = { adImageUrl, adDetails, adAmount };
      localStorage.setItem(`ad-${adId}`, JSON.stringify(adInfo));
      return adInfo;
   } catch (error) {
      console.error('Ошибка при получении данных объявления:', error);
      return { adImageUrl: '', adDetails: '' };
   }
};

const loadLastMessages = async () => {
   try {
      const { data } = await fetchLastMessages(locale.value);
      lastMessages.value = await Promise.all(data.map(async (message) => {
         const userId = message.from_user_id === userStore.userId ? message.for_user_id : message.from_user_id;
         const { avatarUrl, user } = await getUserAvatar(userId);
         const { adImageUrl, adDetails, adAmount } = await getAdImageUrl(message.ads_id);
         return { ...message, avatarUrl, adImageUrl, adDetails, adAmount, user };
      }));
   } catch (error) {
      console.error('Ошибка при загрузке последних сообщений:', error);
   }
};

const openChat = (message) => {
   emit('open-chat', {
      ...message,
      avatarUrl: message.avatarUrl,
      adImageUrl: message.adImageUrl,
      userInfo: getUserInfo(message.user),
      adDetails: message.adDetails,
      adAmount: message.adAmount
   });
};

const getUserInfo = (user) => user ? user.username || user.login || user.phone || 'Имя не указано' : 'Имя не указано';

const isMessageSelected = (message) => {
   return selectedMessagesStore.selectedMessages.some(selected => selected.id === message.id);
};

const toggleMessage = (message) => {
   const messageData = {
      id: message.id,
      ads_id: message.ads_id,
      main_category_id: message.main_category_id,
      user_id: message.for_user_id,
   };
   selectedMessagesStore.toggleMessage(messageData);
};

onMounted(() => {
   loadLastMessages();
});
</script>

<style lang="scss" scoped>
.messages-container {
   display: flex;
   flex-direction: column;
   padding-top: 70px;
   height: 100%;
   width: 100%;
   overflow-y: auto;

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
<template>
   <div class="notifications">
      <div class="notifications__title">
         Оповещения
      </div>
      <div v-show="!loading && notifications.length" class="notifications__actions">
         <button v-if="hasUnreadNotifications" @click="handleMarkAllAsRead" class="notifications__action-button">
            <img src="../assets/icons/done.svg" alt="done" />
            <span> Пометить все как прочитанные</span>
         </button>
         <button @click="handleDeleteAll" class="notifications__action-button">
            <img src="../assets/icons/delete.svg" alt="delete" />
            <span>Удалить все</span>
         </button>
      </div>
      <div class="notifications__content">
         <ul v-if="!loading && notifications.length">
            <!-- Уведомления -->
            <li v-for="(notification, index) in notifications" :key="notification.id">
               <!-- Если специальное уведомление -->
               <SpecialNotificationCard v-if="notification.type === 'App\\Notifications\\NotifyAuthNotification'"
                  :title="notification.data.content.title" :message="notification.data.content.message"
                  :bgImage="getImageUrl(notification.data.content.bgImage)" :bgColor="notification.data.content.bgColor"
                  :buttonText="notification.data.content.buttonText" @button-click="handleSpecialButtonClick(index)" />

               <!-- Если обычное уведомление -->
               <NotificationCard v-else :notification="notification" :isEven="index % 2 === 0"
                  @mark-as-read="handleMarkAsRead(notification.id)"
                  @delete-notification="handleDeleteNotification(notification.id)" />
            </li>
         </ul>

         <!-- Скелетон загрузки -->
         <NotificationCardSkeleton v-if="loading" v-for="index in 3" :key="`skeleton-${index}`" />

         <!-- Плейсхолдер для пустого списка -->
         <div v-show="!loading && !notifications.length" class="notifications__placeholder">
            <svg height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M15 7.61112C15.0027 8.63769 14.7628 9.65036 14.3 10.5667C13.7512 11.6647 12.9076 12.5882 11.8636 13.2339C10.8195 13.8795 9.6164 14.2217 8.38888 14.2222C7.36231 14.2249 6.34964 13.9851 5.43333 13.5222L1 15L2.47778 10.5667C2.01494 9.65036 1.7751 8.63769 1.77778 7.61112C1.77825 6.3836 2.12047 5.18046 2.76611 4.13644C3.41175 3.09243 4.3353 2.24879 5.43333 1.70002C6.34964 1.23719 7.36231 0.997346 8.38888 1.00002H8.77777C10.3989 1.08946 11.9301 1.77372 13.0782 2.9218C14.2263 4.06987 14.9105 5.60108 15 7.22223V7.61112Z"
                  stroke="#D6D6D6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
            </svg>
            <p class="notifications__placeholder-text">Уведомлений пока нет</p>
            <p class="notifications__placeholder-description">
               Здесь будут собираться все важные уведомления от Aligo
            </p>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getImageUrl } from '../services/imageUtils';
import {
   getNotifications,
   markNotificationAsRead,
   deleteNotificationById,
   deleteAllNotifications,
   markAllNotificationsAsRead,
} from '~/services/apiClient.js';

const notifications = ref([]);
const loading = ref(true);

const fetchNotifications = async () => {
   try {
      const fetchedNotifications = await getNotifications();
      notifications.value = fetchedNotifications;
   } catch (error) {
      console.error('Ошибка при получении оповещений: ', error);
   } finally {
      loading.value = false;
   }
};

const hasUnreadNotifications = computed(() => {
   return notifications.value.some((notif) => !notif.read_at);
});

const handleSpecialButtonClick = (index) => {
   console.log(`Кнопка специального уведомления №${index + 1} была нажата.`);
};

const handleMarkAsRead = async (id) => {
   try {
      await markNotificationAsRead(id);
      const notification = notifications.value.find((notif) => notif.id === id);
      if (notification) {
         notification.read_at = new Date().toISOString();
      }
   } catch (error) {
      console.error('Ошибка при пометке уведомления как прочитанного:', error);
   }
};

const handleDeleteNotification = async (id) => {
   try {
      await deleteNotificationById(id);
      notifications.value = notifications.value.filter((notif) => notif.id !== id);
   } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
   }
};

const handleMarkAllAsRead = async () => {
   try {
      await markAllNotificationsAsRead();
      notifications.value.forEach((notif) => {
         notif.read_at = new Date().toISOString();
      });
   } catch (error) {
      console.error('Ошибка при пометке всех уведомлений как прочитанных:', error);
   }
};

const handleDeleteAll = async () => {
   try {
      await deleteAllNotifications();
      notifications.value = [];
   } catch (error) {
      console.error('Ошибка при удалении всех уведомлений:', error);
   }
};

onMounted(fetchNotifications);
</script>

<style scoped lang="scss">
.notifications {
   width: 100%;
   margin-bottom: 40px;

   ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: auto;
      overflow-y: auto;
      margin-bottom: 24px;
      padding: 8px;
      margin: -8px;

      @media (max-width: 768px) {
         margin-bottom: 0;
      }
   }

   &__title {
      color: #3366ff;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   &__actions {
      display: flex;
      gap: 16px;
      padding-bottom: 16px;
      margin-left: -10px;

      @media (max-width: 500px) {
         margin-left: 0;
      }
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

      &:hover {
         background-color: #D6EFFF;
      }

      img {
         height: 16px;

         @media (max-width: 500px) {
            height: 14px;
         }
      }

      @media (max-width: 500px) {
         min-width: 34px;
         padding: 0 9px;
         background: #D6EFFF;
         border-radius: 6px;
         height: 34px;

         &:last-child {
            span {
               display: none;
            }
         }
      }
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 450px;
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
</style>
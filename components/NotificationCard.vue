<template>
   <li class="notification-card" :class="{ 'notification-card--unread': !notification.read_at }">
      <div class="notification-card__body">
         <div class="notification-card__header">
            <span class="notification-card__type">{{ notification.data.notify }}</span>
         </div>
         <p class="notification-card__text">
            {{ getAdditionalText(notification.data.notify) }}
         </p>

      </div>
      <div class="notification-card__footer">
         <span class="notification-card__date">{{ formatDate(notification.created_at) }}</span>
         <div class="notification-card__buttons">
            <button v-if="!notification.read_at" @click="markAsRead" class="notification-card__button">
               <img src="../assets/icons/done.svg" alt="done" />
            </button>
            <button @click="deleteNotification" class="notification-card__button">
               <img src="../assets/icons/delete.svg" alt="delete" />
            </button>
         </div>
      </div>
   </li>
</template>

<script setup>
const props = defineProps({
   notification: {
      type: Object,
      required: true,
   },
});

const emit = defineEmits(['mark-as-read', 'delete-notification']);

/**
 * Генерация дополнительного текста на основе уведомления
 */
const getAdditionalText = (notifyText) => {
   switch (notifyText) {
      case 'Объявление перенесено в архив':
         return 'Ваше объявление было перемещено в архив. Вы можете вернуться к нему, если необходимо.';
      case 'Создан черновик объявления':
         return 'Ваше объявление сохранено как черновик. Вы можете продолжить редактировать его в любой момент.';
      case 'Объявление повторно опубликовано':
         return 'Ваше объявление было успешно повторно опубликовано. Оно снова доступно для просмотра.';
      case 'Объявление снято с публикации':
         return 'Ваше объявление было снято с публикации. Вы можете внести изменения и снова опубликовать его.';
      case 'Создано новое объявление и отправлено на модерацию':
         return 'Ваше новое объявление успешно создано и отправлено на модерацию. Ожидайте проверки.';
      case 'Получено новое сообщение':
         return 'У вас новое сообщение! Пожалуйста, проверьте ваши сообщения в личном кабинете.';
      case 'Добавлен новый отзыв к объявлению':
         return 'Ваше объявление получило новый отзыв. Вы можете ознакомиться с ним в личном кабинете.';
      default:
         return 'Уведомление не распознано. Пожалуйста, проверьте систему уведомлений.';
   }
};

const formatDate = (dateString) => {
   const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
   return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const markAsRead = () => {
   emit('mark-as-read', props.notification.id);
};

const deleteNotification = () => {
   emit('delete-notification', props.notification.id);
};
</script>

<style scoped lang="scss">
.notification-card {
   position: relative;
   display: flex;
   justify-content: space-between;
   padding: 24px 40px;
   border-radius: 8px;
   font-size: 14px;
   color: #323232;
   background-color: #ffffff;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   transition: background-color 0.3s;

   @media (max-width: 768px) {
      padding: 24px;
   }

   &--unread {
      background-color: #EEF9FF;
   }

   &--text {
      color: #323232;
      font-size: 14px;
   }

   &__type   {
      font-weight: 700;
      line-height: 1;
      font-size: 20px;
      color: #323232;
   }

   &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
   }

   &__body {
      max-width: 80%;

      p {
         margin: 8px 0;
         color: #323232;
         font-size: 14px;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;

         .link {
            color: #3366FF;
            cursor: pointer;

            &:hover {
               color: #003399;
            }
         }
      }

      @media (max-width: 768px) {
         padding-bottom: 16px;
      }
   }

   &__footer {
      display: flex;
      flex-direction: column;

      .notification-card__date {
         font-size: 12px;
         color: #787878;
         margin-bottom: 16px;
         text-align: right;

         @media (max-width: 768px) {
            position: absolute;
            bottom: 0;
            left: 24px;
         }
      }

      .notification-card__buttons {
         display: flex;
         justify-content: flex-end;
         gap: 8px;

         @media (max-width: 768px) {
            flex-direction: column;
         }
      }

      .notification-card__button {
         height: 34px;
         width: 34px;
         display: flex;
         justify-content: center;
         align-items: center;
         background-color: #D6EFFF;
         border: none;
         border-radius: 4px;
         cursor: pointer;
         transition: all 0.2s ease;

         img {
            height: 14px;
         }

         &:hover {
            background-color: #A4DCFF;
         }
      }
   }
}
</style>

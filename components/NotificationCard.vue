<template>
   <li class="notification-card" :class="{ 'notification-card--unread': !notification.read_at }">
      <div class="notification-card__body">
         <div class="notification-card__header">
            <span class="notification-card__type">{{ notification.data.notify }}</span>
         </div>

         <!-- Уведомление о новом сообщении -->
         <p v-if="notification.data.new_message">
            <strong>От:</strong> {{ notification.data.from_user.username ? notification.data.from_user.username :
               notification.data.from_user.phone }}
         </p>
         <p v-if="notification.data.new_message">
            <strong>Сообщение:</strong> {{ notification.data.new_message.message }}
         </p>

         <!-- Уведомление о новом отзыве -->
         <div v-if="notification.data.review">
            <p><strong>Отзыв:</strong> {{ notification.data.review.comment }}</p>
            <p><strong>Оценка:</strong> {{ notification.data.review.grade }} из 5</p>
         </div>

         <!-- Категория объявления -->
         <p v-if="notification.data.ads">
            <strong>Категория:</strong> {{ getCategoryName(notification.data.ads.main_category_id) }}
         </p>

         <!-- Статус объявления -->
         <p v-if="notification.data.ads">
            <strong>Статус:</strong> {{ getAdStatus(notification.data.ads.is_draft, notification.data.ads.is_in_archive)
            }}
         </p>
      </div>
      <div class="notification-card__footer">
         <span class="notification-card__date">{{ formatDate(notification.created_at) }}</span>
         <div class="notification-card__buttons">
            <button @click="markAsRead" class="notification-card__button">
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
   isEven: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['mark-as-read', 'delete-notification']);

const getCategoryName = (categoryId) => {
   const categories = {
      1: 'Автомобили',
   };
   return categories[categoryId] || 'Неизвестная категория';
};

const getAdStatus = (isDraft, isInArchive) => {
   if (isDraft) return 'Черновик';
   if (isInArchive) return 'В архиве';
   return 'Опубликовано';
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
   transition: background-color 0.3s;

   @media (max-width: 768px) {
      padding: 24px;
   }

   &--unread {
      background-color: #EEF9FF;
   }

   &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .notification-card__type {
         font-weight: 700;
         line-height: 1;
         font-size: 20px;
         color: #3366FF;

         @media (max-width: 768px) {
            font-size: 14px;
         }
      }
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

         strong {
            font-weight: 700;
            color: #323232;
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
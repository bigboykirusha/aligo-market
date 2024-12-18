<template>
   <div class="info">
      <div class="info__photo" v-if="user.photo">
         <img :src="getImageUrl(user.photo.path, avatarPhoto)" :alt="user.username" class="info__image" />
      </div>
      <div class="info__detail">
         <span class="info__label">Номер профиля:</span>
         <span class="info__value">{{ user.unique_code }}</span>
      </div>
      <div class="info__detail">
         <span class="info__label">Псевдоним:</span>
         <span class="info__value-container">
            <span class="info__value">{{ user.username }}</span>
            <img :src="editIcon" alt="Редактировать" class="info__edit-icon" />
         </span>
      </div>
      <div class="info__detail">
         <span class="info__label">Логин:</span>
         <span class="info__value-container">
            <span class="info__value">{{ user.login }}</span>
            <img :src="editIcon" alt="Редактировать" class="info__edit-icon" />
         </span>
      </div>
      <div class="info__detail">
         <span class="info__label">Рейтинг:</span>
         <span class="info__value">{{ user.grade || 'У пользователя нет отзывов' }}</span>
      </div>
      <div class="info__detail">
         <span class="info__label">Количество отзывов:</span>
         <span class="info__value">{{ user.count_reviews_about_myself }}</span>
      </div>
      <div class="info__divider"></div>
      <div class="info__detail">
         <span class="info__label">Телефон:</span>
         <span class="info__value">{{ user.phone || 'Не указан' }}</span>
      </div>
      <div class="info__detail">
         <span class="info__label">Почта:</span>
         <span class="info__value">{{ user.email || 'Не указан' }}</span>
      </div>
      <div class="info__detail">
         <span class="info__label">Адрес:</span>
         <span class="info__value-container">
            <span class="info__value">{{ user.city || 'Не указан' }}</span>
            <img :src="editIcon" alt="Редактировать" class="info__edit-icon" />
         </span>
      </div>
      <div class="info__divider"></div>
      <div class="info__detail">
         <span class="info__label">Дата создания:</span>
         <span class="info__value">{{ new Date(user.created_at).toLocaleDateString() }}</span>
      </div>
      <div class="info__detail">
         <span class="info__label">Дата обновления:</span>
         <span class="info__value">{{ new Date(user.updated_at).toLocaleDateString() }}</span>
      </div>
   </div>
</template>

<script setup>
import { getImageUrl } from '~/services/imageUtils';
import avatarPhoto from "../assets/icons/avatar-revers.svg";
import editIcon from "../assets/icons/edit.svg";

const props = defineProps({
   user: Object
});
</script>

<style lang="scss" scoped>
.info {
   display: flex;
   flex-direction: column;
   gap: 16px;

   &__detail {
      display: flex;
      font-size: 14px;

      .info__label {
         color: #A8A8A8;
         display: block;
         width: 170px;
      }

      .info__value {
         color: #323232;
      }

      .info__value-container {
         display: flex;
         align-items: center;
         gap: 8px;
      }

      .info__edit-icon {
         width: 16px;
         cursor: pointer;
         opacity: 0.7;
         transition: opacity 0.2s ease;

         &:hover {
            opacity: 1;
         }
      }
   }

   &__photo {}

   &__image {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 50%;
   }

   &__divider {
      height: 1px;
      background-color: #D6D6D6;
   }
}
</style>

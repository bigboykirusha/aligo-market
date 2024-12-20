<template>
   <div id="blocked-users-popup" class="modal" :class="[{ 'modal--visible': isVisible }]" @click.self="closePopup">
   </div>
   <div class="modal__content" :class="[{ 'modal__content--visible': isVisible }]">
      <button class="modal__close-button" @click="closePopup">
         <img :src="closeIcon" alt="close icon" />
      </button>
      <div class="modal__body">
         <div class="modal__title">Заблокированные пользователи</div>

         <!-- Check if there are blocked users -->
         <ul v-if="blockedUsers.length > 0" class="blocked-users__list">
            <li v-for="user in blockedUsers" :key="user.id" class="blocked-users__item">
               <div class="blocked-users__info">
                  <img v-if="user.blocked_user.photo" :src="getImageUrl(user.blocked_user.photo.path, avatarRevers)"
                     alt="user photo" class="blocked-users__photo" />
                  <div class="blocked-users__details">
                     <span class="blocked-users__name">{{ user.blocked_user.username }}</span>
                     <span class="blocked-users__login">@{{ user.blocked_user.login }}</span>
                  </div>
               </div>
               <button class="blocked-users__unblock-button" @click="handleUnblockUser(user.blocked_user.id)">
                  <img src="../assets/icons/unblock.svg" alt="">Разблокировать
               </button>
            </li>
         </ul>

         <!-- Show this message when no users are blocked -->
         <p v-else>Вы пока никого не заблокировали.</p>

      </div>
   </div>
</template>

<script setup>
import closeIcon from '@/assets/icons/close.svg';
import { ref, onMounted } from 'vue';
import { getBlockedUsers, unblockUser } from '~/services/apiClient';
import { getImageUrl } from '~/services/imageUtils.js';
import avatarRevers from '~/assets/icons/avatar-revers.svg';

const props = defineProps({
   isVisible: Boolean,
});

const emit = defineEmits(['close']);
const blockedUsers = ref([]);

const closePopup = () => {
   emit('close');
};

const fetchBlockedUsers = async () => {
   try {
      const response = await getBlockedUsers();
      blockedUsers.value = response.data;
   } catch (error) {
      console.error('Ошибка при загрузке заблокированных пользователей:', error);
   }
};

const handleUnblockUser = async (userId) => {
   try {
      await unblockUser(userId);
      blockedUsers.value = blockedUsers.value.filter(user => user.blocked_user.id !== userId);
   } catch (error) {
      console.error(`Ошибка при разблокировке пользователя с ID ${userId}:`, error);
   }
};

onMounted(() => {
   fetchBlockedUsers();
});
</script>

<style scoped lang="scss">
.modal {
   position: fixed;
   z-index: 1400;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   transform: scaleY(0);
   transform-origin: top;

   &--visible {
      transform: scaleY(1);
   }

   @media (max-width: 768px) {
      align-items: flex-start;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(3px);
   }

   &__title {
      color: #323232;
      font-size: 18px;
      font-weight: 700;
      padding-bottom: 24px;
      border-bottom: 1px solid #D6D6D6;
      margin-bottom: 16px;
   }

   &__content {
      background: #fff;
      position: absolute;
      margin: auto;
      border-radius: 6px;
      top: 0;
      right: 0;
      z-index: 1401;
      width: 100%;
      max-width: 450px;
      min-width: 450px;
      padding: 28px 24px;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      transform: scale(0);
      transform-origin: top right;
      transition: opacity 0.3s ease, transform 0.3s ease;

      &--visible {
         transform: scale(1);
      }


      @media (max-width: 768px) {
         position: fixed;
         border-radius: 0 0 6px 6px;
         padding-top: 40px;
         top: 0;
         left: 0;
         min-width: 0;
         transform: scaleY(0);
         transform-origin: top;
         transition: transform 0.2s ease-in-out;

         &--visible {
            transform: scaleY(1);
         }
      }
   }

   &__close-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;

      @media (max-width: 768px) {
         right: 16px;
         top: 16px;
      }

      img {
         width: 16px;
         height: 16px;
      }
   }
}

.blocked-users {
   &__list {
      list-style: none;
      margin: 0;
      padding: 0;
   }

   &__item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
   }

   &__info {
      display: flex;
      align-items: center;
   }

   &__photo {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 12px;
   }

   &__details {
      display: flex;
      flex-direction: column;
   }

   &__name {
      font-weight: bold;
      font-size: 14px;
   }

   &__login {
      color: #888;
      font-size: 12px;
   }

   &__unblock-button {
      background-color: #ff4d4f;
      color: #fff;
      border: none;
      height: 34px;
      padding: 0 8px;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;

      &:hover {
         background-color: #ff7875;
      }
   }
}
</style>

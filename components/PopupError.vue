<template>
   <TransitionGroup name="popup-list" tag="div" class="popup-container">
      <div v-for="toast in popupErrorStore.notifications" :key="toast.id" class="popup" :class="toast.type">
         <div class="popup__content">
            <p class="popup__text">{{ toast.message }}</p>
            <img @click.prevent="popupErrorStore.removeNotification(toast.id)" class="popup__close-btn"
               src="../assets/icons/close-white.svg" alt="Close"/>
         </div>
      </div>
   </TransitionGroup>
</template>

<script setup>
import { usePopupErrorStore } from '@/store/popupErrorStore';

const popupErrorStore = usePopupErrorStore();
</script>

<style lang="scss" scoped>
.popup-container {
   position: fixed;
   background-color: none;
   right: 24px;
   bottom: 24px;
   display: flex;
   align-items: center;
   flex-direction: column;
   gap: 12px;
   z-index: 999999;

   @media (max-width: 768px) {
      right: 0;
      left: 0;
      bottom: 86px;
   }
}

.popup {
   width: 420px;
   color: white;
   backdrop-filter: blur(10px);
   background-color: none;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
   transition: all 0.4s ease;

   &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      gap: 16px;
      padding: 16px 24px;
   }

   &.error .popup__content {
      background: linear-gradient(135deg, #ff6a6a, #ff2e2e);
   }

   &.warning .popup__content {
      background: linear-gradient(135deg, #ffa500, #ff7b00);
   }

   &.notification .popup__content {
      background: linear-gradient(135deg, #3366ff, #0033cc);
   }

   &__close-btn {
      cursor: pointer;
      height: 16px;
      width: 16px;
      opacity: 0.8;
      transition: opacity 0.2s;
   }

   &__close-btn:hover {
      opacity: 1;
   }

   &__text {
      font-size: 14px;
      font-weight: 700;
   }

   @media (max-width: 768px) {
      left: 16px;
      right: 16px;
      width: calc(100% - 32px);
      bottom: 86px;
   }
}

/* Анимация */
.popup-list-enter-active,
.popup-list-leave-active {
   transition: all 0.4s ease;
}

.popup-list-enter-from {
   opacity: 0;
   transform: translateY(15px) scale(0.98);
}

.popup-list-leave-to {
   opacity: 0;
   transform: translateY(-15px) scale(0.98);
}
</style>
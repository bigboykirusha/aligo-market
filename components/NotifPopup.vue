<template>
   <transition name="popup-fade">
      <div v-if="isPopupVisible" class="popup">
         <div class="popup__content">
            <p v-if="popupStore.statusText" class="popup__text">
               {{ popupStore.statusText }}
            </p>
            <img @click="hidePopup" class="popup__close-btn" src="../assets/icons/close-white.svg" alt="Close">
         </div>
      </div>
   </transition>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { usePopupStore } from '../store/popup.js';

const popupStore = usePopupStore();

const isPopupVisible = computed(() => popupStore.isPopupVisible);

const hidePopup = () => {
   popupStore.hidePopup();
};

onMounted(() => {
   if (popupStore.statusText) {
      setTimeout(hidePopup, 5000);
   }
});
</script>

<style lang="scss" scoped>
.popup {
   position: fixed;
   right: 24px;
   bottom: 96px;
   width: 420px;
   height: 50px;
   color: white;
   z-index: 9999;
   opacity: 1;
   transition: opacity 0.2s ease-in-out;

   &__content {
      display: flex;
      justify-content: center;
      border-radius: 12px;
      height: 50px;
      background-color: #3366ff;
      padding: 16px;
      position: relative;
      flex-direction: column;
   }

   &__close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      position: absolute;
      height: 12px;
      width: 12px;
      top: 8px;
      right: 8px;
   }

   &__text {
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
   }

   .popup__link {
      color: white;
      text-transform: uppercase;
      text-decoration: none;
      font-weight: 700;
      text-decoration: underline;
   }

   @media (max-width: 768px) {
      left: 0;
      right: 0;
      padding: 0 16px;
      width: 100%;
      bottom: 86px;

      &__close-btn {
         position: absolute;
         top: 8px;
         right: 8px;
         font-size: 30px;
      }
   }

   @media (min-width: 769px) {
      bottom: 110px;
   }
}

/* Анимации для появления и исчезновения */
.popup-fade-enter-active,
.popup-fade-leave-active {
   transition: opacity 0.3s ease, transform 0.3s ease;
}

.popup-fade-enter-from {
   opacity: 0;
   transform: translateY(24px);
}

.popup-fade-leave-to {
   opacity: 0;
   transform: translateY(24px);
}
</style>

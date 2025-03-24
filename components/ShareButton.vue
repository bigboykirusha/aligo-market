<template>
   <div class="car-details__wishlist" :class="{ hovered: isHovered }" @mouseenter="isHovered = true"
      @mouseleave="isHovered = false" ref="wishlist">
      <button class="car-details__wishlist-button" @click.stop="openSharePopup">
         <img :src="shareIcon" alt="Избранное" class="icon-heart" />
      </button>
      <span @click.stop="openSharePopup" class="car-details__wishlist-text">Поделиться</span>

      <div v-if="showSharePopup" class="overlay" @click="closeSharePopup">
         <div class="share-popup" @click.stop>
            <button class="share-popup__close" @click="closeSharePopup">
               <img src="../assets/icons/close-blue.svg" alt="Закрыть" />
            </button>
            <div class="share-popup__content">
               <div class="share-popup__title">Поделиться в:</div>
               <div class="share-popup__socials">
                  <div class="share-popup__option" @click="shareOnPlatform(whatsappShareLink)">
                     <img src="../assets/icons/wa-icon.svg" alt="WhatsApp" class="share-popup__icon" />
                     WhatsApp
                  </div>
                  <div class="share-popup__option" @click="shareOnPlatform(telegramShareLink)">
                     <img src="../assets/icons/telegram-icon.svg" alt="Telegram" class="share-popup__icon" />
                     Telegram
                  </div>
                  <div class="share-popup__option" @click="shareOnPlatform(vkShareLink)">
                     <img src="../assets/icons/vk-icon.svg" alt="ВКонтакте" class="share-popup__icon" />
                     ВКонтакте
                  </div>
               </div>
               <div class="share-popup__link" @click="copyLink">
                  <img src="../assets/icons/paperclip.svg" alt="Скопировать ссылку" class="share-popup__icon" />
                  Скопировать ссылку
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import shareIcon from '../assets/icons/share.svg';
import { usePopupErrorStore } from '~/store/popupErrorStore.js';

const props = defineProps({
   mobile: {
      type: Boolean,
      default: false,
   },
   id: Number,
   is_in_favorites: Number,
});

const emit = defineEmits(['toggle-login-modal']);

const isHovered = ref(false);
const popupErrorStore = usePopupErrorStore();

const showSharePopup = ref(false);

const currentUrl = window.location.href;
const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`;
const vkShareLink = `https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}`;

const openSharePopup = () => {
   showSharePopup.value = true;
};

const closeSharePopup = () => {
   showSharePopup.value = false;
};

const shareOnPlatform = (url) => {
   window.open(url, '_blank', 'noopener,noreferrer');
};

const copyLink = async () => {
   try {
      await navigator.clipboard.writeText(currentUrl);
      popupErrorStore.showNotification('Ссылка скопирована!');
   } catch (err) {
      popupErrorStore.showError('Не удалось скопировать ссылку.');
   }
};
</script>

<style lang="scss" scoped>
.car-details__wishlist {
   display: flex;
   align-items: center;
   gap: 6px;
   padding: 4px 8px;
   transition: background-color 0.3s ease, border-color 0.3s ease;
   border-radius: 18px;

   &:hover {
      background-color: #D6EFFF;
   }

   &-text {
      color: #3366ff;
      font-size: 14px;
      cursor: pointer;
      line-height: 1;
   }

   &-button {
      width: 20px;
      height: 20px;
      background-color: transparent;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s;

      &.active {
         background-color: #3366ff;
         border-color: #3366ff;
      }

      .icon-heart {
         margin-top: 1px;
         width: 12px;
         height: 12px;
      }
   }
}

.overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
}

.share-popup {
   background: white;
   padding: 32px;
   border-radius: 8px;
   width: 380px;
   text-align: center;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   position: relative;

   @media (max-width: 768px) {
      position: fixed;
      top: 0;
      width: 100%;
      border-radius: 0 0 8px 8px;
   }

   &__title {
      padding-bottom: 16px;
      font-size: 20px;
      font-weight: 700;
      text-align: left;
      color: #144DF8;
      border-bottom: 1px solid #D6D6D6;
   }

   &__option {
      padding: 8px;
      border-radius: 12px;
   }

   &__close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;

      img {
         height: 16px;
         width: 16px;
      }
   }

   &__socials {
      padding: 24px 0;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-bottom: 1px solid #D6D6D6;
   }

   &__option {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #323232;
      font-size: 14px;
      line-height: 18px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
         background-color: #e3f2fd;
      }

      .share-popup__icon {
         width: 20px;
         height: 20px;
      }
   }

   &__link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 12px;
      color: #3366FF;
      font-size: 14px;
      line-height: 18px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
         background-color: #e3f2fd;
      }

      .share-popup__icon {
         width: 16px;
         height: 16px;
      }
   }
}
</style>

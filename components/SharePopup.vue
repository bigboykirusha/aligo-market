<template>
   <div v-show="sharePopupStore.showSharePopup" class="overlay" @click="closeSharePopup">
      <div class="share-popup" @click.stop>
         <button class="share-popup__close" @click="closeSharePopup">
            <img src="../assets/icons/close-blue.svg" alt="Закрыть" />
         </button>
         <div class="share-popup__content">
            <div class="share-popup__title">Поделиться в</div>
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
</template>

<script setup>
import { useSharePopupStore } from '~/store/sharePopupStore';
import { usePopupErrorStore } from '~/store/popupErrorStore';

const sharePopupStore = useSharePopupStore();
const popupErrorStore = usePopupErrorStore();

const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(sharePopupStore.currentUrl)}`;
const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(sharePopupStore.currentUrl)}`;
const vkShareLink = `https://vk.com/share.php?url=${encodeURIComponent(sharePopupStore.currentUrl)}`;

const shareOnPlatform = (url) => {
   window.open(url, '_blank', 'noopener,noreferrer');
};

const copyLink = async () => {
   try {
      await navigator.clipboard.writeText(sharePopupStore.currentUrl);
      popupErrorStore.showNotification('Ссылка скопирована!');
   } catch (err) {
      popupErrorStore.showError('Не удалось скопировать ссылку.');
   }
};

const closeSharePopup = () => {
   sharePopupStore.closeSharePopup();
};
</script>

<style lang="scss" scoped>
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
   z-index: 100000;
}

.share-popup {
   background: white;
   padding: 24px 40px;
   border-radius: 8px;
   width: 380px;
   text-align: center;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   position: relative;
   animation: slide-in 0.15s ease;
   transform: translateY(-10px);
   transition: opacity 0.3s ease, transform 0.3s ease;

   @media (max-width: 768px) {
      position: fixed;
      top: 8px;
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
      top: 24px;
      right: 24px;
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

@keyframes slide-in {
   from {
      transform: translateY(-100%);
   }

   to {
      transform: translateY(0);
   }
}
</style>

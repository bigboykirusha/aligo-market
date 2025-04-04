import { defineStore } from 'pinia';

export const useSharePopupStore = defineStore('sharePopup', {
   state: () => ({
      showSharePopup: false,
      currentUrl: window.location.href,
   }),
   actions: {
      openSharePopup() {
         this.showSharePopup = true;
      },
      closeSharePopup() {
         this.showSharePopup = false;
      },
      setCurrentUrl(url) {
         this.currentUrl = url;
      }
   }
});

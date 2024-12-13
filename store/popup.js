import { defineStore } from 'pinia';

export const usePopupStore = defineStore('popup', {
   state: () => ({
      isPopupVisible: false,
      isAdSended: 0,
   }),
   actions: {
      showPopup() {
         this.isPopupVisible = true;
      },
      hidePopup() {
         this.isPopupVisible = false;
      },
      setAdSended(status) {
         this.isAdSended = status;

         if (status === 1 || status === 2 || status === 3 || status === 4 || status === 5) {
            this.showPopup();
            setTimeout(() => {
               this.hidePopup();
               this.isAdSended = 0;
            }, 5000);
         } else if (status === 0) {
            this.hidePopup();
         }
      },
   },
});

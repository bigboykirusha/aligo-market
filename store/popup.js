import { defineStore } from 'pinia';

export const usePopupStore = defineStore('popup', {
   state: () => ({
      isPopupVisible: false,
      isAdSended: 0,  
      statusText: '', 
   }),
   actions: {
      showPopup() {
         this.isPopupVisible = true;
      },
      hidePopup() {
         this.isPopupVisible = false;
      },
      setAdSended(status, statusMessage = '') {
         this.isAdSended = status;
         this.statusText = statusMessage;  

         if (status) {
            this.showPopup();
            setTimeout(() => {
               this.hidePopup();
               this.isAdSended = 0;
               this.statusText = '';  
            }, 5000);
         } else if (status === 0) {
            this.hidePopup();
            this.statusText = '';  
         }
      },
   },
});

import { defineStore } from 'pinia';

export const usePayPopupStore = defineStore('payPopup', {
   state: () => ({
      isPopupOpen: false,
      label: '',
   }),
   actions: {
      openPopup(newLabel) {
         this.label = newLabel;
         this.isPopupOpen = true;
      },
      closePopup() {
         this.isPopupOpen = false;
         this.label = ''; 
      },
   },
});
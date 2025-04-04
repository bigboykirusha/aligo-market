import { defineStore } from 'pinia';

export const useComplaintPopupStore = defineStore('complaintPopup', {
   state: () => ({
      isVisible: false,
      adsId: null,
      mainCategoryId: null,
      userId: null
   }),
   actions: {
      open(adsId, mainCategoryId, userId) {
         this.adsId = adsId;
         this.mainCategoryId = mainCategoryId;
         this.userId = userId;
         this.isVisible = true;
      },
      close() {
         this.isVisible = false;
      }
   }
});
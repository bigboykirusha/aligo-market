import { defineStore } from 'pinia';

export const usePhotoViewerStore = defineStore('photoViewer', {
   state: () => ({
      isVisible: false,
      images: [],
      carData: null,
      activeIndex: 0,
      adsId: null,
      userId: null,
   }),
   actions: {
      open(images, carData, activeIndex, adsId, userId) {
         this.images = images;
         this.carData = carData;
         this.activeIndex = activeIndex;
         this.adsId = adsId;
         this.userId = userId;
         this.isVisible = true;
      },
      close() {
         this.isVisible = false;
      }
   }
});
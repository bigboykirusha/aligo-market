import { defineStore } from 'pinia';

export const useLocationModalStore = defineStore('locationModal', {
   state: () => ({
      isActive: false,
   }),
   actions: {
      toggleMenu() {
         this.isActive = !this.isActive;
      },
      closeMenu() {
         this.isActive = false;
      },
   },
});
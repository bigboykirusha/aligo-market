import { defineStore } from 'pinia';

export const useUserMenuStore = defineStore('userMenu', {
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
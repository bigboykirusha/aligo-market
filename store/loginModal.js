import { defineStore } from 'pinia';

export const useLoginModalStore = defineStore('loginModal', {
   state: () => ({
      isOpen: false,
   }),
   actions: {
      toggleLoginModal() {
         this.isOpen = !this.isOpen;
      },
      openLoginModal() {
         this.isOpen = true;
      },
      closeLoginModal() {
         this.isOpen = false;
      },
   },
});
import { defineStore } from 'pinia';

export const useBurgerStore = defineStore('burger', {
   state: () => ({
      isOpen: false,
   }),
   actions: {
      toggleBurger() {
         this.isOpen = !this.isOpen;
      },
      openBurger() {
         this.isOpen = true;
      },
      closeBurger() {
         this.isOpen = false;
      },
   },
});
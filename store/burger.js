import { defineStore } from 'pinia';

export const useBurgerStore = defineStore('burger', {
   state: () => ({
      isOpen: false,
   }),
   actions: {
      toggleBurger() {
         this.isOpen = !this.isOpen;
         this.updateBodyScroll();
      },
      openBurger() {
         this.isOpen = true;
         this.updateBodyScroll();
      },
      closeBurger() {
         this.isOpen = false;
         this.updateBodyScroll();
      },
      updateBodyScroll() {
         if (this.isOpen) {
            document.body.classList.add('no-scroll');
         } else {
            document.body.classList.remove('no-scroll');
         }
      },
   },
});

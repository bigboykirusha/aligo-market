import { defineStore } from 'pinia';

export const useDropdownStore = defineStore('dropdown', {
   state: () => ({
      showDropdown: false,
   }),
   actions: {
      toggleDropdown() {
         this.showDropdown = !this.showDropdown;
         this.updateBodyScroll();
      },
      setDropdownState(state) {
         this.showDropdown = state;
         this.updateBodyScroll();
      },
      updateBodyScroll() {
         if (this.showDropdown && this.isMobile()) {
            document.body.style.overflow = 'hidden'; 
         } else {
            document.body.style.overflow = ''; 
         }
      },
      isMobile() {
         return window.innerWidth <= 768;
      },
   },
});

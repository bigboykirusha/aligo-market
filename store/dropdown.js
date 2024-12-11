import { defineStore } from 'pinia';

export const useDropdownStore = defineStore('dropdown', {
   state: () => ({
      showDropdown: false,
   }),
   actions: {
      toggleDropdown() {
         this.showDropdown = !this.showDropdown;
      },
      setDropdownState(state) {
         this.showDropdown = state;
      },
   },
});
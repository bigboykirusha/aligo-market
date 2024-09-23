import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
   state: () => ({
      language: null,
   }),
   actions: {
      setLanguage(lang) {
         this.language = lang;
      },
   },
});
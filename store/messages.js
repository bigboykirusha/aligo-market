import { defineStore } from 'pinia';
import { fetchLastMessages } from '~/services/apiClient';

export const useMessagesStore = defineStore('messages', {
   state: () => ({
      lastMessages: [],
      loading: true,
      error: null,
   }),
   actions: {
      async loadLastMessages(locale) {
         this.loading = true;
         this.error = null;

         await new Promise(resolve => setTimeout(resolve, 1000));

         try {
            const { data } = await fetchLastMessages(locale);
            this.lastMessages = data;
         } catch (err) {
            console.error('Ошибка при загрузке сообщений:', err);
            this.error = err;
         } finally {
            this.loading = false;
         }
      },
   },
});

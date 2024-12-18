import { defineStore } from 'pinia';
import { fetchLastMessages } from '~/services/apiClient';

export const useMessagesStore = defineStore('messages', {
   state: () => ({
      lastMessages: [],
      totalCount: 0, // Новый параметр для общего количества сообщений
      loading: true,
      error: null,
   }),
   actions: {
      async loadLastMessages(locale, unread_chats = false, read_chats = false, only_my_ads = false) {
         this.loading = true;
         this.error = null;

         await new Promise(resolve => setTimeout(resolve, 500));

         try {
            const { data, totalCount } = await fetchLastMessages(locale, unread_chats, read_chats, only_my_ads);
            this.lastMessages = data;
            this.totalCount = totalCount; 
         } catch (err) {
            console.error('Ошибка при загрузке сообщений:', err);
            this.error = err;
         } finally {
            this.loading = false;
         }
      }
   },
});


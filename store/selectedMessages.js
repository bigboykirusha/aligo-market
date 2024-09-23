import { defineStore } from 'pinia';
import { deleteChats, markChatsAsRead } from '~/services/apiClient';

export const useSelectedMessagesStore = defineStore('selectedMessages', {
   state: () => ({
      selectedMessages: [],
   }),
   actions: {
      toggleMessage(message) {
         const index = this.selectedMessages.findIndex(m => m.id === message.id);
         if (index > -1) {
            this.selectedMessages.splice(index, 1);
         } else {
            this.selectedMessages.push(message);
         }
      },
      selectAll(messages) {
         this.selectedMessages = messages;
      },
      deselectAll() {
         this.selectedMessages = [];
      },
      async deleteSelectedChats() {
         try {
            const ids = this.selectedMessages.map(message => ({
               ads_id: message.ads_id,
               main_category_id: message.main_category_id,
               user_id: message.user_id
            }));
            await deleteChats(ids);
            this.deselectAll();
         } catch (error) {
            console.error('Ошибка при удалении выбранных чатов:', error);
         }
      },
      async markSelectedChatsAsRead() {
         try {
            const ids = this.selectedMessages.map(message => ({
               ads_id: message.ads_id,
               main_category_id: message.main_category_id,
               user_id: message.user_id
            }));
            await markChatsAsRead(ids);
         } catch (error) {
            console.error('Ошибка при пометке выбранных чатов как прочитанных:', error);
         }
      }
   },
});

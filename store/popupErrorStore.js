import { defineStore } from 'pinia';

export const usePopupErrorStore = defineStore('popupErrorStore', {
   state: () => ({
      notifications: [],
      recentMessages: new Map(), 
   }),
   actions: {
      addNotification(message, type = 'notification', duration = 6000) {
         const key = `${type}-${message}`; 
         if (this.recentMessages.has(key)) return; 

         const id = Date.now();
         this.notifications.push({ id, message, type });

         this.recentMessages.set(key, true); 

         setTimeout(() => {
            this.removeNotification(id);
         }, duration);

         setTimeout(() => {
            this.recentMessages.delete(key); 
         }, 3000);
      },
      removeNotification(id) {
         this.notifications = this.notifications.filter(n => n.id !== id);
      },
      showError(message) {
         this.addNotification(message, 'error');
      },
      showWarning(message) {
         this.addNotification(message, 'warning');
      },
      showNotification(message) {
         this.addNotification(message, 'notification');
      },
   },
});
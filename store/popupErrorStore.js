import { defineStore } from 'pinia';

export const usePopupErrorStore = defineStore('popupErrorStore', {
   state: () => ({
      notifications: [],
   }),
   actions: {
      addNotification(message, type = 'notification', duration = 6000) {
         const id = Date.now();
         this.notifications.push({ id, message, type });

         setTimeout(() => {
            this.removeNotification(id);
         }, duration);
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

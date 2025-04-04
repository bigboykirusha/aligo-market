import { defineStore } from 'pinia';
import { addFavorites, getFavorites } from '../services/apiClient';
import { useUserStore } from '../store/user';

export const useFavoritesStore = defineStore('favorites', {
   state: () => ({
      items: [],
      countFavorites: 0,
   }),
   actions: {
      async fetchFavorites() {
         const userStore = useUserStore();
         if (!userStore.isLoggedIn) {
            console.warn('Пользователь не авторизован. Запрос избранных не выполнен.');
            return;
         }
         try {
            const response = await getFavorites();
            this.items = response.map(item => item.ads_show.id);
            this.countFavorites = this.items.length;
         } catch (error) {
            console.error('Ошибка при получении избранных: ', error);
         }
      },
      async toggleFavorite(itemId) {
         try {
            const isFavorite = this.items.includes(itemId);
            let response;

            if (isFavorite) {
               response = await addFavorites({ ads_id: itemId, main_category_id: 1 });
               if (response.success) {
                  this.items = this.items.filter(id => id !== itemId);
               }
            } else {
               response = await addFavorites({ ads_id: itemId, main_category_id: 1 });
               if (response.success) {
                  this.items.push(itemId);
               }
            }

            this.countFavorites = this.items.length;
            return response;
         } catch (error) {
            console.error('Ошибка при изменении избранного: ', error);
            throw error;
         }
      },
   },
});

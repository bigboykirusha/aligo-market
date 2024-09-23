import { useFavoritesStore } from '~/store/favorites';

export default defineNuxtPlugin(async (nuxtApp) => {
   const favoritesStore = useFavoritesStore(nuxtApp.$pinia);
   await favoritesStore.fetchFavorites();
});

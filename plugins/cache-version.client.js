export default defineNuxtPlugin(() => {
   const CACHE_VERSION = '1.1';
   const storedVersion = localStorage.getItem('cacheVersion');

   if (storedVersion !== CACHE_VERSION) {
      localStorage.clear();
      localStorage.setItem('cacheVersion', CACHE_VERSION);
   }
});
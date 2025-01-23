import { mask as vMask } from 'vue-the-mask';

export default defineNuxtPlugin((nuxtApp) => {
   nuxtApp.vueApp.directive('mask', vMask);
});

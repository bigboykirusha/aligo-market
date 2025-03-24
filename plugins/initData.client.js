import { useUserStore } from '~/store/user';
import { useCookie } from '#app';

export default defineNuxtPlugin(() => {
   const userStore = useUserStore();

   const savedUserData = useCookie('userData').value;
   if (savedUserData && savedUserData.token) {
      userStore.fetchAndSetUserdata();
   }
});


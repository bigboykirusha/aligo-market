import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getCookie } from '~/services/auth';
import { useChatStore} from '../store/chatStore.js'
import { useUserStore } from '~/store/user';

export default defineNuxtPlugin(nuxtApp => {
   let token = '';
   const userStore = useUserStore();
   const chatStore = useChatStore();
   const forWhomUserId = userStore.userId;
   const channelName = `store_message.${forWhomUserId}`;

   try {
      const cookieData = getCookie('userData');
      if (cookieData) {
         const savedUserData = JSON.parse(cookieData);
         token = savedUserData.token || '';
      }
   } catch (error) {
      console.error('Ошибка при извлечении токена из куки:', error);
   }

   if (!token) {
      console.error('Токен не найден');
      return;
   }

   window.Pusher = Pusher;
   window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'keyForWSAligo20052012***!!!',
      cluster: 'eu',
      wsHost: 'dev.aligo.pro',
      wsPort: 6001,
      forceTLS: false,
      encrypted: false,
      disableStats: true,
      authEndpoint: 'https://dev.aligo.pro/api/broadcasting/auth',
      auth: {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      },
   });

   window.Echo.private(channelName)
      .listen('.store_message', (res) => {
         console.log('store_message_ws', res);

         if (res.new_message) {
            chatStore.addMessage({
               ...res.new_message,
               isSelf: res.new_message.from_user_id === userStore.userId
            });
         }
      });

   nuxtApp.provide('echo', window.Echo);
});
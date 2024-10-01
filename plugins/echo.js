import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getCookie } from '~/services/auth';
import { useChatStore } from '../store/chatStore.js';
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
         console.log('Токен извлечен из куки:', token);
      } else {
         console.warn('Куки не найдены');
      }
   } catch (error) {
      console.error('Ошибка при извлечении токена из куки:', error);
   }

   if (!token) {
      console.error('Токен не найден');
      return;
   }

   // Настройка Pusher и Echo
   window.Pusher = Pusher;
   console.log('Инициализация Echo...');
   window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'keyForWSAligo20052012***!!!',
      cluster: 'eu',
      wsHost: 'dev.aligo.pro',
      wsPort: 6001,
      wssPort: 6001,
      encrypted: true,
      forceTLS: true, 
      disableStats: false,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: 'https://dev.aligo.pro/api/broadcasting/auth',
      auth: {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      },
   });

   window.Echo.connector.pusher.connection.bind('connecting_in', () => {
      console.log('Попытка соединения...');
   });

   window.Echo.connector.pusher.connection.bind('connected', () => {
      console.log('Соединение установлено');
   });

   window.Echo.connector.pusher.connection.bind('unavailable', () => {
      console.error('Соединение недоступно');
   });

   window.Echo.connector.pusher.connection.bind('failed', () => {
      console.error('Попытка соединения не удалась');
   });

   window.Echo.connector.pusher.connection.bind('disconnected', () => {
      console.warn('Соединение разорвано');
   });

   window.Echo.connector.pusher.connection.bind('error', (error) => {
      console.error('Ошибка Pusher:', error);
   });

   window.Echo.connector.pusher.connection.bind('state_change', (states) => {
      console.log('Состояние подключения изменилось:', states);
   });

   window.Echo.private(channelName)
      .listen('.store_message', (res) => {
         console.log('Получено сообщение на канале:', channelName, res);

         if (res.new_message) {
            chatStore.addMessage({
               ...res.new_message,
               isSelf: res.new_message.from_user.id === userStore.userId
            });
            console.log('Новое сообщение добавлено в чат:', res.new_message);
         } else {
            console.warn('Нет нового сообщения в ответе:', res);
         }
      })
      .error(error => {
         console.error('Ошибка при прослушивании канала:', error);
      });

   nuxtApp.provide('echo', window.Echo);
});
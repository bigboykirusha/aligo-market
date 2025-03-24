import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useCookie } from '#app';
import { useUserStore } from '~/store/user';
import { useChatStore } from '../store/chatStore.js';
import { usePopupErrorStore } from '~/store/popupErrorStore.js';
import { useMessagesStore } from '~/store/messages.js';

export default defineNuxtPlugin((nuxtApp) => {
   const userStore = useUserStore();
   const chatStore = useChatStore();
   const popupErrorStore = usePopupErrorStore();
   const messagesStore = useMessagesStore();

   const initializeEcho = () => {
      if (window.Echo) {
         console.warn('Echo уже инициализирован. Повторная инициализация не требуется.');
         return;
      }

      let token = '';
      const forWhomUserId = userStore.userId;

      try {
         const cookieData = useCookie('userData').value;
         if (cookieData) {
            const savedUserData = cookieData;
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

      window.Pusher = Pusher;
      console.log('Инициализация Echo...');
      window.Echo = new Echo({
         broadcaster: 'pusher',
         key: 'keyForWSAligo20052012***!!!',
         cluster: 'eu',
         wsHost: 'api.aligo.ru',
         wsPort: 6001,
         wssPort: 6001,
         encrypted: true,
         forceTLS: true,
         disableStats: true,
         enabledTransports: ['ws', 'wss'],
         authEndpoint: 'https://api.aligo.ru/api/broadcasting/auth',
         auth: {
            headers: {
               Accept: 'application/json',
               Authorization: `Bearer ${token}`,
            },
         },
      });

      // События подключения
      const pusherConnection = window.Echo.connector.pusher.connection;
      pusherConnection.bind('connecting_in', () => console.log('Попытка соединения...'));
      pusherConnection.bind('connected', () => console.log('Соединение установлено'));
      pusherConnection.bind('unavailable', () => console.error('Соединение недоступно'));
      pusherConnection.bind('failed', () => console.error('Попытка соединения не удалась'));
      pusherConnection.bind('disconnected', () => console.warn('Соединение разорвано'));
      pusherConnection.bind('error', (error) => console.error('Ошибка Pusher:', error));
      pusherConnection.bind('state_change', (states) => console.log('Состояние подключения изменилось:', states));

      // Подписка на каналы
      const storeChannelName = `store_message.${forWhomUserId}`;
      window.Echo.channel(storeChannelName)
         .listen('.store_message', (res) => {
            console.log('Получено сообщение на канале:', storeChannelName, res);
            messagesStore.loadLastMessages();
            if (res.new_message) {
               const newMessage = res.new_message;
               if (
                  chatStore.currentChat &&
                  Number(chatStore.currentChat.ads_id) === Number(newMessage.ads_id) &&
                  (
                     (Number(chatStore.currentChat.from_user.id) === Number(newMessage.from_user_id) &&
                        Number(chatStore.currentChat.for_user.id) === Number(newMessage.for_user_id)) ||
                     (Number(chatStore.currentChat.from_user.id) === Number(newMessage.for_user_id) &&
                        Number(chatStore.currentChat.for_user.id) === Number(newMessage.from_user_id))
                  )
               ) {
                  chatStore.addMessage({
                     ...newMessage,
                     isSelf: Number(newMessage.from_user_id) === Number(userStore.userId),
                  });
                  console.log('Новое сообщение добавлено в чат:', newMessage);
               } else {
                  popupErrorStore.showNotification('Получено новое сообщение');
                  userStore.setCountNewMessages();
               }
            } else {
               console.warn('Нет нового сообщения в ответе:', res);
            }
         })
         .error((error) => console.error('Ошибка при прослушивании канала:', error));

      const notifyChannelName = `App.Models.User.${forWhomUserId}`;
      window.Echo.channel(notifyChannelName)
         .notification((notification) => {
            console.log('Получено уведомление на канале:', notifyChannelName, notification);

            if (
               notification.notify
            ) {
               userStore.setCountUnreadNotify();
               popupErrorStore.showNotification(notification.notify);
            } else {
               console.warn(`Пропущено уведомление с текстом: "${notification.notify}"`);
            }
         })
         .error((error) => console.error('Ошибка при прослушивании канала уведомлений:', error));

      // Проверяем наличие `$echo` перед добавлением
      if (!nuxtApp.$echo) {
         nuxtApp.provide('echo', window.Echo);
      }
   };

   // Следим за состоянием loggedIn
   watch(
      () => userStore.isLoggedIn,
      (isLoggedIn) => {
         if (isLoggedIn) {
            console.log('Пользователь залогинен. Инициализируем Echo...');
            initializeEcho();
         } else if (window.Echo) {
            console.warn('Пользователь разлогинился. Очищаем Echo...');
            window.Echo.disconnect();
            delete window.Echo;
         }
      }
   );

   // Инициализация при загрузке, если пользователь залогинен
   if (userStore.isLoggedIn) {
      console.log('Пользователь уже залогинен. Инициализируем Echo...');
      initializeEcho();
   }
});

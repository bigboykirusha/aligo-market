import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getCookie } from '~/services/auth';
import { useUserStore } from '~/store/user';
import { useChatStore } from '../store/chatStore.js';

export default defineNuxtPlugin((nuxtApp) => {
   const userStore = useUserStore();
   const chatStore = useChatStore();

   // Функция для инициализации Echo
   const initializeEcho = () => {
      let token = '';
      const forWhomUserId = userStore.userId;

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

      // Обработчики событий соединения
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

      // Подписка на канал
      const storeChannelName = `store_message.${forWhomUserId}`;
      window.Echo.private(storeChannelName)
         .listen('.store_message', (res) => {
            console.log('Получено сообщение на канале:', storeChannelName, res);

            if (res.new_message) {
               chatStore.addMessage({
                  ...res.new_message,
                  isSelf: res.new_message.from_user_id === userStore.userId,
               });
               console.log('Новое сообщение добавлено в чат:', res.new_message);
            } else {
               console.warn('Нет нового сообщения в ответе:', res);
            }
         })
         .error((error) => {
            console.error('Ошибка при прослушивании канала:', error);
         });

      // Подписка на канал
      const notifyChannelName = `new_notify.${forWhomUserId}`;
      window.Echo.private(notifyChannelName)
         .listen('.new_notify', (res) => {
            console.log('Получено уведомление на канале:', notifyChannelName, res);

            // Обработка уведомлений
            if (res.new_notify) {
               console.log('Новое уведомление:', res.new_notify);
            } else {
               console.warn('Нет нового уведомления в ответе:', res);
            }
         })
         .error((error) => {
            console.error('Ошибка при прослушивании канала уведомлений:', error);
         });

      nuxtApp.provide('echo', window.Echo);
   };

   // Следим за изменением состояния loggedIn
   watch(
      () => userStore.isLoggedIn,
      (isLoggedIn) => {
         if (isLoggedIn) {
            console.log('Пользователь залогинен. Инициализируем Echo...');
            initializeEcho();
         }
      }
   );

   // Проверка на случай, если пользователь уже залогинен при загрузке
   if (userStore.isLoggedIn) {
      console.log('Пользователь уже залогинен. Инициализируем Echo...');
      initializeEcho();
   }
});

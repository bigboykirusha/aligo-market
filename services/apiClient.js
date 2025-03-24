import axios from 'axios';
import { useCookie } from '#app';
import { usePopupErrorStore } from '@/store/popupErrorStore';

const API_BASE_URL = 'https://api.aligo.ru/api';

const apiClient = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});


apiClient.interceptors.request.use((config) => {
   const userData = useCookie('userData').value;
   const token = userData ? userData.token : null;

   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }

   return config;
});

export const getAdsHistory = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/show_history_ads', {
         params: { count: 5 },
      });

      clearTimeout(timeoutId);
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных истории объявлений.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении данных истории объявлений: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getAdsSimilar = async ({ city = null, not_in_this_city = null, page = 1, count = 10, order_by = 'asc' }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const params = { page, count, order_by };

      if (city !== null) params.city = Number(city);
      if (not_in_this_city !== null) params.not_in_this_city = Number(not_in_this_city);

      const response = await apiClient.get('/show_similar_ads', { params });

      clearTimeout(timeoutId);
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных похожих объявлений.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }

      console.error('Ошибка при получении данных похожих объявлений: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const fetchMessages = async (adsId, mainCategoryId, userId, params = {}) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/chats/show', {
         ads_id: adsId,
         main_category_id: mainCategoryId,
         user_id: userId,
         ...params,
      });

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении сообщений.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении сообщений: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const sendMessage = async (message, adsId, mainCategoryId, forUserId, photos) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   const formData = new FormData();
   if (message?.trim()) formData.append('message', message.trim());
   formData.append('ads_id', adsId);
   formData.append('main_category_id', mainCategoryId);
   formData.append('for_user_id', forUserId);
   photos.forEach((photo, index) => formData.append(`photos[${index}]`, photo));

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/chats', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при отправке сообщения.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при отправке сообщения: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const sendReview = async (adsId, mainCategoryId, grade, comment, photos = []) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   const formData = new FormData();
   formData.append('ads_id', adsId);
   formData.append('main_category_id', mainCategoryId);
   formData.append('grade', grade);
   formData.append('comment', comment);
   photos.forEach((photo, index) => formData.append(`photos[${index}]`, photo));

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/reviews', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при отправке отзыва.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при отправке отзыва: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const sendSupport = async (themeId, comment, photos = []) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   const formData = new FormData();
   formData.append('comment', comment);
   formData.append('theme_id', themeId);

   if (photos.length > 0) {
      formData.append('photos[0]', photos[0]);
   }

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/tech_support', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при отправке отзыва.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при отправке отзыва: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getTechSupportThemes = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/tech_support_themes');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении тем поддержки.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении тем поддержки: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getTechSupport = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/tech_support');

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных поддержки.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении данных поддержки: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const fetchLastMessages = async (translate_to, unread_chats = false, read_chats = false, only_my_ads = false) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const params = { translate_to };
      if (unread_chats) params.unread_chats = true;
      if (read_chats) params.read_chats = true;
      if (only_my_ads) params.only_my_ads = true;

      const response = await apiClient.get('/chats/last_messages', { params });

      clearTimeout(timeoutId);
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении последних сообщений.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении последних сообщений: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCarById = async (id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/autos/${id}`);

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных автомобиля.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении данных автомобиля: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getRegions = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/regions');

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных регионов.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении данных регионов: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getModerationAds = async () => {
   try {
      const response = await apiClient.get('/moderations/ads');
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных регионов: ', error);
      throw error;
   }
};

export const getCitiesByRegion = async (regionId) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/region_with_city?region_id=${regionId}`);

      clearTimeout(timeoutId);
      return response.data.data[0].cities;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при получении городов для региона с ID ${regionId}.`;
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error(`Ошибка при получении городов для региона с ID ${regionId}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const searchCitiesByName = async (cityTitle) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/cities?city_title=${cityTitle}`);

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при поиске города с названием ${cityTitle}.`;
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error(`Ошибка при поиске города с названием ${cityTitle}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const loginUserByPhone = async ({ phone, email, is_send_code_telegram }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/send_code', {
         phone,
         email,
         is_send_code_telegram: is_send_code_telegram ? 1 : 0
      });

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при входе.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при входе: ', error.response?.data || error.message);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const confirmPhoneCode = async ({ phone, email, code }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/auth_by_phone_email', {
         phone,
         email,
         code
      });

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "Код неверный, проверьте правильность ввода.";
      popupErrorStore.showError(errorMessage);

      console.error('Ошибка при входе: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const confirmCode = async ({ phone, email, code }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/user/check_code_and_update_phone_or_email', {
         phone,
         email,
         code
      });

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при входе.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при входе: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserDetails = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/user/get_myself');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных пользователя.';
      if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

      console.error('Ошибка при получении данных пользователя: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getAboutMeReviews = async (search = '') => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/reviews/about_me', {
         params: { search }
      });

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = 'Сервер временно недоступен, повторите попытку через 1 мин.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении отзывов обо мне: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserOtherReviews = async (user_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/user_other/reviews/${user_id}`);

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при получении отзывов о пользователе с ID ${user_id}.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при получении отзывов о пользователе с ID ${user_id}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserOtherAds = async (user_id, is_published_or_closed) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/user_other/get_ads_active_closed/${user_id}`, {
         params: {
            is_published: is_published_or_closed === 'published' ? 1 : 0,
            is_closed: is_published_or_closed === 'closed' ? 1 : 0,
            count: 8
         }
      });

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при получении объявлений пользователя с ID ${user_id}.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при получении объявлений пользователя с ID ${user_id}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserOtherInfo = async (user_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/user_other/show/${user_id}`);

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при получении информации о пользователе с ID ${user_id}.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при получении информации о пользователе с ID ${user_id}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getLeftToAnotherReviews = async (search = '') => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/reviews/left_to_another', {
         params: { search }
      });

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении отзывов другим пользователям.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении отзывов другим пользователям: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUser = async (user_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/user_other/show/${user_id}`);

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при получении информации о пользователе с ID ${user_id}.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при получении информации о пользователе с ID ${user_id}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserCount = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/user/get_info_count_for_myself');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных пользователя.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении данных пользователя: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getMyselfAuthEvents = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/user/get_myself_auth_events', {
         params: {
            is_active: 1,
         },
      });

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении событий аутентификации.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении событий аутентификации: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const logoutUser = async (authEventId) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const endpoint = authEventId
         ? `/logout/${authEventId}`
         : '/logout';
      const response = await apiClient.post(endpoint);

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при выходе.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при выходе: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const logoutEverywhere = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/logout_everywhere_but_this');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при выходе везде.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при выходе везде: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCarBrands = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_brand', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getCarTransmission = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_transmission', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении трансмиссий автомобилей:', error);
      throw error;
   }
};

export const getCarBodyType = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_car_body_type', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении типов кузовов автомобилей:', error);
      throw error;
   }
};

export const getCarEngineType = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_engine_type', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении типов двигателей автомобилей:', error);
      throw error;
   }
};

export const getCarState = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_state', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении состояния автомобилей:', error);
      throw error;
   }
};

export const getCarCondition = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_condition', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении состояния автомобилей:', error);
      throw error;
   }
};

export const getCarDrive = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/auto_drive', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении типа привода автомобилей:', error);
      throw error;
   }
};

export const getCarModels = async (id) => {
   try {
      const response = await apiClient.get(`/auto_model?brand_id=${id}`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getCarGenerations = async (brandId, modelId) => {
   try {
      const response = await apiClient.get(`/unique_fields_from_auto_full_info?brand_id=${brandId}&model_id=${modelId}&generation=1`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных поколений автомобилей:', error);
      throw error;
   }
};

export const getCarEquipment = async (brandId, modelId, generationId) => {
   try {
      const response = await apiClient.get(`/unique_fields_from_auto_full_info?brand_id=${brandId}&model_id=${modelId}&generation_id=${generationId}&equipment=1`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных поколений автомобилей:', error);
      throw error;
   }
};

export const deleteNotificationById = async (id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.delete(`/notifications/${id}`);

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при удалении уведомления с ID ${id}.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении уведомления:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteAllNotifications = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.delete('/notifications/delete_all_notifications');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при удалении всех уведомлений.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении всех уведомлений:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const markAllNotificationsAsRead = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/notifications/mark_as_read_all');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при пометке всех уведомлений как прочитанных.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при пометке всех уведомлений как прочитанных:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const markNotificationAsRead = async (id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/notifications/mark_as_read/${id}`);

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при пометке уведомления с ID ${id} как прочитанного.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при пометке уведомления с ID ${id} как прочитанного:`, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCarCountry = async () => {
   try {
      const response = await apiClient.get(`/auto_country_register`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getColors = async (translate_to = null) => {
   try {
      const params = translate_to ? { translate_to } : {};
      const response = await apiClient.get('/colors', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении цветов:', error);
      throw error;
   }
};

export const getYear = async () => {
   try {
      const response = await apiClient.get(`/year`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsOwners = async () => {
   try {
      const response = await apiClient.get(`/auto_count_owner`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getNotifications = async () => {
   try {
      const response = await apiClient.get(`/notifications`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении уведомлений:', error);
      throw error;
   }
};

export const getCarsPts = async () => {
   try {
      const response = await apiClient.get(`/auto_pts`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsDamage = async () => {
   try {
      const response = await apiClient.get(`/auto_damage`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsPowerSteering = async () => {
   try {
      const response = await apiClient.get(`/auto_power_steering`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsSalon = async () => {
   try {
      const response = await apiClient.get(`/auto_salon`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsElectricWindow = async () => {
   try {
      const response = await apiClient.get(`/auto_electric_window`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsWheels = async () => {
   try {
      const response = await apiClient.get(`/auto_tires_wheels`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsAudioSystem = async () => {
   try {
      const response = await apiClient.get(`/auto_audio_system`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsHeadlight = async () => {
   try {
      const response = await apiClient.get(`/auto_headlight`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsClimate = async () => {
   try {
      const response = await apiClient.get(`/auto_climate_management`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsHandlebar = async () => {
   try {
      const response = await apiClient.get(`/auto_handlebar`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCommunicationMethod = async () => {
   try {
      const response = await apiClient.get(`/contact_communication_method`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getUsers = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/users`);

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении пользователей.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении пользователей:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCarsFiltered = async (filters) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/autos_filters', { params: filters });

      clearTimeout(timeoutId);
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении автомобилей с фильтрами.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении автомобилей с фильтрами:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const blockUser = async (data) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/blocked_users', data);

      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при блокировке пользователя.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при блокировке пользователя:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getBlockedUsers = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/blocked_users');

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении списка заблокированных пользователей.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении списка заблокированных пользователей:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const unblockUser = async (userId) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.delete(`/blocked_users/${userId}`);

      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || `Ошибка при разблокировке пользователя с ID ${userId}.`;
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при разблокировке пользователя с ID ${userId}:`, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const submitComplaint = async (formData) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/claim_users', formData);

      clearTimeout(timeoutId);
      console.log('Жалоба успешно отправлена');
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при отправке жалобы.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при отправке жалобы:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const createCarAd = async (params) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/autos', params, {
         headers: {
            'Content-Type': 'multipart/form-data',
         }
      });

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = error.response?.data?.message || "Сервер временно недоступен, повторите попытку через 1 мин";
      popupErrorStore.showError(errorMessage);
      console.error('Ошибка при создании', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const updateUserInfo = async (params) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/user/update', params, {
         headers: {
            'Content-Type': 'multipart/form-data',
         }
      });

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "Сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при обновлении информации о пользователе';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при обновлении информации о пользователе', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const updateCarAd = async (auto_id, params) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post(`/autos/${auto_id}`, params, {
         headers: {
            'Content-Type': 'multipart/form-data',
         }
      });

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = error.response?.data?.message || "Сервер временно недоступен, повторите попытку через 1 мин";
      popupErrorStore.showError(errorMessage);
      console.error('Ошибка при обновлении объявления об автомобиле', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteReview = async (review_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.delete(`/reviews/${review_id}`);

      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "Сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при удалении отзыва';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении отзыва', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCarsSearch = async ({ searchQuery, page, count }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/autos_filters', {
         params: {
            search_title: searchQuery,
            page: page,
            count: count
         }
      });

      clearTimeout(timeoutId);
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "Сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при поиске автомобилей';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при поиске автомобилей:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getFavorites = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/favorites');

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении избранных автомобилей';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении избранных автомобилей:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getDrafts = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/show_draft_ads');

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении черновиков';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении черновиков:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCancelledAds = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/show_cancelled_ads');

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении отклонённых объявлений';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении отклонённых объявлений:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserSavedFilters = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/user_save_filters');

      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении сохранённых фильтров';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении сохранённых фильтров:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getArchives = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/archives');
      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении архива';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении архива:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getMyAds = async (isPublished) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const params = {};
      if (isPublished !== null) {
         if (isPublished === 2) {
            params.is_moderation = 1;
         } else {
            params.is_published = isPublished;
         }
      }

      const response = await apiClient.get('/all_ads_user_not_draft_not_archive', { params });
      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении объявлений.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении объявлений:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getMyAdsCount = async () => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/all_ads_user_not_draft_not_archive');
      clearTimeout(timeoutId);
      return response.data.total_count;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении общего количества объявлений.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении общего количества объявлений:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getCars = async ({ page = 1, count = 20, order_by = 'asc' }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get('/autos', {
         params: {
            page,
            count,
            order_by,
         },
      });
      clearTimeout(timeoutId);
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении данных.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении данных: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const addFavorites = async ({ ads_id, main_category_id }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/favorites', { ads_id, main_category_id });
      clearTimeout(timeoutId);
      return response.data.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при добавлении в избранное.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при добавлении в избранное:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const seeContact = async ({ ads_id, main_category_id = 1 }) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/show_phone_seller_and_add_count_view_seller_contact', { ads_id, main_category_id });
      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении контактных данных.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении контактных данных:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getUserPhoneEmail = async (user_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.get(`/user_other/get_phone_email/${user_id}`);
      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении телефона и email пользователя.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении телефона и email пользователя:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const getSiteDocumentById = async (id = null) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const endpoint = id ? `/site_documents/${id}` : `/site_documents`;
      const response = await apiClient.get(endpoint);
      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при получении документа сайта.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при получении документа сайта:', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteAds = async (ids) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/delete_add_to_archive', { ids });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при удалении объявлений.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении объявлений: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteChats = async (ids) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/chats/delete_conversations', { ids });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при удалении чатов.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении чатов: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const markChatsAsRead = async (ids) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/chats/mark_as_read_conversations', { ids });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при пометке чатов как прочитанных.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при пометке чатов как прочитанных: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const takeOffPublication = async (ids) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/take_off_publication', { ids });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при снятии с публикации.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при снятии с публикации: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const publishAgainSelected = async (ids) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/publish_again_from_main_tab', { ids });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при публикации из архива.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при публикации из архива: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteFromDrafts = async (ids) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/delete_from_draft_and_forever', { ids });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при удалении из черновиков.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении из черновиков: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteFromArchive = async (ads_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/archives/delete_from_archive', {
         ids: [
            {
               ads_id,
               main_category_id: 1,
            }
         ]
      });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при удалении из архива.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при удалении из архива: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const publishFromArchive = async (ads_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      await apiClient.post('/archives/publish_again_from_archive', {
         ids: [
            {
               ads_id,
               main_category_id: 1,
            }
         ]
      });
      clearTimeout(timeoutId);
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Ошибка при публикации из архива.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при публикации из архива: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const publishFromMainTab = async (ads_id) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post('/publish_again_from_main_tab', {
         ids: [
            {
               ads_id,
               main_category_id: 1,
            }
         ]
      });
      clearTimeout(timeoutId);
      return response;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Произошла ошибка при публикации.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error('Ошибка при публикации: ', error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const replyToReview = async (reviewId, comment) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.post(`/reviews_comments/${reviewId}`, { comment });
      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Произошла ошибка при ответе на отзыв.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при ответе на отзыв с ID ${reviewId}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export const deleteReviewReply = async (reviewCommentId) => {
   const popupErrorStore = usePopupErrorStore();
   let timeoutId;

   try {
      timeoutId = setTimeout(() => {
         popupErrorStore.showWarning('Пожалуйста, подождите, сервер отвечает дольше обычного...');
      }, 5000);

      const response = await apiClient.delete(`/reviews_comments/${reviewCommentId}`);
      clearTimeout(timeoutId);
      return response.data;
   } catch (error) {
      clearTimeout(timeoutId);

      const errorMessage = "сервер временно недоступен, повторите попытку через 1 мин" || 'Произошла ошибка при удалении ответа на отзыв.';
      if (error.response?.status >= 500) {
         popupErrorStore.showError(errorMessage);
      }
      console.error(`Ошибка при удалении ответа на отзыв с ID ${reviewCommentId}: `, error);
      return { success: false, message: errorMessage, ...error.response?.data };
   }
};

export default apiClient;

import axios from 'axios';
import { getCookie } from './auth';

const API_BASE_URL = 'https://api.aligo.ru/api';

const apiClient = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

apiClient.interceptors.request.use((config) => {
   const userData = JSON.parse(getCookie('userData'));
   const token = userData ? userData.token : null;

   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }

   return config;
});

export const getAdsHistory = async () => {
   try {
      const response = await apiClient.get('/show_history_ads', {
         params: {
            count: 10,
         },
      });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
      throw error;
   }
};

export const getAdsSimilar = async (city) => {
   try {
      const response = await apiClient.get(`/show_similar_ads?city=${city}`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
      throw error;
   }
};

export const fetchMessages = async (adsId, mainCategoryId, userId, params = {}) => {
   try {
      const response = await apiClient.post('/chats/show', {
         ads_id: adsId,
         main_category_id: mainCategoryId,
         user_id: userId,
         ...params
      });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении сообщений: ', error);
      throw error;
   }
};

export const sendMessage = async (message, adsId, mainCategoryId, forUserId, photos) => {
   const formData = new FormData();

   // Добавляем только непустое сообщение
   if (message && message.trim()) {
      formData.append('message', message.trim());
   }

   formData.append('ads_id', adsId);
   formData.append('main_category_id', mainCategoryId);
   formData.append('for_user_id', forUserId);

   if (photos.length > 0) {
      photos.forEach((photo, index) => {
         formData.append(`photos[${index}]`, photo);
      });
   }

   try {
      const response = await apiClient.post('/chats', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      return response.data;
   } catch (error) {
      console.error('Ошибка при отправке сообщения: ', error);
      throw error;
   }
};

export const sendReview = async (adsId, mainCategoryId, grade, comment, photos = []) => {
   const formData = new FormData();
   formData.append('ads_id', adsId);
   formData.append('main_category_id', mainCategoryId);
   formData.append('grade', grade);
   formData.append('comment', comment);

   if (photos.length > 0) {
      photos.forEach((photo, index) => {
         formData.append(`photos[${index}]`, photo);
      });
   }

   try {
      await apiClient.post('/reviews', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
   } catch (error) {
      console.error('Ошибка при отправке отзыва: ', error);
      throw error;
   }
};

export const sendSupport = async (themeId, comment, photos = []) => {
   const formData = new FormData();
   formData.append('comment', comment);
   formData.append('theme_id', themeId);

   // Если есть фотографии, добавляем их
   if (photos.length > 0) {
      formData.append('photos[0]', photos[0]); // Только первое фото, если оно есть
   }

   try {
      await apiClient.post('/tech_support', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
   } catch (error) {
      console.error('Ошибка при отправке отзыва: ', error);
      throw error;
   }
};

export const getTechSupportThemes = async () => {
   try {
      const response = await apiClient.get('/tech_support_themes');
      return response.data; // Возвращаем полученные данные
   } catch (error) {
      console.error('Ошибка при получении тем поддержки: ', error);
      throw error;
   }
};

export const getTechSupport = async () => {
   try {
      const response = await apiClient.get('/tech_support');
      return response.data.data; // Возвращаем полученные данные
   } catch (error) {
      console.error('Ошибка при получении тем поддержки: ', error);
      throw error;
   }
};

export const fetchLastMessages = async (translate_to, unread_chats = false, read_chats = false, only_my_ads = false) => {
   try {
      // Создаём объект параметров для запроса
      const params = { translate_to };

      // Добавляем дополнительные параметры, если они переданы как true
      if (unread_chats) params.unread_chats = true;
      if (read_chats) params.read_chats = true;
      if (only_my_ads) params.only_my_ads = true;

      // Выполняем GET-запрос с параметрами
      const response = await apiClient.get('/chats/last_messages', { params });

      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      console.error('Ошибка при получении последних сообщений: ', error);
      throw error;
   }
};

export const getCarById = async (id) => {
   try {
      const response = await apiClient.get(`/autos/${id}`);
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных автомобиля: ', error);
      throw error;
   }
};

export const getRegions = async () => {
   try {
      const response = await apiClient.get('/regions');
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении данных регионов: ', error);
      throw error;
   }
};

export const getCitiesByRegion = async (regionId) => {
   try {
      const response = await apiClient.get(`/region_with_city?region_id=${regionId}`);
      return response.data.data[0].cities;
   } catch (error) {
      console.error(`Ошибка при получении городов для региона с ID ${regionId}: `, error);
      throw error;
   }
};

export const searchCitiesByName = async (cityTitle) => {
   try {
      const response = await apiClient.get(`/cities?city_title=${cityTitle}`);
      return response.data.data;
   } catch (error) {
      console.error(`Ошибка при поиске города с названием ${cityTitle}: `, error);
      throw error;
   }
};

export const loginUserByPhone = async ({ phone, email, is_send_code_telegram }) => {
   try {
      const response = await apiClient.post('/send_code', {
         phone,
         email,
         is_send_code_telegram: is_send_code_telegram ? 1 : 0
      });
      return response.data;
   } catch (error) {
      console.error('Ошибка при входе: ', error.response?.data || error.message);
      throw error.response?.data || error;
   }
};
export const confirmPhoneCode = async ({ phone, email, code }) => {
   try {
      const response = await apiClient.post('/auth_by_phone_email', {
         phone,
         email,
         code
      });
      return response.data;
   } catch (error) {
      console.error('Ошибка при входе: ', error);
      throw error;
   }
};

export const confirmCode = async ({ phone, email, code }) => {
   try {
      const response = await apiClient.post('/user/check_code_and_update_phone_or_email', {
         phone,
         email,
         code
      });
      return response.data;
   } catch (error) {
      console.error('Ошибка при входе: ', error);
      throw error;
   }
};

export const getUserDetails = async () => {
   try {
      const response = await apiClient.get('/user/get_myself');
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
      throw error;
   }
};

export const getAboutMeReviews = async (search = '') => {
   try {
      const response = await apiClient.get('/reviews/about_me', {
         params: { search }
      });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении отзывов обо мне: ', error);
      throw error;
   }
};

export const getUserOtherReviews = async (user_id) => {
   try {
      const response = await apiClient.get(`/user_other/reviews/${user_id}`);
      return response.data.data;
   } catch (error) {
      console.error(`Ошибка при получении отзывов о пользователе с ID ${user_id}: `, error);
      throw error;
   }
};

export const getUserOtherAds = async (user_id, is_published_or_closed) => {
   try {
      const response = await apiClient.get(`/user_other/get_ads_active_closed/${user_id}`, {
         params: {
            is_published: is_published_or_closed === 'published' ? 1 : 0,
            is_closed: is_published_or_closed === 'closed' ? 1 : 0,
            count: 8
         }
      });
      return response.data.data;
   } catch (error) {
      console.error(`Ошибка при получении объявлений пользователя с ID ${user_id}: `, error);
      throw error;
   }
};

export const getUserOtherInfo = async (user_id) => {
   try {
      const response = await apiClient.get(`/user_other/show/${user_id}`);
      return response.data.data;
   } catch (error) {
      console.error(`Ошибка при получении информации о пользователе с ID ${user_id}: `, error);
      throw error;
   }
};

export const getLeftToAnotherReviews = async (search = '') => {
   try {
      const response = await apiClient.get('/reviews/left_to_another', {
         params: { search }
      });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении отзывов другим пользователям: ', error);
      throw error;
   }
};

export const getUser = async (user_id) => {
   try {
      const response = await apiClient.get(`/user_other/show/${user_id}`);
      return response.data.data;
   } catch (error) {
      console.error(`Ошибка при получении информации о пользователе с ID ${user_id}: `, error);
      throw error;
   }
};

export const getUserCount = async () => {
   try {
      const response = await apiClient.get('/user/get_info_count_for_myself');
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении данных пользователя: ', error);
      throw error;
   }
};

export const getMyselfAuthEvents = async () => {
   try {
      const response = await apiClient.get('/user/get_myself_auth_events', {
         params: {
            is_active: 1,
         },
      });
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении событий аутентификации: ', error);
      throw error;
   }
};


export const logoutUser = async (authEventId) => {
   try {
      const endpoint = authEventId
         ? `/logout/${authEventId}`
         : '/logout';
      const response = await apiClient.post(endpoint);
      return response.data;
   } catch (error) {
      console.error('Ошибка при выходе: ', error);
      throw error;
   }
};

export const logoutEverywhere = async () => {
   try {
      const response = await apiClient.post('/logout_everywhere_but_this');
      return response.data;
   } catch (error) {
      console.error('Ошибка при выходе везде: ', error);
      throw error;
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

export const deleteNotificationById = async (id) => {
   try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response.data;
   } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
      throw error;
   }
};

export const deleteAllNotifications = async () => {
   try {
      const response = await apiClient.delete('/notifications/delete_all_notifications');
      return response.data;
   } catch (error) {
      console.error('Ошибка при удалении всех уведомлений:', error);
      throw error;
   }
};

export const markAllNotificationsAsRead = async () => {
   try {
      const response = await apiClient.get('/notifications/mark_as_read_all');
      return response.data;
   } catch (error) {
      console.error('Ошибка при пометке всех уведомлений как прочитанных:', error);
      throw error;
   }
};

export const markNotificationAsRead = async (id) => {
   try {
      const response = await apiClient.get(`/notifications/mark_as_read/${id}`);
      return response.data;
   } catch (error) {
      console.error(`Ошибка при пометке уведомления с ID ${id} как прочитанного:`, error);
      throw error;
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
   try {
      const response = await apiClient.get(`/users`);
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении colors:', error);
      throw error;
   }
};

export const getCarsFiltered = async (filters) => {
   try {
      const response = await apiClient.get('/autos_filters', {
         params: filters,
      });
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      console.error('Ошибка при получении', error);
      throw error;
   }
};

export const blockUser = async (data) => {
   try {
      await apiClient.post('/blocked_users', data);
   } catch (error) {
      console.error('Ошибка при блокировке пользователя:', error);
      throw error;
   }
};

export const getBlockedUsers = async () => {
   try {
      const response = await apiClient.get('/blocked_users');
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении списка заблокированных пользователей:', error);
      throw error;
   }
};

export const unblockUser = async (userId) => {
   try {
      await apiClient.delete(`/blocked_users/${userId}`);
   } catch (error) {
      console.error(`Ошибка при разблокировке пользователя с ID ${userId}:`, error);
      throw error;
   }
};

export const submitComplaint = async (formData) => {
   try {
      await apiClient.post('/claim_users', formData);
      console.log('Жалоба успешно отправлена');
   } catch (error) {
      console.error('Ошибка при отправке жалобы:', error);
      throw error;
   }
};

export const createCarAd = async (params) => {
   try {
      const response = await apiClient.post('/autos', params, {
         headers: {
            'Content-Type': 'multipart/form-data',
         }
      });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при создании', error);
      throw error;
   }
};

export const updateUserInfo = async (params) => {
   try {
      const response = await apiClient.post('/user/update', params, {
         headers: {
            'Content-Type': 'multipart/form-data',
         }
      });
      return response.data;
   } catch (error) {
      console.error('Ошибка при обновлении информации о пользователе', error);
      return error.response.data;
   }
};

export const updateCarAd = async (auto_id, params) => {
   try {
      const response = await apiClient.post(`/autos/${auto_id}`, params, {
         headers: {
            'Content-Type': 'multipart/form-data',
         }
      });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при обновлении информации об автомобиле', error);
      throw error;
   }
};

export const deleteReview = async (review_id) => {
   try {
      const response = await apiClient.delete(`/reviews/${review_id}`);
      return response.data;
   } catch (error) {
      console.error('Ошибка при удалении отзыва', error);
      throw error;
   }
};

export const getCarsSearch = async ({ searchQuery, page, count }) => {
   try {
      const response = await apiClient.get('/autos_filters', {
         params: {
            search_title: searchQuery,
            page: page,
            count: count
         }
      }
      );
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      console.error('Ошибка при создании', error);
      throw error;
   }
};

export const getFavorites = async () => {
   try {
      const response = await apiClient.get('/favorites');
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getDrafts = async () => {
   try {
      const response = await apiClient.get('/show_draft_ads');
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getArchives = async () => {
   try {
      const response = await apiClient.get('/archives');
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getMyAds = async (isPublished) => {
   try {
      const params = {};

      if (isPublished !== undefined) {
         if (isPublished === 2) {
            params.is_moderation = 1; 
         } else {
            params.is_published = isPublished;
         }
      }

      const response = await apiClient.get('/all_ads_user_not_draft_not_archive', { params });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
      throw error;
   }
};

export const getMyAdsCount = async () => {
   try {
      const response = await apiClient.get('/all_ads_user_not_draft_not_archive');
      return response.data.total_count;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getCars = async ({ page = 1, count = 20, order_by = 'asc' }) => {
   try {
      const response = await apiClient.get('/autos', {
         params: {
            page,
            count,
            order_by,
         },
      });
      return { data: response.data.data, totalCount: response.data.total_count };
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
      throw error;
   }
};

export const addFavorites = async ({ ads_id, main_category_id }) => {
   try {
      const response = await apiClient.post('/favorites', { ads_id, main_category_id });
      return response.data.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const seeContact = async ({ ads_id, main_category_id = 1 }) => {
   try {
      const response = await apiClient.post('/show_phone_seller_and_add_count_view_seller_contact', { ads_id, main_category_id });
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
      throw error;
   }
};

export const getUserPhoneEmail = async (user_id) => {
   try {
      const response = await apiClient.get(`/user_other/get_phone_email/${user_id}`);
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении телефона и email пользователя:', error);
      throw error;
   }
};

export const getSiteDocumentById = async (id = null) => {
   try {
      const endpoint = id ? `/site_documents/${id}` : `/site_documents`;
      const response = await apiClient.get(endpoint);
      return response.data;
   } catch (error) {
      console.error('Ошибка при получении документа сайта:', error);
      throw error;
   }
};

export const deleteAds = async (ids) => {
   try {
      await apiClient.post('/delete_add_to_archive', { ids });
   } catch (error) {
      console.error('Ошибка при удалении объявлений: ', error);
      throw error;
   }
};

export const deleteChats = async (ids) => {
   try {
      await apiClient.post('/chats/delete_conversations', { ids });
   } catch (error) {
      console.error('Ошибка при удалении чатов: ', error);
      throw error;
   }
};

export const markChatsAsRead = async (ids) => {
   try {
      await apiClient.post('/chats/mark_as_read_conversations', { ids });
   } catch (error) {
      console.error('Ошибка при пометке чатов как прочитанных: ', error);
      throw error;
   }
};

export const takeOffPublication = async (ids) => {
   try {
      await apiClient.post('/take_off_publication', { ids });
   } catch (error) {
      console.error('Ошибка при снятии с публикации: ', error);
      throw error;
   }
};

export const publishAgainSelected = async (ids) => {
   try {
      await apiClient.post('/publish_again_from_archive_or_main_tab', { ids });
   } catch (error) {
      console.error('Ошибка при публикации из архива: ', error);
      throw error;
   }
};

export const deleteFromDrafts = async (ids) => {
   try {
      await apiClient.post('/delete_from_draft_and_forever', { ids });
   } catch (error) {
      console.error('Ошибка при снятии с публикации: ', error);
      throw error;
   }
};


export const deleteFromArchive = async (ads_id) => {
   try {
      await apiClient.post('/archives/delete_from_archive', {
         ids: [
            {
               ads_id,
               main_category_id: 1,
            }
         ]
      });
   } catch (error) {
      console.error('Ошибка при удалении из архива: ', error);
      throw error;
   }
};

export const publishFromArchive = async (ads_id) => {
   try {
      await apiClient.post('/publish_again_from_archive_or_main_tab', {
         ids: [
            {
               ads_id,
               main_category_id: 1,
            }
         ]
      });
   } catch (error) {
      console.error('Ошибка при публикации из архива: ', error);
      throw error;
   }
};

export const replyToReview = async (reviewId, comment) => {
   try {
      const response = await apiClient.post(`/reviews_comments/${reviewId}`, {
         comment,
      });
      return response.data;
   } catch (error) {
      console.error(`Ошибка при ответе на отзыв с ID ${reviewId}: `, error);
      throw error;
   }
};

export const deleteReviewReply = async (reviewCommentId) => {
   try {
      const response = await apiClient.delete(`/reviews_comments/${reviewCommentId}`);
      return response.data;
   } catch (error) {
      console.error(`Ошибка при удалении ответа на отзыв с ID ${reviewCommentId}: `, error);
      throw error;
   }
};

export default apiClient;

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

export const getCarsSearchHeaders = async ({ searchQuery, page, count }) => {
   try {
      const response = await apiClient.head('/autos_filters', {
         params: {
            search_title: searchQuery,
            page: page,
            count: count
         }
      });
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков (Cars Search):', error);
      return new Headers();
   }
};

export const getFavoritesHeaders = async () => {
   try {
      const response = await apiClient.head('/favorites');
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков (Favorites):', error);
      return new Headers();
   }
};

export const getDraftsHeaders = async () => {
   try {
      const response = await apiClient.head('/show_draft_ads');
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков черновиков:', error);
      return null;
   }
};

export const getArchivesHeaders = async () => {
   try {
      const response = await apiClient.head('/archives');
      console.log('Все заголовки:', response.headers);

      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков архива:', error);
      return null;
   }
};

export const getMyAdsHeaders = async (isPublished) => {
   try {
      const params = {};
      if (isPublished !== null) {
         if (isPublished === 2) {
            params.is_moderation = 1;
         } else {
            params.is_published = isPublished;
         }
      }

      const response = await apiClient.head('/all_ads_user_not_draft_not_archive', { params });
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков объявлений:', error);
      return null;
   }
};

export const getAdsHistoryHeaders = async () => {
   try {
      const response = await apiClient.head('/show_history_ads', {
         params: { count: 5 },
      });
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков истории объявлений:', error);
      return null;
   }
};

export const getAdsSimilarHeaders = async ({ city = null, not_in_this_city = null, page = 1, count = 10, order_by = 'asc' }) => {
   try {
      const params = { page, count, order_by };

      if (city !== null) params.city = Number(city);
      if (not_in_this_city !== null) params.not_in_this_city = Number(not_in_this_city);

      const response = await apiClient.head('/show_similar_ads', { params });
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков похожих объявлений:', error);
      return null;
   }
};

export const getAboutMeReviewsHeaders = async () => {
   try {
      const response = await apiClient.head('/reviews/about_me');
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков отзывов обо мне:', error);
      return null;
   }
};

export const getUserSavedFiltersHeaders = async () => {
   try {
      const response = await apiClient.head('/user_save_filters');
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков сохранённых фильтров:', error);
      return null;
   }
};

export const getCancelledAdsHeaders = async () => {
   try {
      const response = await apiClient.head('/show_cancelled_ads');
      return response.headers;
   } catch (error) {
      console.error('Ошибка при получении заголовков отклонённых объявлений:', error);
      return null;
   }
};

export const getUserOtherReviewsHeaders = async (user_id) => {
   try {
      const response = await apiClient.head(`/user_other/reviews/${user_id}`);
      return response.headers;
   } catch (error) {
      console.error(`Ошибка при получении заголовков отзывов о пользователе с ID ${user_id}:`, error);
      return null;
   }
};

export const getUserOtherAdsHeaders = async (user_id, is_published_or_closed) => {
   try {
      const response = await apiClient.head(`/user_other/get_ads_active_closed/${user_id}`, {
         params: {
            is_published: is_published_or_closed === 'published' ? 1 : 0,
            is_closed: is_published_or_closed === 'closed' ? 1 : 0,
            count: 8
         }
      });
      return response.headers;
   } catch (error) {
      console.error(`Ошибка при получении заголовков объявлений пользователя с ID ${user_id}:`, error);
      return null;
   }
};
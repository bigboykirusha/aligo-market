import { defineStore } from 'pinia';
import { getUserDetails, logoutUser, getUserCount, getMyAdsCount, updateUserInfo } from '../services/apiClient';
import { useCookie } from '#app';
import { useFavoritesStore } from './favorites';
import { useCreateStore } from './create';

// Утилиты
function formatPhoneNumber(phone) {
   const cleaned = phone.replace(/\D/g, '');
   const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{2})(\d{2})$/);
   if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
   }
   return phone;
}

function formatUniqueCode(code) {
   return code.match(/.{1,4}/g)?.join(' ') || '';
}

function updateUserCookie(userData) {
   const userDataCookie = useCookie('userData', {
      default: () => ({}),
      maxAge: 30 * 24 * 60 * 60
   });
   userDataCookie.value = { ...userDataCookie.value, ...userData };
}

export const useUserStore = defineStore('user', {
   state: () => ({
      login: null,
      userId: null,
      email: null,
      unconfirmed_email: null,
      phoneNumber: null,
      isLoggedIn: false,
      username: null,
      uniqueCode: null,
      latitude: null,
      longitude: null,
      city_id: null,
      city_name: null,
      address: null,
      photo: null,
      createdAt: null,
      countAds: 0,
      countFavorites: 0,
      countUnreadNotify: 0,
      count_new_messages: 0,
      countDrafts: 0,
      countReviews: 0,
      count_new_reviews_about_myself: 0,
      grade: 0,
   }),

   actions: {
      setUserData(data) {
         this.$patch(data);
         this.isLoggedIn = true;
      },

      async updateUsername(newUsername) {
         if (!newUsername.trim()) throw new Error('Имя пользователя не может быть пустым.');

         const formData = new FormData();
         formData.append('username', newUsername);

         try {
            await updateUserInfo(formData);
            await this.fetchAndSetUserdata();
         } catch (error) {
            console.error('Ошибка при обновлении имени пользователя:', error);
         }
      },

      setCountNewMessages() {
         this.count_new_messages += 1;
      },

      setCountUnreadNotify() {
         this.countUnreadNotify += 1;
      },

      decCountUnreadNotify() {
         this.countUnreadNotify -= 1;
      },

      setCounts(countData) {
         if (countData.success) {
            Object.assign(this, {
               countAds: countData.count_ads ?? this.countAds,
               countFavorites: countData.count_favorites ?? this.countFavorites,
               countUnreadNotify: countData.count_unread_notify ?? this.countUnreadNotify,
               count_new_messages: countData.count_new_messages ?? this.count_new_messages,
               countDrafts: countData.count_drafts ?? this.countDrafts,
               countReviews: countData.count_reviews_about_myself ?? this.countReviews,
               count_new_reviews_about_myself: countData.count_new_reviews_about_myself ?? this.count_new_reviews_about_myself,
            });
         } else {
            console.error('Ошибка при обновлении счетчиков: данные не валидны.');
         }
      },

      async fetchAndSetUserdata() {
         try {
            const { success, data } = await getUserDetails();
            if (success && data) {
               const userData = {
                  userId: data.id,
                  username: data.username,
                  uniqueCode: data.unique_code ? formatUniqueCode(data.unique_code) : null,
                  login: data.login,
                  email: data.email,
                  unconfirmed_email: data.unconfirmed_email,
                  phoneNumber: data.phone ? formatPhoneNumber(data.phone) : null,
                  address: data.address,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  city_id: data.city?.id,
                  city_name: data.city?.title,
                  photo: data.photo,
                  createdAt: data.created_at,
                  grade: data.grade || 0.0,
                  isLoggedIn: true,
               };
               this.setUserData(userData);
               await this.fetchUserCounts();
               useFavoritesStore().fetchFavorites();
               updateUserCookie({ email: data.email, phoneNumber: data.phone });
            } else {
               this.isLoggedIn = false;
            }
         } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            this.isLoggedIn = false;
         }
      },

      async clearUserdata() {
         try {
            await logoutUser();
            sessionStorage.removeItem('userDataLoaded');
            const userDataCookie = useCookie('userData');
            const userData = userDataCookie.value || {};

            delete userData.token;

            useCreateStore().resetParams();
            userDataCookie.value = JSON.stringify(userData);

            this.$reset();
            this.isLoggedIn = false;
         } catch (error) {
            console.error('Ошибка при очистке данных пользователя:', error);
         }
      },

      async fetchUserCounts() {
         try {
            const [userCountData] = await Promise.all([getUserCount()]);
            this.setCounts(userCountData);
         } catch (error) {
            console.error('Ошибка при получении счетчиков пользователя:', error);
         }
      },

      async updateProfile(changedFields) {
         try {
            const formData = new FormData();
            Object.entries(changedFields).forEach(([key, value]) => {
               if (key === 'phone') value = value.replace(/[^\d+]/g, '');
               formData.append(key, value);
            });

            const response = await updateUserInfo(formData);
            await this.fetchAndSetUserdata();
            return response;
         } catch (error) {
            return error.response;
         }
      }
   },
});
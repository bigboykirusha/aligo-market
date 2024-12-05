import { defineStore } from 'pinia';
import { getUserDetails, logoutUser, getUserCount, getMyAdsCount, updateUserInfo } from '../services/apiClient';
import { getCookie, setCookie } from '../services/auth';

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

export const useUserStore = defineStore('user', {
   state: () => ({
      login: null,
      userId: null,
      email: null,
      phoneNumber: null,
      isLoggedIn: false,
      username: null,
      uniqueCode: null,
      latitude: null,
      longitude: null,
      city: null,
      address: null,
      photo: null,
      createdAt: null,
      countAds: 0,
      countFavorites: 0,
      countUnreadNotify: 0,
      count_new_messages: 0,
      countDrafts: 0,
      countReviews: 0,
      grade: 0,
   }),
   actions: {
      setUserData(data) {
         this.$patch(data);
         this.isLoggedIn = true;
      },

      async updateUsername(newUsername) {
         try {
            if (!newUsername.trim()) {
               throw new Error('Имя пользователя не может быть пустым.');
            }

            const formData = new FormData();
            formData.append('username', newUsername);

            await updateUserInfo(formData);

            await this.fetchAndSetUserdata();
         } catch (error) {
            console.error('Ошибка при обновлении имени пользователя: ', error);
         }
      },
      setCounts(countData) {
         if (countData.success) {
            this.countAds = countData.count_ads ?? this.countAds;
            this.countFavorites = countData.count_favorites ?? this.countFavorites;
            this.countUnreadNotify = countData.count_unread_notify ?? this.countUnreadNotify;
            this.count_new_messages = countData.count_new_messages ?? this.count_new_messages;
            this.countDrafts = countData.count_drafts ?? this.countDrafts;
            this.countReviews = countData.count_reviews_about_myself ?? this.countReviews;
         } else {
            console.error('Ошибка при обновлении счетчиков: данные не валидны.');
         }
      },
      async fetchAndSetUserdata() {
         try {
            const { success, data } = await getUserDetails();

            const formattedPhone = data.phone ? formatPhoneNumber(data.phone) : null;
            const formattedUniqueCode = data.unique_code ? formatUniqueCode(data.unique_code) : null;

            if (success && data) {
               // Обновляем данные в хранилище
               this.setUserData({
                  userId: data.id,
                  username: data.username,
                  uniqueCode: formattedUniqueCode,
                  login: data.login,
                  email: data.email,
                  phoneNumber: formattedPhone,
                  address: data.address,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  city: data.city,
                  photo: data.photo,
                  createdAt: data.created_at,
                  grade: data.grade,
               });

               // Обновляем данные в куках
               const userData = JSON.parse(getCookie('userData') || '{}');
               if (data.email) userData.email = data.email;
               if (data.phone) userData.phoneNumber = data.phone;
               setCookie('userData', JSON.stringify(userData), 7);
            }
         } catch (error) {
            console.error('Ошибка при получении данных пользователя: ', error);
         }
      },

      // Очистка данных пользователя
      async clearUserdata() {
         try {
            await logoutUser();
            const userData = JSON.parse(getCookie('userData'));
            delete userData.token;
            setCookie('userData', JSON.stringify(userData), 7);
            this.$reset();
            this.isLoggedIn = false;
         } catch (error) {
            console.error('Ошибка при очистке данных пользователя: ', error);
         }
      },

      // Загрузка счетчиков пользователя
      async fetchUserCounts() {
         try {
            const [userCountData] = await Promise.all([getUserCount(), getMyAdsCount()]);
            this.countAds = userCountData.count_ads;
            this.countFavorites = userCountData.count_favorites;
            this.countUnreadNotify = userCountData.count_unread_notify;
            this.countDrafts = userCountData.count_drafts;
            this.countReviews = userCountData.count_reviews_about_myself;
            this.count_new_messages = userCountData.count_new_messages;
         } catch (error) {
            console.error('Ошибка при получении счетчиков пользователя: ', error);
         }
      },

      // Обновление профиля
      async updateProfile(changedFields) {
         try {
            const formData = new FormData();
            console.log(changedFields);

            Object.entries(changedFields).forEach(([key, value]) => {
               if (key === 'phone') {
                  value = value.replace(/[^\d+]/g, '');
               }
               formData.append(key, value);
            });

            await updateUserInfo(formData);
            this.fetchAndSetUserdata();
         } catch (error) {
            console.error('Ошибка при обновлении профиля', error);
         }
      }
   },
});
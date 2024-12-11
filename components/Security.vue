<template>
   <div class="auth-devices">
      <div class="auth-devices__title">История активности</div>

      <ul class="auth-devices__list" v-if="devices.length > 0">
         <li v-for="device in devices" :key="device.id" class="auth-devices__item">
            <img :src="getDeviceIcon(device)" alt="Device Icon" class="auth-devices__icon" />
            <div class="auth-devices__info">
               <p class="auth-devices__status"> {{ getDeviceCategory(device) }}, {{ device.platform }}, {{
                  device.browser }}</p>
               <p class="auth-devices__geo">{{ device.city }}, {{ device.country }} · {{ formatDate(device.auth_time) }}
               </p>
            </div>
            <button @click="logoutDevice(device.id)" class="auth-devices__logout-button">
               <img class="logout-icon" src="../assets/icons/out-icon.svg" alt="">
            </button>
         </li>
      </ul>
      <p v-else class="auth-devices__no-devices">Нет активных устройств для входа.</p>

      <button @click="logoutEverywhereDevices" class="auth-devices__logout-everywhere">
         Выйти со всех устройств
      </button>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyselfAuthEvents, logoutUser, logoutEverywhere } from '../services/apiClient';
import { getCityByIp } from '../services/apiLocation';
import phoneIcon from '../assets/icons/phone2.svg';
import pcIcon from '../assets/icons/pc2.svg';

const devices = ref([]);

const fetchDevices = async () => {
   try {
      const response = await getMyselfAuthEvents();
      if (response.success) {
         devices.value = response.data.filter(device => !device.exit_time);
         // Для каждого устройства запрашиваем город по IP
         await fetchDeviceCities(devices.value);
      }
   } catch (error) {
      console.error('Ошибка при получении устройств:', error);
   }
};

// Функция для получения города по IP с использованием нашего нового сервиса
const fetchDeviceCities = async (devices) => {
   for (let device of devices) {
      try {
         const { city, country } = await getCityByIp(device.ip);

         device.city = city;
         device.country = country;
      } catch (error) {
         console.error(`Ошибка при получении города для IP ${device.ip}:`, error);
         device.city = 'Неизвестно';  // Если ошибка, ставим "Неизвестно"
      }
   }
};

const logoutDevice = async (authEventId) => {
   try {
      await logoutUser(authEventId);
      devices.value = devices.value.filter(device => device.id !== authEventId);
   } catch (error) {
      console.error('Ошибка при выходе с устройства:', error);
   }
};

const logoutEverywhereDevices = async () => {
   try {
      await logoutEverywhere();
      devices.value = [];
   } catch (error) {
      console.error('Ошибка при выходе со всех устройств:', error);
   }
};

const formatDate = (date) => {
   return new Date(date).toLocaleString('ru-RU');
};

// Функция для определения категории устройства
const getDeviceCategory = (device) => {
   if (device.platform.includes('Windows') || device.platform.includes('Mac')) {
      return 'ПК';
   }
   if (device.platform.includes('iOS')) {
      return 'iPhone';
   }
   if (device.platform.includes('Android')) {
      return 'Android';
   }
   return 'Неизвестно';
};

const getDeviceIcon = (device) => {
   const category = getDeviceCategory(device);
   if (category === 'ПК') {
      return pcIcon;  // Убедитесь, что путь правильный
   }
   if (category === 'iPhone') {
      return phoneIcon;
   }
   if (category === 'Android') {
      return phoneIcon;
   }
   return ''; // Если категория неизвестна, не показывать иконку
};

onMounted(fetchDevices);
</script>

<style scoped lang="scss">
.auth-devices {
   max-width: 600px;
   margin-top: 40px;

   &__title {
      color: #323232;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 24px;
   }

   &__list {
      list-style: none;
      padding: 0;
      margin: 0;
   }

   &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      padding: 16px 0;
      border-bottom: 1px solid #E0E0E0;
   }

   &__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
   }

   &__icon {
      width: 36px;
      height: 36px;
      margin-right: 16px;
   }

   &__logout-button {
      height: 36px;
      width: 36px;
      background-color: #EEF9FF;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease-in-out;

      &:hover {
         background-color: #D6EFFF;
      }
   }

   &__logout-button .logout-icon {
      height: 14px;
      width: 14px;
   }

   &__status {
      color: #323232;
      font-size: 14px;
      line-height: 18px;
   }

   &__geo {
      color: #777777;
      font-size: 12px;
      line-height: 14px;
   }

   &__logout-everywhere {
      display: block;
      background-color: #FFFFFF;
      color: #FF5959; 
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 16px;

      &:hover {
         color: #FF5959; 
      }
   }
}
</style>
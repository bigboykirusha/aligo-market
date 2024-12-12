<template>
   <div class="auth-devices">
      <div class="auth-devices__title">История активности</div>

      <!-- Блок текущего устройства -->
      <div v-if="currentDevice" class="auth-devices__current-device">
         <div class="auth-devices__sub-title">Это устройство</div>
         <ul class="auth-devices__list">
            <li :key="currentDevice.id" class="auth-devices__item">
               <img :src="getDeviceIcon(currentDevice)" alt="Device Icon" class="auth-devices__icon" />
               <div class="auth-devices__info">
                  <p class="auth-devices__status">
                     {{ getDeviceCategory(currentDevice) }}, {{ currentDevice.platform }}
                  </p>
                  <p class="auth-devices__browser">{{ currentDevice.browser }}</p>
                  <p class="auth-devices__geo">{{ currentDevice.city }}, {{ currentDevice.country }} · {{
                     formatDate(currentDevice.auth_time) }}</p>
               </div>
               <button @click="logoutDevice(currentDevice.id)" class="auth-devices__logout-button">
                  <img class="logout-icon" src="../assets/icons/out-icon.svg" alt="Logout Icon" />
               </button>
            </li>
         </ul>
      </div>

      <!-- Блок других устройств -->
      <div v-if="otherDevices.length > 0" class="auth-devices__current-device">
         <div class="auth-devices__sub-title">Активные устройства</div>
         <ul class="auth-devices__list">
            <li v-for="device in otherDevices" :key="device.id" class="auth-devices__item">
               <img :src="getDeviceIcon(device)" alt="Device Icon" class="auth-devices__icon" />
               <div class="auth-devices__info">
                  <p class="auth-devices__status">
                     {{ getDeviceCategory(currentDevice) }}, {{ currentDevice.platform }}
                  </p>
                  <p class="auth-devices__browser">{{ currentDevice.browser }}</p>
                  <p class="auth-devices__geo">{{ currentDevice.city }}, {{ currentDevice.country }} · {{
                     formatDate(currentDevice.auth_time) }}</p>
               </div>
               <button @click="logoutDevice(device.id)" class="auth-devices__logout-button">
                  <img class="logout-icon" src="../assets/icons/out-icon.svg" alt="Logout Icon" />
               </button>
            </li>
         </ul>
      </div>

      <p v-else class="auth-devices__no-devices">Нет активных устройств для входа.</p>

      <button @click="logoutEverywhereDevices" class="auth-devices__logout-everywhere">
         Выйти со всех устройств
      </button>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getMyselfAuthEvents, logoutUser, logoutEverywhere } from '../services/apiClient';
import { getCityByIp } from '../services/apiLocation';
import phoneIcon from '../assets/icons/phone2.svg';
import pcIcon from '../assets/icons/pc2.svg';

const devices = ref([]);
const currentDevice = computed(() => devices.value.find(device => !device.exit_time));
const otherDevices = computed(() => devices.value.filter(device => device.id !== currentDevice.value?.id && !device.exit_time));

// Запросить устройства и город для каждого устройства
const fetchDevices = async () => {
   try {
      const response = await getMyselfAuthEvents();
      if (response.success) {
         devices.value = response.data.filter(device => !device.exit_time);
         await fetchDeviceCities(devices.value); // Запрашиваем города для всех устройств
      } else {
         console.error('Не удалось загрузить устройства:', response.message);
      }
   } catch (error) {
      console.error('Ошибка при получении устройств:', error);
   }
};

// Получаем город и страну для каждого устройства по IP
const fetchDeviceCities = async (devices) => {
   for (let device of devices) {
      try {
         const { city, country } = await getCityByIp(device.ip);
         device.city = city;
         device.country = country;
      } catch (error) {
         console.error(`Ошибка при получении города для IP ${device.ip}:`, error);
         device.city = 'Неизвестно';  // Если ошибка, ставим "Неизвестно"
         device.country = 'Неизвестно';
      }
   }
};

// Функция выхода с устройства
const logoutDevice = async (authEventId) => {
   try {
      await logoutUser(authEventId);
      devices.value = devices.value.filter(device => device.id !== authEventId);
   } catch (error) {
      console.error('Ошибка при выходе с устройства:', error);
   }
};

// Функция выхода со всех устройств
const logoutEverywhereDevices = async () => {
   try {
      await logoutEverywhere();
      devices.value = [];
   } catch (error) {
      console.error('Ошибка при выходе со всех устройств:', error);
   }
};

// Форматируем дату
const formatDate = (date) => {
   return new Date(date).toLocaleString('ru-RU');
};

// Определяем категорию устройства (ПК, iPhone, Android)
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

// Определяем иконку устройства
const getDeviceIcon = (device) => {
   const category = getDeviceCategory(device);
   if (category === 'ПК') {
      return pcIcon;
   }
   if (category === 'iPhone' || category === 'Android') {
      return phoneIcon;
   }
   return ''; // Если категория неизвестна, не показывать иконку
};

// Загрузка данных при монтировании компонента
onMounted(fetchDevices);
</script>

<style scoped lang="scss">
.auth-devices {
   max-width: 600px;
   width: 100%;
   margin-top: 40px;

   &__title {
      color: #323232;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 24px;
   }

   &__sub-title {
      color: #A8A8A8;
      font-size: 14px;
      font-weight: 400;
      min-width: 200px;
   }

   &__current-device {
      display: flex;
      margin-bottom: 24px;
      
      @media (max-width: 991px) {
         flex-direction: column;
         row-gap: 16px;
      }
   }

   &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      padding: 0;
      margin: 0;
   }

   &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #EEF9FF;
      padding: 16px;
      border-radius: 6px;
      width: 100%;
   }

   &__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
   }

   &__icon {
      width: 40px;
      height: 40px;
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
      font-weight: 700;
   }

   &__browser {
      color: #323232;
      font-size: 12px;
      line-height: 14px;
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

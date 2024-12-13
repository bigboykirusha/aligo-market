<template>
   <div class="auth-devices">
      <div class="auth-devices__title">История активности</div>

      <!-- Блок текущего устройства -->
      <div v-if="currentDevice" class="auth-devices__current-device">
         <div class="auth-devices__sub-title">Это устройство</div>
         <ul class="auth-devices__list">
            <div class="auth-devices__block">
               <li :key="currentDevice.id" class="auth-devices__item">
                  <img :src="getDeviceIcon(currentDevice)" alt="Device Icon" class="auth-devices__icon" />
                  <div class="auth-devices__info">
                     <p class="auth-devices__status">
                        {{ getDeviceCategory(currentDevice) }}, {{ currentDevice.platform }}
                     </p>
                     <p class="auth-devices__browser">{{ currentDevice.browser }}</p>
                     <p class="auth-devices__geo">{{ currentDevice.auth_city }}, {{ currentDevice.auth_country }} · {{
                        formatDate(currentDevice.auth_time) }}</p>
                  </div>
               </li>
               <button @click="logoutEverywhereDevices" class="auth-devices__logout-everywhere">
                  <img class="leave-icon" src="../assets/icons/stop.svg" alt="Logout Icon" />Выйти со всех
                  устройств
               </button>
            </div>
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
                     {{ getDeviceCategory(device) }}, {{ device.platform }}
                  </p>
                  <p class="auth-devices__browser">{{ device.browser }}</p>
                  <p class="auth-devices__geo">{{ device.auth_city }}, {{ device.auth_country }} · {{
                     formatDate(device.auth_time) }}</p>
               </div>
               <button @click="logoutDevice(device.id)" class="auth-devices__logout-button">
                  <img class="logout-icon" src="../assets/icons/out-icon.svg" alt="Logout Icon" />
               </button>
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getMyselfAuthEvents, logoutUser, logoutEverywhere } from '../services/apiClient';
import phoneIcon from '../assets/icons/phone2.svg';
import pcIcon from '../assets/icons/pc2.svg';

const devices = ref([]);
const currentDevice = computed(() => devices.value.find(device => device.is_this_device));
const otherDevices = computed(() => devices.value.filter(device => !device.is_this_device));

// Запросить устройства
const fetchDevices = async () => {
   try {
      const response = await getMyselfAuthEvents();
      if (response.success) {
         devices.value = response.data;
      } else {
         console.error('Не удалось загрузить устройства:', response.message);
      }
   } catch (error) {
      console.error('Ошибка при получении устройств:', error);
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
   if (device.platform.includes('Mac')) {
      return 'MacBook'; // Если это Mac
   }
   if (device.platform.includes('Windows') || device.platform.includes('Linux')) {
      return 'ПК'; // Если это ПК
   }
   if (device.platform.includes('iOS')) {
      return 'iPhone'; // Если это iPhone
   }
   if (device.platform.includes('Android')) {
      return 'Android'; // Если это Android
   }
   return 'Неизвестно'; // Если категория не определена
};

// Получаем иконку устройства в зависимости от категории
const getDeviceIcon = (device) => {
   const category = getDeviceCategory(device);
   if (category === 'ПК' || category === 'Linux') {
      return pcIcon;
   }
   if (category === 'MacBook') {
      return pcIcon;
   }
   if (category === 'iPhone' || category === 'Android') {
      return phoneIcon;
   }
   return 'pcIcon'; // Если категория неизвестна, иконка не показывается
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
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      gap: 8px;
      padding: 0 16px;
      padding-bottom: 16px;
      background-color: #EEF9FF;
      color: #3366FF;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
   }
}

.leave-icon {
   width: 14px;
   height: 14px;
}
</style>

<template>
   <div v-if="isVisible" class="popup">
      <div class="popup__content">
         <p>Это ваш город?</p>
         <div class="popup__buttons">
            <button @click="confirmCity">Да</button>
            <button @click="chooseCity">Выбрать другой</button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCookie } from '~/services/auth';
import { useCityStore } from '~/store/city';
import { fetchLocation, fetchCity } from '~/services/apiLocation';

const emit = defineEmits(['open-modal']);

const cityStore = useCityStore();

const isVisible = ref(false);

const getLocationAndCity = async () => {
   try {
      const { lat, lon } = await fetchLocation();
      const cityName = await fetchCity(lat, lon);
      cityStore.setSelectedCity(cityName);
      isVisible.value = true;
   } catch (error) {
      console.error('Ошибка:', error);
   }
};

const confirmCity = () => {
   isVisible.value = false;
   localStorage.setItem('selectedCity', cityStore.selectedCity.name);
};

const chooseCity = () => {
   isVisible.value = false;
   emit('open-modal');
};

onMounted(() => {
   const savedCity = getCookie('selectedCity');
   if (savedCity) {
      const savedCity2 = JSON.parse(savedCity);
      cityStore.setSelectedCity(savedCity2.name);
      isVisible.value = false;
   } else {
      getLocationAndCity();
   }
});
</script>

<style scoped lang="scss">
.popup {
   position: absolute;
   top: 26px;
   left: 0;
   background-color: #fff;
   border: 1px solid #3366FF;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   padding: 16px;
   z-index: 100000;
   width: 250px;
   font-size: 16px;
   color: #333;

   @media (max-width: 768px) {
      display: none;
   }

   &::before {
      content: '';
      position: absolute;
      background-color: transparent;
      top: -8px;
      left: 30px;
      width: 0;
      height: 0;
      border-left: 8px solid #3366FF;
      border-right: 8px solid #3366FF;
      border-bottom: 8px solid #fff;
   }

   &__content {
      p {
         font-weight: 700;
         color: #323232;
         font-size: 14px;
         padding-bottom: 16px;
         border-bottom: 1px solid #EEEEEE;
      }
   }

   &__buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      gap: 16px;

      button {
         border: none;
         border-radius: 6px;
         font-size: 14px;
         padding: 6px 16px;
         cursor: pointer;
         transition: background-color 0.3s ease, color 0.3s ease;
         font-weight: 400;

         &:first-child {
            background-color: #3366ff;
            color: #ffffff;
            width: 26%;

            &:hover {
               background-color: #0044cc;
            }
         }

         &:last-child {
            background-color: #D6EFFF;
            color: #3366ff;

            &:hover {
               background-color: #A4DCFF;
               color: #3366ff;
            }
         }
      }
   }
}
</style>
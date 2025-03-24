<template>
   <div v-if="isVisible" class="overlay">
      <div class="popup">
         <img @click="chooseCity" src="../assets/icons/close-blue.svg" alt="Закрыть" />
         <div class="popup__header">
            <p><span>{{ cityStore.selectedCity.name }}</span> – это ваш город?</p>
         </div>
         <div class="popup__buttons">
            <button @click="confirmCity">Да</button>
            <button @click="chooseCity">Выбрать другой</button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCookie } from '#app';
import { useCityStore } from '~/store/city';
import { fetchLocation, fetchCity } from '~/services/apiLocation';
import { searchCitiesByName } from '~/services/apiClient';
import { useLocationModalStore } from '~/store/locationModalStore';

const cityStore = useCityStore();
const locationModalStore = useLocationModalStore();
const isVisible = ref(false);

const getLocationAndCity = async () => {
   try {
      const { lat, lon } = await fetchLocation();
      const cityName = await fetchCity(lat, lon);

      const cities = await searchCitiesByName(cityName);

      let selectedCity;

      if (cities && cities.data && cities.data.length > 0) {
         selectedCity = cities.data.find(city => city.title === cityName) || { name: 'Москва', id: 365 };
      } else {
         selectedCity = { name: 'Москва', id: 365 };
      }

      cityStore.setSelectedCity({
         name: selectedCity.title || selectedCity.name,
         id: selectedCity.id,
      });

      isVisible.value = true;
   } catch (error) {
      console.error('Ошибка определения города:', error);
   }
};

const confirmCity = () => {
   isVisible.value = false;
   localStorage.setItem('selectedCity', JSON.stringify(cityStore.selectedCity));
};

const chooseCity = () => {
   isVisible.value = false;
   locationModalStore.toggleMenu();
};

onMounted(() => {
   const savedCity = useCookie('selectedCity').value;

   if (savedCity) {
      cityStore.setSelectedCity(savedCity);
   } else {
      getLocationAndCity();
   }
});
</script>

<style scoped lang="scss">
.overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.3);
   display: none;
   justify-content: center;
   align-items: flex-start;
   z-index: 1000;

   @media (max-width: 768px) {
      display: flex;
   }
}

.popup {
   position: relative;
   width: 100%;
   max-width: 100%;
   background: #fff;
   border-radius: 0 0 6px 6px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
   padding: 40px 34px;
   text-align: center;

   img {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 16px;
      height: 16px;
      cursor: pointer;
   }

   &__header {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
      color: #323232;
      text-align: left;

      span {
         color: #3366ff;
      }
   }

   &__buttons {
      display: flex;
      gap: 12px;

      button {
         flex: 1;
         border: none;
         border-radius: 6px;
         padding: 8px 12px;
         font-size: 16px;
         cursor: pointer;
         font-weight: 400;
         transition: 0.3s;

         &:first-child {
            background: #3366ff;
            color: #fff;

            &:hover {
               background: #0044cc;
            }
         }

         &:last-child {
            background: #d6efff;
            color: #3366ff;

            &:hover {
               background: #a4dcff;
            }
         }
      }
   }
}
</style>

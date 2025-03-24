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
import { ref, onMounted, onUnmounted } from 'vue';
import { useCookie } from '#app';
import { useCityStore } from '~/store/city';
import { fetchLocation, fetchCity } from '~/services/apiLocation';
import { searchCitiesByName } from '~/services/apiClient';

const emit = defineEmits(['open-modal']);
const cityStore = useCityStore();
const isVisible = ref(false);

const getLocationAndCity = async () => {
   try {
      const { lat, lon } = await fetchLocation();
      const cityName = await fetchCity(lat, lon);

      const cities = await searchCitiesByName(cityName);

      let selectedCity;

      if (cities?.data?.length) {
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
   emit('open-modal');
};

const handleScroll = () => {
   isVisible.value = false;
};

onMounted(() => {
   const savedCity = useCookie('selectedCity').value;
   if (savedCity) {
      cityStore.setSelectedCity(savedCity);
   } else {
      getLocationAndCity();
   }

   window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.popup {
   position: absolute;
   top: 26px;
   left: 0;
   width: 250px;
   background: #fff;
   border: 1px solid #3366FF;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   padding: 16px;
   font-size: 16px;
   color: #333;
   z-index: 1000000;

   @media (max-width: 768px) {
      display: none;
   }

   &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 30px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #fff;
   }

   &__content {
      p {
         font-size: 14px;
         font-weight: 700;
         color: #323232;
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

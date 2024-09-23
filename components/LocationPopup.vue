<template>
   <div v-if="isVisible" class="popup">
      <div class="popup__content">
         <p>{{ popupMessage }}</p>
         <div class="popup__buttons">
            <button @click="confirmCity">Да</button>
            <button @click="chooseCity">Выбрать другой</button>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getCookie } from '~/services/auth';
import { useCityStore } from '~/store/city';
import { fetchLocation, fetchCity } from '~/services/apiLocation';

const emit = defineEmits();

const cityStore = useCityStore();

const city = ref('');
const isVisible = ref(false);

const getLocationAndCity = async () => {
   try {
      const { lat, lon } = await fetchLocation();
      const cityName = await fetchCity(lat, lon);
      city.value = cityName;
      cityStore.setSelectedCity(city.value);
      isVisible.value = true;
   } catch (error) {
      console.error('Ошибка:', error);
   }
};

const confirmCity = () => {
   isVisible.value = false;
   cityStore.setSelectedCity(city.value);
   localStorage.setItem('selectedCity', city.value);
};

const chooseCity = () => {
   isVisible.value = false;
   emit('open-modal');
};

const popupMessage = computed(() => {
   return window.innerWidth <= 600
      ? `Ваш город ${city.value}?`
      : 'Это ваш город?';
});

onMounted(() => {
   const savedCity = getCookie('selectedCity');
   if (savedCity) {
      const savedCity2 = JSON.parse(savedCity);
      city.value = savedCity2.name;
      cityStore.setSelectedCity(city.value);
      isVisible.value = false;
   } else {
      getLocationAndCity();
   }
});
</script>

<style scoped lang="scss">
.popup {
   position: absolute;
   top: 36px;
   left: 0;
   background-color: #fff;
   border: 1px solid #3366FF;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   padding: 16px;
   z-index: 1000;
   width: 250px;
   font-size: 16px;
   color: #333;

   @media screen and (max-width: 600px) {
      left: -30px;
   }

   &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 30px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #fff;

      @media screen and (max-width: 600px) {
         left: 26px;
      }
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

      button {
         border: none;
         border-radius: 4px;
         font-size: 14px;
         padding: 6px 16px;
         cursor: pointer;
         transition: background-color 0.3s;

         &:first-child {
            background-color: #3366FF;
            color: #fff;

            &:hover {
               background-color: #0044cc;
            }
         }

         &:last-child {
            background-color: #fff;
            color: #3366FF;
            border: 1px solid #EEEEEE;

            &:hover {
               background-color: #3366FF;
               color: #fff;
            }
         }
      }
   }
}
</style>
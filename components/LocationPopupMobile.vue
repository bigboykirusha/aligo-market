<template>
   <div v-if="isVisible" class="overlay">
      <div class="popup">
         <img @click="chooseCity" src="../assets/icons/close-blue.svg" alt="">
         <div class="popup__header">
            <p><span>{{ cityStore.selectedCity.name }}</span> – это ваш город?</p>
         </div>
         <div class="popup__buttons">
            <button @click="confirmCity">Да</button>
            <button @click="chooseCity">Выбрать другой</button>
         </div>
      </div>
   </div>
   <LocationModal v-show="modalOpen" @close-modal="closeModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCookie } from '~/services/auth';
import { useCityStore } from '~/store/city';
import { fetchLocation, fetchCity } from '~/services/apiLocation';

const modalOpen = ref(false);

const toggleModal = () => {
   modalOpen.value = true;
};

const closeModal = () => {
   modalOpen.value = false;
};

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
   toggleModal();
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
.overlay {
   position: fixed;
   display: none;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.3);
   justify-content: center;
   align-items: flex-start;
   z-index: 1000;

   @media (max-width: 768px) {
      display: flex;
   }
}

.popup {
   width: 100%;
   background-color: #ffffff;
   border-radius: 0 0 6px 6px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
   padding: 40px 34px;
   padding-top: 44px;
   text-align: center;

   p {
      span {
         color: #3366ff;
      }
   }

   img {
      position: absolute;
      right: 24px;
      top: 28px;
      width: 16px;
      height: 16px;
   }

   &__header {
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eeeeee;
      color: #323232;
      text-align: left;
   }

   &__buttons {
      display: flex;
      justify-content: space-around;
      gap: 12px;

      button {
         flex: 1;
         border: none;
         border-radius: 6px;
         padding: 8px 12px;
         font-size: 16px;
         cursor: pointer;
         font-weight: 400;
         transition: background-color 0.3s ease;

         &:first-child {
            background-color: #3366ff;
            color: #ffffff;

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

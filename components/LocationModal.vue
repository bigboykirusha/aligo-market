<template>
  <div v-show="isLocationModalOpen" id="location-switcher-modal" class="modal" @click.self="closeModal">
    <div class="modal__content">
      <button class="modal__close-button" @click.stop="closeModal">
        <img :src="closeIcon" alt="close icon" />
      </button>
      <form class="modal__form" @submit.prevent="saveCity">
        <div class="modal__header">
          <button v-if="selectedRegion" class="back-button" @click="clearRegionSelection">
            <img :src="backIcon" alt="back arrow" />
          </button>
          <h2 class="modal__title">
            {{ selectedRegion ? `${selectedRegion.title}, РФ` : $t('modal.title') }}
          </h2>
        </div>
        <div class="modal__body">
          <div class="input-wrapper">
            <div class="input-text">
              <img class="input-text__icon" src="../assets/icons/ru.svg" alt="flag" />
              <input v-model="searchQuery" type="text" placeholder="Поиск города" class="input-text__input" />
            </div>
          </div>

          <!-- Скелетоны для загрузки -->
          <div v-if="isLoadingCities" class="list-wrapper">
            <ul class="list">
              <li v-for="n in 8" :key="n" class="list__item list__item--skeleton"></li>
            </ul>
          </div>
          <!-- Список городов -->
          <div v-else>
            <div v-if="!selectedRegion && searchQuery === ''" class="list-wrapper">
              <ul class="list">
                <li v-for="region in regions" :key="region.id" class="list__item" @click="fetchCitiesForRegion(region)">
                  {{ region.title }}
                </li>
              </ul>
            </div>

            <div v-else class="list-wrapper">
              <ul class="list">
                <li v-for="city in filteredCities" :key="city.id"
                  :class="['list__item', { 'selected': city.id === selectedCity.id }]" @click="selectCity(city)"
                  :title="`${city.title}, РФ`">
                  {{ `${city.title}` }}
                </li>
                <li v-if="filteredCities.length === 0" class="list__empty">
                  Ничего не найдено
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="modal__footer">
          <button type="submit" class="modal__button" :disabled="!selectedCity?.id">
            {{ $t('modal.saveButton') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { debounce } from 'lodash-es';
import { getRegions, getCitiesByRegion, searchCitiesByName, updateUserInfo } from '~/services/apiClient';
import { useLocationModalStore } from '~/store/locationModalStore';
import { useCityStore } from '~/store/city';
import closeIcon from '../assets/icons/close.svg';
import backIcon from '../assets/icons/back.svg';

const cityStore = useCityStore();
const locationModalStore = useLocationModalStore();

const regions = ref([]);
const cities = ref([]);
const selectedRegion = ref(null);
const searchQuery = ref('');
const selectedCity = ref({ name: '' });
const isLoadingCities = ref(false);
const isLocationModalOpen = computed(() => locationModalStore.isActive);

onMounted(() => {
  fetchRegions();
});

const fetchRegions = async () => {
  const cachedRegions = localStorage.getItem('regions');

  if (cachedRegions) {
    regions.value = JSON.parse(cachedRegions);
    return;
  }

  try {
    isLoadingCities.value = true;
    const data = await getRegions();
    regions.value = data;

    // Сохраняем регионы в локальное хранилище
    localStorage.setItem('regions', JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка получения регионов:', error);
  } finally {
    setLoadingWithDelay(isLoadingCities);
  }
};

const fetchCitiesForRegion = async (region) => {
  try {
    isLoadingCities.value = true;
    selectedRegion.value = region;
    searchQuery.value = '';
    cities.value = await getCitiesByRegion(region.id);
  } catch (error) {
    console.error('Ошибка получения городов:', error);
  } finally {
    setLoadingWithDelay(isLoadingCities);
  }
};

const searchCities = async (query) => {
  if (query.length !== 0) {
    try {
      isLoadingCities.value = true;
      cities.value = await searchCitiesByName(query);
    } catch (error) {
      console.error('Ошибка поиска городов:', error);
    } finally {
      setLoadingWithDelay(isLoadingCities);
    }
  }
};

let loadingTimeout;
const setLoadingWithDelay = (isLoadingRef) => {
  clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => {
    isLoadingRef.value = false;
  }, 1000);
};

const debouncedSearch = debounce((newQuery) => {
  selectedRegion.value = null;
  searchCities(newQuery);
}, 500);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const filteredCities = computed(() => {
  if (!searchQuery.value && selectedRegion.value) {
    return cities.value;
  }
  return cities.value.filter(city => city.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const selectCity = (city) => {
  selectedCity.value = { name: city.title, id: city.id };
};

const clearRegionSelection = () => {
  selectedRegion.value = null;
  cities.value = [];
  selectedCity.value = { name: null, id: null };
};

const saveCity = async () => {
  cityStore.setSelectedCity(selectedCity.value);
  const formData = new FormData();
  formData.append('city_id', selectedCity.value.id);

  await updateUserInfo(formData);
  closeModal();
};

const closeModal = () => {
  searchQuery.value = '';
  locationModalStore.closeMenu();
};
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  z-index: 40000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  padding: 32px;
  box-sizing: border-box;

  @media (max-width: 576px) {
    padding: 16px;
  }

  &__content {
    background: #fff;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    padding: 32px 40px;
    box-sizing: border-box;
    animation: slide-up 0.3s ease-out;
  }

  &__close-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.1s ease-in-out;
    width: 16px;
    height: 16px;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;

    img {
      width: 16px;
      height: 16px;
    }
  }

  &__header,
  &__body {
    padding: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 20px;
    line-height: 24px;
    font-weight: bold;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  &__body {
    padding: 24px 0;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
  }

  &__footer {
    padding-top: 24px;
  }

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: auto;
    width: 148px;
    height: 34px;
    font-size: 14px;
    color: #fff;
    background-color: #3366ff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #EEEEEE;
      color: #787878;
      cursor: not-allowed;
    }
  }
}

.input-wrapper {
  display: flex;
  gap: 16px;
  position: relative;
  margin-bottom: 18px;
}

.input-text {
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  &__icon {
    position: absolute;
    left: 10px;
    width: 16px;
    height: 16px;
  }

  &__input {
    width: 100%;
    height: 34px;
    padding: 10px 10px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      border-color: #3366ff;
      outline: none;
    }
  }
}

.back-button {
  background-color: #D6EFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in;
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  cursor: pointer;

  img {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background-color: #A4DCFF;
  }
}

.list-wrapper {
  height: 165px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 285px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ebebeb;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #d6efff;
    }
  }
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 24px;
  padding-right: 8px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  &__item {
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-radius: 12px;

    &--skeleton {
      height: 34px;
      background-color: #f0f0f0;
      border-radius: 4px;
      animation: pulse 1.5s infinite ease-in-out;
    }

    &.selected {
      font-weight: 700;
      color: #3366ff;
    }
  }

  &__empty {
    padding: 16px;
    padding-left: 0;
    font-size: 14px;
    line-height: 18px;
  }
}

@keyframes pulse {
  0% {
    background-color: #f0f0f0;
  }

  50% {
    background-color: #e0e0e0;
  }

  100% {
    background-color: #f0f0f0;
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.region-title {
  margin: 16px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
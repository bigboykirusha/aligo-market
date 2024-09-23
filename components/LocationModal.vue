<template>
  <div id="location-switcher-modal" class="modal" @click.self="closeModal">
    <div class="modal__content">
      <button class="modal__close-button" @click="closeModal">
        <img :src="closeIcon" alt="close icon" />
      </button>
      <form class="modal__form" @submit.prevent="saveCity">
        <div class="modal__header">
          <h2 class="modal__title">{{ $t('modal.title') }}</h2>
        </div>
        <div class="modal__body">
          <div class="input-wrapper">
            <div class="input-text">
              <img class="input-text__icon" src="../assets/icons/ru.svg" alt="flag" />
              <input v-model="searchQuery" type="text" placeholder="Поиск города" class="input-text__input" />
            </div>
            <button v-if="selectedRegion" class="back-button" @click="clearRegionSelection">
              <img :src="backIcon" alt="back arrow" />
            </button>
          </div>

          <div v-if="!selectedRegion && searchQuery === ''" class="list-wrapper">
            <ul class="list">
              <li v-for="region in regions" :key="region.id" class="list__item" @click="fetchCitiesForRegion(region)">
                {{ region.title }}
              </li>
            </ul>
          </div>

          <div v-else class="list-wrapper">
            <ul class="list">
              <li v-for="city in filteredCities" :key="city.id" class="list__item" @click="selectCity(city)"
                :title="`${city.title}, РФ`">
                {{ city.title }}
              </li>
              <li v-if="filteredCities.length === 0" class="list__empty">
                {{ $t('modal.noData') }}
              </li>
            </ul>
          </div>
        </div>

        <div class="modal__footer">
          <button type="submit" class="modal__button" :disabled="!selectedCity.name">
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
import { getRegions, getCitiesByRegion, searchCitiesByName } from '~/services/apiClient';
import { useCityStore } from '~/store/city';
import closeIcon from '../assets/icons/close.svg';
import backIcon from '../assets/icons/back.svg';

const cityStore = useCityStore();
const emit = defineEmits(['close-modal']);

const regions = ref([]);
const cities = ref([]);
const selectedRegion = ref(null);
const searchQuery = ref('');
const selectedCity = ref({ name: '' });

onMounted(() => {
  fetchRegions();
});

const fetchRegions = async () => {
  try {
    regions.value = await getRegions();
  } catch (error) {
    console.error('Ошибка получения регионов:', error);
  }
};

const fetchCitiesForRegion = async (region) => {
  try {
    selectedRegion.value = region;
    searchQuery.value = '';
    cities.value = await getCitiesByRegion(region.id);
  } catch (error) {
    console.error('Ошибка получения городов:', error);
  }
};

const searchCities = async (query) => {
  if (query.length >= 3) {
    try {
      cities.value = await searchCitiesByName(query);
    } catch (error) {
      console.error('Ошибка поиска городов:', error);
    }
  } else if (!selectedRegion.value) {
    cities.value = [];
  } else if (selectedRegion.value) {
    try {
      cities.value = await getCitiesByRegion(selectedRegion.value.id);
    } catch (error) {
      console.error('Ошибка получения городов по региону:', error);
    }
  }
};

const debouncedSearch = debounce((newQuery) => {
  searchCities(newQuery);
}, 300); 

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
  searchQuery.value = city.title;
  selectedCity.value.name = city.title;
};

const clearRegionSelection = () => {
  selectedRegion.value = null;
  cities.value = [];
};

const saveCity = () => {
  const trimmedCityName = selectedCity.value.name.replace(/\s?(с\/п|с|г|п)(?=\s|$)/g, '').trim();
  cityStore.setSelectedCity(trimmedCityName);
  console.log('Выбранный город:', trimmedCityName);
  closeModal();
};

const closeModal = () => {
  searchQuery.value = '';
  emit('close-modal');
};
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  z-index: 40;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  padding: 32px;
  box-sizing: border-box;

  &__content {
    background: #fff;
    border-radius: 8px;
    width: 100%;
    max-width: 550px;
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

  &__title {
    font-size: 20px;
    line-height: 24px;
    padding-bottom: 24px;
    font-weight: bold;
    margin: 0;
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
      background-color: #d3d3d3;
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
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s ease-in-out;
  min-width: 34px;
  border-radius: 50%;
  border: none;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: #D6EFFF;
  }
}

.country-dropdown {
  position: absolute;
  top: 0;
  left: 0;
  width: 38px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 20;

  &__item {
    display: flex;
    align-items: center;
    padding: 12px 10px;
    cursor: pointer;

    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.list-wrapper {
  height: 100%;
  max-height: 165px;
  overflow-y: auto;

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
  columns: 2;
  padding: 0;
  margin: 0;

  @media screen and (max-width: 600px) {
    columns: 1;
  }

  &__item {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
    margin-bottom: 18px;

    &:hover {
      color: #007bff;
    }
  }

  &__empty {
    font-size: 14px;
    color: #787878;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
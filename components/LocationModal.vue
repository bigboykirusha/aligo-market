<template>
  <div id="location-switcher-modal" class="modal" @click.self="closeModal">
    <div class="modal__content">
      <button class="modal__close-button" @click.stop="closeModal">
        <img :src="closeIcon" alt="close icon" />
      </button>
      <form class="modal__form" @submit.prevent="saveCity">
        <div class="modal__header">
          <h2 class="modal__title">
            {{ selectedRegion ? `${selectedRegion.sorp} ${selectedRegion.title}` : $t('modal.title') }}
          </h2>
        </div>
        <div class="modal__body">
          <div class="input-wrapper">
            <button v-if="selectedRegion" class="back-button" @click="clearRegionSelection">
              <img :src="backIcon" alt="back arrow" />
            </button>
            <div class="input-text">
              <img class="input-text__icon" src="../assets/icons/ru.svg" alt="flag" />
              <input v-model="searchQuery" type="text" placeholder="Поиск города" class="input-text__input" />
            </div>
          </div>
          <div v-if="!selectedRegion && searchQuery === ''" class="list-wrapper">
            <ul class="list">
              <li v-for="region in regions" :key="region.id" class="list__item" @click="fetchCitiesForRegion(region)">
                {{ region.sorp }} {{ region.title }}
              </li>
            </ul>
          </div>

          <div v-else class="list-wrapper">
            <ul class="list">
              <li v-for="city in filteredCities" :key="city.id" class="list__item" @click="selectCity(city)"
                :title="`${city.title}, РФ`">
                {{ transformSorp(city.sorp) }} {{ `${city.title}` }}
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

const transformSorp = (sorp) => {
  return sorp
    .replace(/г\b/g, 'г.') // Город
    .replace(/\bп\b/g, 'поселок') // Поселок
    .replace(/\bс\b/g, 'село') // Село
    .replace(/с\/с\b/g, 'сельсовет') // Сельсовет
    .replace(/р-н\b/g, 'район') // Район
    .replace(/д\b/g, 'деревня') // Деревня
    .replace(/ст\b/g, 'станица') // Станция
    .replace(/кп\b/g, 'коттеджный поселок') // Курортный поселок
    .replace(/мкр\b/g, 'микрорайон') // Микрорайон
    .replace(/\bм\b/g, 'мыс') // Мыс
    .replace(/пр-кт\b/g, 'проспект') // Проспект
    .replace(/ш\b/g, 'шоссе') // Шоссе
    .replace(/пер\b/g, 'переулок') // Переулок
    .replace(/б-р\b/g, 'бульвар') // Бульвар
    .replace(/тер\b/g, 'территория') // Территория
    .replace(/рп\b/g, 'рабочий поселок') // Рабочий поселок
    .replace(/нп\b/g, 'населенный пункт') // Населенный пункт
    .replace(/х\b/g, 'хутор') // Хутор
    .replace(/пгт\b/g, 'поселок городского типа') // Поселок городского типа
    .replace(/аал\b/g, 'аал') // Аал
    .replace(/арбан\b/g, 'арбан') // Арбан
    .replace(/ау\b/g, 'аул') // Аул
    .replace(/в-ки\b/g, 'выселки') // Выселки
    .replace(/г-к\b/g, 'городок') // Городок
    .replace(/з-ка\b/g, 'заимка') // Заимка
    .replace(/п-к\b/g, 'починок') // Починок
    .replace(/киш\b/g, 'кишлак') // Кишлак
    .replace(/м-ко\b/g, 'местечко') // Местечко
    .replace(/с\b/g, 'село') // Село
    .replace(/сл\b/g, 'слобода') // Слобода
    .replace(/ст\b/g, 'станция') // Станция
    .replace(/ст-ца\b/g, 'станица') // Станница
    .replace(/у\b/g, 'улус') // Улус
    .replace(/х\b/g, 'хутор') // Хутор
    .replace(/рзд\b/g, 'разъезд') // Разъезд
    .replace(/зим\b/g, 'зимовье') // Зимовье
    .replace(/б-г\b/g, 'берег') // Берег
    .replace(/вал\b/g, 'вал') // Вал
    .replace(/ж\/р\b/g, 'жилой район') // Жилой район
    .replace(/зона\b/g, 'зона') // Зона
    .replace(/кв-л\b/g, 'квартал') // Квартал
    .replace(/мкр\b/g, 'микрорайон') // Микрорайон
    .replace(/ост-в\b/g, 'остров') // Остров
    .replace(/парк\b/g, 'парк') // Парк
    .replace(/платф\b/g, 'платформа') // Платформа
    .replace(/п\/р\b/g, 'промышленный район') // Промышленный район
    .replace(/сад\b/g, 'сад') // Сад
    .replace(/сквер\b/g, 'сквер') // Сквер
    .replace(/тер\b/g, 'территория') // Территория
    .replace(/ус\b/g, 'усадьба') // Усадьба
    .replace(/тер\.ф\.х\b/g, 'территория фермерского хозяйства') // Территория ФХ
    .replace(/ю\b/g, 'юрты') // Юрты
    .replace(/ал\b/g, 'аллея') // Аллея
    .replace(/б-р\b/g, 'бульвар') // Бульвар
    .replace(/взв\b/g, 'взвоз') // Взвоз
    .replace(/взд\b/g, 'въезд') // Въезд
    .replace(/дор\b/g, 'дорога') // Дорога
    .replace(/ззд\b/g, 'заезд') // Заезд
    .replace(/км\b/g, 'километр') // Километр
    .replace(/к-цо\b/g, 'кольцо') // Кольцо
    .replace(/коса\b/g, 'коса') // Коса
    .replace(/лн\b/g, 'линия') // Линия
    .replace(/мгстр\b/g, 'магистраль') // Магистраль
    .replace(/наб\b/g, 'набережная') // Набережная
    .replace(/пер-д\b/g, 'переезд') // Переезд
    .replace(/пер\b/g, 'переулок') // Переулок
    .replace(/пл-ка\b/g, 'площадка') // Площадка
    .replace(/пл\b/g, 'площадь') // Площадь
    .replace(/пр-д\b/g, 'проезд') // Проезд
    .replace(/пр-к\b/g, 'просек') // Просек
    .replace(/пр-ка\b/g, 'просека') // Просека
    .replace(/пр-лок\b/g, 'проселок') // Проселок
    .replace(/пр-кт\b/g, 'проспект') // Проспект
    .replace(/проул\b/g, 'проулок') // Проулок
    .replace(/рзд\b/g, 'разъезд') // Разъезд
    .replace(/ряд\b/g, 'ряд') // Ряд
    .replace(/с-р\b/g, 'сквер') // Сквер
    .replace(/с-к\b/g, 'спуск') // Спуск
    .replace(/сзд\b/g, 'съезд') // Съезд
    .replace(/тракт\b/g, 'тракт') // Тракт
    .replace(/туп\b/g, 'тупик') // Тупик
    .replace(/ул\b/g, 'улица') // Улица
    .replace(/ш\b/g, 'шоссе') // Шоссе
    .replace(/влд\b/g, 'владение') // Владение
    .replace(/г-ж\b/g, 'гараж') // Гараж
    .replace(/д\b/g, 'дом') // Дом
    .replace(/двлд\b/g, 'домовладение') // Домовладение
    .replace(/зд\b/g, 'здание') // Здание
    .replace(/з\/у\b/g, 'земельный участок') // Земельный участок
    .replace(/кв\b/g, 'квартира') // Квартира
    .replace(/ком\b/g, 'комната') // Комната
    .replace(/подв\b/g, 'подвал') // Подвал
    .replace(/кот\b/g, 'котельная') // Котельная
    .replace(/п-б\b/g, 'погреб') // Погреб
    .replace(/к\b/g, 'корпус') // Корпус
    .replace(/ОНС\b/g, 'объект незавершенного строительства') // ОНС
    .replace(/офис\b/g, 'офис') // Офис
    .replace(/пав\b/g, 'павильон') // Павильон
    .replace(/помещ\b/g, 'помещение') // Помещение
    .replace(/раб\.уч\b/g, 'рабочий участок') // Рабочий участок
    .replace(/скл\b/g, 'склад') // Склад
    .replace(/coop\b/g, 'сооружение') // Сооружение
    .replace(/стр\b/g, 'строение') // Строение
    .replace(/торг\.зал\b/g, 'торговый зал') // Торговый зал
    .replace(/цех\b/g, 'цех'); // Цех
};

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
  cityStore.setSelectedCity(selectedCity.value.name);
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
  z-index: 40000;
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
  margin: 0;
  padding: 0;
  display: grid;
  column-gap: 16px;
  padding-right: 8px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.list__item {
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 12px;

  &:hover {
    background-color: #d6efff;
  }
}

.list__empty {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  line-height: 16px;
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

@media screen and (max-width: 576px) {
  .modal {
    padding: 16px;
  }
}
</style>

<template>
   <div class="filters">
      <div v-if="isMobile" class="filters__toggle"
         :class="{ 'filters__toggle--with-margin': !isWithMargin && showFilters }" ref="filtersRef">
         <div v-show="!isSecondClicked && !showFilters" class="filters__toggle-item" @click="toggleFirst">
            <SelectSkeleton v-if="loading" />
            <SelectOptionsTemplate v-else :options="switcherConditionOptions" @updateSort="handleButtonClick($event)"
               :initialSelectedOption="filtersStore.selectedCondition" placeholder="Все" />
         </div>
         <div v-show="!isFirstClicked && !showFilters" class="filters__toggle-item" @click="toggleSecond">
            <SelectSkeleton v-if="loading" />
            <AutosSelectTemplate v-else :options="dropdownMarksOptions" @updateSort="handleMarksUpdate"
               :initialSelectedOptions="filtersStore.selectedMark" placeholder="Марка" :key="marksComponentKey" />
         </div>
         <div v-if="showFilters" class="filters__settings--large">Настройки поиска</div>
         <div @click="resetFilters" v-if="showFilters" class="filters__settings">
            <img src="../assets/icons/clear.svg" />
            <span>Очистить</span>
         </div>
         <div @click="toggleFiltersVisibility" class="filters__settings">
            <img src="../assets/icons/settings.svg" />
            <span v-if="!showFilters">Настройки поиска</span>
            <span v-else>Скрыть</span>
         </div>
      </div>
      <div v-if="!showFilters && isAnyFilterSelected && isMobile" class="filters__selected-tags">
         <div v-for="(filter, index) in selectedFilters" :key="index" class="filters__tag">
            {{ capitalizeTitle(filter.title) }}
            <span @click="removeFilter(filter)">&#10005;</span>
         </div>
      </div>
      <div v-if="showFilters || !isMobile" class="filters__block" :key="filtersComponentKey">
         <div class="filters__title">Поиск автомобиля</div>
         <SwitcherSkeleton v-if="loading" />
         <AutosButtonsTemplate v-else :options="switcherConditionOptions" label="Категория"
            @updateSelected="handleButtonClick($event)" :activeIndex="filtersStore.selectedCondition" />

         <SwitcherSkeleton v-if="loading" />
         <AutosSwitcherTemplate v-else-if="filtersStore.selectedCondition !== 1" :options="switcherStateOptions"
            label="Состояние" @updateSelected="handleFilterUpdate('selectedState', $event)"
            :activeIndex="filtersStore.selectedState" :dis="filtersStore.selectedCondition === 1" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownMarksOptions" label="Марка" @updateSort="handleMarksUpdate"
            :initialSelectedOptions="filtersStore.selectedMark" placeholder="Нажмите для выбора" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownModelsOptions" label="Модель"
            :disabled="isModelsDropdownDisabled" @updateSort="handleModelsUpdate"
            :initialSelectedOptions="filtersStore.selectedModel" placeholder="Нажмите для выбора" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Цена" @updateRange="handleFilterUpdate('priceRange', $event)"
            :initialMinValue="filtersStore.priceRange.min" :initialMaxValue="filtersStore.priceRange.max" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Год выпуска" @updateRange="handleFilterUpdate('yearRange', $event)"
            :initialMinValue="filtersStore.yearRange.min" :initialMaxValue="filtersStore.yearRange.max" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxBodyTypeOptions" label="Тип кузова"
            @updateSelected="handleFilterUpdate('selectedBodyTypes', $event)"
            :activeIndexes="filtersStore.selectedBodyTypes" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownTransmissionOptions" label="Коробка передач"
            @updateSort="handleFilterUpdate('selectedTransmission', $event)"
            :initialSelectedOptions="filtersStore.selectedTransmission" placeholder="Нажмите для выбора" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxEngineTypeOptions" label="Тип двигателя"
            @updateSelected="handleFilterUpdate('selectedEngineTypes', $event)"
            :activeIndexes="filtersStore.selectedEngineTypes" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else-if="filtersStore.selectedCondition !== 1" label="Пробег, км"
            @updateRange="handleFilterUpdate('mileageRange', $event)" :dis="filtersStore.selectedCondition === 1"
            :initialMinValue="filtersStore.mileageRange.min" :initialMaxValue="filtersStore.mileageRange.max" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Объём двигателя, л"
            @updateRange="handleFilterUpdate('engineVolumeRange', $event)"
            :initialMinValue="filtersStore.engineVolumeRange.min"
            :initialMaxValue="filtersStore.engineVolumeRange.max" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxDriveOptions" label="Привод"
            @updateSelected="handleFilterUpdate('selectedDrives', $event)"
            :activeIndexes="filtersStore.selectedDrives" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Мощность, л.с." @updateRange="handleFilterUpdate('powerRange', $event)"
            :initialMinValue="filtersStore.powerRange.min" :initialMaxValue="filtersStore.powerRange.max" />

         <ColorPickerSkeleton v-if="loading" />
         <ColorPickerTemplate v-else :options="colorOptions" label="Цвет"
            @updateSelected="handleFilterUpdate('selectedColor', $event)" :activeIndexes="filtersStore.selectedColor" />
      </div>
   </div>
   <div v-show="isAnyFilterSelected && !isButtonClicked" class="filters__overlay">
      <div class="filters__seacrh">
         <div @click="searchCars" class="filters__button">Показать результаты</div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useFiltersStore } from '../store/filters';
import { useRoute } from 'vue-router';
import { getCarBrands, getCarModels, getCarTransmission, getCarBodyType, getCarEngineType, getCarDrive, getCarState, getColors, getCarCondition } from '../services/apiClient';
import { fetchDataWithCache } from '../services/createUtils'

const searchCars = () => {
   emit('updateSort');
   isButtonClicked.value = true;
   showFilters.value = false;
};

const loading = ref(true);
const filtersStore = useFiltersStore();
const route = useRoute();
const showFilters = ref(false);
const dropdownMarksOptions = ref([]);
const dropdownModelsOptions = ref([]);
const dropdownTransmissionOptions = ref([]);
const checkboxBodyTypeOptions = ref([]);
const checkboxEngineTypeOptions = ref([]);
const checkboxDriveOptions = ref([]);
const switcherStateOptions = ref([]);
const switcherConditionOptions = ref([]);
const colorOptions = ref([]);
const selectedMark = ref([]);
const selectedModel = ref([]);
const isModelsDropdownDisabled = computed(() => !(filtersStore.selectedMark.length > 0 && filtersStore.selectedMark.length === 1));
const emit = defineEmits(['updateSort']);
const isMobile = ref(false);
const isWithMargin = ref(true);

const isButtonClicked = ref(true);

const isFirstClicked = ref(false);
const isSecondClicked = ref(false);
const filtersRef = ref(null);

const marksComponentKey = ref(0);
const filtersComponentKey = ref(0);

const toggleFirst = () => {
   isFirstClicked.value = true;
   isSecondClicked.value = false;
};

const toggleSecond = () => {
   isSecondClicked.value = true;
   isFirstClicked.value = false;
};

const handleClickOutside = (event) => {
   if (filtersRef.value && !filtersRef.value.contains(event.target)) {
      isFirstClicked.value = false;
      isSecondClicked.value = false;
   }
};

const handleScroll = () => {
   isWithMargin.value = window.scrollY === 0;
};

const handleButtonClick = (value) => {
   isButtonClicked.value = true;
   console.log(value);
   handleFilterUpdate('selectedCondition', value)
};

if (route.path.includes('autos/new')) {
   handleFilterUpdate('selectedCondition', 1);
} else if (route.path.includes('autos/used')) {
   handleFilterUpdate('selectedCondition', 2);
} 

const fetchOptions = async () => {
   try {
      await Promise.all([
         fetchMarksDropdownOptions(),
         fetchTransmissionDropdownOptions(),
         fetchBodyTypeOptions(),
         fetchEngineTypeOptions(),
         fetchDriveOptions(),
         fetchColorOptions(),
         fetchStateOptions(),
         fetchConditionOptions(),
      ]);
      loading.value = false;
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const fetchMarksDropdownOptions = async () => {
   dropdownMarksOptions.value = await fetchDataWithCache('MarksDropdownOptions', getCarBrands);
};

const fetchColorOptions = async () => {
   colorOptions.value = await fetchDataWithCache('ColorOptions', getColors);
};

const fetchConditionOptions = async () => {
   switcherConditionOptions.value = await fetchDataWithCache('ConditionOptions', getCarCondition);
};

const fetchTransmissionDropdownOptions = async () => {
   dropdownTransmissionOptions.value = await fetchDataWithCache('TransmissionDropdownOptions', getCarTransmission);
};

const fetchBodyTypeOptions = async () => {
   checkboxBodyTypeOptions.value = await fetchDataWithCache('BodyTypeOptions', getCarBodyType);
};

const fetchEngineTypeOptions = async () => {
   checkboxEngineTypeOptions.value = await fetchDataWithCache('EngineTypeOptions', getCarEngineType);
};

const fetchDriveOptions = async () => {
   checkboxDriveOptions.value = await fetchDataWithCache('DriveOptions', getCarDrive);
};

const fetchStateOptions = async () => {
   switcherStateOptions.value = await fetchDataWithCache('StateOptions', getCarState);
};

const fetchModelsDropdownOptions = async (id) => {
   try {
      dropdownModelsOptions.value = await getCarModels(id);
   } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
   }
};

const toggleFiltersVisibility = () => {
   showFilters.value = !showFilters.value;
};

const selectedFilters = computed(() => {
   const filters = [];

   if (loading.value) return filters;

   // Категория (новые/с пробегом)
   if (filtersStore.selectedCondition !== null && switcherConditionOptions.value.length > 0) {
      const condition = switcherConditionOptions.value.find(option => option.id === filtersStore.selectedCondition);
      if (condition) filters.push({ title: condition.title, type: 'condition', value: filtersStore.selectedCondition });
   }

   // Состояние (битый/не битый)
   if (filtersStore.selectedState !== null && switcherStateOptions.value.length > 0) {
      const state = switcherStateOptions.value.find(option => option.id === filtersStore.selectedState);
      if (state) filters.push({ title: state.title, type: 'state', value: filtersStore.selectedState });
   }

   // Марка
   if (Array.isArray(filtersStore.selectedMark) && filtersStore.selectedMark.length > 0) {
      filtersStore.selectedMark.forEach((id) => {
         const mark = dropdownMarksOptions.value.find(option => option.id === id);
         if (mark) filters.push({ title: mark.title, type: 'mark', value: mark.id });
      });
   }

   // Модель
   if (Array.isArray(filtersStore.selectedModel) && filtersStore.selectedModel.length > 0) {
      filtersStore.selectedModel.forEach((id) => {
         const model = dropdownModelsOptions.value.find(option => option.id === id);
         if (model) filters.push({ title: model.title, type: 'model', value: model.id });
      });
   }

   // Тип кузова
   if (Array.isArray(filtersStore.selectedBodyTypes) && filtersStore.selectedBodyTypes.length > 0) {
      filtersStore.selectedBodyTypes.forEach((id) => {
         const bodyType = checkboxBodyTypeOptions.value.find(option => option.id === id);
         if (bodyType) filters.push({ title: bodyType.title, type: 'bodyType', value: bodyType.id });
      });
   }

   // Добавление фильтра для типа двигателя
   if (Array.isArray(filtersStore.selectedEngineTypes) && filtersStore.selectedEngineTypes.length > 0) {
      filtersStore.selectedEngineTypes.forEach((id) => {
         const engineType = checkboxEngineTypeOptions.value.find(option => option.id === id);
         if (engineType) filters.push({ title: engineType.title, type: 'engineType', value: engineType.id });
      });
   }

   // Коробка передач
   if (Array.isArray(filtersStore.selectedTransmission) && filtersStore.selectedTransmission.length > 0) {
      filtersStore.selectedTransmission.forEach((id) => {
         const transmission = dropdownTransmissionOptions.value.find(option => option.id === id);
         if (transmission) filters.push({ title: transmission.title, type: 'transmission', value: transmission.id });
      });
   }

   // Цвет
   if (Array.isArray(filtersStore.selectedColor) && filtersStore.selectedColor.length > 0) {
      filtersStore.selectedColor.forEach((id) => {
         const color = colorOptions.value.find(option => option.id === id);
         if (color) filters.push({ title: color.title, type: 'color', value: color.id });
      });
   }

   // Цена
   if (filtersStore.priceRange?.min !== null || filtersStore.priceRange?.max !== null) {
      const min = filtersStore.priceRange.min ?? 'от';
      const max = filtersStore.priceRange.max ?? 'до';
      filters.push({ title: `Цена: ${min} — ${max} ₽`, type: 'priceRange' });
   }

   // Пробег
   if (filtersStore.mileageRange?.min !== null || filtersStore.mileageRange?.max !== null) {
      const min = filtersStore.mileageRange.min ?? 'от';
      const max = filtersStore.mileageRange.max ?? 'до';
      filters.push({ title: `Пробег: ${min} — ${max} км`, type: 'mileageRange' });
   }

   // Объем двигателя
   if (filtersStore.engineVolumeRange?.min !== null || filtersStore.engineVolumeRange?.max !== null) {
      const min = filtersStore.engineVolumeRange.min ?? 'от';
      const max = filtersStore.engineVolumeRange.max ?? 'до';
      filters.push({ title: `Объем двигателя: ${min} — ${max} л.`, type: 'engineVolumeRange' });
   }

   // Мощность
   if (filtersStore.powerRange?.min !== null || filtersStore.powerRange?.max !== null) {
      const min = filtersStore.powerRange.min ?? 'от';
      const max = filtersStore.powerRange.max ?? 'до';
      filters.push({ title: `Мощность: ${min} — ${max} лш.`, type: 'powerRange' });
   }

   // Привод
   if (Array.isArray(filtersStore.selectedDrives) && filtersStore.selectedDrives.length > 0) {
      filtersStore.selectedDrives.forEach((id) => {
         const drive = checkboxDriveOptions.value.find(option => option.id === id);
         if (drive) filters.push({ title: drive.title, type: 'drive', value: drive.id });
      });
   }

   return filters;
});

const capitalizeTitle = (text) => {
   if (!text) return '';
   return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFilter = (filter) => {
   switch (filter.type) {
      case 'mark':
         // Удаление марки
         handleMarksUpdate(filtersStore.selectedMark.filter(id => id !== filter.value));
         marksComponentKey.value += 1;
         break;
      case 'model':
         // Удаление модели
         handleFilterUpdate('selectedModel', filtersStore.selectedModel.filter(id => id !== filter.value));
         break;
      case 'bodyType':
         // Удаление типа кузова
         handleFilterUpdate('selectedBodyTypes', filtersStore.selectedBodyTypes.filter(id => id !== filter.value));
         break;
      case 'transmission':
         // Удаление коробки передач
         handleFilterUpdate('selectedTransmission', filtersStore.selectedTransmission.filter(id => id !== filter.value));
         break;
      case 'color':
         // Удаление цвета
         handleFilterUpdate('selectedColor', filtersStore.selectedColor.filter(id => id !== filter.value));
         break;
      case 'priceRange':
         // Сброс диапазона цен
         handleFilterUpdate('priceRange', { min: null, max: null });
         break;
      case 'mileageRange':
         // Сброс диапазона пробега
         handleFilterUpdate('mileageRange', { min: null, max: null });
         break;
      case 'engineVolumeRange':
         // Сброс диапазона объема двигателя
         handleFilterUpdate('engineVolumeRange', { min: null, max: null });
         break;
      case 'powerRange':
         // Сброс диапазона мощности
         handleFilterUpdate('powerRange', { min: null, max: null });
         break;
      case 'drive':
         // Удаление привода
         handleFilterUpdate('selectedDrives', filtersStore.selectedDrives.filter(id => id !== filter.value));
         break;
      case 'condition':
         // Удаление категории (новые/с пробегом)
         handleFilterUpdate('selectedCondition', null);
         break;
      case 'state':
         // Удаление состояния (битый/не битый)
         handleFilterUpdate('selectedState', null);
         break;
      case 'engineType':
         handleFilterUpdate('selectedEngineTypes', filtersStore.selectedEngineTypes.filter(id => id !== filter.value));
         break;
   }
};

const isAnyFilterSelected = computed(() => {
   return filtersStore.selectedState || filtersStore.selectedMark.length > 0 ||
      filtersStore.selectedModel.length > 0 ||
      filtersStore.selectedBodyTypes.length > 0 ||
      filtersStore.selectedEngineTypes.length > 0 ||
      filtersStore.selectedTransmission.length > 0 ||
      filtersStore.selectedDrives.length > 0 ||
      filtersStore.selectedColor.length > 0 ||
      (filtersStore.priceRange.min !== null && filtersStore.priceRange.max !== null) ||
      (filtersStore.mileageRange.min !== null && filtersStore.mileageRange.max !== null) ||
      (filtersStore.engineVolumeRange.min !== null && filtersStore.engineVolumeRange.max !== null) ||
      (filtersStore.powerRange.min !== null && filtersStore.powerRange.max !== null) ||
      (filtersStore.yearRange.min !== null && filtersStore.yearRange.max !== null);
});

const handleFilterUpdate = (field, value) => {
   if (field === 'selectedCondition') {
      filtersStore.setFilter('selectedCondition', value);
      filtersStore.setFilter('mileageRange', { min: null, max: null });
      filtersStore.setFilter('selectedState', null);
      emit('updateSort');
   } else {
      filtersStore.setFilter(field, value);
      if (field !== 'selectedColor') { resetButtonVisibility() };
   }
};

const handleMarksUpdate = (selectedOptions) => {
   marksComponentKey.value += 1;
   if (selectedMark.value !== selectedOptions) {
      selectedMark.value = selectedOptions;
      handleFilterUpdate('selectedMark', selectedOptions);

      if (selectedOptions.length === 1) {
         fetchModelsDropdownOptions(selectedOptions[0]);
         selectedModel.value = [];
         handleFilterUpdate('selectedModel', []);
      } else {
         dropdownModelsOptions.value = [];
         selectedModel.value = [];
         handleFilterUpdate('selectedModel', []);
      }
   }
};

const handleModelsUpdate = (selectedOptions) => {
   if (selectedModel.value !== selectedOptions) {
      selectedModel.value = selectedOptions;
      handleFilterUpdate('selectedModel', selectedOptions);
   }
};

const resetFilters = () => {
   filtersStore.resetFilters();
   filtersComponentKey.value += 1;
   marksComponentKey.value += 1;
   emit('updateSort');
};

watch(isModelsDropdownDisabled, (newVal) => {
   if (newVal) {
      selectedModel.value = [];
      dropdownModelsOptions.value = [];
      handleFilterUpdate('selectedModel', []);
   }
});

const resetButtonVisibility = () => {
   isButtonClicked.value = false;
};

onMounted(() => {
   fetchOptions();
   document.addEventListener('click', handleClickOutside);
   window.addEventListener('scroll', handleScroll);

   if (window.innerWidth <= 1250) {
      isMobile.value = true;
   }

   window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 1250;
   });

   if (filtersStore.selectedMark.length === 1) {
      fetchModelsDropdownOptions(filtersStore.selectedMark[0]);
      selectedModel.value = [];
   }
});

onUnmounted(() => {
   window.removeEventListener('resize', () => { });
   document.removeEventListener('click', handleClickOutside);
   window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.filters {
   display: flex;
   gap: 24px;
   max-width: 260px;
   flex-direction: column;
   margin-bottom: 40px;

   @media (max-width: 1250px) {
      max-width: 50%;
      margin: 0 auto;
      margin-bottom: 40px;
   }

   @media (max-width: 1250px) {
      max-width: 100%;
      margin: 0;

      .filters__toggle {
         display: flex;
         position: sticky;
         top: 66px;
         align-items: center;
         justify-content: space-between;
         gap: 24px;
         width: 100%;
         z-index: 4;
         cursor: pointer;
         font-size: 16px;
         background-color: #EEF9FF;
         box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
         color: #3366FF;
         padding: 24px;
         transition: width 0.3s ease, padding 0.3s ease, margin 0.3s ease;

         &--with-margin {
            padding: 12px 24px;
            width: 100vw;
            margin-left: -16px;
         }

         &-item {

            &:nth-child(2) {
               width: 100%;
            }
         }

         @media (max-width: 768px) {
            &-item {
               &:first-child {
                  width: 100%;
               }

               &:nth-child(2) {
                  width: 100%;
               }
            }
         }

         @media (max-width: 480px) {
            padding: 16px;
            gap: 16px;

            &-item {
               &:first-child {
                  width: 100%;
               }
            }
         }
      }

      .filters__settings {
         display: flex;
         font-size: 14px;
         gap: 10px;
         align-items: center;

         &--large {
            color: #003BCE;
            font-size: 20px;
            font-weight: 700;
            margin-right: auto;

            @media (max-width: 600px) {
               font-size: 18px;
            }
         }

         span {
            font-size: 14px;
            white-space: nowrap;

            @media (max-width: 600px) {
               display: none;
            }
         }

         img {
            height: 16px;
            width: 16px;
         }
      }
   }

   &__title {
      font-size: 20px;
      width: 100%;
      font-weight: 700;
      color: #323232;

      @media screen and (max-width: 1250px) {
         display: none;
      }
   }

   &__block {
      display: flex;
      gap: 24px;
      flex-direction: column;
      margin-bottom: 40px;

      @media (max-width: 1250px) {
         padding: 0 120px;
      }

      @media (max-width: 768px) {
         padding: 0 46px;
      }

      @media (max-width: 480px) {
         padding: 0 16px;
      }
   }

   &__overlay {
      position: fixed;
      width: 100%;
      max-width: 100vw;
      height: 70px;
      z-index: 15;
      bottom: 0;
      left: 0;
      background-color: #EEF9FF;

      @media (max-width: 768px) {
         bottom: 70px;
         background-color: rgba(#EEF9FF, 0.3);
         backdrop-filter: blur(8px);
         border-radius: 24px 24px 0 0;
      }
   }

   &__seacrh {
      padding: 16px 16px 24px;
      max-width: 1312px;
      height: 70px;
      margin: 0 auto;

      @media (max-width: 768px) {
         padding: 16px 46px;
      }
   }

   &__button {
      display: flex;
      align-items: center;
      max-width: 260px;
      justify-content: center;
      border-radius: 6px;
      background-color: #3366FF;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      height: 34px;
      padding: 8px 24px;
      transition: $transition-1;

      @media (max-width: 600px) {
         width: 100%;
         height: 36px;
         max-width: 100%;
         box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      &:hover {
         background-color: #2e60f5;
      }
   }
}

.filters__selected-tags {
   display: flex;
   flex-wrap: wrap;
   gap: 10px;
}

.filters__tag {
   background-color: #D6EFFF;
   border-radius: 6px;
   font-size: 14px;
   line-height: 18px;
   color: #3366FF;
   padding: 6px 10px;
   display: flex;
   align-items: center;
   cursor: pointer;
}

.filters__tag span {
   margin-left: 8px;
   font-size: 14px;
   color: #3366FF;
   cursor: pointer;
}
</style>
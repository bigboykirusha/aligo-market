<template>
   <div class="filters">
      <div v-if="isMobile" class="filters__toggle"
         :class="{ 'filters__toggle--with-margin': !isWithMargin && showFilters }" ref="filtersRef">
         <div v-show="!isSecondClicked && !showFilters" class="filters__toggle-item" @click="toggleFirst">
            <SelectSkeleton v-if="loading" />
            <SelectOptionsTemplate v-else :options="switcherConditionOptions" @updateSort="handleConditionUpdate"
               :initialSelectedOption="selectedCondition" placeholder="Все" />
         </div>
         <div v-show="!isFirstClicked && !showFilters" class="filters__toggle-item" @click="toggleSecond">
            <SelectSkeleton v-if="loading" />
            <AutosSelectTemplate v-else :options="dropdownMarksOptions" @updateSort="handleMarksUpdate"
               :initialSelectedOptions="selectedMarkI" placeholder="Марка" :key="marksComponentKey" />
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
         <AutosSwitcherTemplate v-else :options="switcherConditionOptions" label="Категория"
            @updateSelected="handleConditionUpdate" :activeIndex="selectedCondition" />

         <SwitcherSkeleton v-if="loading" />
         <AutosSwitcherTemplate v-else-if="selectedCondition !== 1" :options="switcherStateOptions" label="Состояние"
            @updateSelected="handleStateUpdate" :activeIndex="selectedState" :dis="selectedCondition === 1" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownMarksOptions" label="Марка" @updateSort="handleMarksUpdate"
            :initialSelectedOptions="selectedMarkI" placeholder="Нажмите для выбора" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownModelsOptions" label="Модель"
            :disabled="isModelsDropdownDisabled" @updateSort="handleModelsUpdate"
            :initialSelectedOptions="selectedModelI" placeholder="Нажмите для выбора" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Цена" @updateRange="handlePriceRangeUpdate"
            :initialMinValue="priceRange.min" :initialMaxValue="priceRange.max" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxBodyTypeOptions" label="Тип кузова"
            @updateSelected="handleBodyTypeUpdate" :activeIndexes="selectedBodyTypes" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownTransmissionOptions" label="Коробка передач"
            @updateSort="handleTransmissionUpdate" :initialSelectedOptions="selectedTransmission"
            placeholder="Нажмите для выбора" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxEngineTypeOptions" label="Тип двигателя"
            @updateSelected="handleEngineTypeUpdate" :activeIndexes="selectedEngineTypes" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else-if="selectedCondition !== 1" label="Пробег, км"
            @updateRange="handleMileageRangeUpdate" :dis="selectedCondition === 1" :initialMinValue="mileageRange.min"
            :initialMaxValue="mileageRange.max" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Объём двигателя, л" @updateRange="handleEngineVolumeRangeUpdate"
            :initialMinValue="engineVolumeRange.min" :initialMaxValue="engineVolumeRange.max" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxDriveOptions" label="Привод"
            @updateSelected="handleDriveUpdate" :activeIndexes="selectedDrives" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Мощность, л.с." @updateRange="handlePowerRangeUpdate"
            :initialMinValue="powerRange.min" :initialMaxValue="powerRange.max" />

         <ColorPickerSkeleton v-if="loading" />
         <ColorPickerTemplate v-else :options="colorOptions" label="Цвет" @updateSelected="handleColorUpdate"
            :activeIndexes="selectedColor" />
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

const searchCars = () => {
   fetchCars();
   showFilters.value = false;
};


const fetchCars = () => {
   console.log(selectedFilters.value, 'выбранные фильтры')
   isButtonClicked.value = true;
   emit('updateSort');
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

const isButtonClicked = ref(false);

const isFirstClicked = ref(false);
const isSecondClicked = ref(false);
const filtersRef = ref(null);

const marksComponentKey = ref(0);
const filtersComponentKey = ref(0);

const selectedCondition = computed(() => filtersStore.selectedCondition);
const selectedMarkI = computed(() => filtersStore.selectedMark);
const selectedModelI = computed(() => filtersStore.selectedModel);
const priceRange = computed(() => filtersStore.priceRange);
const selectedBodyTypes = computed(() => filtersStore.selectedBodyTypes);
const selectedTransmission = computed(() => filtersStore.selectedTransmission);
const selectedEngineTypes = computed(() => filtersStore.selectedEngineTypes);
const mileageRange = computed(() => filtersStore.mileageRange);
const engineVolumeRange = computed(() => filtersStore.engineVolumeRange);
const selectedDrives = computed(() => filtersStore.selectedDrives);
const selectedColor = computed(() => filtersStore.selectedColor);
const selectedState = computed(() => filtersStore.selectedState);
const powerRange = computed(() => filtersStore.powerRange);

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


if (route.path.includes('autos/new')) {
   filtersStore.setSelectedCondition(1);
} else if (route.path.includes('autos/mileage')) {
   filtersStore.setSelectedCondition(2);
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
      case 'mark': { filtersStore.setSelectedMark(filtersStore.selectedMark.filter(id => id !== filter.value)); marksComponentKey.value += 1; }
         // Удаление марки

         break;
      case 'model':
         // Удаление модели
         filtersStore.setSelectedModel(filtersStore.selectedModel.filter(id => id !== filter.value));
         break;
      case 'bodyType':
         // Удаление типа кузова
         filtersStore.setSelectedBodyTypes(filtersStore.selectedBodyTypes.filter(id => id !== filter.value));
         break;
      case 'transmission':
         // Удаление коробки передач
         filtersStore.setSelectedTransmission(filtersStore.selectedTransmission.filter(id => id !== filter.value));
         break;
      case 'color':
         // Удаление цвета
         filtersStore.setSelectedColor(filtersStore.selectedColor.filter(id => id !== filter.value));
         break;
      case 'priceRange':
         // Сброс диапазона цен
         filtersStore.setPriceRange({ min: null, max: null });
         break;
      case 'mileageRange':
         // Сброс диапазона пробега
         filtersStore.setMileageRange({ min: null, max: null });
         break;
      case 'engineVolumeRange':
         // Сброс диапазона объема двигателя
         filtersStore.setEngineVolumeRange({ min: null, max: null });
         break;
      case 'powerRange':
         // Сброс диапазона мощности
         filtersStore.setPowerRange({ min: null, max: null });
         break;
      case 'drive':
         // Удаление привода
         filtersStore.setSelectedDrives(filtersStore.selectedDrives.filter(id => id !== filter.value));
         break;
      case 'condition':
         // Удаление категории (новые/с пробегом)
         filtersStore.setSelectedCondition(null);
         break;
      case 'state':
         // Удаление состояния (битый/не битый)
         filtersStore.setSelectedState(null);
         break;
      case 'engineType':
         filtersStore.setSelectedEngineTypes(filtersStore.selectedEngineTypes.filter(id => id !== filter.value)); // Добавлено удаление типа двигателя
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
      (filtersStore.powerRange.min !== null && filtersStore.powerRange.max !== null);
});

const fetchMarksDropdownOptions = async () => {
   try {
      const cachedMarksOptions = JSON.parse(localStorage.getItem('MarksDropdownOptions'));
      if (cachedMarksOptions) {
         dropdownMarksOptions.value = cachedMarksOptions;
      } else {
         dropdownMarksOptions.value = await getCarBrands();
         localStorage.setItem('MarksDropdownOptions', JSON.stringify(dropdownMarksOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
   }
};

const fetchColorOptions = async () => {
   try {
      const cachedColorOptions = JSON.parse(localStorage.getItem('ColorOptions'));
      if (cachedColorOptions) {
         colorOptions.value = cachedColorOptions;
      } else {
         colorOptions.value = await getColors();
         localStorage.setItem('ColorOptions', JSON.stringify(colorOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении цветов автомобилей:', error);
   }
};

const fetchConditionOptions = async () => {
   try {
      const cachedConditionOptions = JSON.parse(localStorage.getItem('ConditionOptions'));
      if (cachedConditionOptions) {
         switcherConditionOptions.value = cachedConditionOptions;
      } else {
         switcherConditionOptions.value = await getCarCondition();
         localStorage.setItem('ConditionOptions', JSON.stringify(switcherConditionOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении условий автомобилей:', error);
   }
};

const fetchModelsDropdownOptions = async (id) => {
   try {
      dropdownModelsOptions.value = await getCarModels(id);
   } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
   }
};

const fetchTransmissionDropdownOptions = async () => {
   try {
      const cachedTransmissionOptions = JSON.parse(localStorage.getItem('TransmissionDropdownOptions'));
      if (cachedTransmissionOptions) {
         dropdownTransmissionOptions.value = cachedTransmissionOptions;
      } else {
         dropdownTransmissionOptions.value = await getCarTransmission();
         localStorage.setItem('TransmissionDropdownOptions', JSON.stringify(dropdownTransmissionOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении коробок передач:', error);
   }
};

const fetchBodyTypeOptions = async () => {
   try {
      const cachedBodyTypeOptions = JSON.parse(localStorage.getItem('BodyTypeOptions'));
      if (cachedBodyTypeOptions) {
         checkboxBodyTypeOptions.value = cachedBodyTypeOptions;
      } else {
         checkboxBodyTypeOptions.value = await getCarBodyType();
         localStorage.setItem('BodyTypeOptions', JSON.stringify(checkboxBodyTypeOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов кузова:', error);
   }
};

const fetchEngineTypeOptions = async () => {
   try {
      const cachedEngineTypeOptions = JSON.parse(localStorage.getItem('EngineTypeOptions'));
      if (cachedEngineTypeOptions) {
         checkboxEngineTypeOptions.value = cachedEngineTypeOptions;
      } else {
         checkboxEngineTypeOptions.value = await getCarEngineType();
         localStorage.setItem('EngineTypeOptions', JSON.stringify(checkboxEngineTypeOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов двигателя:', error);
   }
};

const fetchDriveOptions = async () => {
   try {
      const cachedDriveOptions = JSON.parse(localStorage.getItem('DriveOptions'));
      if (cachedDriveOptions) {
         checkboxDriveOptions.value = cachedDriveOptions;
      } else {
         checkboxDriveOptions.value = await getCarDrive();
         localStorage.setItem('DriveOptions', JSON.stringify(checkboxDriveOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов привода:', error);
   }
};

const fetchStateOptions = async () => {
   try {
      const cachedStateOptions = JSON.parse(localStorage.getItem('StateOptions'));
      if (cachedStateOptions) {
         switcherStateOptions.value = cachedStateOptions;
      } else {
         switcherStateOptions.value = await getCarState();
         localStorage.setItem('StateOptions', JSON.stringify(switcherStateOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении состояния автомобилей:', error);
   }
};

const handleMarksUpdate = (selectedOptions) => {
   marksComponentKey.value += 1;
   if (selectedMark.value !== selectedOptions) {
      selectedMark.value = selectedOptions;
      filtersStore.setSelectedMark(selectedOptions);

      if (selectedOptions.length === 1) {
         fetchModelsDropdownOptions(selectedOptions[0]);
         selectedModel.value = [];
         filtersStore.setSelectedModel([]);
      } else {
         dropdownModelsOptions.value = [];
         selectedModel.value = [];
         filtersStore.setSelectedModel([]);
      }
   }
};

const handleModelsUpdate = (selectedOptions) => {
   if (selectedModel.value !== selectedOptions) {
      selectedModel.value = selectedOptions;
      filtersStore.setSelectedModel(selectedOptions);
   }
};

const resetFilters = () => {
   filtersStore.resetFilters();
   filtersComponentKey.value += 1;
   marksComponentKey.value += 1;
   fetchCars();
};

const handlePriceRangeUpdate = (range) => filtersStore.setPriceRange(range);
const handleMileageRangeUpdate = (range) => filtersStore.setMileageRange(range);
const handleEngineVolumeRangeUpdate = (range) => filtersStore.setEngineVolumeRange(range);
const handlePowerRangeUpdate = (range) => filtersStore.setPowerRange(range);
const handleBodyTypeUpdate = (selectedOptions) => filtersStore.setSelectedBodyTypes(selectedOptions);
const handleTransmissionUpdate = (selectedOptions) => filtersStore.setSelectedTransmission(selectedOptions);
const handleEngineTypeUpdate = (selectedOptions) => filtersStore.setSelectedEngineTypes(selectedOptions);
const handleDriveUpdate = (selectedOptions) => filtersStore.setSelectedDrives(selectedOptions);
const handleStateUpdate = (selectedOptions) => filtersStore.setSelectedState(selectedOptions);
const handleColorUpdate = (selectedOptions) => filtersStore.setSelectedColor(selectedOptions);
const handleConditionUpdate = (selectedOptions) => {
   filtersStore.setSelectedCondition(selectedOptions);
   filtersStore.setMileageRange({ min: null, max: null });
   filtersStore.setSelectedState(null);
   fetchCars();
};


watch(isModelsDropdownDisabled, (newVal) => {
   if (newVal) {
      selectedModel.value = [];
      dropdownModelsOptions.value = [];
      filtersStore.setSelectedModel([]);
   }
});

const resetButtonVisibility = () => {
   isButtonClicked.value = false;
};

watch(() => filtersStore.selectedState, resetButtonVisibility);
watch(() => filtersStore.selectedMark, resetButtonVisibility, { deep: true });
watch(() => filtersStore.selectedModel, resetButtonVisibility, { deep: true });
watch(() => filtersStore.selectedBodyTypes, resetButtonVisibility, { deep: true });
watch(() => filtersStore.selectedEngineTypes, resetButtonVisibility, { deep: true });
watch(() => filtersStore.selectedTransmission, resetButtonVisibility, { deep: true });
watch(() => filtersStore.selectedDrives, resetButtonVisibility, { deep: true });
watch(() => filtersStore.selectedColor, resetButtonVisibility, { deep: true });
watch(() => filtersStore.priceRange, resetButtonVisibility, { deep: true });
watch(() => filtersStore.mileageRange, resetButtonVisibility, { deep: true });
watch(() => filtersStore.engineVolumeRange, resetButtonVisibility, { deep: true });
watch(() => filtersStore.powerRange, resetButtonVisibility, { deep: true });

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

watch(isAnyFilterSelected, () => {
   if (isAnyFilterSelected.value && !isButtonClicked.value) {
      isButtonClicked.value = false;
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

   @media screen and (max-width: 1250px) {
      max-width: 50%;
      margin: 0 auto;
      margin-bottom: 40px;
   }

   @media screen and (max-width: 1250px) {
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

         @media screen and (max-width: 768px) {
            &-item {
               &:first-child {
                  width: 100%;
               }

               &:nth-child(2) {
                  width: 100%;
               }
            }
         }

         @media screen and (max-width: 480px) {
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
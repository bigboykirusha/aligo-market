<template>
   <div class="filters">
      <div v-if="isMobile" class="filters__toggle">
         <div v-if="!showFilters" class="filters__toggle-item">
            <SelectSkeleton v-if="loading" />
            <SelectOptionsTemplate v-else :options="switcherStateOptions" @updateSort="handleStateUpdate"
               :initialSelectedOptions="filtersStore.selectedState" placeholder="Состояние" />
         </div>
         <div v-if="!showFilters" class="filters__toggle-item">
            <SelectSkeleton v-if="loading" />
            <AutosSelectTemplate v-else :options="dropdownMarksOptions" @updateSort="handleMarksUpdate"
               :initialSelectedOptions="filtersStore.selectedMark" placeholder="Марка" />
         </div>
         <div v-if="showFilters" class="filters__settings--large">Настройки поиска</div>
         <div @click="resetFilters" v-if="showFilters" class="filters__settings">Очистить</div>
         <div @click="toggleFiltersVisibility" class="filters__settings">
            <img src="../assets/icons/settings.svg" />
            <span v-if="!showFilters">Настройки поиска</span>
            <span v-else>Скрыть</span>
         </div>
      </div>
      <div v-if="showFilters || !isMobile" class="filters__block">
         <div class="filters__title">Поиск автомобиля</div>
         <SwitcherSkeleton v-if="loading" />
         <AutosSwitcherTemplate v-else :options="switcherConditionOptions" label="Новизна"
            @updateSelected="handleConditionUpdate" :activeIndex="filtersStore.selectedCondition" />

         <SwitcherSkeleton v-if="loading" />
         <AutosSwitcherTemplate v-else-if="filtersStore.selectedCondition !== 1" :options="switcherStateOptions"
            label="Состояние" @updateSelected="handleStateUpdate" :activeIndex="filtersStore.selectedState"
            :dis="filtersStore.selectedCondition === 1" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownMarksOptions" label="Марка" @updateSort="handleMarksUpdate"
            :initialSelectedOptions="filtersStore.selectedMark" placeholder="Нажмите для выбора" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownModelsOptions" label="Модель"
            :disabled="isModelsDropdownDisabled" @updateSort="handleModelsUpdate"
            :initialSelectedOptions="filtersStore.selectedModel" placeholder="Нажмите для выбора" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Цена" @updateRange="handlePriceRangeUpdate"
            :initialMinValue="filtersStore.priceRange.min" :initialMaxValue="filtersStore.priceRange.max" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxBodyTypeOptions" label="Тип кузова"
            @updateSelected="handleBodyTypeUpdate" :activeIndexes="filtersStore.selectedBodyTypes" />

         <SelectSkeleton v-if="loading" />
         <AutosSelectTemplate v-else :options="dropdownTransmissionOptions" label="Коробка передач"
            @updateSort="handleTransmissionUpdate" :initialSelectedOptions="filtersStore.selectedTransmission"
            placeholder="Нажмите для выбора" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxEngineTypeOptions" label="Тип двигателя"
            @updateSelected="handleEngineTypeUpdate" :activeIndexes="filtersStore.selectedEngineTypes" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else-if="filtersStore.selectedCondition !== 1" label="Пробег, км"
            @updateRange="handleMileageRangeUpdate" :dis="filtersStore.selectedCondition === 1"
            :initialMinValue="filtersStore.mileageRange.min" :initialMaxValue="filtersStore.mileageRange.max" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Объём двигателя, л" @updateRange="handleEngineVolumeRangeUpdate"
            :initialMinValue="filtersStore.engineVolumeRange.min"
            :initialMaxValue="filtersStore.engineVolumeRange.max" />

         <CheckboxSkeleton v-if="loading" />
         <AutosCheckboxTemplate v-else :options="checkboxDriveOptions" label="Привод"
            @updateSelected="handleDriveUpdate" :activeIndexes="filtersStore.selectedDrives" />

         <FromToSkeleton v-if="loading" />
         <AutosFromToTemplate v-else label="Мощность, л.с." @updateRange="handlePowerRangeUpdate" />

         <ColorPickerSkeleton v-if="loading" />
         <ColorPickerTemplate v-else :options="colorOptions" label="Цвет" @updateSelected="handleColorUpdate"
            :activeIndexes="filtersStore.selectedColor" />
      </div>
   </div>
   <div v-show="isAnyFilterSelected" class="filters__overlay">
      <div class="filters__seacrh">
         <div @click="fetchCars" class="filters__button">Показать результаты</div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useFiltersStore } from '../store/filters';
import { useRoute } from 'vue-router';
import { getCarBrands, getCarModels, getCarTransmission, getCarBodyType, getCarEngineType, getCarDrive, getCarState, getColors, getCarCondition } from '../services/apiClient';

const fetchCars = () => {
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

const isAnyFilterSelected = computed(() => {
   return filtersStore.selectedState || filtersStore.selectedMark.length > 0 ||
      filtersStore.selectedModel.length > 0 ||
      filtersStore.selectedCondition !== null ||
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
};


watch(isModelsDropdownDisabled, (newVal) => {
   if (newVal) {
      selectedModel.value = [];
      dropdownModelsOptions.value = [];
      filtersStore.setSelectedModel([]);
   }
});

onMounted(() => {
   fetchOptions();

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
         align-items: center;
         justify-content: space-between;
         gap: 24px;
         width: 100%;
         cursor: pointer;
         font-size: 16px;
         background-color: #EEF9FF;
         box-shadow: 1px 1px 6px 0px #00000024;
         color: #3366FF;
         padding: 24px;

         &-item {
            &:nth-child(2) {
               width: 100%;
            }
         }

         @media screen and (max-width: 768px) {
            &-item {
               &:first-child {
                  width: 100%;
                  max-width: 140px;
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
                  max-width: 114px;
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

            @media screen and (max-width: 600px) {
               font-size: 18px;
            }
         }

         span {
            font-size: 14px;
            white-space: nowrap;

            @media screen and (max-width: 600px) {
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
   }

   &__overlay {
      position: fixed;
      width: 100%;
      height: 70px;
      z-index: 15;
      bottom: 0;
      left: 0;
      background-color: #EEF9FF;
   }

   &__seacrh {
      padding: 16px 16px 24px;
      max-width: 1312px;
      margin: 0 auto;
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

      @media screen and (max-width: 600px) {
         width: 100%;
         max-width: 100%;
      }

      &:hover {
         background-color: #2e60f5;
      }
   }
}
</style>
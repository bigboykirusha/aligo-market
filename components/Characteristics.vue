<template>
   <div class="characteristics">
      <div class="characteristics__content">
         <BlockTitle text="Категория" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="conditionIdOptions" label="Категория"
            @updateSelected="handleConditionIdUpdate" :activeIndex="createStore.condition_id" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="Внешний вид" />
         <PhotoUploader label="Фотографии (до 10 шт)*" :photos="createStore.photos" @updatePhotos="updatePhotos" />
         <ColorPickerCreateSkeleton v-if="loading" />
         <ColorPickerCreate v-else :options="colorOptions" label="Цвет" @updateSelected="handleColorUpdate"
            :activeIndex="createStore.color_id" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="Видео с youtube" placeholder="Cсылка на видео" :option="createStore.video"
            validationType="url" @update:option="handleVideoUpdate" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="Регистрационные данные" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Страна регистрации*" :initialSelectedOption="createStore.country_id"
            :options="countryOptions" @updateSort="handleCountryUpdate" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="VIN или номер кузова*" placeholder="Нажмите для ввода"
            :option="createStore.vin" @update:option="handleVinUpdate" validationType="vin" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="Государтсвенный номер" placeholder="Нажмите для ввода"
            :option="createStore.state_number" @update:option="handleStateNumberUpdate" v-if="showStateNumber"
            validationType="licensePlate" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="Технические характеристики*" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Марка" :initialSelectedOption="createStore.brand_id"
            :options="dropdownMarksOptions" @updateSort="handleMarksUpdate" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Модель" :initialSelectedOption="createStore.model_id"
            :options="dropdownModelsOptions" @updateSort="handleModelsUpdate" :disabled="isModelsDropdownDisabled" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Год выпуска" :initialSelectedOption="createStore.year_id"
            :options="yearOptions" @updateSort="handleYearUpdate" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Тип кузова" :initialSelectedOption="createStore.car_body_type"
            :options="checkboxBodyTypeOptions" @updateSort="handleBodyTypeUpdate" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="handlebarIdOptions" label="Руль"
            @updateSelected="handleHandlebarIdUpdate" :activeIndex="createStore.handlebar_id" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="Количество дверей" placeholder="Нажмите для ввода"
            :option="createStore.count_doors" @update:option="handleCountDoorsUpdate" validationType="doors"
            :isEmpty="checkIfEmpty(createStore.count_doors)" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="checkboxEngineTypeOptions" label="Тип двигателя"
            @updateSelected="handleEngineTypeUpdate" :activeIndex="createStore.engine_type_id" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="checkboxDriveOptions" label="Привод" @updateSelected="handleDriveUpdate"
            :activeIndex="createStore.drive_id" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="dropdownTransmissionOptions" label="Коробка передач"
            @updateSelected="handleTransmissionUpdate" :activeIndex="createStore.transmission_id" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="История эксплуатации и состояние" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="Пробег, км" placeholder="Нажмите для ввода" :option="createStore.mileage"
            @update:option="handleMileageUpdate" v-if="showMileage" validationType="number"
            :isEmpty="checkIfEmpty(createStore.mileage)" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="switcherStateOptions" label="Состояние*"
            @updateSelected="handleStateUpdate" :activeIndex="createStore.state_id" v-if="showState" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="ownersOptions" label="Владельцев" @updateSelected="handleOwnersUpdate"
            :activeIndex="createStore.owners" v-if="showOwners" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="ПТС*" :initialSelectedOption="createStore.pts" :options="PtsOptions"
            @updateSort="handlePtsUpdate" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Данные о ТО</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Есть сервисная книжка" :checked="createStore.is_service_book"
                  @updateChecked="handleServiceBookUpdate" />
               <SimpleCheckboxTemplate label="Обслуживался у диллера" :checked="createStore.is_serviced_dealer"
                  @updateChecked="handleServicedDealerUpdate" />
               <SimpleCheckboxTemplate label="На гарантии" :checked="createStore.is_under_warranty"
                  @updateChecked="handleUnderWarrantyUpdate" />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCreateStore } from '../store/create';
import { getCarsPts, getCarBrands, getCarModels, getCarTransmission, getCarBodyType, getCarEngineType, getCarDrive, getCarState, getColors, getCarCountry, getYear, getCarsOwners, getCarsHandlebar, getCarCondition } from '../services/apiClient';

const loading = ref(true);
const createStore = useCreateStore();
const dropdownMarksOptions = ref([]);
const dropdownModelsOptions = ref([]);
const dropdownTransmissionOptions = ref([]);
const checkboxBodyTypeOptions = ref([]);
const checkboxEngineTypeOptions = ref([]);
const checkboxDriveOptions = ref([]);
const switcherStateOptions = ref([]);
const conditionIdOptions = ref([]);
const colorOptions = ref([]);
const countryOptions = ref([]);
const ownersOptions = ref([]);
const selectedModel = ref([]);
const yearOptions = ref([])
const handlebarIdOptions = ref([]);
const PtsOptions = ref([]);
const isModelsDropdownDisabled = computed(() => !(createStore.brand_id));
const isMobile = ref(false);

const showStateNumber = computed(() => createStore.condition_id !== 1);
const showMileage = computed(() => createStore.condition_id !== 1);
const showState = computed(() => createStore.condition_id !== 1);
const showOwners = computed(() => createStore.condition_id !== 1);

const checkIfEmpty = (item) => {
   if (createStore.id && !item) {
      return true;
   }
   return false;
};

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
         fetchCountryOptions(),
         fetchYearOptions(),
         fetchOwnersOptions(),
         fetchHandlebarOptions(),
         fetchPtsOptions(),
         fetchConditionOptions(),
      ]);
      loading.value = false;
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const fetchMarksDropdownOptions = async () => {
   try {
      const cachedMarksOptions = JSON.parse(localStorage.getItem('dropdownMarksOptions'));
      if (cachedMarksOptions) {
         dropdownMarksOptions.value = cachedMarksOptions;
      } else {
         dropdownMarksOptions.value = await getCarBrands();
         localStorage.setItem('dropdownMarksOptions', JSON.stringify(dropdownMarksOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
   }
};

const fetchPtsOptions = async () => {
   try {
      const cachedPtsOptions = JSON.parse(localStorage.getItem('PtsOptions'));
      if (cachedPtsOptions) {
         PtsOptions.value = cachedPtsOptions;
      } else {
         PtsOptions.value = await getCarsPts();
         localStorage.setItem('PtsOptions', JSON.stringify(PtsOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении ПТС:', error);
   }
};

const fetchHandlebarOptions = async () => {
   try {
      const cachedHandlebarOptions = JSON.parse(localStorage.getItem('handlebarIdOptions'));
      if (cachedHandlebarOptions) {
         handlebarIdOptions.value = cachedHandlebarOptions;
      } else {
         handlebarIdOptions.value = await getCarsHandlebar();
         localStorage.setItem('handlebarIdOptions', JSON.stringify(handlebarIdOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов руля:', error);
   }
};

const fetchConditionOptions = async () => {
   try {
      const cachedConditionOptions = JSON.parse(localStorage.getItem('conditionOptions'));
      if (cachedConditionOptions) {
         conditionIdOptions.value = cachedConditionOptions;
      } else {
         conditionIdOptions.value = await getCarCondition();
         localStorage.setItem('conditionOptions', JSON.stringify(conditionIdOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении цветов:', error);
   }
};

const fetchColorOptions = async () => {
   try {
      const cachedColorOptions = JSON.parse(localStorage.getItem('colorOptions'));
      if (cachedColorOptions) {
         colorOptions.value = cachedColorOptions;
      } else {
         colorOptions.value = await getColors();
         localStorage.setItem('colorOptions', JSON.stringify(colorOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении цветов:', error);
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
      const cachedTransmissionOptions = JSON.parse(localStorage.getItem('dropdownTransmissionOptions'));
      if (cachedTransmissionOptions) {
         dropdownTransmissionOptions.value = cachedTransmissionOptions;
      } else {
         dropdownTransmissionOptions.value = await getCarTransmission();
         localStorage.setItem('dropdownTransmissionOptions', JSON.stringify(dropdownTransmissionOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении коробок передач:', error);
   }
};

const fetchBodyTypeOptions = async () => {
   try {
      const cachedBodyTypeOptions = JSON.parse(localStorage.getItem('checkboxBodyTypeOptions'));
      if (cachedBodyTypeOptions) {
         checkboxBodyTypeOptions.value = cachedBodyTypeOptions;
      } else {
         checkboxBodyTypeOptions.value = await getCarBodyType();
         localStorage.setItem('checkboxBodyTypeOptions', JSON.stringify(checkboxBodyTypeOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов кузова:', error);
   }
};

const fetchEngineTypeOptions = async () => {
   try {
      const cachedEngineTypeOptions = JSON.parse(localStorage.getItem('checkboxEngineTypeOptions'));
      if (cachedEngineTypeOptions) {
         checkboxEngineTypeOptions.value = cachedEngineTypeOptions;
      } else {
         checkboxEngineTypeOptions.value = await getCarEngineType();
         localStorage.setItem('checkboxEngineTypeOptions', JSON.stringify(checkboxEngineTypeOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов двигателя:', error);
   }
};

const fetchOwnersOptions = async () => {
   try {
      const cachedOwnersOptions = JSON.parse(localStorage.getItem('ownersOptions'));
      if (cachedOwnersOptions) {
         ownersOptions.value = cachedOwnersOptions;
      } else {
         ownersOptions.value = await getCarsOwners();
         localStorage.setItem('ownersOptions', JSON.stringify(ownersOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении владельцев:', error);
   }
};

const fetchDriveOptions = async () => {
   try {
      const cachedDriveOptions = JSON.parse(localStorage.getItem('checkboxDriveOptions'));
      if (cachedDriveOptions) {
         checkboxDriveOptions.value = cachedDriveOptions;
      } else {
         checkboxDriveOptions.value = await getCarDrive();
         localStorage.setItem('checkboxDriveOptions', JSON.stringify(checkboxDriveOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов привода:', error);
   }
};

const fetchStateOptions = async () => {
   try {
      const cachedStateOptions = JSON.parse(localStorage.getItem('switcherStateOptions'));
      if (cachedStateOptions) {
         switcherStateOptions.value = cachedStateOptions;
      } else {
         switcherStateOptions.value = await getCarState();
         localStorage.setItem('switcherStateOptions', JSON.stringify(switcherStateOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении состояния автомобилей:', error);
   }
};

const fetchCountryOptions = async () => {
   try {
      const cachedCountryOptions = JSON.parse(localStorage.getItem('countryOptions'));
      if (cachedCountryOptions) {
         countryOptions.value = cachedCountryOptions;
      } else {
         countryOptions.value = await getCarCountry();
         localStorage.setItem('countryOptions', JSON.stringify(countryOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении стран:', error);
   }
};

const fetchYearOptions = async () => {
   try {
      const cachedYearOptions = JSON.parse(localStorage.getItem('yearOptions'));
      if (cachedYearOptions) {
         yearOptions.value = cachedYearOptions;
      } else {
         yearOptions.value = await getYear();
         localStorage.setItem('yearOptions', JSON.stringify(yearOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении годов выпуска:', error);
   }
};

const handleMarksUpdate = (selectedOptions) => {
   createStore.setBrandId(selectedOptions);
   fetchModelsDropdownOptions(selectedOptions);
   selectedModel.value = null;
   createStore.setModelId(null);
};

const handleModelsUpdate = (selectedOptions) => {
   createStore.setModelId(selectedOptions);
};

const handleBodyTypeUpdate = (selectedOptions) => createStore.setCarBodyType(selectedOptions);
const handleTransmissionUpdate = (selectedOptions) => createStore.setTransmissionId(selectedOptions);
const handleEngineTypeUpdate = (selectedOptions) => createStore.setEngineTypeId(selectedOptions);
const handleDriveUpdate = (selectedOptions) => createStore.setDriveId(selectedOptions);
const handleStateUpdate = (selectedOptions) => createStore.setStateId(selectedOptions);
const handleColorUpdate = (selectedOptions) => createStore.setColorId(selectedOptions);
const handleVideoUpdate = (selectedOptions) => createStore.setVideo(selectedOptions);
const handleVinUpdate = (selectedOptions) => createStore.setVin(selectedOptions);
const handleCountDoorsUpdate = (selectedOptions) => createStore.setCountDoors(selectedOptions);
const handleCountryUpdate = (selectedOptions) => createStore.setCountryId(selectedOptions);
const handleYearUpdate = (selectedOptions) => createStore.setYearId(selectedOptions);
const handleMileageUpdate = (selectedOptions) => createStore.setMileage(selectedOptions);
const handleOwnersUpdate = (selectedOptions) => createStore.setOwners(selectedOptions);
const handleStateNumberUpdate = (selectedOptions) => createStore.setStateNumber(selectedOptions);
const handleHandlebarIdUpdate = (selectedOptions) => createStore.setHandlebarId(selectedOptions);
const handlePtsUpdate = (selectedOptions) => createStore.setPts(selectedOptions);
const updatePhotos = (newPhotos) => createStore.setPhotos(newPhotos);
const handleServiceBookUpdate = (selectedOptions) => createStore.setIsServiceBook(selectedOptions);
const handleServicedDealerUpdate = (selectedOptions) => createStore.setIsServicedDealer(selectedOptions);
const handleUnderWarrantyUpdate = (selectedOptions) => createStore.setIsUnderWarranty(selectedOptions);
const handleConditionIdUpdate = (selectedOptions) => createStore.setConditionId(selectedOptions);


onMounted(() => {
   fetchOptions();

   if (window.innerWidth <= 1250) {
      isMobile.value = true;
   }

   window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 1250;
   });

   if (createStore.brand_id) {
      fetchModelsDropdownOptions(createStore.brand_id);
   }
});

const resetFields = () => {
   createStore.setStateNumber(null);
   createStore.setMileage(null);
   createStore.setOwners(null);
   createStore.setStateId(null);
};

watch(() => createStore.condition_id, (newConditionId, oldConditionId) => {
   if (newConditionId !== oldConditionId) {
      resetFields();
   }
});

onUnmounted(() => {
   window.removeEventListener('resize', () => { });
});
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: column;
   gap: 40px;

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }
}

.checkbox-section {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 5px;

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__items {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 24px;

      @media screen and (max-width: 768px) {
         gap: 8px;
      }
   }

   &__title {
      font-size: 14px;
      color: #323232;
      width: 270px;
   }
}
</style>
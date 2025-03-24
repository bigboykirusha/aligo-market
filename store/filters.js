import { defineStore } from 'pinia';
import { getCarsFiltered } from '../services/apiClient';

export const useFiltersStore = defineStore('filters', {
   state: () => ({
      selectedMark: [],
      currentSelectedMark: [],
      selectedCondition: null,
      currentSelectedCondition: null,
      selectedModel: [],
      currentSelectedModel: [],
      priceRange: { min: null, max: null },
      currentPriceRange: { min: null, max: null },
      mileageRange: { min: null, max: null },
      currentMileageRange: { min: null, max: null },
      yearRange: { min: null, max: null },
      currentYearRange: { min: null, max: null },
      engineVolumeRange: { min: null, max: null },
      currentEngineVolumeRange: { min: null, max: null },
      powerRange: { min: null, max: null },
      currentPowerRange: { min: null, max: null },
      selectedBodyTypes: [],
      currentSelectedBodyTypes: [],
      selectedTransmission: [],
      currentSelectedTransmission: [],
      selectedEngineTypes: [],
      currentSelectedEngineTypes: [],
      selectedDrives: [],
      currentSelectedDrives: [],
      selectedColor: [],
      currentSelectedColor: [],
      selectedState: null,
      currentSelectedState: null,
      orderBy: 'desc'
   }),
   getters: {
      conditionUrl(state) {
         if (state.selectedCondition === 1) {
            return 'auto/new';
         } else if (state.selectedCondition === 2) {
            return 'auto/used';
         }
         return 'auto';
      }
   },
   actions: {
      setFilter(field, value) {
         if (this[field] !== undefined) {
            this[field] = value;
         } else {
            console.warn(`Field ${field} does not exist in the state.`);
         }
      },
      copyFiltersToCurrent() {
         this.currentSelectedCondition = this.selectedCondition;
         this.currentSelectedMark = [...this.selectedMark];
         this.currentSelectedModel = [...this.selectedModel];
         this.currentPriceRange = { ...this.priceRange };
         this.currentMileageRange = { ...this.mileageRange };
         this.currentYearRange = { ...this.yearRange };
         this.currentEngineVolumeRange = { ...this.engineVolumeRange };
         this.currentPowerRange = { ...this.powerRange };
         this.currentSelectedBodyTypes = [...this.selectedBodyTypes];
         this.currentSelectedTransmission = [...this.selectedTransmission];
         this.currentSelectedEngineTypes = [...this.selectedEngineTypes];
         this.currentSelectedDrives = [...this.selectedDrives];
         this.currentSelectedColor = [...this.selectedColor];
         this.currentSelectedState = this.selectedState;
      },
      async fetchFilteredCars({ page = 1, count = 20 }) {
         const filters = {
            condition_id: [this.selectedCondition],
            brand_id: this.selectedMark,
            model_id: this.selectedModel,
            amount_from: this.priceRange.min,
            amount_to: this.priceRange.max,
            mileage_from: this.mileageRange.min,
            mileage_to: this.mileageRange.max,
            engine_volume_from: this.engineVolumeRange.min,
            engine_volume_to: this.engineVolumeRange.max,
            power_from: this.powerRange.min,
            power_to: this.powerRange.max,
            car_body_type_id: this.selectedBodyTypes,
            transmission_id: this.selectedTransmission,
            engine_type_id: this.selectedEngineTypes,
            drive_id: this.selectedDrives,
            color_id: this.selectedColor,
            state_id: this.selectedState,
            order_by: this.orderBy,
            year_from: this.yearRange.min,
            year_to: this.yearRange.max,
            page,
            count,
         };
         try {
            const filteredCars = await getCarsFiltered(filters);
            this.copyFiltersToCurrent();
            return filteredCars;
         } catch (error) {
            console.error('Ошибка при фильтрации автомобилей', error);
         }
      },
      async fetchFilteredCarsCurrent({ page = 1, count = 20 }) {
         const filters = {
            condition_id: [this.currentSelectedCondition],
            brand_id: this.currentSelectedMark,
            model_id: this.currentSelectedModel,
            amount_from: this.currentPriceRange.min,
            amount_to: this.currentPriceRange.max,
            mileage_from: this.currentMileageRange.min,
            mileage_to: this.currentMileageRange.max,
            engine_volume_from: this.currentEngineVolumeRange.min,
            engine_volume_to: this.currentEngineVolumeRange.max,
            power_from: this.currentPowerRange.min,
            power_to: this.currentPowerRange.max,
            car_body_type_id: this.currentSelectedBodyTypes,
            transmission_id: this.currentSelectedTransmission,
            engine_type_id: this.currentSelectedEngineTypes,
            drive_id: this.currentSelectedDrives,
            color_id: this.currentSelectedColor,
            state_id: this.currentSelectedState,
            year_from: this.currentYearRange.min,
            year_to: this.currentYearRange.max,
            order_by: this.orderBy,
            page,
            count,
         };
         try {
            const filteredCars = await getCarsFiltered(filters);
            return filteredCars;
         } catch (error) {
            console.error('Ошибка при фильтрации автомобилей', error);
         }
      },
      resetFilters() {
         this.selectedMark = [];
         this.selectedModel = [];
         this.priceRange = { min: null, max: null };
         this.mileageRange = { min: null, max: null };
         this.engineVolumeRange = { min: null, max: null };
         this.powerRange = { min: null, max: null };
         this.yearRange = { min: null, max: null };
         this.selectedBodyTypes = [];
         this.selectedTransmission = [];
         this.selectedEngineTypes = [];
         this.selectedDrives = [];
         this.selectedColor = [];
         this.selectedState = null;
         this.orderBy = 'desc';

         this.selectedMarkCurrent = [];
         this.selectedModelCurrent = [];
         this.priceRangeCurrent = { min: null, max: null };
         this.mileageRangeCurrent = { min: null, max: null };
         this.engineVolumeRangeCurrent = { min: null, max: null };
         this.powerRangeCurrent = { min: null, max: null };
         this.yearRangeCurrent = { min: null, max: null };
         this.selectedBodyTypesCurrent = [];
         this.selectedTransmissionCurrent = [];
         this.selectedEngineTypesCurrent = [];
         this.selectedDrivesCurrent = [];
         this.selectedColorCurrent = [];
         this.selectedStateCurrent = null;
      }
   },
});

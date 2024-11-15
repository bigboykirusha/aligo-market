import { defineStore } from 'pinia';
import { getCarsFiltered } from '../services/apiClient';

export const useFiltersStore = defineStore('filters', {
   state: () => ({
      selectedMark: [],
      selectedCondition: null,
      selectedModel: [],
      priceRange: { min: null, max: null },
      mileageRange: { min: null, max: null },
      engineVolumeRange: { min: null, max: null },
      powerRange: { min: null, max: null },
      selectedBodyTypes: [],
      selectedTransmission: [],
      selectedEngineTypes: [],
      selectedDrives: [],
      selectedColor: [],
      selectedState: null,
      orderBy: 'desc'
   }),
   actions: {
      setSelectedMark(mark) {
         this.selectedMark = mark;
      },
      setSelectedModel(model) {
         this.selectedModel = model;
      },
      setPriceRange(range) {
         this.priceRange = range;
      },
      setMileageRange(range) {
         this.mileageRange = range;
      },
      setEngineVolumeRange(range) {
         this.engineVolumeRange = range;
      },
      setPowerRange(range) {
         this.powerRange = range;
      },
      setSelectedBodyTypes(types) {
         this.selectedBodyTypes = types;
      },
      setSelectedTransmission(transmission) {
         this.selectedTransmission = transmission;
      },
      setSelectedEngineTypes(types) {
         this.selectedEngineTypes = types;
      },
      setSelectedDrives(drives) {
         this.selectedDrives = drives;
      },
      setSelectedState(state) {
         this.selectedState = state;
      },
      setSelectedColor(color) {
         this.selectedColor = color;
      },
      setSelectedCondition(condition) {
         this.selectedCondition = condition;
      },
      setOrderBy(order) {
         this.orderBy = order;
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
            page,
            count,
         };

         try {
            const filteredCars = await getCarsFiltered(filters);
            console.log(filteredCars);
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
         this.selectedBodyTypes = [];
         this.selectedTransmission = [];
         this.selectedEngineTypes = [];
         this.selectedDrives = [];
         this.selectedColor = [];
         this.selectedState = null;
         this.orderBy = 'desc';
      }
   },
});
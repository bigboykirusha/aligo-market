<template>
   <div class="container">
      <Breadcrumbs />
      <div class="section">
         <AutosFilters @updateSort="handleSearchUpdate" />
         <div class="wrap">
            <CardListWithBanner :title="cardListTitle" :adsMain="adsMain" :pageSize="count" :XTotalCount="8" :isLoading="isLoading"
               @updateSort="handleSortUpdate">
               <template #banner>
                  <AutosBanner />
               </template>
            </CardListWithBanner>
            <Pagination v-if="totalItems > getAdsCount()" :totalItems="totalItems" :pageSize="count"
               :currentPage="currentPage" @changePage="changePage" />
            <CardList v-show="adsMain.length == 0 && !isLoading" isFour :title="'Возможно, вам будет интересно'" :XTotalCount="0" :ads="ads"
               :isLoading="isLoading" />
         </div>
      </div>
   </div>
   <div class="wrap2">
      <CardList v-show="ads.length > 0" :title="'Свежие объявления'" :ads="ads" :XTotalCount="5" :isLoading="isLoading" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
   getCars,
   getCarBrands,
   getColors,
   getCarCondition,
   getCarTransmission,
   getCarBodyType,
   getCarEngineType,
   getCarDrive,
   getCarState
} from '~/services/apiClient';
import { useFiltersStore } from '~/store/filters';
import { useRouter, useRoute } from 'vue-router';
import { useCityStore } from '../store/city.js';

const filtersStore = useFiltersStore();
const cityStore = useCityStore();
const router = useRouter();
const route = useRoute();

const dropdownMarksOptions = ref([]);
const dropdownTransmissionOptions = ref([]);
const checkboxBodyTypeOptions = ref([]);
const checkboxEngineTypeOptions = ref([]);
const checkboxDriveOptions = ref([]);
const switcherStateOptions = ref([]);
const switcherConditionOptions = ref([]);
const colorOptions = ref([]);

const getAdsCount = () => {
   if (typeof window !== 'undefined') return window.innerWidth < 1000 ? 12 : 16;
   return 16;
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
         fetchConditionOptions(),
      ]);
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const fetchMarksDropdownOptions = async (translate_to = 'en') => {
   try {
      const cachedMarksOptions = JSON.parse(localStorage.getItem(`MarksDropdownOptions${translate_to}`));
      if (cachedMarksOptions) {
         dropdownMarksOptions.value = cachedMarksOptions;
      } else {
         dropdownMarksOptions.value = await getCarBrands(translate_to);
         localStorage.setItem(`MarksDropdownOptions${translate_to}`, JSON.stringify(dropdownMarksOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении брендов автомобилей:', error);
   }
};

const fetchColorOptions = async (translate_to = 'en') => {
   try {
      const cachedColorOptions = JSON.parse(localStorage.getItem(`ColorOptions${translate_to}`));
      if (cachedColorOptions) {
         colorOptions.value = cachedColorOptions;
      } else {
         colorOptions.value = await getColors(translate_to);
         localStorage.setItem(`ColorOptions${translate_to}`, JSON.stringify(colorOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении цветов автомобилей:', error);
   }
};

const fetchConditionOptions = async (translate_to = 'en') => {
   try {
      const cachedConditionOptions = JSON.parse(localStorage.getItem(`ConditionOptions${translate_to}`));
      if (cachedConditionOptions) {
         switcherConditionOptions.value = cachedConditionOptions;
      } else {
         switcherConditionOptions.value = await getCarCondition(translate_to);
         localStorage.setItem(`ConditionOptions${translate_to}`, JSON.stringify(switcherConditionOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении условий автомобилей:', error);
   }
};

const fetchTransmissionDropdownOptions = async (translate_to = 'en') => {
   try {
      const cachedTransmissionOptions = JSON.parse(localStorage.getItem(`TransmissionDropdownOptions${translate_to}`));
      if (cachedTransmissionOptions) {
         dropdownTransmissionOptions.value = cachedTransmissionOptions;
      } else {
         dropdownTransmissionOptions.value = await getCarTransmission(translate_to);
         localStorage.setItem(`TransmissionDropdownOptions${translate_to}`, JSON.stringify(dropdownTransmissionOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении коробок передач:', error);
   }
};

const fetchBodyTypeOptions = async (translate_to = 'en') => {
   try {
      const cachedBodyTypeOptions = JSON.parse(localStorage.getItem(`BodyTypeOptions${translate_to}`));
      if (cachedBodyTypeOptions) {
         checkboxBodyTypeOptions.value = cachedBodyTypeOptions;
      } else {
         checkboxBodyTypeOptions.value = await getCarBodyType(translate_to);
         localStorage.setItem(`BodyTypeOptions${translate_to}`, JSON.stringify(checkboxBodyTypeOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов кузова:', error);
   }
};

const fetchEngineTypeOptions = async (translate_to = 'en') => {
   try {
      const cachedEngineTypeOptions = JSON.parse(localStorage.getItem(`EngineTypeOptions${translate_to}`));
      if (cachedEngineTypeOptions) {
         checkboxEngineTypeOptions.value = cachedEngineTypeOptions;
      } else {
         checkboxEngineTypeOptions.value = await getCarEngineType(translate_to);
         localStorage.setItem(`EngineTypeOptions${translate_to}`, JSON.stringify(checkboxEngineTypeOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов двигателя:', error);
   }
};

const fetchDriveOptions = async (translate_to = 'en') => {
   try {
      const cachedDriveOptions = JSON.parse(localStorage.getItem(`DriveOptions${translate_to}`));
      if (cachedDriveOptions) {
         checkboxDriveOptions.value = cachedDriveOptions;
      } else {
         checkboxDriveOptions.value = await getCarDrive(translate_to);
         localStorage.setItem(`DriveOptions${translate_to}`, JSON.stringify(checkboxDriveOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении типов привода:', error);
   }
};

const fetchStateOptions = async (translate_to = 'en') => {
   try {
      const cachedStateOptions = JSON.parse(localStorage.getItem(`StateOptions${translate_to}`));
      if (cachedStateOptions) {
         switcherStateOptions.value = cachedStateOptions;
      } else {
         switcherStateOptions.value = await getCarState(translate_to);
         localStorage.setItem(`StateOptions${translate_to}`, JSON.stringify(switcherStateOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении состояния автомобилей:', error);
   }
};

const ads = ref([]);
const adsMain = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const count = getAdsCount();

const cardListTitle = computed(() => {
   if (!isLoading.value && !adsMain.value.length) {
      return 'Ничего не найдено';
   }
   return `Купить автомобиль в г. ${cityStore.selectedCity.name}`;
});

const generateUrl = computed(() => {
   let basePath = '/auto';
   const { selectedCondition, selectedState, selectedMark } = filtersStore;

   if (selectedCondition === 1) basePath += '/new';
   else if (selectedCondition === 2) basePath += '/used';

   if (selectedState === 1) basePath += '/broken';
   else if (selectedState === 2) basePath += '/unbeaten';

   const params = [];
   const {
      priceRange,
      mileageRange,
      engineVolumeRange,
      powerRange,
      selectedBodyTypes,
      selectedTransmission,
      selectedEngineTypes,
      selectedDrives,
      selectedColor,
   } = filtersStore;

   const getTitleById = (options, id) => {
      const found = options.find(option => option.id === id);
      return found ? found.title : null;
   };

   const marksTitles = selectedMark
      .map(id => getTitleById(dropdownMarksOptions.value, id))
      .filter(Boolean);

   if (marksTitles.length === 1) {
      basePath += `/${marksTitles[0].toLowerCase().replace(/\s+/g, '-')}`;
   } else if (marksTitles.length > 1) {
      params.push(`brands=${marksTitles.map(mark => mark.toLowerCase().replace(/\s+/g, '-')).join('-')}`);
   }

   const bodyTypesTitles = selectedBodyTypes
      .map(id => getTitleById(checkboxBodyTypeOptions.value, id))
      .filter(Boolean);

   if (bodyTypesTitles.length === 1) {
      basePath += `/${bodyTypesTitles[0].toLowerCase().replace(/\s+/g, '-')}`;
   } else if (bodyTypesTitles.length > 1) {
      params.push(`body-types=${bodyTypesTitles.map(type => type.toLowerCase().replace(/\s+/g, '-')).join('-')}`);
   }

   const transmissionTitles = selectedTransmission
      .map(id => getTitleById(dropdownTransmissionOptions.value, id))
      .filter(Boolean);

   if (transmissionTitles.length === 1) {
      basePath += `/${transmissionTitles[0].toLowerCase().replace(/\s+/g, '-')}`;
   } else if (transmissionTitles.length > 1) {
      params.push(`transmission-types=${transmissionTitles.map(type => type.toLowerCase().replace(/\s+/g, '-')).join('-')}`);
   }

   const engineTypesTitles = selectedEngineTypes
      .map(id => getTitleById(checkboxEngineTypeOptions.value, id))
      .filter(Boolean);

   if (engineTypesTitles.length === 1) {
      basePath += `/${engineTypesTitles[0].toLowerCase().replace(/\s+/g, '-')}`;
   } else if (engineTypesTitles.length > 1) {
      params.push(`engine-types=${engineTypesTitles.map(type => type.toLowerCase().replace(/\s+/g, '-')).join('-')}`);
   }

   const drivesTitles = selectedDrives
      .map(id => getTitleById(checkboxDriveOptions.value, id))
      .filter(Boolean);

   if (drivesTitles.length === 1) {
      basePath += `/${drivesTitles[0].toLowerCase().replace(/\s+/g, '-')}`;
   } else if (drivesTitles.length > 1) {
      params.push(`drive-types=${drivesTitles.map(type => type.toLowerCase().replace(/\s+/g, '-')).join('-')}`);
   }

   const colorTitles = selectedColor
      .map(id => getTitleById(colorOptions.value, id))
      .filter(Boolean);

   if (colorTitles.length === 1) {
      basePath += `/${colorTitles[0].toLowerCase().replace(/\s+/g, '-')}`;
   } else if (colorTitles.length > 1) {
      params.push(`colors=${colorTitles.map(color => color.toLowerCase().replace(/\s+/g, '-')).join('-')}`);
   }

   if (priceRange.min !== null && priceRange.max !== null) {
      params.push(`price-range=${priceRange.min}-${priceRange.max}`);
   }
   if (mileageRange.min !== null && mileageRange.max !== null) {
      params.push(`mileage-range=${mileageRange.min}-${mileageRange.max}`);
   }
   if (engineVolumeRange.min !== null && engineVolumeRange.max !== null) {
      params.push(`engine-volume-range=${engineVolumeRange.min}-${engineVolumeRange.max}`);
   }
   if (powerRange.min !== null && powerRange.max !== null) {
      params.push(`power-range=${powerRange.min}-${powerRange.max}`);
   }

   return params.length ? `${basePath}?${params.join('&')}` : basePath;
});

const updateFiltersFromUrl = async () => {
   const pathSegments = route.params.slug || [];
   console.log('Path Segments:', pathSegments);

   const mapFilterFromPath = (options, filterKey) => {
      const foundValue = pathSegments.find(segment =>
         options.value.some(option =>
            option.title.toLowerCase().replace(/\s+/g, '-') === segment
         )
      );

      if (foundValue) {
         const id = options.value.find(option =>
            option.title.toLowerCase().replace(/\s+/g, '-') === foundValue
         )?.id;
         filtersStore.setFilter(filterKey, [id]);
      }
   };

   mapFilterFromPath(dropdownMarksOptions, 'selectedMark');
   mapFilterFromPath(checkboxBodyTypeOptions, 'selectedBodyTypes');
   mapFilterFromPath(dropdownTransmissionOptions, 'selectedTransmission');
   mapFilterFromPath(checkboxEngineTypeOptions, 'selectedEngineTypes');
   mapFilterFromPath(checkboxDriveOptions, 'selectedDrives');
   mapFilterFromPath(colorOptions, 'selectedColor');

   if (pathSegments.includes('new')) filtersStore.setFilter('selectedCondition', 1);
   if (pathSegments.includes('used')) filtersStore.setFilter('selectedCondition', 2);
   if (pathSegments.includes('broken')) filtersStore.setFilter('selectedState', 1);
   if (pathSegments.includes('unbeaten')) filtersStore.setFilter('selectedState', 2);

   const params = route.query;
   const mapFilterFromQuery = (paramKey, filterKey, options) => {
      if (params[paramKey]) {
         filtersStore.setFilter(
            filterKey,
            params[paramKey].split('-').map(value =>
               options.value.find(option =>
                  option.title.toLowerCase().replace(/\s+/g, '-') === value
               )?.id
            )
         );
      }
   };

   mapFilterFromQuery('brands', 'selectedMark', dropdownMarksOptions);
   mapFilterFromQuery('body-types', 'selectedBodyTypes', checkboxBodyTypeOptions);
   mapFilterFromQuery('transmission-types', 'selectedTransmission', dropdownTransmissionOptions);
   mapFilterFromQuery('engine-types', 'selectedEngineTypes', checkboxEngineTypeOptions);
   mapFilterFromQuery('drive-types', 'selectedDrives', checkboxDriveOptions);
   mapFilterFromQuery('colors', 'selectedColor', colorOptions);

   const mapRangeFilter = (paramKey, filterKey) => {
      if (params[paramKey]) {
         const [min, max] = params[paramKey].split('-').map(Number);
         filtersStore.setFilter(filterKey, { min, max });
      }
   };

   mapRangeFilter('price-range', 'priceRange');
   mapRangeFilter('mileage-range', 'mileageRange');
   mapRangeFilter('engine-volume-range', 'engineVolumeRange');
   mapRangeFilter('power-range', 'powerRange');
};

const fetchAds = async () => {
   try {
      isLoading.value = true;
      const { data } = await getCars({ count: 5, order_by: 'desc' });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
   }
};

const fetchAdsMain = async () => {
   try {
      router.push(generateUrl.value).catch(() => { });
      isLoading.value = true;
      const { data, totalCount } = await filtersStore.fetchFilteredCars({ page: currentPage.value, count });
      adsMain.value = data;
      totalItems.value = totalCount;
      console.log(generateUrl.value);
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
   }
};

const fetchAdsMainCurrent = async () => {
   try {
      isLoading.value = true;
      const { data, totalCount } = await filtersStore.fetchFilteredCarsCurrent({ page: currentPage.value, count });
      adsMain.value = data;
      totalItems.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   } finally {
      setLoadingWithDelay();
   }
};

const setLoadingWithDelay = () => {
   setTimeout(() => {
      isLoading.value = false;
   }, 1000);
};

const changePage = async (page) => {
   if (page < 1 || page > Math.ceil(totalItems.value / count)) return;
   currentPage.value = page;
   await fetchAdsMain();
};

const handleSortUpdate = () => {
   fetchAdsMainCurrent();
};

const handleSearchUpdate = () => {
   currentPage.value = 1;
   fetchAdsMain();
};

onMounted(async () => {
   fetchAds();
   await updateFiltersFromUrl();
   await fetchOptions();
   fetchAdsMain();
});
</script>

<style scoped lang="scss">
.container {
   max-width: 1312px;
   width: 100%;
   padding: 0 16px;
   margin: 0 auto;
   margin-top: 110px;
   display: flex;
   flex-direction: column;
   gap: 16px;

   @media(max-width: 768px) {
      margin-top: calc(66px);
      margin-bottom: 40px;
   }
}

.section {
   display: flex;
   justify-content: space-between;
   gap: 40px;

   @media (max-width: 1250px) {
      flex-direction: column;
      gap: 32px;
   }
}

.autos-title {
   color: #323232;
}

.wrap {
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 40px;
   margin-bottom: 40px;

   @media (max-width: 1250px) {
      max-width: 100%;
   }

   @media (max-width: 768px) {
      gap: 32px;
      margin-bottom: 32px;
   }
}

.autos-title {
   font-size: 20px;
   font-weight: bold;
   color: #323232;
   margin-bottom: 20px;
}

.wrap2 {
   width: 100%;
   display: flex;
   flex-direction: column;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;
}

.filter-link {
   margin-top: 20px;
   display: inline-block;
   color: #007BFF;
   text-decoration: none;

   &:hover {
      text-decoration: underline;
   }
}
</style>

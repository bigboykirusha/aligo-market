<template>
   <div ref="menuRef" class='menu-2' :class="{ 'menu-2--open': modelValue }">
      <div class="menu-2__header-row">
         <div class="menu-2__block">
            <img @click="dropdownStore.setDropdownState(false);" class="header__close-icon" :src="closeIcon" alt="" />
            <button class="header__nav-link" @click="toggleModal">
               <img :src="defaultLocationIcon" alt="Location icon" class="header__icon" />
               <span class="header__text header__text--hidden">{{ translatedCityName }}</span>
            </button>
         </div>
      </div>
      <div class="menu-2__container">
         <div class="menu-2__columns">
            <div v-for="(group, groupIndex) in detailedGroups" :key="groupIndex" class="menu-2__column">
               <div class="menu-2__list-item" @click="handleMenuItemClick(group)">
                  <img :src="group.icon" :alt="group.text" class="menu-2__list-item-icon" />
                  {{ group.title }}
                  <span class="menu-2__list-item-count-total">{{ group.count }}</span>
               </div>
               <div class="menu-2__column-list">
                  <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="menu-2__column-list-item"
                     @click="handleSubCategoryClick(item)">
                     <div class="menu-2__column-list-link">
                        {{ item.title }}
                     </div>
                  </div>
               </div>
            </div>
            <div class="menu-2__placeholder"></div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getCars } from '../services/apiClient.js';
import { useRouter } from 'vue-router';
import carIcon from '../assets/icons/car.svg';
import diskIcon from '../assets/icons/disc.svg';
import motoIcon from '../assets/icons/moto.svg';
import closeIcon from "../assets/icons/close.svg";
import { useFiltersStore } from '~/store/filters.js';
import { useDropdownStore } from '~/store/dropdown.js';
import { useLocationModalStore } from '~/store/locationModalStore';
import { useCityStore } from '~/store/city.js';
import defaultLocationIcon from '../assets/icons/Location-blue.svg';

const props = defineProps({
   modelValue: Boolean,
});

const adsCount = ref(0);
const menuRef = ref(null);
const filtersStore = useFiltersStore();
const dropdownStore = useDropdownStore();
const cityStore = useCityStore();
const locationModalStore = useLocationModalStore();

const router = useRouter();

const emit = defineEmits(['update:modelValue']);

const translatedCityName = computed(() => cityStore.selectedCity.name);

const toggleDropdown = (value) => {
   emit('update:modelValue', value);
};

const hideDetailedMenu = () => {
   toggleDropdown(false);
};

const toggleModal = () => {
   locationModalStore.toggleMenu();
};

const detailedGroups = ref([
   {
      target: 'auto',
      title: 'Автомобили',
      link: '/auto',
      icon: carIcon,
      count: adsCount,
      items: [
         { title: 'С пробегом', link: '/auto', type: 'used' },
         { title: 'Новые', link: '/auto', type: 'new' },
         { title: 'Седаны', link: '/auto', type: 'sedans' },
         { title: 'Хетчбеки', link: '/auto', type: 'hatchbacks' },
         { title: 'Универсалы', link: '/auto', type: 'wagons' },
         { title: 'Внедорожники', link: '/auto', type: 'suvs' },
         { title: 'Электромобили', link: '/auto', type: 'electric' },
         { title: 'Коммерческий транспорт', link: '/auto', type: 'commercial' },
      ],
   },
   {
      target: 'parts',
      title: 'Автотовары',
      link: '/parts',
      icon: diskIcon,
      count: '15 000',
      items: [
         { title: 'Шины и диски', link: '/parts?category=tires-and-disks', type: 'tires-and-disks' },
         { title: 'Запчасти', link: '/parts?category=spare-parts', type: 'spare-parts' },
         { title: 'Расходники для ТО', link: '/parts?category=maintenance-supplies', type: 'maintenance-supplies' },
         { title: 'Инструменты', link: '/parts?category=tools', type: 'tools' },
         { title: 'Аудио- и видеотехника', link: '/parts?category=audio-video', type: 'audio-video' },
         { title: 'Противоугонные устройства', link: '/parts?category=anti-theft', type: 'anti-theft' },
         { title: 'GPS-навигаторы', link: '/parts?category=gps', type: 'gps' },
         { title: 'Аксессуары', link: '/parts?category=accessories', type: 'accessories' },
         { title: 'Экипировка', link: '/parts?category=gear', type: 'gear' },
         { title: 'Масла и автохимия', link: '/parts?category=fluids-and-chemicals', type: 'fluids-and-chemicals' },
         { title: 'Прицепы', link: '/parts?category=trailers', type: 'trailers' },
         { title: 'Багажники и фаркопы', link: '/parts?category=roof-racks-and-hitches', type: 'roof-racks-and-hitches' },
      ],
   },
   {
      target: 'moto',
      title: 'Мототехника',
      link: '/moto',
      icon: motoIcon,
      count: '8 500',
      items: [
         { title: 'Мотоциклы', link: '/moto?type=motorcycles', type: 'motorcycles' },
         { title: 'Мопеды и скутеры', link: '/moto?type=scooters-and-mopeds', type: 'scooters-and-mopeds' },
         { title: 'Экипировка', link: '/moto?type=gear', type: 'gear' },
         { title: 'Аксессуары', link: '/moto?type=accessories', type: 'accessories' },
         { title: 'Вездеходы', link: '/moto?type=all-terrain-vehicles', type: 'all-terrain-vehicles' },
         { title: 'Картинг', link: '/moto?type=go-karts', type: 'go-karts' },
         { title: 'Квадроциклы и багги', link: '/moto?type=atvs-and-buggies', type: 'atvs-and-buggies' },
         { title: 'Снегоходы', link: '/moto?type=snowmobiles', type: 'snowmobiles' },
         { title: 'Запчасти', link: '/moto?type=moto-parts', type: 'moto-parts' },
      ],
   },
]);

const handleUsedClick = () => {
   console.log('Выбран б/у автомобиль');
   filtersStore.setFilter('selectedCondition', 2);
};

const handleNewClick = () => {
   console.log('Выбран новый автомобиль');
   filtersStore.setFilter('selectedCondition', 1);
};

const handleSedansClick = () => {
   filtersStore.setFilter('selectedBodyTypes', [2]);
   console.log('Седаны выбраны');
};

const handleWagonsClick = () => {
   filtersStore.setFilter('selectedBodyTypes', [3]);
   console.log('Универсалы выбраны');
};

const handleSuvsClick = () => {
   filtersStore.setFilter('selectedBodyTypes', [1]);
   console.log('Внедорожники выбраны');
};

const handleClickOutside = (event) => {
   if (menuRef.value && !menuRef.value.contains(event.target)) {
      hideDetailedMenu();
      dropdownStore.setDropdownState(false);
   }
};

const handleSubCategoryClick = (item) => {
   if (item.type === 'new') {
      handleNewClick();
   } else if (item.type === 'used') {
      handleUsedClick();
   } else if (item.type === 'sedans') {
      handleSedansClick();
   } else if (item.type === 'wagons') {
      handleWagonsClick();
   } else if (item.type === 'suvs') {
      handleSuvsClick();
   }
   dropdownStore.setDropdownState(false);
   router.push(item.link);
};

const handleMenuItemClick = (item) => {
   if (item.target === 'auto') {
      filtersStore.setFilter('selectedCondition', null);
   }
   dropdownStore.setDropdownState(false);
   router.push(item.target);
};

const fetchAdsCount = async () => {
   try {
      const { totalCount } = await getCars({ page: 1 });
      adsCount.value = totalCount;
   } catch (error) {
      adsCount.value = '0';
      console.error('Ошибка при получении данных: ', error);
   }
};

onMounted(() => {
   window.addEventListener('click', handleClickOutside);
   fetchAdsCount();
});

onUnmounted(() => {
   window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.menu-2 {
   position: fixed;
   left: 0;
   right: 0;
   top: -548px;
   z-index: -1;
   max-width: 1360px;
   margin: 0 auto;
   min-height: 66px;
   transform-origin: top;
   transform: translate(0, 100%) scaleY(0);
   box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
   will-change: transform;
   transition: transform 0.2s ease-in-out;

   @media (max-width: 768px) {
      height: 100vh;
      height: 100dvh;
      z-index: 100;
      top: -100vh;
      top: -100dvh;
   }

   &--open {
      transform: translate(0, 100%) scaleY(1);
   }

   &__block {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      height: 66px;
   }

   &__header-row {
      display: none;
      padding: 0 16px;
      background-color: #FFFFFF;

      &::after {
         content: '';
         width: 100%;
         height: 1px;
         background-color: #D6D6D6;
      }

      @media (max-width: 768px) {
         display: flex;
         flex-direction: column;
      }
   }

   &__placeholder {
      background-color: #D6EFFF;
      border-radius: 6px;
      height: 100%;
      width: 100%;

      @media (max-width: 991px) {
         display: none;
      }
   }

   &__container {
      padding: 66px 40px 60px;
      border-radius: 0 0 4px 4px;
      background: $white;
      width: 100%;
      border: 1px solid $color-block;
      border-top: none;
      transition: max-height 0.2s ease-in-out;

      @media (max-width: 768px) {
         padding: 0 16px 60px;
         padding-bottom: 40px;
         overflow-y: auto;
         border: none;
         height: calc(100vh - 66px);
         height: calc(100dvh - 66px);
         border-radius: 0;
      }
   }

   &__columns {
      display: grid;
      grid-template-columns: repeat(4, 25%);
      row-gap: 64px;
      border-top: 1px solid #d6d6d6;
      padding-top: 32px;

      @media (max-width: 991px) {
         grid-template-columns: repeat(3, 33%);
      }

      @media (max-width: 768px) {
         display: flex;
         flex-direction: column;
         padding-top: 24px;
         row-gap: 32px;
         border: none;
      }
   }

   &__column {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__list {
      list-style: none;
      padding: 0;
      margin: 0;
      height: 100%;
      overflow-y: auto;
      min-width: 290px;
   }

   &__list-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
         color: #3366FF;
      }


      &-icon {
         width: 16px;
         height: 16px;
         object-fit: contain;
      }

      &-count-total {
         background: #EEF9FF;
         border-radius: 12px;
         padding: 3px 10px;
         font-weight: 400;
         font-size: 14px;
         height: 24px;
         display: flex;
         align-items: center;
         color: $main-button;
         white-space: nowrap;
      }
   }

   &__column-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0;
      margin: 0;
   }

   &__column-list-item {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
         color: #3366FF;
      }
   }
}

.header__nav-link {
   display: flex;
   align-items: center;
   color: #3366FF;
   font-weight: 400;
   font-size: 14px;
   line-height: 18px;
   gap: 6px;
   background: none;
   border: none;
   outline: none;
   cursor: pointer;
   text-decoration: none;

   .header__icon {
      width: 16px;
      height: 16px;
   }
}

.header__close-icon {
   width: 16px;
   height: 16px;
}
</style>
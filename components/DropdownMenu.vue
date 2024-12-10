<template>
   <div ref="menuRef" class='menu-2'>
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
import { useFiltersStore } from '~/store/filters.js';

const adsCount = ref(0);
const menuRef = ref(null);
const filtersStore = useFiltersStore();
const router = useRouter();

const emit = defineEmits(['close']);

const detailedGroups = ref([
   {
      target: 'autos',
      title: 'Автомобили',
      link: '/autos',
      icon: carIcon,
      count: adsCount,
      items: [
         { title: 'Б/у', link: '/autos?condition=used', type: 'used' },
         { title: 'Новые', link: '/autos?condition=new', type: 'new' },
         { title: 'Электромобили', link: '/autos?condition=electric', type: 'electric' },
         { title: 'Коммерческий транспорт', link: '/autos?condition=commercial', type: 'commercial' },
         { title: 'С пробегом', link: '/autos?condition=with-mileage', type: 'mileage' },
      ],
   },
   {
      target: 'parts',
      title: 'Автотовары',
      link: '/parts',
      icon: diskIcon,
      count: '15 000',
      items: [
         { title: 'Шины', link: '/parts?category=tires', type: 'tires' },
         { title: 'Диски', link: '/parts?category=disks', type: 'disks' },
         { title: 'Масла и жидкости', link: '/parts?category=fluids', type: 'fluids' },
         { title: 'Автозапчасти', link: '/parts?category=spare-parts', type: 'spare-parts' },
         { title: 'Аксессуары', link: '/parts?category=accessories', type: 'accessories' },
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
         { title: 'Скутеры', link: '/moto?type=scooters', type: 'scooters' },
         { title: 'Квадроциклы', link: '/moto?type=atvs', type: 'atvs' },
         { title: 'Электроскутеры', link: '/moto?type=e-scooters', type: 'e-scooters' },
         { title: 'Мотозапчасти', link: '/moto?type=moto-parts', type: 'moto-parts' },
      ],
   },
]);

const handleUsedClick = () => {
   console.log('Выбран б/у автомобиль');
   filtersStore.setSelectedCondition(2);
};

const handleNewClick = () => {
   console.log('Выбран новый автомобиль');
   filtersStore.setSelectedCondition(1);
};

const handleClickOutside = (event) => {
   if (menuRef.value && !menuRef.value.contains(event.target)) {
      hideDetailedMenu();
      emit('close');
   }
};

const handleSubCategoryClick = (item) => {
   if (item.type === 'new') {
      handleNewClick();
   } else if (item.type === 'used') {
      handleUsedClick();
   }
   router.push(item.link);
   emit('close');
};

const handleMenuItemClick = (item) => {
   router.push(item.target);
   if (item.target === 'autos') {
      filtersStore.setSelectedCondition(null);
   }
   emit('close');
};

const fetchAdsCount = async () => {
   try {
      const { totalCount } = await getCars({ page: 1 });
      adsCount.value = totalCount;
   } catch (error) {
      adsCount.value = 'N/A';
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
   top: 0;
   z-index: -1;
   max-width: 1360px;
   margin: 0 auto;
   max-height: 0;
   transition: max-height 0.3s ease, padding 0.3s ease;

   &__container {
      padding: 60px 40px;
      padding-top: 66px;
      border-radius: 0 0 4px 4px;
      background: $white;
      width: 100%;
      border: 1px solid $color-block;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      transition: max-height 0.3s ease;

      @media (max-width: 768px) {
         padding: 60px 16px;
         height: calc(100vh - 70px);
      }
   }

   &__columns {
      display: grid;
      grid-template-columns: repeat(3, 25%);
      justify-content: start;
      column-gap: 32px;
      row-gap: 64px;
      border-top: 1px solid #d6d6d6;
      padding-top: 32px;

      @media (max-width: 1024px) {
         grid-template-columns: repeat(3, 33%);
      }

      @media (max-width: 768px) {
         grid-template-columns: repeat(2, 50%);
         padding-top: 24px;
      }

      @media (max-width: 480px) {
         grid-template-columns: 1fr;
         row-gap: 32px;
      }
   }

   &__column {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__bar {
      background-color: #d6d6d6;
      height: 1px;
      width: 100%;
      margin-bottom: 16px;
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
      ;
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

@keyframes slide-up {
   from {
      opacity: 0;
      transform: translateY(-15%);
   }

   to {
      opacity: 1;
      transform: translateY(0);
   }
}
</style>

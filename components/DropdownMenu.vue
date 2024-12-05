<template>
   <div ref="menuRef" :class="['menu-2', { 'menu-2--with-margin': isWithMargin }]">
      <div class="menu-2__container">
         <div class="menu-2__block">
            <ul class="menu-2__list">
               <li v-for="(item, index) in menuItems" :key="index" :data-target="item.target"
                  @click="handleMenuItemClick(item)" @mouseenter="showDetailedMenu(item.target)"
                  :class="['menu-2__list-item', { 'menu-2__list-item--active': activeTarget === item.target }]">
                  <img :src="item.icon" :alt="item.text" class="menu-2__list-item-icon" />
                  {{ item.text }}
               </li>
            </ul>
            <div :class="['menu-2__detailed', { 'menu-2__detailed--active': activeTarget !== null }]">
               <div v-for="(group, groupIndex) in detailedGroups" :key="groupIndex" :data-id="group.target"
                  :class="['menu-2__detailed-group', { 'menu-2__detailed-group--active': activeTarget === group.target }]">
                  <div class="menu-2__detailed-header">
                     <div class="menu-2__back-button" @click="hideDetailedMenu">
                        <div class="menu-2__back-icon"></div>
                     </div>
                     <div class="menu-2__detailed-title">
                        {{ group.title }}
                     </div>
                     <div class="menu-2__detailed-count-total">{{ group.count }}</div>
                  </div>
                  <div class="menu-2__detailed-list-wrapper">
                     <ul v-if="group.items.length" class="menu-2__detailed-list">
                        <li v-for="(item, itemIndex) in group.items" :key="itemIndex" class="menu-2__detailed-list-item"
                           @click="handleSubCategoryClick(item)">
                           <nuxt-link :to="item.link" class="menu-2__detailed-list-title" @click="$emit('close')">
                              {{ item.title }}
                           </nuxt-link>
                        </li>
                     </ul>
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

const isWithMargin = ref(true);
const adsCount = ref(0);
const activeTarget = ref(null);
const menuRef = ref(null);
const filtersStore = useFiltersStore();
const router = useRouter();

const emit = defineEmits(['close']);

const isDesktop = ref(window.innerWidth > 1024);

const handleScroll = () => {
   const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
   isWithMargin.value = currentScrollTop === 0;
};

const updateDeviceMode = () => {
   isDesktop.value = window.innerWidth > 1024;
};

const menuItems = ref([
   { target: 'autos', icon: carIcon, text: 'Автомобили' },
   { target: 'parts', icon: diskIcon, text: 'Запчасти и аксессуары' },
   { target: 'moto', icon: motoIcon, text: 'Мототехника' },
]);

const detailedGroups = ref([
   {
      target: 'autos',
      title: 'Автомобили',
      link: '/autos',
      count: adsCount,
      items: [
         { title: 'Б/у', link: '/autos', type: 'used' },
         { title: 'Новые', link: '/autos', type: 'new' },
      ],
   },
   {
      target: 'parts',
      title: 'Запчасти и аксессуары',
      link: '/realty',
      count: '15 000',
      items: [],
   },
   {
      target: 'moto',
      title: 'Мототехника',
      link: '/goods',
      count: '8 500',
      items: [],
   },
]);

const toggleDetailedMenu = (target) => {
   activeTarget.value = target;
};

const showDetailedMenu = (target) => {
   activeTarget.value = target;
};

const hideDetailedMenu = () => {
   activeTarget.value = null;
};

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
   hideDetailedMenu();
};

const handleMenuItemClick = (item) => {
   if (isDesktop.value) {
      router.push(item.target);
      if (item.target === 'autos') {
         filtersStore.setSelectedCondition(null);
      }
      emit('close');
   } else {
      toggleDetailedMenu(item.target);
   }
};

const fetchAdsCount = async () => {
   try {
      const { totalCount } = await getCars({ page: 1 });
      adsCount.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
   window.addEventListener('click', handleClickOutside);
   window.addEventListener('resize', updateDeviceMode);
   fetchAdsCount();
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
   window.removeEventListener('click', handleClickOutside);
   window.removeEventListener('resize', updateDeviceMode);
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
   height: 100vh;
   max-height: 0;
   transition: max-height 0.3s ease, padding 0.3s ease;

   &--active {
      max-height: 75vh;
   }

   &--with-margin {
      padding-top: 44px;

      @media (max-width: 768px) {
         padding-top: 0;
      }

   }

   &__container {
      padding: 60px 40px;
      padding-top: 66px;
      border-radius: 0 0 4px 4px;
      background: $white;
      max-height: 75vh;
      height: 100vh;
      width: 100%;
      border: 1px solid $color-block;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      transition: max-height 0.3s ease;

      @media (max-width: 1313px) {
         padding: 60px 16px;
      }

      @media (max-width: 768px) {
         padding-top: 66px;
         max-height: 100vh;
      }
   }

   &__block {
      position: relative;
      display: grid;
      grid-template-columns: 212px 1fr;
      gap: 32px;
      border-top: 1px solid #d6d6d6;
      padding-top: 8px;

      @media screen and (max-width: 768px) {
         grid-template-columns: 1fr;
         height: 100%;
      }
   }

   &__bar {
      background-color: #d6d6d6;
      height: 1px;
      width: 100%;
      margin-bottom: 16px;
   }

   &__list {
      list-style: none;
      height: 100%;
      overflow-y: auto;
      min-width: 290px;
   }

   &__list-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: $white;
      border-radius: 4px;
      font-weight: 400;
      font-size: 14px;
      height: 40px;
      color: $main-button;
      transition: font-weight 0.1s ease-in-out;
      cursor: pointer;

      &:hover {
         font-weight: 700;
      }

      &::after {
         content: '';
         display: block;
         width: 12px;
         height: 6px;
         background-image: url(../assets/images/svg/down-icon.svg);
         background-size: contain;
         background-repeat: no-repeat;
         transform: rotate(-90deg);
         margin-left: auto;
      }
   }

   &__list-item-icon {
      width: 16px;
      height: 16px;
      object-fit: contain;
   }

   &__detailed {
      height: 100%;
      padding-left: 92px;

      @media (max-width: 1200px) {
         padding-left: 15px;
      }

      @media (max-width: 600px) {
         padding-left: 0;
      }

      @media (max-width: 460px) {
         position: absolute;
         z-index: -1;
         left: 0;
         top: 0;
         width: 100%;
         height: 100%;
         background: $white;
         transition: $transition-1;

         &--active {
            z-index: 1;
            transition: $transition-2;
         }
      }
   }

   &__detailed-group {
      display: none;
      flex-direction: column;
      height: 100%;
      padding-top: 12px;

      &--active {
         display: flex;
      }
   }

   &__detailed-header {
      position: relative;
      display: flex;
      pointer-events: auto;
      align-items: center;
      justify-content: flex-start;
      padding-bottom: 24px;

      @media (max-width: 460px) {
         cursor: pointer;
      }

      .menu-2__back-icon {
         display: none;
         width: 14px;
         height: 12px;
         background-image: url(../assets/icons/arrow-back.svg);
         background-size: contain;
         background-repeat: no-repeat;

         @media (max-width: 460px) {
            display: block;
         }
      }

      @media (max-width: 460px) {
         cursor: pointer;
      }
   }

   &__detailed-title {
      font-weight: 700;
      display: flex;
      align-items: center;
      font-size: 20px;
      line-height: 1;
      height: 24px;
      color: #323232;
      text-decoration: none;
      margin-right: 8px;

      @media (max-width: 460px) {
         pointer-events: none;
         margin: 0 8px;
      }

      &:hover {
         color: $main-button;
      }
   }

   &__detailed-count-total {
      background: #d6efff;
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

   &__detailed-list-wrapper {
      height: 100%;
      padding-right: 92px;
      overflow-y: auto;

      @media (max-width: 1200px) {
         padding-right: 0;
      }

      &::-webkit-scrollbar {
         width: 8px;
      }

      &::-webkit-scrollbar-track {
         background: transparent;
      }

      &::-webkit-scrollbar-thumb {
         background: #ebebeb;
         border-radius: 4px;

         &:hover {
            background: #d6efff;
         }
      }
   }

   &__detailed-list {
      list-style: none;
      columns: 4;
      column-gap: 16px;

      @media screen and (max-width: 1200px) {
         columns: 3;
      }

      @media screen and (max-width: 1000px) {
         columns: 2;
      }

      @media screen and (max-width: 700px) {
         columns: 1;
      }
   }

   &__detailed-list-item {
      display: inline-block;
      width: 100%;
      margin-bottom: 24px;

      &:last-child {
         margin-bottom: 0;
      }
   }

   &__detailed-list-title {
      display: block;
      font-weight: 700;
      font-size: 14px;
      color: $main-text;
      text-decoration: none;
      transition: $transition-1;
      margin-bottom: 8px;

      &:hover {
         color: $main-button;
      }
   }

   &__detailed-sublist {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
   }

   &__detailed-sublist-item {
      font-size: 14px;

      &--hidden {
         display: none;
      }

      &>a {
         font-size: inherit;
         color: inherit;
         font-weight: inherit;
         text-decoration: none;
         transition: $transition-1;

         &:hover {
            color: $main-button;
         }
      }
   }

   &__detailed-sublist-show-more {
      font-size: inherit;
      font-weight: inherit;
      color: $main-button;
      cursor: pointer;
      transition: $transition-1;

      &:hover {
         opacity: 0.7;
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

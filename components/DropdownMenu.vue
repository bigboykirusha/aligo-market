<template>
   <div ref="menuRef"  :class="['menu-2', { 'menu-2--with-margin': isWithMargin }]">
      <div class="menu-2__container">
         <div class="menu-2__bar"></div>
         <div class="menu-2__block">
            <ul class="menu-2__list">
               <li v-for="(item, index) in menuItems" :key="index" :data-target="item.target"
                  @click="toggleDetailedMenu(item.target)" @mouseenter="showDetailedMenu(item.target)"
                  :class="['menu-2__list-item', { 'menu-2__list-item--active': activeTarget === item.target }]">
                  <img :src="item.icon" :alt="t(`menu.${item.text}`)" class="menu-2__list-item-icon" />
                  {{ t(`menu.${item.text}`) }}
               </li>
            </ul>
            <div :class="['menu-2__detailed', { 'menu-2__detailed--active': activeTarget !== null }]">
               <div v-for="(group, groupIndex) in detailedGroups" :key="groupIndex" :data-id="group.target"
                  :class="['menu-2__detailed-group', { 'menu-2__detailed-group--active': activeTarget === group.target }]">
                  <div class="menu-2__detailed-header">
                     <div class="menu-2__back-button" @click="hideDetailedMenu">
                        <div class="menu-2__back-icon"></div>
                     </div>
                     <nuxt-link :to="group.link" class="menu-2__detailed-title" @click="$emit('close')">
                        {{ t(`menu.${group.title}`) }}
                     </nuxt-link>
                     <div class="menu-2__detailed-count-total">{{ group.count }}</div>
                  </div>
                  <div class="menu-2__detailed-list-wrapper">
                     <ul class="menu-2__detailed-list">
                        <li v-for="(item, itemIndex) in group.items" :key="itemIndex"
                           class="menu-2__detailed-list-item">
                           <nuxt-link :to="item.link" class="menu-2__detailed-list-title" @click="$emit('close')">
                              {{ t(`menu.${item.title}`) }}
                           </nuxt-link>
                           <ul v-if="item.subitems" class="menu-2__detailed-sublist">
                              <li v-for="(subitem, subitemIndex) in item.subitems" :key="subitemIndex"
                                 class="menu-2__detailed-sublist-item">
                                 <nuxt-link :href="subitem.link" @click="$emit('close')">
                                    {{ t(`menu.${subitem.title}`) }}
                                 </nuxt-link>
                              </li>
                           </ul>
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
import { useI18n } from 'vue-i18n';
import { getCars } from '../services/apiClient.js'
import carIcon from '../assets/icons/car.svg';
import houseIcon from '../assets/icons/house.svg';
import peoplesIcon from '../assets/images/svg/peoples.svg';
import servicesIcon from '../assets/icons/servises.svg';
import goodsIcon from '../assets/images/svg/goods.svg';

const { t } = useI18n();
const isWithMargin = ref(true);
const lastScrollTop = ref(0);
const adsCount = ref(0);
const activeTarget = ref(null);
const menuRef = ref(null);

const emit = defineEmits(['close']);

const menuItems = ref([
   { target: 'auto', icon: carIcon, text: 'auto' },
   { target: 'realty', icon: houseIcon, text: 'realty' },
   { target: 'job', icon: peoplesIcon, text: 'job' },
   { target: 'service', icon: servicesIcon, text: 'service' },
   { target: 'product', icon: goodsIcon, text: 'product' },
]);

const detailedGroups = ref([
   {
      target: 'auto',
      title: 'auto',
      link: '/autos',
      count: adsCount,
      items: [
         { title: 'used', link: '/autos' },
         { title: 'new', link: '/autos' },
      ],
   },
   {
      target: 'realty',
      title: 'realty',
      link: '/realty',
      count: '21 537',
      items: [
         {
            title: 'apartments',
            link: '/realty',
            subitems: [
               { title: 'sell', link: '/realty' },
               { title: 'rent', link: '/realty' },
            ],
         },
         {
            title: 'rooms',
            link: '/realty',
            subitems: [
               { title: 'sell', link: '/realty' },
               { title: 'rent', link: '/realty' },
            ],
         },
         {
            title: 'houses',
            link: '/realty',
            subitems: [
               { title: 'sell', link: '/realty' },
               { title: 'rent', link: '/realty' },
            ],
         },
         {
            title: 'land',
            link: '/realty',
            subitems: [
               { title: 'sell', link: '/realty' },
               { title: 'rent', link: '/realty' },
            ],
         },
         {
            title: 'commercial',
            link: '/realty',
            subitems: [
               { title: 'sell', link: '/realty' },
               { title: 'rent', link: '/realty' },
            ],
         },
      ],
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

const handleScroll = () => {
   const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
   isWithMargin.value = currentScrollTop === 0;
   lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

const fetchAdsCount = async () => {
   try {
      const { totalCount } = await getCars({ page: 1 });
      adsCount.value = totalCount;
   } catch (error) {
      console.error('Ошибка при получении данных: ', error);
   }
};

const handleClickOutside = (event) => {
   if (menuRef.value && !menuRef.value.contains(event.target)) {
      hideDetailedMenu();
      event.stopPropagation()
      emit('close');
      console.log('click outside');
   }
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
   window.addEventListener('click', handleClickOutside);
   fetchAdsCount();
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
   window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.menu-2--with-margin {
   padding-top: 44px;
}

.menu-2 {
   position: fixed;
   left: 0;
   right: 0;
   top: 0;
   z-index: -1;
   max-width: 1360px;
   margin: 0 auto;
   height: 100vh;
   max-height: 75vh;
   animation: slide-up 0.2s ease-out;

   @media screen and (max-width: 460px) {
      max-height: unset;
   }

   &--active {
      transform: translate(0, 0);

   }

   &__container {
      padding: 60px 40px;
      padding-top: 66px;
      border-radius: 0 0 4px 4px;
      background: $white;
      height: 100%;
      width: 100%;
      border: 1px solid $color-block;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      transition: $transition-1;

      @media screen and (max-width: 1313px) {
         padding: 60px 16px;
         padding-top: 66px;
      }

      @media screen and (max-width: 460px) {
         padding-top: 66px;
      }
   }

   &__block {
      position: relative;
      display: grid;
      grid-template-columns: 212px 1fr;
      gap: 32px;

      @media screen and (max-width: 460px) {
         grid-template-columns: 1fr;
         height: 100%;
      }
   }


   &__bar {
      background-color: #D6D6D6;
      height: 1px;
      width: 100%;
      margin-bottom: 16px;
   }


   &__list {
      list-style: none;
      height: 100%;
      overflow-y: auto;
      margin-left: -9px;
   }

   &__list-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px;
      background: $white;
      border-radius: 4px;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.3em;
      color: $main-button;
      transition: all 0.1s ease;
      cursor: pointer;

      &:hover {
         background: $text-button;
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

      @media screen and (max-width: 1200px) {
         padding-left: 15px;
      }

      @media screen and (max-width: 600px) {
         padding-left: 0;
      }

      @media screen and (max-width: 460px) {
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

      padding-bottom: 20px;

      @media screen and (max-width: 460px) {
         cursor: pointer;
      }

      .menu-2__back-icon {
         display: none;
         width: 16px;
         height: 14px;
         background-image: url(../assets/icons/arrow-back.svg);
         background-size: contain;
         background-repeat: no-repeat;

         @media screen and (max-width: 460px) {
            display: block;
         }
      }

      @media screen and (max-width: 460px) {
         cursor: pointer;
      }
   }

   &__detailed-title {
      font-weight: 700;
      font-size: 20px;
      line-height: 1.2em;
      color: $main-text;
      text-decoration: none;
      transition: $transition-1;
      margin-right: 8px;

      @media screen and (max-width: 460px) {
         pointer-events: none;
         margin: 0 8px;
      }

      &:hover {
         color: $main-button;
      }
   }

   &__detailed-count-total {
      background: $text-button;
      border-radius: 12px;
      padding: 3px 10px;
      font-weight: 400;
      font-size: 14px;
      display: flex;
      align-items: center;
      color: $main-button;
      white-space: nowrap;
   }

   &__detailed-list-wrapper {
      height: 100%;
      padding-right: 92px;
      overflow-y: auto;

      @media screen and (max-width: 1200px) {
         padding-right: 0;
      }

      &::-webkit-scrollbar {
         width: 8px;
      }

      &::-webkit-scrollbar-track {
         background: transparent;
      }

      &::-webkit-scrollbar-thumb {
         background: #EBEBEB;
         border-radius: 4px;

         &:hover {
            background: #D6EFFF;
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
      margin-bottom: 16px;

      &:last-child {
         margin-bottom: 0;
      }
   }

   &__detailed-list-title {
      display: block;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.32em;
      color: $main-text;
      text-decoration: none;
      transition: $transition-1;
      margin-bottom: .5em;

      &:hover {
         color: $main-button;
      }
   }

   &__detailed-sublist {
      list-style: none;
   }

   &__detailed-sublist-item {
      font-size: 14px;
      line-height: 1.32em;

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
         opacity: .7;
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
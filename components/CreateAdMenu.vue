<template>
   <div v-if="selectedItem.main && selectedItem.sub" class="menu-2__selected">
      <div class="menu-2__selected-header">
         <div class="menu-2__back-button" @click="backToMainCategory">
            <div class="menu-2__back-icon"></div>
         </div>
         <div class="menu-2__selected-title">
            {{ t(`menu.${selectedItem.main}`) }} • {{ selectedItem.sub }}
         </div>
      </div>
   </div>
   <div v-else class="menu-2"
      :class="{ 'menu-2--with-margin': isWithMargin, 'menu-2--hidden': selectedItem.main === null && selectedItem.sub === null }">
      <div class="menu-2__name">Выберите категорию</div>
      <div class="menu-2__container">
         <div class="menu-2__block">
            <ul class="menu-2__list">
               <li v-for="(item, index) in menuItems" :key="index" :data-target="item.target"
                  @click="selectMainCategory(item.target)"
                  :class="['menu-2__list-item', { 'menu-2__list-item--active': activeTarget.main === item.target }]">
                  <img :src="item.icon" class="menu-2__list-item-icon" :alt="t(`menu.${item.text}`)" />
                  {{ t(`menu.${item.text}`) }}
               </li>
            </ul>
            <div class="menu-2__detailed" :class="{ 'menu-2__detailed--active': activeTarget.main !== null }">
               <div v-for="(group, groupIndex) in detailedGroups" :key="groupIndex" :data-id="group.target"
                  :class="['menu-2__detailed-group', { 'menu-2__detailed-group--active': activeTarget.main === group.target }]">
                  <div class="menu-2__detailed-header">
                     <div class="menu-2__back-button" @click="backToMainCategory">
                        <div class="menu-2__back-icon"></div>
                     </div>
                     <div @click="$emit('close')">
                        <nuxt-link :to="group.link" class="menu-2__detailed-title">
                           {{ t(`menu.${group.title}`) }}
                        </nuxt-link>
                     </div>
                  </div>
                  <div class="menu-2__detailed-list-wrapper">
                     <ul class="menu-2__detailed-list">
                        <li v-for="(item, itemIndex) in group.items" :key="itemIndex"
                           class="menu-2__detailed-list-item">
                           <a class="menu-2__detailed-list-title"
                              @click="selectSubItem(t(`menu.${item.title}`), group.title)">
                              {{ t(`menu.${item.title}`) }}
                           </a>
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
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const isWithMargin = ref(true);
const lastScrollTop = ref(0);

const emit = defineEmits(['selectionChanged']);

import carIcon from '../assets/icons/car.svg';
import houseIcon from '../assets/icons/house.svg';
import peoplesIcon from '../assets/images/svg/peoples.svg';
import servicesIcon from '../assets/icons/servises.svg';
import goodsIcon from '../assets/images/svg/goods.svg';

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
      items: [
         { title: 'used', link: '/autos' },
         { title: 'new', link: '/autos' },
      ],
   },
   {
      target: 'realty',
      title: 'realty',
      link: '/realty',
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
   {
      target: 'job',
      title: 'job',
      link: '/job',
      items: [
         { title: 'full-time', link: '/jobs/full-time' },
         { title: 'part-time', link: '/jobs/part-time' },
         { title: 'internship', link: '/jobs/internship' },
      ],
   },
   {
      target: 'service',
      title: 'service',
      link: '/services',
      items: [
         { title: 'repair', link: '/services/repair' },
         { title: 'cleaning', link: '/services/cleaning' },
         { title: 'delivery', link: '/services/delivery' },
      ],
   },
   {
      target: 'product',
      title: 'product',
      link: '/goods',
      items: [
         { title: 'electronics', link: '/products/electronics' },
         { title: 'furniture', link: '/products/furniture' },
         { title: 'clothing', link: '/products/clothing' },
      ],
   },
]);

const activeTarget = ref({ main: null, sub: null });
const selectedItem = ref({ main: null, sub: null });

const selectMainCategory = (target) => {
   if (target === 'auto') {
      activeTarget.value.main = target;
      activeTarget.value.sub = null;
      selectedItem.value.main = menuItems.value.find(item => item.target === target)?.text || null;
      selectedItem.value.sub = null;
   } else {
      const group = detailedGroups.value.find(g => g.target === target);
      if (group) {
         router.push(group.link);
      }
   }
   emitSelectionChange();
};

const selectSubItem = (subItem, mainItem) => {
   activeTarget.value.sub = subItem;
   selectedItem.value.sub = subItem;
   selectedItem.value.main = mainItem;
   emitSelectionChange();
};

const backToMainCategory = () => {
   activeTarget.value.sub = null;
   selectedItem.value.sub = null;
   activeTarget.value.main = null;
   selectedItem.value.main = null;
   emitSelectionChange();
};

const handleScroll = () => {
   const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
   isWithMargin.value = currentScrollTop === 0;
   lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

const emitSelectionChange = () => {
   const selected = {
      main: selectedItem.value.main,
      sub: selectedItem.value.sub
   };
   emit('selectionChanged', selected);
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
   if (window.innerWidth <= 460) {
      activeTarget.value.main = menuItems.value[0].target;
   }
   const main = route.query.main || null;
   const sub = route.query.sub || null;
   selectedItem.value = { main, sub };
   if (selectedItem.value) {
      emitSelectionChange();
   }
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.menu-2 {
   max-width: 1360px;
   margin: 0 auto;
   height: 100vh;
   max-height: 65vh;
   transition: $transition-1;

   @media screen and (max-width: 460px) {
      max-height: unset;
   }

   &--with-margin {
      padding-top: 150px;

      @media screen and (max-width: 460px) {
         padding-top: 92px;
      }
   }

   &--active {
      transform: translate(0, 0);
      transition: $transition-2;
   }

   &__name {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 22px;
      line-height: 32px;
      font-weight: 700;
      color: #323232;

      @media screen and (max-width: 460px) {
         display: none;
      }
   }

   &__container {
      padding-top: 24px;
      background: $white;
      height: 100%;
      width: 100%;
      transition: $transition-1;
   }

   &__block {
      position: relative;
      display: grid;
      grid-template-columns: 212px 260px;
      overflow: hidden;

      @media screen and (max-width: 460px) {
         grid-template-columns: 1fr;
         height: 100%;
      }
   }

   &__list {
      list-style: none;
      height: 100%;
      overflow-y: auto;
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
      transition: $transition-1;
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
      border-left: 1px solid #d6d6d6;

      @media screen and (max-width: 460px) {
         position: absolute;
         z-index: -1;
         left: 0;
         top: 0;
         width: 100%;
         height: 100%;
         border: none;
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
      display: none;
      pointer-events: auto;
      align-items: center;
      justify-content: flex-start;
      padding-bottom: 20px;

      div a {
         color: #3366FF;
      }

      @media screen and (max-width: 460px) {
         cursor: pointer;
         display: flex;
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
   }

   &__selected {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      padding-top: 125px;
      background: $white;
   }

   &__selected-header {
      display: flex;
      align-items: center;
   }

   &__back-button {
      cursor: pointer;
      margin-right: 10px;

      .menu-2__back-icon {
         width: 16px;
         height: 14px;
         background-image: url(../assets/icons/arrow-back.svg);
         background-size: contain;
         background-repeat: no-repeat;
      }
   }

   &__selected-title {
      font-weight: 700;
      font-size: 16px;
      line-height: 1.2em;
      color: #3366FF;
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

   &__detailed-list-wrapper {
      height: 100%;
      overflow-y: auto;
   }

   &__detailed-list {
      list-style: none;
      columns: 1;
      column-gap: 16px;
   }

   &__detailed-list-item {
      display: inline-block;
      width: 100%;
   }

   &__detailed-list-title {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 0;
      padding-left: 16px;
      background: $white;
      border-radius: 4px;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.3em;
      color: $main-button;
      transition: $transition-1;
      cursor: pointer;

      &:hover {
         background: $text-button;
         font-weight: 700;
      }
   }
}
</style>
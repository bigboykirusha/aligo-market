<template>
   <div class="tabs">
      <div v-for="(tab, index) in tabs" :key="tab.index" class="tabs__item">
         <!-- Таб -->
         <div class="tabs__tab" :class="{
            'tabs__tab--active': activeTab === tab.index,
            'tabs__tab--completed': activeTab > tab.index,
         }" @click="selectTab(tab.index)">
            <img v-if="tab.index < activeTab" src="../assets/icons/check.svg" alt="check icon" class="tabs__tab-icon" />
            <b v-if="tab.index === activeTab || tab.index > activeTab">{{ tab.index }}</b>
            <span v-if="tab.index === activeTab"> • {{ tab.label }}</span>
         </div>

         <div v-if="index < tabs.length - 1" class="tabs__arrow" :class="{ 'tabs__arrow--active': activeTab > index }">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 7L1 7" :stroke="activeTab > index ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 1" :stroke="activeTab > index ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 13" :stroke="activeTab > index ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
            </svg>
         </div>
      </div>
   </div>
</template>

<script setup>
import { useTabsStore } from '../store/tabsStore';
import { useCreateStore } from '../store/create';

const tabsStore = useTabsStore();
const createStore = useCreateStore();

const activeTab = computed(() => tabsStore.activeTab);
const tabs = computed(() => tabsStore.tabs);

const selectTab = (index) => {
   if (index === 2 || index === 3) {
      if (!createStore.isCharacteristicFieldsFilled) {
         alert('Заполните обязательные поля в первом табе, чтобы продолжить.');
         return;
      }
   }

   tabsStore.setActiveTab(index);
};
</script>

<style lang="scss" scoped>
.tabs {
   display: flex;
   align-items: center;
   gap: 8px;
   background-color: white;

   &__item {
      display: flex;
      align-items: center;
      gap: 8px;
   }

   &__tab {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 10px;
      height: 26px;
      border-radius: 12px;
      background-color: #eeeeee;
      color: #757575;
      font-weight: 400;
      transition: background-color 0.3s, color 0.3s;

      img {
         width: 16px;
         height: 16px;
      }

      b {
         font-size: 16px;
      }

      span {
         font-size: 16px;
         padding-left: 3px;
      }

      &--active {
         background-color: #3366ff;
         color: #ffffff;
      }

      &--completed {
         background-color: #3366ff;
         color: #ffffff;
      }
   }

   &__arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a8a8a8;
      opacity: 0.6;
      transition: color 0.3s, opacity 0.3s;

      &--active {
         color: #3366ff;
         opacity: 1;
      }

      svg {
         width: 16px;
         height: 14px;

         path {
            transition: stroke 0.3s;
         }
      }
   }
}
</style>
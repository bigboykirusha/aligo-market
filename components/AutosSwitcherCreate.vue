<template>
   <div class="switcher">
      <div class="switcher__label">{{ label }}</div>
      <div class="switcher__items">
         <div v-for="(option, index) in options" :key="option.id"
            :class="['switcher__item', { 'switcher__item--active': selectedIndex === (index + 1) }]"
            @click="selectOption(index)" :style="{ width: itemWidth }">
            {{ capitalizeFirstWord(option.title) }}
            <div v-if="shouldShowDivider(index)" class="switcher__divider"></div>
         </div>
         <div v-if="selectedIndex !== null" class="switcher__indicator" :style="indicatorStyle">
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['updateSelected']);
const props = defineProps({
   options: {
      type: Array,
      required: true
   },
   label: {
      type: String,
      default: ''
   },
   activeIndex: {
      type: Number,
      default: null
   }
});

const selectedIndex = ref(props.activeIndex);

watch(() => props.activeIndex, (newIndex) => {
   selectedIndex.value = newIndex;
});

const selectOption = (index) => {
   const actualIndex = index + 1;
   if (selectedIndex.value !== actualIndex) {
      selectedIndex.value = actualIndex;
      emit('updateSelected', selectedIndex.value);
   }
};

const shouldShowDivider = (index) => {
   const actualIndex = index + 1;
   if (selectedIndex.value === null) {
      return actualIndex < props.options.length;
   }
   if (actualIndex === selectedIndex.value - 1 || actualIndex === selectedIndex.value) {
      return false;
   }
   return actualIndex < props.options.length;
};

const capitalizeFirstWord = (text) => {
   if (!text) return '';
   const words = text.split(' ');
   words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
   return words.join(' ');
};

const indicatorStyle = computed(() => {
   const translateX = (selectedIndex.value - 1) * 100;
   const width = 100 / props.options.length;
   const margin = props.options.length === 2 ? 3 : 2;
   return {
      transform: `translateX(calc(${translateX}% + 3px))`,
      width: `calc(${width}% - ${1 * margin}px)`
   };
});

const itemWidth = computed(() => {
      return props.options.length > 3 ? '77.5px' : '103px';
});
</script>

<style scoped lang="scss">
.switcher {
   display: flex;
   align-items: flex-start;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__items {
      display: flex;
      position: relative;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      overflow: hidden;
   }

   &__item {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 7.5px 0;
      z-index: 3;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      transition: color 0.3s;
      white-space: nowrap;

      &--active {
         color: white;
      }
   }

   &__divider {
      position: absolute;
      right: 0;
      top: 10%;
      bottom: 10%;
      width: 1px;
      background-color: #d6d6d6;
   }

   &__indicator {
      position: absolute;
      top: 3px;
      bottom: 3px;
      border-radius: 4px;
      background-color: #3366FF;
      transition: transform 0.3s, width 0.3s;
   }
}
</style>

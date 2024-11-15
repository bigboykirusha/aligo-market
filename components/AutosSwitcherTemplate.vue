<template>
   <div class="switcher">
      <div class="switcher__label">{{ label }}</div>
      <div class="switcher__items">
         <div v-for="(option, index) in options" :key="option.id" :class="['switcher__item', {
            'switcher__item--active': selectedIndex === (index + 1),
            'switcher__item--disabled': props.dis
         }]" @click="selectOption(index)" :disabled="props.dis">
            {{ capitalizeFirstWord(option.title) }}
            <div v-if="shouldShowDivider(index)" class="switcher__divider"></div>
         </div>
         <div v-if="(selectedIndex) !== null" class="switcher__indicator" :style="indicatorStyle"></div>
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
   },
   dis: {
      type: Boolean,
      default: false
   }
});

const selectedIndex = ref(props.activeIndex);

watch(() => props.activeIndex, (newIndex) => {
   selectedIndex.value = newIndex;
});

const capitalizeFirstWord = (text) => {
   if (!text) return '';
   const words = text.split(' ');
   words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
   return words.join(' ');
};

const selectOption = (index) => {
   if (props.dis) {
      return;
   }
   const actualIndex = index + 1;
   if (selectedIndex.value !== actualIndex) {
      selectedIndex.value = actualIndex;
      emit('updateSelected', selectedIndex.value);
   }
};

const shouldShowDivider = (index) => {
   if (selectedIndex.value === null) {
      return index < props.options.length - 1;
   }
   if (index === selectedIndex.value - 1 || index === selectedIndex.value) {
      return false;
   }
   return index < props.options.length - 1;
};

const indicatorStyle = computed(() => {
   const translateX = (selectedIndex.value - 1) * 100;
   const width = 100 / props.options.length;
   return {
      transform: `translateX(calc(${translateX}% + 3px))`,
      width: `calc(${width}% - 3px)`
   };
});
</script>

<style scoped lang="scss">
.switcher {
   display: flex;
   flex-direction: column;

   @media screen and (max-width: 768px) {
      gap: 8px;
   }

   &__label {
      font-size: 12px;
      color: #323232;
      margin-bottom: 5px;
   }

   &__items {
      display: flex;
      position: relative;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      overflow: hidden;
   }

   &__item {
      display: flex;
      flex-grow: 1;
      flex-basis: 0;
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

      &--disabled {
         color: #a5a5a5;
         cursor: not-allowed;
         pointer-events: none;
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
      border-radius: 3px;
      background-color: #3366FF;
      transition: transform 0.3s, width 0.3s;
   }
}
</style>
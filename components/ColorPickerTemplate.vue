<template>
   <div class="color-picker">
      <div class="color-picker__title">{{ label }}</div>
      <div class="color-picker__options">
         <div v-for="color in options" :key="color.id" class="color-picker__option"
            :style="[getStyle(color), { backgroundColor: color.code }]"
            :class="{ 'color-picker__option--selected': selectedOptions.includes(color.id) }"
            @click="toggleColor(color.id)">
            <div class="color-picker__tooltip">
               {{ color.title }}
               <span class="color-picker__tooltip-arrow"></span>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const emit = defineEmits(['updateSelected']);
const props = defineProps({
   options: {
      type: Array,
      required: true,
   },
   label: {
      type: String,
      default: '',
   },
   activeIndexes: {
      type: Array,
      default: () => [],
   },
});

const selectedOptions = ref([]);

const getStyle = (color) => {
   if (color.is_gradient) {
      if (color.id === 5) {
         return { background: 'linear-gradient(149.74deg, #D9D9D9 13.83%, #F5F5F5 48.22%, #CECECE 64.1%)' };
      }
      if (color.id === 13) {
         return { background: 'linear-gradient(149.74deg, #E3D2B8 13.83%, #FCF4E9 48.22%, #D6BB93 64.1%)' };
      }
      if (color.id === 17) {
         return { background: 'linear-gradient(149.74deg, #C8A381 13.83%, #F2DED2 48.22%, #B08C6E 64.1%)' };
      }
   }
   return { backgroundColor: color.code };
};

onMounted(() => {
   selectedOptions.value = props.activeIndexes;
});

watch(
   () => props.activeIndexes,
   (newIndexes) => {
      selectedOptions.value = newIndexes;
   }
);

watch(selectedOptions, (newOptions) => {
   emit('updateSelected', newOptions);
});

const toggleColor = (id) => {
   const index = selectedOptions.value.indexOf(id);
   if (index > -1) {
      selectedOptions.value.splice(index, 1);
   } else {
      selectedOptions.value.push(id);
   }
   emit('updateSelected', selectedOptions.value);
};
</script>

<style scoped lang="scss">
.color-picker {
   display: flex;
   flex-direction: column;

   &__title {
      font-size: 12px;
      color: #323232;
      margin-bottom: 10px;
   }

   &__options {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      gap: 20px;
      flex-wrap: wrap;
   }

   &__option {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid #d6d6d6;
      transition: border-color 0.3s ease;
      position: relative;

      &:hover .color-picker__tooltip {
         visibility: visible;
         opacity: 1;
      }
   }

   &__option--selected {
      border: 2px solid #3366ff;
   }

   &__tooltip {
      position: absolute;
      bottom: -42px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #3366ff;
      color: #fff;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 14px;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s, opacity 0.2s ease-in-out;
      white-space: nowrap;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   &__tooltip-arrow {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #3366ff;
   }
}
</style>
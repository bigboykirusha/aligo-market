<template>
   <div class="color-picker">
      <div class="color-picker__title">{{ label }}</div>
      <div class="color-picker__options">
         <div v-for="color in options" :key="color.id" class="color-picker__option" :style="getStyle(color)"
            :class="{ 'color-picker__option--selected': selectedColor === color.id }" @click="selectColor(color.id)">
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
   activeIndex: {
      type: Number,
      default: null,
   },
});

const selectedColor = ref(null);

onMounted(() => {
   selectedColor.value = props.activeIndex;
});

watch(() => props.activeIndex, (newIndex) => {
   selectedColor.value = newIndex;
});

watch(selectedColor, (newColor) => {
   emit('updateSelected', newColor);
});

const selectColor = (id) => {
   selectedColor.value = id;
};

const getStyle = (color) => {
   if (color.is_gradient) {
      if (color.id === 5) {
         // Серебряный
         return {
            background: 'linear-gradient(149.74deg, #D9D9D9 13.83%, #F5F5F5 48.22%, #CECECE 64.1%)',
         };
      }
      if (color.id === 13) {
         // Золотой
         return {
            background: 'linear-gradient(149.74deg, #E3D2B8 13.83%, #FCF4E9 48.22%, #D6BB93 64.1%)',
         };
      }
      if (color.id === 17) {
         // Бронзовый
         return {
            background: 'linear-gradient(149.74deg, #C8A381 13.83%, #F2DED2 48.22%, #B08C6E 64.1%)',
         };
      }
   }
   return { backgroundColor: color.code };
};
</script>

<style scoped lang="scss">
.color-picker {
   display: flex;
   flex-direction: row;
   align-items: flex-start;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__title {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__options {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      gap: 12px;
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
      transform: translateX(-30%);
      background-color: #3366ff;
      color: #FFF;
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
      text-transform: capitalize;
   }

   &__tooltip-arrow {
      position: absolute;
      top: -8px;
      left: 30%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #3366ff;
   }
}
</style>
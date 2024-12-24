<template>
   <div class="color-picker">
      <div class="color-picker__title">{{ label }}</div>
      <div class="color-picker__options">
         <div v-for="color in options" :key="color.id" class="color-picker__option" :style="getStyle(color)"
            :class="{ 'color-picker__option--selected': selectedColors.includes(color.id) }"
            @click="toggleColorSelection(color.id)">
            <div class="color-picker__tooltip">
               {{ color.title }}
               <span class="color-picker__tooltip-arrow"></span>
            </div>
         </div>
      </div>
   </div>
   <div class="color-picker__custom-color">
      <label for="colorCustom">Пользовательский цвет</label>
      <input type="text" id="colorCustom" v-model="colorCustom" @input="setColorCustom"
         placeholder="Не нашли цвет в списке? Введите свой цвет" class="color-picker__text-input" />
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCreateStore } from '@/store/create.js';

const store = useCreateStore();

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
   activeIndices: {
      type: Array,
      default: () => [],
   },
});

const colorCustom = computed({
   get() {
      return store.color_custom;
   },
   set(newColor) {
      store.setColorCustom(newColor);
   }
});

const setColorCustom = (event) => {
   const color = event.target.value;
   if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      colorCustom.value = color;
   }
};

const selectedColors = computed({
   get() {
      return props.activeIndices;
   },
   set(newColors) {
      emit('updateSelected', newColors);
   }
});

const toggleColorSelection = (id) => {
   const newSelection = [...selectedColors.value];
   const index = newSelection.indexOf(id);

   if (index > -1) {
      newSelection.splice(index, 1);
   } else {
      newSelection.push(id);
   }

   selectedColors.value = newSelection;
};

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

   &__custom-color {
      display: flex;
      flex-direction: row;

      @media (max-width: 768px) {
         flex-direction: column;
         row-gap: 8px;
      }

      label {
         font-size: 14px;
         color: #323232;
         min-width: 270px;
      }

      .color-picker__text-input {
         font-size: 14px;
         padding: 8px 12px;
         padding-right: 28px;
         border: 1px solid #d6d6d6;
         border-radius: 6px;
         outline: none;
         width: 100%;
         max-width: 310px;
         box-sizing: border-box;

         @media (max-width: 768px) {
            max-width: 100%;
         }

         &:focus {
            border: 1px solid #3366FF;
         }
      }
   }
}
</style>

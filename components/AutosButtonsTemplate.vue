<template>
   <div class="button-selector">
      <div class="button-selector__items">
         <button :class="['button-selector__button', { 'button-selector__button--active': selectedIndex === null }]"
            @click="selectOption(null)">
            Все
         </button>
         <button v-for="(option) in options" :key="option.id"
            :class="['button-selector__button', { 'button-selector__button--active': selectedIndex === option.id }]"
            @click="selectOption(option.id)">
            {{ capitalizeFirstWord(option.title) }}
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['updateSelected']);
const props = defineProps({
   options: {
      type: Array,
      required: true
   },
   activeIndex: {
      type: Number,
      default: null
   }
});

const selectedIndex = ref(props.activeIndex);

const capitalizeFirstWord = (text) => {
   if (!text) return '';
   const words = text.split(' ');
   words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
   return words.join(' ');
};

const selectOption = (id) => {
   if (selectedIndex.value !== id) {
      selectedIndex.value = id;
      console.log(id);
      emit('updateSelected', selectedIndex.value);
   }
};
</script>

<style scoped lang="scss">
.button-selector {
   display: flex;
   flex-direction: column;
   padding-bottom: 24px;
   border-bottom: 1px solid #D6D6D6;

   &__items {
      display: flex;
      gap: 8px;
   }

   &__button {
      padding: 7px 14px;
      font-size: 14px;
      line-height: 18px;
      color: #3366FF;
      background-color: #EEF9FF;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
         background-color: #A4DCFF;
      }

      &--active {
         background-color: #3366FF;
         color: #ffffff;

         &:hover {
            background-color: #3366FF;
            color: #ffffff;
         }
      }
   }
}
</style>

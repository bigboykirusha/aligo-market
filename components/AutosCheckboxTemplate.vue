<template>
   <div class="checkbox-list">
      <div v-if="label" class="checkbox-list__label">{{ label }}</div>
      <div class="checkbox-list__items">
         <div v-for="(option, index) in options" :key="option.title" class="checkbox-list__item">
            <input type="checkbox" :id="`checkbox-${option.title}`" :checked="selectedIndexes.includes(index)"
               @change="toggleCheckbox(index)" />
            <label :for="`checkbox-${option.title}`">{{ option.title }}</label>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';

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

const selectedIndexes = ref([...props.activeIndexes]);

const toggleCheckbox = (index) => {
   if (selectedIndexes.value.includes(index)) {
      selectedIndexes.value = selectedIndexes.value.filter(i => i !== index);
   } else {
      selectedIndexes.value.push(index);
   }

   emit('updateSelected', selectedIndexes.value);
};
</script>

<style scoped lang="scss">
.checkbox-list {
   display: flex;
   flex-direction: column;
   gap: 5px;

   &__label {
      font-size: 12px;
      color: #323232;
      margin-bottom: 5px;
   }

   &__items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
   }

   &__item {
      flex: 0 0 48%;
      display: flex;
      align-items: center;

      input {
         margin-right: 8px;
      }

      label {
         font-size: 14px;
         color: #323232;
      }
   }
}
</style>

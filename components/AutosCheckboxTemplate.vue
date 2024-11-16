<template>
   <div class="checkbox-list">
      <div v-if="label" class="checkbox-list__label">{{ label }}</div>
      <div class="checkbox-list__items">
         <div v-for="(option, index) in options" :key="option.id" class="checkbox-list__item">
            <input type="checkbox" :id="`checkbox-${option.title}`" :checked="selectedIds.includes(option.id)"
               @change="toggleCheckbox(option.id)" />
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

const selectedIds = ref([...props.activeIndexes]);

const toggleCheckbox = (id) => {
   if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter(i => i !== id);
   } else {
      selectedIds.value.push(id);
   }

   emit('updateSelected', selectedIds.value);
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

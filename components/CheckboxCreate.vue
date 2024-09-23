<template>
   <div class="checkbox-list">
      <div class="checkbox-list__label">{{ label }}</div>
      <div class="checkbox-list__items">
         <div v-for="(option, index) in options" :key="option.id" class="checkbox-list__item">
            <input type="checkbox" :id="`checkbox-${option.id}`" :value="index" v-model="selectedOptions" />
            <label :for="`checkbox-${option.id}`">{{ option.title }}</label>
         </div>
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
   label: {
      type: String,
      default: ''
   },
   activeIndexes: {
      type: Array,
      default: () => []
   }
});

const selectedOptions = ref([...props.activeIndexes]);

watch(() => props.activeIndexes, (newIndexes) => {
   selectedOptions.value = newIndexes;
}, { deep: true });

watch(selectedOptions, (newOptions) => {
   emit('updateSelected', newOptions);
}, { deep: true });
</script>

<style scoped lang="scss">
.checkbox-list {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 5px;

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      width: 270px;
   }

   &__items {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 24px;

      @media screen and (max-width: 768px) {
         gap: 8px;
      }
   }

   &__item {
      display: flex;
      align-items: center;

      input {
         margin-right: 5px;
      }

      label {
         font-size: 14px;
         margin-bottom: 2px;
         color: #323232;
      }
   }
}
</style>
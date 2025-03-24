<template>
   <div class="checkbox">
      <input type="checkbox" :id="checkboxId" v-model="isChecked" @change="handleChange" />
      <label :for="checkboxId">{{ label }}</label>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['updateChecked']);
const props = defineProps({
   label: {
      type: String,
      required: true
   },
   checked: {
      type: [Number, Boolean],
      default: 0
   }
});

const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

const isChecked = ref(props.checked === 1);

watch(() => props.checked, (newValue) => {
   isChecked.value = newValue === 1;
});

const handleChange = () => {
   emit('updateChecked', isChecked.value ? 1 : 0);
};
</script>

<style scoped lang="scss">
.checkbox {
   display: flex;
   align-items: center;

   input {
      margin-right: 5px;
   }

   label {
      font-size: 14px;
      color: #323232;
   }
}
</style>

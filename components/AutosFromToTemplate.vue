<template>
   <div class="range-input">
      <div class="range-input__label">{{ label }}</div>
      <div class="range-input__fields">
         <input type="number" v-model="minValue" placeholder="от" class="range-input__field" @input="handleMinInput" :disabled="props.dis"/>
         <input type="number" v-model="maxValue" placeholder="до" class="range-input__field" @input="handleMaxInput" :disabled="props.dis"/>
         <span v-if="label === 'Цена'" class="range-input__currency">₽</span>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
   label: {
      type: String,
      default: ''
   },
   initialMinValue: {
      type: Number,
      default: null
   },
   initialMaxValue: {
      type: Number,
      default: null
   },
   dis: {
      type: Boolean,
      default: false
   }
});

// Определение событий, которые компонент будет испускать
const emit = defineEmits(['updateRange']);

// Локальные состояния для минимального и максимального значений
const minValue = ref(props.initialMinValue);
const maxValue = ref(props.initialMaxValue);

// Обработчики ввода для полей минимального и максимального значений
const handleMinInput = (event) => {
   const value = event.target.value;
   minValue.value = value === '' ? null : Number(value);
};

const handleMaxInput = (event) => {
   const value = event.target.value;
   maxValue.value = value === '' ? null : Number(value);
};

// Наблюдение за изменениями значений и эмиссия события с новыми значениями
watch([minValue, maxValue], ([newMin, newMax]) => {
   emit('updateRange', { min: newMin, max: newMax });
});

// Наблюдение за изменениями начальных значений и обновление локальных состояний
watch(() => props.initialMinValue, (newValue) => {
   minValue.value = newValue;
});

watch(() => props.initialMaxValue, (newValue) => {
   maxValue.value = newValue;
});
</script>

<style scoped lang="scss">
.range-input {
   display: flex;
   max-width: 260px;
   flex-direction: column;
   gap: 5px;

   @media screen and (max-width: 1250px) {
      max-width: 100%;
   }

   &__label {
      font-size: 12px;
      font-weight: 400;
      color: #323232;
   }

   &__fields {
      display: flex;
      gap: 10px;
   }

   &__currency {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #323232;
   }

   &__field {
      width: 50%;
      height: 34px;
      padding: 8px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      outline: none;
      font-size: 14px;
      color: #323232;

      &:focus {
         border-color: #3366FF;
      }

      &::placeholder {
         color: #a8a8a8;
      }
   }
}
</style>

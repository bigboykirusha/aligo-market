<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">{{ label }}</label>
      <div class="simple-input__block">
         <div class="simple-input__wrapper">
            <input type="text" :inputmode="props.validationType === 'number' ? 'numeric' : null"
               class="simple-input__field" :class="{
                  'simple-input__field--error': shouldShowError,
                  'simple-input__field--success': shouldShowSuccess,
                  'simple-input__field--highlighted': isHighlighted
               }" :placeholder="placeholder" v-model="displayValue" :disabled="disabled" @input="handleInput" />
            <img v-if="optionValue" src="../assets/icons/close-gray.svg" alt="Clear" class="simple-input__clear"
               @click="clearInput" />
         </div>
         <div v-if="hasInput && props.validationType"
            :class="{ 'simple-input__error': !isValid, 'simple-input__success': isValid }">
            {{ isValid ? 'Значение введено корректно' : errorMessage }}
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
   option: {
      type: [String, Number],
   },
   label: {
      type: String,
   },
   placeholder: {
      type: String,
      default: 'Введите текст',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
   validationType: {
      type: String,
   },
   isEmpty: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['update:option']);
const optionValue = ref(props.option ? String(props.option).trim() : '');
const hasInput = ref(false);
const isHighlighted = ref(props.isEmpty);

// Функция для форматирования числа с разделением на разряды
const formatNumber = (value) => {
   // Убираем все символы, кроме цифр
   const numValue = value.replace(/\D/g, '');
   // Форматируем число с пробелами для отображения
   return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Вычисляем отображаемое значение (с пробелами) только для поля с числовой валидацией
const displayValue = computed({
   get() {
      if (props.validationType === 'number') {
         return formatNumber(optionValue.value); // Форматируем только для отображения
      }
      return optionValue.value; // Для других типов не форматируем
   },
   set(newValue) {
      if (props.validationType === 'number') {
         // Если это число, убираем пробелы для сохранения
         optionValue.value = newValue.replace(/\s/g, '');
      } else {
         optionValue.value = newValue; // Для других типов сохраняем без изменений
      }
   }
});

// Функция валидации
const isValid = computed(() => {
   switch (props.validationType) {
      case 'number':
         return !isNaN(optionValue.value) && Number(optionValue.value) > 0;
      case 'email':
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionValue.value);
      case 'url':
         return /^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)(\/[\w\d\-._~:/?#\[\]@!$&'()*+,;=]*)?$/.test(optionValue.value);
      case 'doors':
         const numberValue = Number(optionValue.value);
         return Number.isInteger(numberValue) && numberValue >= 2 && numberValue <= 12;
      case 'vin':
         return validateVIN(optionValue.value);
      case 'licensePlate':
         return /^[A-Z]{1}\d{3}[A-Z]{2}\d{2,3}$/.test(optionValue.value);
      default:
         return true;
   }
});

const validateVIN = (vin) => {
   // Регулярное выражение для проверки VIN
   const vinRegex = /^[A-HJ-NPR-Za-hj-npr-z\d]{17}$/;

   // Проверяем, что строка состоит ровно из 17 символов
   // и что в ней присутствуют хотя бы одна буква и хотя бы одна цифра
   if (!vinRegex.test(vin)) return false;

   // Проверяем, что в VIN есть хотя бы одна буква (без I, O, Q)
   const letterCheck = /[A-HJ-NPR-Za-hj-npr-z]/;
   const digitCheck = /\d/;

   return letterCheck.test(vin) && digitCheck.test(vin);
};

const errorMessage = computed(() => {
   if (!props.validationType) return '';
   if (isValid.value) return '';
   switch (props.validationType) {
      case 'number':
         return 'Введите число больше нуля';
      case 'email':
         return 'Введите корректный email';
      case 'url':
         return 'Введите корректный URL';
      case 'doors':
         return 'Введите количество дверей от 2 до 12';
      case 'vin':
         return 'Некорректный VIN';
      case 'licensePlate':
         return 'Некорректный номер';
      default:
         return 'Некорректное значение';
   }
});

const shouldShowError = computed(() => props.validationType && !isValid.value && hasInput.value);
const shouldShowSuccess = computed(() => props.validationType && isValid.value && hasInput.value);

watch(() => optionValue.value, (newValue) => {
   const trimmedValue = newValue.trim();
   hasInput.value = trimmedValue !== '';
   optionValue.value = trimmedValue;
   if (['vin', 'licensePlate'].includes(props.validationType)) {
      optionValue.value = trimmedValue.toUpperCase();
   }
   if (hasInput.value && props.validationType) {
      if (isValid.value) {
         emit('update:option', trimmedValue);
      } else {
         emit('update:option', null);
      }
   } else {
      emit('update:option', null);
   }
});

// Обрабатываем ввод
const handleInput = () => {
   isHighlighted.value = false;
   if (optionValue.value.trim() !== '') {
      hasInput.value = true;
      if (isValid.value) {
         emit('update:option', optionValue.value.trim());
      }
   }
};

const clearInput = () => {
   optionValue.value = '';
   hasInput.value = false;
   emit('update:option', null);
};
</script>

<style scoped lang="scss">
.simple-input {
   display: flex;
   align-items: flex-start;
   width: 100%;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__wrapper {
      position: relative;
      width: 100%;

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__block {
      width: 100%;
      max-width: 310px;

      @media (max-width: 768px) {
         max-width: 100%;
      }
   }

   &__field {
      font-size: 14px;
      padding: 8px 12px;
      padding-right: 28px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;

      &:focus {
         outline: none;
      }

      &:disabled {
         background-color: #f0f0f0;
         color: #a8a8a8;
      }

      &--error {
         border-color: #FF5959;
         color: #FF5959;
      }

      &--success {
         border-color: #3BBC71;
         color: #3BBC71;
      }

      &--highlighted {
         box-shadow: 0 0 16px rgba(#3366FF, 0.5);
         border-color: #ADD8E6;
      }
   }

   &__clear {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      width: 14px;
      height: 14px;

      &:hover {
         opacity: 0.7;
      }
   }

   &__error {
      color: #FF5959;
      font-size: 12px;
      margin-top: 4px;
   }

   &__success {
      color: #3BBC71;
      font-size: 12px;
      margin-top: 4px;
   }
}
</style>

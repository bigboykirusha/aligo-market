<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">{{ label }}</label>
      <div class="simple-input__block">
         <div class="simple-input__wrapper">
            <input type="text"
               :inputmode="props.validationType === 'number' || props.validationType === 'doors' ? 'numeric' : null"
               class="simple-input__field" :class="{
                  'simple-input__field--error': shouldShowError,
                  'simple-input__field--success': shouldShowSuccess,
                  'simple-input__field--highlighted': isHighlighted
               }" :placeholder="placeholder" v-model="displayValue" :disabled="disabled" @input="handleInput"
               @blur="handleBlur" @focus="handleFocus" @keypress="restrictNonNumericInput" />
            <img v-if="optionValue" src="../assets/icons/close-gray.svg" alt="Clear" class="simple-input__clear"
               @click="clearInput" />
         </div>
         <div v-if="hasInput && props.validationType && hasBlurred && isErrorDisplayed"
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
const hasBlurred = ref(false);  // Состояние для отслеживания, потерял ли инпут фокус
const isErrorDisplayed = ref(false);  // Состояние для отслеживания, была ли ошибка показана

// Функция для форматирования числа с разделением на разряды
const formatNumber = (value) => {
   const numValue = value.replace(/\D/g, '');
   return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const displayValue = computed({
   get() {
      if (props.validationType === 'number') {
         return formatNumber(optionValue.value);
      }
      return optionValue.value;
   },
   set(newValue) {
      if (props.validationType === 'number') {
         optionValue.value = newValue.replace(/\s/g, '');
      } else {
         optionValue.value = newValue;
      }
   }
});

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

// Функция валидации VIN
const validateVIN = (vin, isNorthAmerican = false) => {
   const vinRegex = /^[A-HJ-NPR-Za-hj-npr-z\d]{17}$/;

   if (!vinRegex.test(vin)) return false;

   if (/^([A-HJ-NPR-Za-hj-npr-z\d])\1*$/.test(vin)) return false;

   const transliterationTable = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
      S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
   };

   const weights = [8, 7, 6, 5, 4, 3, 2, 10, 1, 9, 8, 7, 6, 5, 4, 3, 2];

   const getTransliteratedValue = (char) => {
      if (!isNaN(char)) return parseInt(char);
      return transliterationTable[char.toUpperCase()] || 0;
   };

   const validateCheckDigit = () => {
      let sum = 0;
      for (let i = 0; i < vin.length; i++) {
         const char = vin[i];
         const value = getTransliteratedValue(char);
         const weight = weights[i];
         const weightedValue = value * weight;
         sum += weightedValue;
      }

      const remainder = sum % 11;
      const calculatedCheckDigit = remainder === 10 ? 'X' : remainder.toString();
      return vin[8].toUpperCase() === calculatedCheckDigit;
   };

   if (isNorthAmerican && !validateCheckDigit()) return false;

   return true;
};

const errorMessage = computed(() => {
   if (!props.validationType) return '';
   if (isValid.value) return '';
   switch (props.validationType) {
      case 'number':
         return 'Используйте только цифры для ввода';
      case 'email':
         return 'Проверьте адрес электронной почты';
      case 'url':
         return 'Проверьте правильность ввода URL';
      case 'doors':
         return 'Введите количество дверей от 2 до 12';
      case 'vin':
         return 'Проверьте правильность ввода VIN';
      case 'licensePlate':
         return 'Государственный номер может содержать только буквы (А, В, Е, К, М, Н, О, Р, С, Т, У, Х) и цифры (0-9) в определенном порядке, например Х123ХХ123.';
      default:
         return 'Некорректное значение';
   }
});

const shouldShowError = computed(() => props.validationType && !isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);
const shouldShowSuccess = computed(() => props.validationType && isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);

const restrictNonNumericInput = (event) => {
   if (['number', 'doors'].includes(props.validationType) && !/[0-9]/.test(event.key)) {
      event.preventDefault();
   }
};

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

const handleBlur = () => {
   hasBlurred.value = true;
   isErrorDisplayed.value = true; // Показываем ошибку после потери фокуса
   if (isValid.value) {
      emit('update:option', optionValue.value.trim());
   } else {
      emit('update:option', null);
   }
};

const handleFocus = () => {
   isErrorDisplayed.value = false; // Ошибка скрывается, если фокус на инпуте
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

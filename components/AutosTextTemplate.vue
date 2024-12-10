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
               }" :placeholder="placeholder" v-model="optionValue" :disabled="disabled" @input="handleInput" />
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

const isValid = computed(() => {
   return props.validationType ? validate(optionValue.value) : true;
});

const errorMessage = computed(() => {
   if (!props.validationType) return '';
   switch (props.validationType) {
      case 'number':
         return (isNaN(optionValue.value) || optionValue.value <= 0) ? 'Введите корректное значение' : '';
      case 'doors':
         const numberValue = Number(optionValue.value);
         return Number.isInteger(numberValue) && numberValue >= 4 && numberValue <= 12 ? '' : 'Введите корректное количество дверей (от 4 до 12)';
      case 'email':
         return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionValue.value) ? 'Введите корректный email' : '';
      case 'url':
         return !/^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)(\/[\w\d\-._~:/?#\[\]@!$&'()*+,;=]*)?$/.test(optionValue.value) ? 'Введите корректный URL' : '';
      case 'vin':
         return !/^[A-HJ-NPR-Z0-9]{17}$/.test(optionValue.value) ? 'Введите корректный VIN (17 символов, буквы и цифры)' : '';
      case 'licensePlate':
         return !/^[A-Z]{1}\d{3}[A-Z]{2}\d{2,3}$/.test(optionValue.value) ? 'Введите корректный госномер (например, A123BC77)' : '';
      default:
         return '';
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

const validate = (value) => {
   switch (props.validationType) {
      case 'number':
         return !isNaN(value) && value > 0;
      case 'email':
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
         return /^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)(\/[\w\d\-._~:/?#\[\]@!$&'()*+,;=]*)?$/.test(value);
      case 'doors':
         const numberValue = Number(value);
         return Number.isInteger(numberValue) && numberValue >= 4 && numberValue <= 12;
      case 'vin':
         return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
      case 'licensePlate':
         return /^[A-Z]{1}\d{3}[A-Z]{2}\d{2,3}$/.test(value);
      default:
         return true;
   }
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

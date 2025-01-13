<template>
   <div class="number-input">
      <label v-if="label" class="number-input__label">{{ label }}</label>
      <div class="number-input__block">
         <div class="number-input__wrapper">
            <input type="text" class="number-input__field" :class="{
               'number-input__field--error': shouldShowError,
               'number-input__field--success': shouldShowSuccess
            }" :placeholder="placeholder" v-model="optionValue" :disabled="disabled" @input="handleInput"
               @blur="handleBlur" @focus="handleFocus" maxlength="9" />
            <img v-if="hasInput" src="../assets/icons/close-gray.svg" alt="Clear" class="number-input__clear"
               @click="clearInput" />
         </div>
         <div v-if="hasInput && hasBlurred && isErrorDisplayed"
            :class="{ 'number-input__error': !isValid, 'number-input__success': isValid }">
            {{ isValid ? 'Госномер введён корректно' : errorMessage }}
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
   option: {
      type: String,
      default: '',
   },
   label: {
      type: String,
   },
   placeholder: {
      type: String,
      default: 'Введите госномер',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['update:option']);
const optionValue = ref(props.option ? props.option.trim() : '');
const hasInput = ref(false);
const hasBlurred = ref(false);
const isErrorDisplayed = ref(false);

const numberRegex = /^[АВЕКМНОРСТУХABEKMHOPCTYX]{1}\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/;

const isValid = computed(() => numberRegex.test(optionValue.value));

const errorMessage = computed(() => 'Госномер должен соответствовать формату: А 123 ВС 45');

const shouldShowError = computed(() => !isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);
const shouldShowSuccess = computed(() => isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);

const charMap = {
   'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'N', 'О': 'O', 'Р': 'P', 'С': 'C',
   'Т': 'T', 'У': 'Y', 'Х': 'X', 'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'N',
   'О': 'O', 'Р': 'P', 'С': 'C', 'Т': 'T', 'У': 'Y', 'Х': 'X',
   'а': 'a', 'в': 'b', 'е': 'e', 'к': 'k', 'м': 'm', 'н': 'n', 'о': 'o', 'р': 'p', 'с': 'c',
   'т': 't', 'у': 'y', 'х': 'x'
};

const convertToLatin = (str) => {
   return str.split('').map(char => charMap[char] || char).join('');
};

const handleInput = (event) => {
   const rawValue = event.target.value.toUpperCase().replace(/[^АВЕКМНОРСТУХABEKMHOPCTYX0-9]/g, '');
   optionValue.value = rawValue;
   hasInput.value = rawValue.trim() !== '';
};

const clearInput = () => {
   optionValue.value = '';
   hasInput.value = false;
   emit('update:option', null);
};

const handleBlur = () => {
   hasBlurred.value = true;
   isErrorDisplayed.value = true;
   if (isValid.value) {
      const latinValue = convertToLatin(optionValue.value.trim());
      emit('update:option', latinValue);
   } else {
      emit('update:option', null);
   }
};

const handleFocus = () => {
   isErrorDisplayed.value = false;
};
</script>

<style scoped lang="scss">
.number-input {
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
      display: flex;
      justify-content: space-between;

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
         box-shadow: 0px 0px 16px 1px #D1F5FF;
      }

      /* Добавляем стили для меньших букв */
      &::selection {
         font-size: 12px;
         /* Размер шрифта для букв */
      }

      &::after {
         font-size: 16px;
         /* Размер шрифта для цифр */
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

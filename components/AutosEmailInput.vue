<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">
         {{ label }}
         <span v-if="userStore.unconfirmed_email" class="simple-input__not-confirmed">
            <img :src="warningIcon" alt="Warning" class="simple-input__warning-icon" />
            Не подтвержден
         </span>
      </label>
      <div class="simple-input__block">
         <div class="simple-input__wrapper">
            <input type="email" class="simple-input__field" :class="{
               'simple-input__field--error': shouldShowError,
               'simple-input__field--success': shouldShowSuccess
            }" :placeholder="placeholder" v-model="optionValue" :disabled="isInputDisabled" @input="handleInput"
               @blur="handleBlur" @focus="handleFocus" />
            <img v-if="optionValue && showClearIcon" :src="closeIcon" alt="Clear" class="simple-input__clear"
               @click="clearInput" />
         </div>
         <div v-if="isErrorDisplayed" class="simple-input__message" :class="{
            'simple-input__error': !isValid,
            'simple-input__success': isValid
         }">
            {{ isValid ? confirmationMessage : errorMessage }}
         </div>
         <div v-else class="simple-input__message" :class="{
            'simple-input__info': true
         }">
            {{ confirmationMessage }}
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/user';
import closeIcon from '../assets/icons/close-gray.svg';
import warningIcon from '../assets/icons/alert-yellow.svg';

const userStore = useUserStore();

const shouldShowError = computed(() => props.validationType && !isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);
const shouldShowSuccess = computed(() => props.validationType && isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);

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
});

const optionValue = ref(userStore.unconfirmed_email || userStore.email || '');
const emit = defineEmits(['update:option']);
const hasInput = ref(!!optionValue.value);
const hasBlurred = ref(false);
const isErrorDisplayed = ref(false);

const isInputDisabled = computed(() => {
   return !userStore.unconfirmed_email && userStore.email;
});

const showClearIcon = computed(() => {
   return !isInputDisabled.value && optionValue.value.trim() !== '';
});

const isValid = computed(() => {
   switch (props.validationType) {
      case 'email':
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionValue.value);
      default:
         return true;
   }
});

const errorMessage = computed(() => {
   if (!props.validationType) return '';
   if (isValid.value) return '';
   switch (props.validationType) {
      case 'email':
         return 'Проверьте адрес электронной почты';
      default:
         return 'Некорректное значение';
   }
});

// Сообщение под инпутом
const confirmationMessage = computed(() => {
   if (userStore.email && !userStore.unconfirmed_email) {
      return 'На эту почту будут приходить важные оповещения о статусе объявлений.';
   }
   return 'Далее почту необходимо подтвердить, на нее будут приходить важные оповещения о статусе объявлений.';
});

const handleInput = () => {
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
};

const handleBlur = () => {
   hasBlurred.value = true;
   isErrorDisplayed.value = true;
};

const handleFocus = () => {
   isErrorDisplayed.value = false;
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
      display: flex;
      align-items: center;
      gap: 8px;
   }

   &__not-confirmed {
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #E8C917;
      gap: 8px;
   }

   &__wrapper {
      position: relative;
      display: flex;
      width: 100%;
   }

   &__block {
      width: 100%;
      display: flex;
      flex-direction: column;
      max-width: 310px;

      @media (max-width: 768px) {
         max-width: 100%;
      }
   }

   &__field {
      font-size: 14px;
      padding: 8px 12px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;

      &:focus {
         outline: none;
      }

      &:disabled {
         border: none;
         padding: 0;
         background-color: #FFFFFF;
         color: #323232;
      }

      &--error {
         border-color: #FF5959;
         color: #FF5959;
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

   &__message {
      font-size: 12px;
      margin-top: 4px;
   }

   &__error {
      color: #FF5959;
   }

   &__success {
      color: #787878;
   }

   &__info {
      color: #6c757d;
   }
}
</style>

<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">{{ label }}</label>
      <div class="simple-input__wrapper" :class="{ 'valid': isValidPhoneNumber }">
         <input type="text" class="simple-input__field" :placeholder="placeholder" v-model="displayValue"
            v-mask="'+7 (###) ###-##-##'" :disabled="disabled" />
         <div class="simple-input__subtext">
            Номер телефона будет виден только зарегистрированным пользователям. Эту защиту нельзя отключить.
         </div>
         <img v-if="displayValue" src="../assets/icons/close-gray.svg" alt="Clear" class="simple-input__clear"
            @click="clearInput" />
      </div>
   </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
   option: {
      type: String,
      default: '',
   },
   label: {
      type: String,
      default: '',
   },
   placeholder: {
      type: String,
      default: 'Введите текст',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['update:option']);
const displayValue = ref(props.option);

watch(displayValue, (newValue) => {
   const cleanValue = (newValue || '').replace(/\D/g, '');
   emit('update:option', cleanValue);
});

const isValidPhoneNumber = computed(() => {
   const cleanValue = (displayValue.value || '').replace(/\D/g, '');
   return cleanValue.length === 11;
});

const clearInput = () => {
   displayValue.value = '';
};
</script>

<style scoped lang="scss">
.simple-input {
   display: flex;
   flex-direction: row;
   align-items: flex-start;

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__subtext {
      font-size: 14px;
      color: #FFFFFF;
      padding-top: 8px;
      padding-bottom: 8px;
      margin-top: 5px;
   }

   &__wrapper {
      position: relative;
      padding: 16px;
      width: 340px;
      border-radius: 6px;
      background-color: #3366ff;

      @media screen and (max-width: 768px) {
         width: 100%;
      }

      &.valid {
         background-color: #3BBC71;

         .simple-input__field {
            border-color: #3BBC71;
         }
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
         border-color: #3366ff;
      }

      &:disabled {
         background-color: #f0f0f0;
         color: #a8a8a8;
      }
   }

   &__clear {
      position: absolute;
      top: 35px;
      right: 25px;
      transform: translateY(-50%);
      cursor: pointer;
      width: 14px;
      height: 14px;

      &:hover {
         opacity: 0.7;
      }
   }
}
</style>

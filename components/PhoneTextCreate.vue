<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">{{ label }}</label>
      <div class="simple-input__wrapper">
         <input disabled type="text" v-mask="'+7 (###) ###-##-##'" class="simple-input__field"
            :placeholder="placeholder" v-model="displayValue" :disabled="disabled" />
         <div class="simple-input__subtext">
            Чтобы ваши номера не попали в базы мошенников, мы показываем его только зарегистрированным и проверенным
            пользователям сервиса.
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { mask as vMask } from 'vue-the-mask'

defineOptions({
   directives: {
      mask: vMask
   }
})

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
   }

   &__wrapper {
      position: relative;
      padding: 16px;
      width: 340px;
      border-radius: 6px;
      background-color: #3366ff;

      @media (max-width: 768px) {
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
      font-weight: 700;
      border: none;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;

      &:focus {
         outline: none;
         border-color: #3366ff;
      }

      &:disabled {
         background-color: #3366ff;
         color: #FFFFFF;
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

<template>
   <div class="simple-textarea">
      <label v-if="label" class="simple-textarea__label">{{ label }}</label>
      <div class="simple-textarea__wrapper">
         <div class="simple-textarea__field-wrapper">
            <textarea class="simple-textarea__field" :placeholder="placeholder" v-model="optionValue"
               :disabled="disabled" :maxlength="maxLength"></textarea>
            <div class="simple-textarea__char-count">
               {{ remainingCharacters }}/{{ maxLength }}
            </div>
         </div>
         <div class="simple-textarea__subtext">
            Не указывайте в сообщении телефон и другие персональные данные — для этого есть отдельные поля.
         </div>
         <img v-if="optionValue && optionValue.length > 0" src="../assets/icons/close-gray.svg" alt="Clear"
            class="simple-textarea__clear" @click="clearInput" />
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
const maxLength = 3000;
const optionValue = ref(props.option || '');

watch(optionValue, (newValue) => {
   emit('update:option', newValue);
});

const remainingCharacters = computed(() => {
   return maxLength - (optionValue.value?.length || 0);
});

const clearInput = () => {
   optionValue.value = '';
};
</script>

<style scoped lang="scss">
.simple-textarea {
   display: flex;
   align-items: flex-start;

   @media screen and (max-width: 768px) {
      gap: 8px;
      flex-direction: column;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__wrapper {
      position: relative;
      max-width: 310px;

      @media screen and (max-width: 768px) {
         width: 100%;
         max-width: 100%;
      }
   }

   &__field-wrapper {
      position: relative;
   }

   &__field {
      font-size: 14px;
      padding: 8px 12px;
      padding-right: 60px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      resize: vertical;

      @media screen and (max-width: 768px) {
         height: 130px;
      }

      &:focus {
         outline: none;
         border-color: #3366ff;
      }

      &:disabled {
         background-color: #f0f0f0;
         color: #a8a8a8;
      }
   }

   &__char-count {
      position: absolute;
      bottom: 10px;
      right: 12px;
      font-size: 12px;
      color: #787878;
   }

   &__subtext {
      font-size: 12px;
      color: #787878;
      margin-top: 5px;
   }

   &__clear {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      width: 14px;
      height: 14px;

      &:hover {
         opacity: 0.7;
      }
   }
}
</style>

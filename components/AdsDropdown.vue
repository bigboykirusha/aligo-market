<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive }" ref="dropdown">
      <div class="dropdown-2__input" @click="toggleDropdown">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" v-model="selectedOptionLabel"
               :class="{ 'placeholder-text': !selectedOption, 'input-focused': isInputFocused }" readonly
               @focus="handleFocus" @blur="handleBlur" />
         </div>
      </div>
      <ul class="dropdown-2__list" :class="{ 'input-focused': isInputFocused }">
         <li v-for="option in options" :key="option.value" class="dropdown-2__list-item"
            :class="{ 'dropdown-2__list-item--active': option.label === selectedOptionLabel }"
            @click="selectOption(option)">
            {{ option.label }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const emit = defineEmits(['updateSort']);

const props = defineProps({
   options: {
      type: Array,
      default: () => [
         { label: 'Сначала свежие', value: 'desc' },
         { label: 'Сначала старые', value: 'asc' },
         { label: 'Опубликованные', value: '1' },
         { label: 'Неопубликованные', value: '0' },
      ],
   },
   placeholder: {
      type: String,
      default: '',
   },
   defaultValue: {
      type: [String, Number],
      default: null,
   },
});

const selectedOption = ref(null);
const selectedOptionLabel = ref(props.placeholder || props.options[0].label);
const isActive = ref(false);
const dropdown = ref(null);
const isInputFocused = ref(false);

const handleFocus = () => {
   isInputFocused.value = true;
};

const handleBlur = () => {
   isInputFocused.value = false;
};

const toggleDropdown = () => {
   isActive.value = !isActive.value;
};

const selectOption = (option) => {
   selectedOption.value = option.value;
   selectedOptionLabel.value = option.label;
   isActive.value = false;
   emit('updateSort', option.value);
};

const handleClickOutside = (event) => {
   if (dropdown.value && !dropdown.value.contains(event.target)) {
      isActive.value = false;
   }
};

onMounted(() => {
   if (props.defaultValue !== null) {
      const defaultOption = props.options.find(option => option.value === props.defaultValue);
      if (defaultOption) {
         selectedOption.value = defaultOption.value;
         selectedOptionLabel.value = defaultOption.label;
      }
   }
   document.addEventListener('click', handleClickOutside);
});

watch(() => props.defaultValue, (newValue) => {
   const defaultOption = props.options.find(option => option.value === newValue);
   if (defaultOption) {
      selectedOption.value = defaultOption.value;
      selectedOptionLabel.value = defaultOption.label;
   }
});

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.dropdown-2 {
   position: relative;
   width: fit-content;
   height: 34px;
   z-index: 49;

   @media (max-width: 480px) {
      width: 100%;
   }

   &__input {
      position: relative;
      height: 34px;
      z-index: 2;

      &:focus {
         outline: none;
      }

      &::before {
         pointer-events: none;
         position: absolute;
         right: 14px;
         top: 50%;
         z-index: 1;
         content: '';
         width: 11px;
         height: 11px;
         background: url('/assets/images/svg/arrow.svg') center center / contain no-repeat;
         transform: translate(0, -50%) rotate(90deg);
         transition: transform 0.2s ease;
      }

      input {
         cursor: pointer;
         font-size: 14px;
         height: 34px;
         width: 200px;
         padding: 12px;
         border: 1px solid #d6d6d6;
         border-radius: 6px;

         @media (max-width: 480px) {
            width: 100%;
         }

         &.input-focused {
            outline: none;
            border: 1px solid #3366FF;
         }
      }

      .placeholder-text {
         color: #323232;
      }
   }

   &__list {
      position: absolute;
      bottom: 0;
      border-top: none;
      z-index: 9;
      display: flex;
      flex-direction: column;
      transform-origin: top;
      transform: translate(0, 100%) scaleY(0);
      list-style: none;
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      transition: transform 0.2s ease;

      &.input-focused {
         border-color: #3366FF;
      }
   }

   &__list-item {
      display: block;
      padding: 12px;
      font-size: 14px;
      line-height: 18px;
      border-radius: 6px;
      color: #787878;
      background-color: white;
      cursor: pointer;
      transition: background-color 0.1s ease, color 0.1s ease;

      &:hover {
         background-color: #eef9ff;
         color: #323232;
      }

      &--active {
         color: #323232;
         background: #eef9ff;
      }

      &--hidden {
         display: none !important;
      }
   }

   &--active {

      .dropdown-2__input::before {
         transform: translate(0, -50%) rotate(-90deg);
      }

      .dropdown-2 {
         &__list {
            display: flex;
            border: 1px solid #3366FF;
            border-top: none;
            transform: translate(0, 100%) scaleY(1);
            border-radius: 0 0 6px 6px;
         }

         &__input input {
            border-radius: 6px 6px 0 0;
         }
      }
   }

   &--disabled .dropdown-2__input .input-text-2 input {
      pointer-events: none;
      background: #eeeeee;
      color: #a8a8a8;

      &::before {
         filter: grayscale(1) brightness(1.5);
      }
   }
}
</style>

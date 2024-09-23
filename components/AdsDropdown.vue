<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive }" ref="dropdown">
      <div class="dropdown-2__input" @click="toggleDropdown">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" v-model="selectedOptionLabel"
               :class="{ 'placeholder-text': !selectedOption }" readonly />
         </div>
      </div>
      <ul class="dropdown-2__list">
         <li v-for="option in options" :key="option.value" class="dropdown-2__list-item"
            :class="{ 'dropdown-2__list-item--active': option.label === selectedOptionLabel }"
            @click="selectOption(option)">
            {{ option.label }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

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
});

const selectedOption = ref(null);
const selectedOptionLabel = ref(props.placeholder || props.options[0].label);

const isActive = ref(false);
const dropdown = ref(null);

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
   document.addEventListener('click', handleClickOutside);
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

   @media (max-width: 480px) {
      width: 100%;
   }

   &__input {
      position: relative;
      height: 34px;

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
         transition: 0.3s;
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

         &:focus {
            outline: none;
         }
      }

      .placeholder-text {
         color: #a8a8a8;
      }
   }

   &__list {
      position: absolute;
      bottom: 0;
      border: 1px solid #d6d6d6;
      border-top: none;
      left: 1px;
      z-index: 11115;
      display: none;
      flex-direction: column;
      transform: translate(-1px, 100%);
      list-style: none;
      width: 100%;
      max-height: 187px;
      background: #ffffff;
      border-radius: 6px;
      overflow-y: auto;
   }

   &__list-item {
      display: block;
      padding: 12px;
      font-size: 14px;
      line-height: 1.29em;
      color: #787878;
      background: white;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
         background: #eef9ff;
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

<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive, 'dropdown-2--disabled': disabled }" ref="dropdown">
      <div v-if="props.label" class="dropdown-2__label">{{ label }}</div>
      <div class="dropdown-2__input" @click="toggleDropdown" :class="{ 'dropdown-2__input--disabled': disabled }">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" :value="selectedOptionsTitles.join(', ')"
               :placeholder="placeholder" readonly :disabled="disabled" />
         </div>
      </div>
      <ul class="dropdown-2__list" v-if="isActive">
         <li v-for="option in options" :key="option.id" class="dropdown-2__list-item">
            <input type="checkbox" :value="option.id" v-model="selectedOptions" />
            {{ option.title }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
   options: {
      type: Array,
      required: true
   },
   label: {
      type: String,
      default: ''
   },
   disabled: {
      type: Boolean,
      default: false
   },
   initialSelectedOptions: {
      type: Array,
      default: () => []
   },
   placeholder: {
      type: String,
      default: 'Нажмите'
   }
});

const emit = defineEmits(['updateSort']);
const selectedOptions = ref([...props.initialSelectedOptions]);
const isActive = ref(false);

const toggleDropdown = () => {
   if (!props.disabled) {
      isActive.value = !isActive.value;
   }
};

const selectedOptionsTitles = computed(() => {
   return props.options
      .filter(option => selectedOptions.value.includes(option.id))
      .map(option => option.title);
});

const handleClickOutside = (event) => {
   if (!props.disabled && !event.target.closest('.dropdown-2')) {
      isActive.value = false;
   }
};

onMounted(() => {
   document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside);
});

watch(selectedOptions, (newOptions) => {
   if (newOptions !== props.initialSelectedOptions) {
      emit('updateSort', newOptions);
   }
});
</script>

<style scoped lang="scss">
.dropdown-2 {
   position: relative;
   width: 100%;
   width: 260px;

   @media screen and (max-width: 1250px) {
      max-width: 100%;
      width: 100%;
   }

   &__label {
      font-size: 12px;
      color: #323232;
      margin-bottom: 5px;
   }

   &__input {
      position: relative;
      height: 34px;
      width: 100%;

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
         width: 100%;
         font-size: 14px;
         height: 34px;
         padding: 12px;
         border: 1px solid #d6d6d6;
         border-radius: 6px;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         padding-right: 36px;

         &:focus {
            outline: none;
         }
      }
   }

   .selected-options {
      font-size: 14px;
      color: #323232;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   .selected-option {
      margin-right: 4px;
      font-size: 14px;
      color: #323232;
   }

   &__list {
      position: absolute;
      bottom: 1px;
      border: 1px solid #3366FF;
      border-top: 1px solid #D6D6D6;
      left: 1px;
      z-index: 5;
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
      display: flex;
      align-items: center;
      padding: 12px;
      font-size: 14px;
      line-height: 1.29em;
      gap: 10px;
      color: #787878;
      background: white;
      transition: 0.3s;
      cursor: pointer;
      white-space: nowrap;
      /* Обрезка текста с многоточием */
      overflow: hidden;
      /* Обрезка текста */
      text-overflow: ellipsis;
      /* Многоточие */

      &:hover {
         background: #D6EFFF;
         color: #3366FF;
      }

      &--active {
         color: #3366FF;
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

      .dropdown-2__list {
         display: flex;
         border-radius: 0 0 6px 6px;
      }

      .dropdown-2__input input {
         border-radius: 6px 6px 0 0;
         border: 1px solid #3366FF;
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

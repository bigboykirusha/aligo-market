<template>
   <button class="base-button" :class="{ 'base-button--reversed': reversed }" @click="handleClick">
      <img v-if="icon" :src="icon" alt="button icon" class="base-button__icon" />
      <span class="base-button__text">{{ label }}</span>
   </button>
</template>

<script setup>
const emit = defineEmits(['click']);

defineProps({
   label: {
      type: String,
      required: true,
   },
   icon: {
      type: String,
      default: '',
   },
   reversed: {
      type: Boolean,
      default: false,
   },
});

const handleClick = () => {
   emit('click');
};
</script>

<style scoped lang="scss">
.base-button {
   display: inline-flex;
   align-items: center;
   padding: 8px 10px;
   background-color: #3366FF;
   color: #fff;
   font-size: 14px;
   border: none;
   border-radius: 6px;
   cursor: pointer;
   transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

   &:hover {
      background-color: #144DF8;
   }

   &__icon {
      width: 18px;
      height: 18px;
      margin-right: 16px;
   }

   &__text {
      white-space: nowrap;
   }

   &--reversed {
      background-color: #fff;
      color: #3366FF;
      border: 1px solid #3366FF;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

      &:hover {
         background-color: #EEEEEE;
      }
   }
}
</style>
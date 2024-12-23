<template>
   <button class="complain-button" @click="showComplaintPopup = true">
      <img class="complain-button__icon" src="../assets/icons/alert.svg" alt="Иконка" />
      <span class="complain-button__text">Пожаловаться на объявление</span>
   </button>
   <Complaint :isVisible="showComplaintPopup" :adsId="adsId" :mainCategoryId="1"
      @close="showComplaintPopup = false" :user_id="userId" />
</template>

<script setup>
import { ref } from 'vue';

defineProps({
   userId: {
      type: [String, Number],
      required: true,
   },
   adsId: {
      type: [String, Number],
      required: true,
   },
});

const showComplaintPopup = ref(false);
</script>

<style scoped lang="scss">
.complain-button {
   background-color: #d6efff;
   border-radius: 6px;
   margin-top: 8px;
   padding: 12px;
   height: 34px;
   display: flex;
   align-items: center;
   gap: 8px;
   border: none;
   cursor: pointer;

   &__icon {
      width: 16px;
      height: 16px;
   }

   &__text {
      color: #3366ff;
      font-size: 14px;
   }
}
</style>
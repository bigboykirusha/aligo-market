<template>
   <button class="complain-button" @click="openComplaintPopup">
      <img class="complain-button__icon" :src="alertIcon" alt="Иконка" />
      <span class="complain-button__text">Пожаловаться на объявление</span>
   </button>
</template>

<script setup>
import { useComplaintPopupStore } from '@/store/complaintPopupStore';
import alertIcon from "../assets/icons/alert.svg";

const props = defineProps({
   userId: {
      type: [String, Number],
      required: true,
   },
   adsId: {
      type: [String, Number],
      required: true,
   },
});

const complaintPopupStore = useComplaintPopupStore();

const openComplaintPopup = () => {
   complaintPopupStore.open(props.adsId, 1, props.userId);
};
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
   transition: background-color 0.2s ease;

   &:hover {
      background-color: #A4DCFF;
   }

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
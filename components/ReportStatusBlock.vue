<template>
   <div class="report-info-block">
      <div class="report-info-block__content">
         <img :src="statusImage" alt="Статус" class="report-info-block__image" />
         <p class="report-info-block__text">{{ title }}</p>
         <img :src="downIcon" alt="Статус" class="report-info-block__icon" />
      </div>
      <div class="report-info-block__title">{{ text }}</div>
   </div>
</template>

<script setup>
import { computed } from 'vue';
import doneIcon from '@/assets/icons/done-icon.svg';
import doneGrayIcon from '@/assets/icons/done-icon-gray.svg';
import alertIcon from '@/assets/icons/alert-icon.svg';
import downIcon from '@/assets/icons/down-wide.svg';

const props = defineProps({
   title: String,
   text: String,
   status: Number
});

const statusImage = computed(() => {
   switch (props.status) {
      case 1:
         return doneIcon;
      case 2:
         return doneGrayIcon;
      case 3:
         return alertIcon;
      default:
         return doneIcon;
   }
});
</script>

<style lang="scss" scoped>
.report-info-block {
   display: flex;
   flex-direction: column;
   gap: 4px;

   &__content {
      display: flex;
      cursor: pointer;
      align-items: center;
      gap: 8px;
   }

   &__image {
      height: 24px;
      width: 24px;
   }

   &__icon {
      height: 10px;
   }

   &__title {
      font-size: 14px;
      line-height: 18px;
      color: #323232;
   }

   &__text {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #3366FF;
   }
}
</style>
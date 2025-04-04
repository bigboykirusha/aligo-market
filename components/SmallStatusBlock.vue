<template>
   <div class="small-status-blocks-container">
      <div v-for="(param, index) in data" :key="index" class="small-status-block">
         <div class="small-status-block__content">
            <img :src="getStatusImage(param.status)" alt="Статус" class="small-status-block__image" />
            <p class="small-status-block__text">{{ param.title }}</p>
         </div>
         <div v-if="param.description" class="small-status-block__title">{{ param.description }}</div>
      </div>
   </div>
</template>

<script setup>
import doneIcon from '@/assets/icons/done-icon.svg';
import doneGrayIcon from '@/assets/icons/done-icon-gray.svg';
import alertIcon from '@/assets/icons/alert-icon.svg';
import starIcon from '@/assets/icons/star-icon.svg';

const props = defineProps({
   data: Array
});

const getStatusImage = (status) => {
   switch (status) {
      case 1:
         return doneIcon;
      case 2:
         return doneGrayIcon;
      case 3:
         return alertIcon;
      default:
         return starIcon;
   }
};
</script>

<style lang="scss" scoped>
.small-status-blocks-container {
   display: flex;
   flex-direction: column;
   gap: 16px;
   margin-top: 16px;
}

.small-status-block {
   display: flex;
   flex-direction: column;
   gap: 4px;

   &__content {
      display: flex;
      cursor: pointer;
      align-items: flex-start;
      gap: 8px;
   }

   &__image {
      height: 16px;
      width: 16px;
   }

   &__title {
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      padding-left: 24px;
      color: #323232;

      @media (max-width: 768px) {
         padding-left: 0;
      }
   }

   &__text {
      font-size: 14px;
      font-weight: 700;
      line-height: 18px;
      color: #323232;
   }
}
</style>
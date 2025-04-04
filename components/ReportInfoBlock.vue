<template>
   <div class="report-info-block">
      <div class="report-info-block__title">{{ title }}</div>
      <div class="report-info-block__content">
         <img v-if="image" :src="image" alt="" class="report-info-block__image" />
         <p class="report-info-block__text">{{ text }}</p>
      </div>
   </div>
</template>

<script setup>
defineProps({
   image: String,
   title: String,
   text: String
});
</script>

<style lang="scss" scoped>
.report-info-block {
   display: flex;
   flex-direction: column;
   gap: 8px;

   &__image {
      height: 16px;
   }

   &__content {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 8px;
   }

   &__title {
      display: flex;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      color: #323232
   }

   &__text {
      display: flex;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      color: #3366FF;

      &:hover {
         text-decoration: underline;
      }
   }
}
</style>

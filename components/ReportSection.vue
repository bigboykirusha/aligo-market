<template>
   <div class="report-section" :id="id">
      <h2 class="report-section__title">{{ title }}</h2>
      <p class="report-section__date">Обновлено {{ date }}</p>
      <p v-if="description" class="report-section__description">{{ description }}</p>
      <slot></slot>
   </div>
</template>

<script setup>
defineProps({
   id: String,
   title: String,
   date: String,
   description: String
});
</script>

<style lang="scss" scoped>
.report-section {
   display: flex;
   flex-direction: column;
   gap: 4px;
   border-bottom: 2px solid #EEEEEE;
   padding: 40px 0;

   @media (max-width: 768px) {
      padding: 32px 0;
   }

   &__title {
      margin: 0;
      color: #3366ff;
      font-size: 24px;
      line-height: 30px;
      font-weight: 700;
   }

   &__date {
      color: #323232;
      font-size: 14px;
      line-height: 18px;
   }

   &__description {
      color: #787878;
      font-size: 12px;
      line-height: 16px;
   }
}
</style>
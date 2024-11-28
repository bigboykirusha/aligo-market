<template>
   <div class="no-results">
      <p class="no-results__title">Ничего не найдено</p>
      <div class="no-results__content">
         <img src="../assets/icons/sad-smile.svg" alt="No Results" class="no-results__icon" />
         <p class="no-results__description">Установите более мягкие критерии поиска или выберите другой регион поиска
            объявлений</p>
      </div>
   </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.no-results {
   text-align: left;
   max-width: 460px;

   &__title {
      font-size: 24px;
      font-weight: bold;
      color: #323232;
      margin-bottom: 16px;
   }

   &__content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;
   }

   &__icon {
      width: 40px;
      height: 40px;
   }

   &__description {
      font-size: 16px;
      color: #323232;
   }
}
</style>
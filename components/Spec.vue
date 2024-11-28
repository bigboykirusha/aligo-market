<template>
   <div class="card">
      <p class="card__text">Узнайте полную историю автомобиля по государственным и прочим базам всего за 99 ₽</p>
      <button class="card__button">
         <img src="../assets/icons/spec.svg" alt="icon" class="card__button-icon" />
         <span class="card__button-text">Получить полный отчет</span>
      </button>
   </div>
</template>

<style scoped lang="scss">
.card {
   background-color: #eef9ff;
   border-radius: 8px;
   padding: 24px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 40px;
   row-gap: 16px;
   margin-top: 24px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }

   &__text {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #323232;
      flex: 1;
   }

   &__button {
      background-color: #3366ff;
      color: white;
      border: none;
      border-radius: 6px;
      height: 34px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 8px;
      cursor: pointer;

      &-icon {
         width: 16px;
         height: 16px;
      }

      &-text {
         font-size: 12px;
      }
   }
}
</style>
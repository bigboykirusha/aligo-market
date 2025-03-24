<template>
   <div class="card">
      <div class="card__section">
         <div class="card__info">
            <div class="card__row">
               <img src="../assets/icons/done-icon.svg" alt="icon" class="card__icon" />
               <span class="card__text card__text--small">2 владельца по ПТС соответствуют данным ГИБДД</span>
            </div>
            <div class="card__row">
               <img src="../assets/icons/alert-icon.svg" alt="icon" class="card__icon" />
               <span class="card__text card__text--small">Проверка на ДТП: тяжесть повреждений и стоимость
                  ремонта</span>
            </div>
         </div>
         <button class="card__example">Пример отчёта</button>
      </div>
      <div class="card__block">
         <p class="card__text">Узнайте историю автомобиля всего за 62 ₽</p>
         <button class="card__button">
            <img src="../assets/icons/spec.svg" alt="icon" class="card__button-icon" />
            <span class="card__button-text">Купить полный отчет</span>
         </button>
      </div>
   </div>
</template>

<style scoped lang="scss">
.card {
   background-color: #eef9ff;
   border-radius: 8px;
   padding: 16px 24px;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 16px;
   margin-top: 24px;
   position: relative;

   &__info {
      display: flex;
      flex-direction: column;
      gap: 8px;
   }

   &__row {
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 480px) {
         align-items: flex-start;
      }
   }

   &__icon {
      width: 16px;
      height: 16px;
   }

   &__text {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #323232;
      flex: 1;

      &--small {
         font-weight: 400;
      }
   }

   &__example {
      background-color: #eef9ff;
      color: #3366FF;
      border: none;
      font-size: 14px;
      cursor: pointer;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      @media (max-width: 768px) {
         flex-direction: column;
         align-items: flex-start;
         gap: 16px;
      }
   }

   &__section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
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
         font-size: 14px;
      }
   }
}
</style>
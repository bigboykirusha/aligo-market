<template>
   <div class="range-input-skeleton">
      <div class="range-input-skeleton__label"></div>
      <div class="range-input-skeleton__fields">
         <div class="range-input-skeleton__field"></div>
         <div class="range-input-skeleton__field"></div>
         <div class="range-input-skeleton__currency"></div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.range-input-skeleton {
   display: flex;
   flex-direction: column;
   gap: 5px;
   max-width: 260px;

   @media screen and (max-width: 1250px) {
      max-width: 100%;
   }

   &__label {
      height: 12px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 100px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &__fields {
      display: flex;
      gap: 10px;
      align-items: center;
   }

   &__field {
      flex: 1;
      height: 30px;
      background: #e0e0e0;
      border-radius: 6px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &__currency {
      width: 24px;
      height: 24px;
      background: #e0e0e0;
      border-radius: 50%;
      animation: pulse 1.5s infinite ease-in-out;
   }
}

@keyframes pulse {
   0% {
      background-color: #e0e0e0;
   }

   50% {
      background-color: #d6d6d6;
   }

   100% {
      background-color: #e0e0e0;
   }
}
</style>

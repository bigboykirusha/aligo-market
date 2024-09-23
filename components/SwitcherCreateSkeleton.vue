<template>
   <div class="switcher-skeleton">
      <div class="switcher-skeleton__label"></div>
      <div class="switcher-skeleton__items">
         <div v-for="n in 2" :key="n" class="switcher-skeleton__item"></div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.switcher-skeleton {
   display: flex;
   align-items: center;

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label {
      height: 14px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 70px;
      margin-right: 200px;

      animation: pulse 1.5s infinite ease-in-out;
   }

   &__items {
      display: flex;
      min-width: 260px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
   }

   &__item {
      flex: 1;
      height: 30px;
      margin: 2px;
      background: #e0e0e0;
      border-radius: 6px;
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

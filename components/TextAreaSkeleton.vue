<template>
   <div class="simple-textarea-skeleton">
      <div class="simple-textarea-skeleton__label"></div>
      <div class="simple-textarea-skeleton__wrapper">
         <div class="simple-textarea-skeleton__field"></div>
         <div class="simple-textarea-skeleton__clear"></div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.simple-textarea-skeleton {
   display: flex;
   flex-direction: column;
   width: 100%;
   gap: 5px;

   &__label,
   &__field,
   &__clear {
      background-color: #e0e0e0;
      border-radius: 4px;
      animation: pulse 1.5s infinite;
   }

   &__label {
      height: 14px;
      width: 30%;
   }

   &__wrapper {
      position: relative;
      width: 100%;
   }

   &__field {
      height: 100px;
      width: 100%;
   }

   &__clear {
      position: absolute;
      top: 10px;
      right: 10px;
      height: 14px;
      width: 14px;
   }

   @keyframes pulse {
      0% {
         opacity: 1;
      }

      50% {
         opacity: 0.5;
      }

      100% {
         opacity: 1;
      }
   }
}
</style>
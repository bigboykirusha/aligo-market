<template>
   <div class="car-details-skeleton">
      <div class="skeleton-block"></div>
   </div>
</template>

<style scoped lang="scss">
.car-details-skeleton {
   width: 100%;
   height: 470px;
   margin-bottom: 40px;

   .skeleton-block {
      background-color: #d6d6d6;
      border-radius: 6px;
      animation: pulse 1.5s infinite ease-in-out;
      width: 100%;
      height: 100%;
   }

   @media screen and (max-width: 768px) {
      height: 230px;
   }
}

@keyframes pulse {
   0% {
      background-color: #d6d6d6;
   }

   50% {
      background-color: #e0e0e0;
   }

   100% {
      background-color: #d6d6d6;
   }
}
</style>

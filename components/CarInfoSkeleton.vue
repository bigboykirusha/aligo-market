<template>
   <div class="car-details-skeleton">
      <div class="skeleton-block"></div>
   </div>
</template>

<style scoped lang="scss">
.car-details-skeleton {
   width: 100%;
   display: flex;
   min-width: 746px;
   height: 470px;
   margin-bottom: 40px;
   margin-left: auto;

   .skeleton-block {
      background-color: #d6d6d6;
      border-radius: 6px;
      animation: pulse 1.5s infinite ease-in-out;
      width: 100%;
      height: 100%;
   }

   @media (max-width: 768px) {
      height: 230px;
      min-width: 100%;
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

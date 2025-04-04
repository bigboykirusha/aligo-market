<template>
   <div class="car-details-skeleton">
      <div class="skeleton-block skeleton-title"></div>
      <div class="skeleton-block skeleton-price"></div>
      <div class="skeleton-block skeleton-write-button"></div>
      <div class="skeleton-block skeleton-location-title"></div>
      <div class="skeleton-block skeleton-map"></div>
   </div>
</template>

<style scoped lang="scss">
.car-details-skeleton {
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 16px;

   @media (max-width: 768px) {
      margin-top: 16px;
   }
}

.skeleton-block {
   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
   background-size: 200% 100%;
   animation: shimmer 1.5s infinite linear;
   border-radius: 6px;
}

.skeleton-title {
   height: 42px;
   width: 100%;

   @media (max-width: 768px) {
      height: 32px;
   }
}

.skeleton-price {
   height: 24px;
   width: 60%;
}

.skeleton-write-button {
   height: 350px;
   width: 100%;

   @media (max-width: 768px) {
      height: 105px;
   }
}

.skeleton-location-title {
   height: 24px;
   width: 60%;
}

.skeleton-map {
   width: 100%;
   height: 350px;

   @media (max-width: 768px) {
      height: 300px;
   }
}

@keyframes shimmer {
   0% {
      background-position: -200% 0;
   }

   100% {
      background-position: 200% 0;
   }
}
</style>

<template>
   <div class="car-details-skeleton">
      <div class="car-details-skeleton__content">
         <header class="car-details-skeleton__header">
            <div class="skeleton-block skeleton-title"></div>
            <div class="skeleton-block skeleton-price"></div>
         </header>
         <div class="car-details-skeleton__contact">
            <div class="car-details-skeleton__contact-buttons">
               <div class="skeleton-block skeleton-contact-button"></div>
               <div class="skeleton-block skeleton-write-button"></div>
            </div>
         </div>
         <div class="car-details-skeleton__location">
            <div class="skeleton-block skeleton-location-title"></div>
            <div class="skeleton-block skeleton-map"></div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.car-details-skeleton {
   width: 100%;

   @media (max-width: 1280px) {
      display: flex;
      max-width: 100%;
      column-gap: 52px;
   }

   @media (max-width: 768px) {
      flex-direction: column;
   }

   &__content {
      @media (max-width: 1280px) {
         width: 100%;
         margin-top: 32px;
      }

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__header {
      margin-bottom: 24px;
   }

   &__contact-buttons {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 768px) {
         flex-direction: row;
         gap: 16px;
      }
   }

   &__title,
   &__price {
      background: #e0e0e0;
      border-radius: 6px;
   }

   .skeleton-block {
      background-color: #d6d6d6;
      border-radius: 6px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   .skeleton-title {
      height: 32px;
      width: 100%;
      margin-bottom: 16px;
   }

   .skeleton-price {
      height: 24px;
      width: 60%;
      margin-bottom: 24px;
   }

   .skeleton-contact-button {
      height: 50px;
      width: 100%;
   }

   .skeleton-write-button {
      height: 50px;
      width: 100%;
   }

   .skeleton-user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
   }

   .skeleton-avatar {
      width: 64px;
      height: 64px;
      background-color: #3366ff;
   }

   .skeleton-name {
      width: 60%;
      height: 20px;
      margin-bottom: 8px;
   }

   .skeleton-rating {
      width: 80px;
      height: 18px;
      margin-bottom: 8px;

   }

   .skeleton-reviews {
      width: 40%;
      height: 16px;
   }

   .skeleton-location-title {
      height: 18px;
      width: 60%;
      margin-bottom: 8px;
   }

   .skeleton-map {
      width: 100%;
      height: 200px;
      margin-bottom: 8px;
   }

   .skeleton-map-toggle {
      height: 40px;
      width: 50%;
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

<template>
   <li class="notification-card-skeleton">
      <div class="notification-card-skeleton__type"></div>
      <div class="notification-card-skeleton__category"></div>
      <div class="notification-card-skeleton__status"></div>
   </li>
</template>

<style scoped lang="scss">
.notification-card-skeleton {
   position: relative;
   padding: 24px 40px;
   border-radius: 4px;
   font-size: 14px;
   color: #323232;
   background-color: #ffffff;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
   gap: 10px;

   @media screen and (max-width: 768px) {
      padding: 16px 24px;
   }

   .notification-card-skeleton__type,
   .notification-card-skeleton__category,
   .notification-card-skeleton__status,
   .notification-card-skeleton__date,
   .notification-card-skeleton__deleted-date {
      background: linear-gradient(90deg, #e0e0e0 25%, #d6d6d6 50%, #e0e0e0 75%);
      background-size: 200% 200%;
      animation: pulse 2s infinite linear;
      border-radius: 4px;
   }

   .notification-card-skeleton__type {
      height: 18px;
      width: 50%;
   }

   .notification-card-skeleton__category {
      height: 18px;
      width: 80%;
   }

   .notification-card-skeleton__status {
      height: 18px;
      width: 60%;
   }

   .notification-card-skeleton__date {
      height: 14px;
      width: 40%;
   }

   .notification-card-skeleton__deleted-date {
      height: 14px;
      width: 40%;
   }
}

@keyframes pulse {
   0% {
      background-position: 0% 0%;
   }

   50% {
      background-position: 100% 100%;
   }

   100% {
      background-position: 0% 0%;
   }
}
</style>

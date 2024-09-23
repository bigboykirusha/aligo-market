<template>
   <div class='card-skeleton'>
      <div class="card-skeleton__image"></div>
      <div class="card-skeleton__body">
         <div class="card-skeleton__wishlist-button"></div>
         <div class="card-skeleton__title"></div>
         <div class="card-skeleton__price"></div>
         <div class="card-skeleton__block"></div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
.card-skeleton {
   position: relative;
   display: flex;
   flex-direction: column;
   background: #f0f0f0;
   border-radius: 6px;
   min-width: 220px;
   overflow: hidden;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

   &__image,
   &__title,
   &__price,
   &__block {
      background: linear-gradient(90deg, #e0e0e0 25%, #d6d6d6 50%, #e0e0e0 75%);
      background-size: 200% 200%;
      border-radius: 6px;
      animation: pulse 2s infinite linear;
   }

   &__image {
      width: 100%;
      height: 220px;
      border-radius: 0;
   }

   &__body {
      padding: 14px 16px 16px;
   }

   &__wishlist-button {
      position: absolute;
      right: 16px;
      top: 208px;
      width: 32px;
      height: 32px;
      background: #e0e0e0;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      margin-bottom: 10px;
   }

   &__title {
      height: 18px;
      margin-bottom: 10px;
      margin-top: 10px;
      width: 70%;
   }

   &__price {
      height: 18px;
      margin-bottom: 10px;
      width: 40%;
   }

   &__block {
      height: 34px;
      width: 100%;
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

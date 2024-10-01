<template>
   <div class="skeleton-message">
      <div class="image-container">
         <div class="skeleton-ad-image"></div>
      </div>
      <div class="message-info">
         <div class="message-info__container">
            <div class="skeleton-avatar skeleton"></div>
            <div class="message-info__block">
               <div class="skeleton user-info"></div>
               <div class="skeleton ad-amount"></div>
            </div>
         </div>
         <div class="skeleton message-text"></div>
      </div>
   </div>
</template>

<style scoped>
.skeleton-message {
   display: flex;
   padding: 16px 24px;
   background: #fff;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-container {
   position: relative;
   height: 100%;
   margin-right: 15px;
}

.skeleton-avatar {
   width: 34px;
   height: 34px;
   border-radius: 50%;
   background-color: #e0e0e0;
   margin-bottom: 8px;
   animation: pulse 1.5s infinite;
}

.skeleton-ad-image {
   width: 70px;
   height: 70px;
   border-radius: 4px;
   background-color: #e0e0e0;
   animation: pulse 1.5s infinite;
}

.message-info {
   display: flex;
   flex-direction: column;
   gap: 3px;
   width: calc(100% - 70px);
}

.skeleton {
   background-color: #e0e0e0;
   height: 10px;
   margin-bottom: 4px;
   border-radius: 4px;
   animation: pulse 1.5s infinite;
}

.skeleton.user-info {
   width: 50%;
}

.skeleton.ad-amount {
   width: 30%;
}

.skeleton.message-text {
   width: 100%;
   height: 100%;
   animation: pulse 1.5s infinite;
}

@keyframes pulse {
   0% {
      background-color: #e0e0e0;
   }

   50% {
      background-color: #d0d0d0;
   }

   100% {
      background-color: #e0e0e0;
   }
}
</style>

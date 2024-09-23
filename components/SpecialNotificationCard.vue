<template>
   <div class="notification-box" :style="{ backgroundColor: bgColor, backgroundImage: `url(${bgImage})` }">
      <div class="notification-box__content">
         <h3 class="notification-box__title">{{ title }}</h3>
         <p class="notification-box__message">{{ message }}</p>
      </div>
      <button @click="onButtonClick" class="notification-box__button">{{ buttonText }}</button>
   </div>
</template>

<script setup>
const props = defineProps({
   title: {
      type: String,
      required: true,
   },
   message: {
      type: String,
      required: true,
   },
   bgColor: {
      type: String,
      default: '#ffffff',
   },
   bgImage: {
      type: String,
      required: true,
   },
   buttonText: {
      type: String,
      required: true,
   },
});

const emit = defineEmits(['button-click']);

const onButtonClick = () => {
   emit('button-click');
};
</script>

<style lang="scss" scoped>
.notification-box {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 24px 40px;
   border-radius: 6px;
   transition: background-color 0.3s ease;
   background-repeat: no-repeat;
   background-position: right;
   background-size: contain;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 24px;
      background-position: right bottom; 
      background-size: 120px auto;
   }
}

.notification-box__content {
   max-width: 70%;

   @media (max-width: 600px) {
      max-width: 100%;
   }
}

.notification-box__title {
   font-size: 20px;
   color: #323232;
   font-weight: 700;
   margin: 0;
   margin-bottom: 8px;
}

.notification-box__message {
   font-size: 14px;
   line-height: 18px;
}

.notification-box__button {
   padding: 8px 16px;
   background-color: #3366FF;
   font-size: 14px;
   color: white;
   border: none;
   border-radius: 6px;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.notification-box__button:hover {
   background-color: #144DF8;
}
</style>
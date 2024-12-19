<template>
   <div :class="['popup', { 'popup--active': props.isVisible }]" ref="popupRef">
      <div class="popup-item" v-for="item in items" :key="item.text" @click="handleAction(item.action)">
         <img :src="item.icon" alt="icon" class="popup-item__icon" />
         <span class="popup-item__text">{{ item.text }}</span>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
   isVisible: Boolean,
   items: {
      type: Array,
      required: true,
   },
});

const emit = defineEmits(['close']);

const popupRef = ref(null);

const handleClickOutside = (event) => {
   if (popupRef.value && !popupRef.value.contains(event.target)) {
      emit('close');
   }
};

const handleAction = (action) => {
   if (action) {
      action();
   }
   emit('close');
};

onMounted(() => {
   document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
   document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.popup {
   position: absolute;
   display: flex;
   flex-direction: column;
   gap: 24px;
   top: 0;
   right: 0;
   width: 250px;
   background: #ffffff;
   border: 1px solid #3366ff;
   padding: 24px;
   border-radius: 6px 12px 6px 6px;
   z-index: 10000;
   transform: scale(0);
   transform-origin: top right;
   transition: opacity 0.3s ease, transform 0.3s ease;

   &.popup--active {
      opacity: 1;
      transform: scale(1);
   }

   @media (max-width: 768px) {
      top: 100%;
      transform: scaleY(0);
      transform-origin: top;
      border: none;
      border-radius: 0;
      border-top: 1px solid #eeeeee;
      width: 100%;

      &.popup--active {
         transform: scaleY(1);
      }
   }
}

.popup-item {
   display: flex;
   align-items: center;
   gap: 10px;
   cursor: pointer;
}

.popup-item__icon {
   width: 14px;
   height: 14px;
}

.popup-item__text {
   font-size: 14px;
   color: #323232;
}

.popup-slide-enter-active,
.popup-slide-leave-active {
   transition: transform 0.3s ease, opacity 0.3s ease;
}

.popup-slide-enter-from {
   transform: translateY(-20px) scale(0.95);
   opacity: 0;
}

.popup-slide-enter-to {
   transform: translateY(0) scale(1);
   opacity: 1;
}

.popup-slide-leave-from {
   transform: translateY(0) scale(1);
   opacity: 1;
}

.popup-slide-leave-to {
   transform: translateY(-20px) scale(0.95);
   opacity: 0;
}
</style>

<template>
   <div class="overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
         <button class="popup-close-button" @click="closePopup">
            <img :src="closeIcon" alt="close icon" />
         </button>
         <p class="popup-text">{{ title }}</p>
         <div class="popup-buttons">
            <button class="popup-button" @click="handleSave">Сохранить</button>
            <button class="popup-button popup-button--cancel" @click="handleDiscard">Не сохранять</button>
         </div>
      </div>
   </div>
</template>

<script setup>
import closeIcon from '../assets/icons/close.svg';

const props = defineProps({
   title: {
      type: String,
      default: 'Не хотите ли сохранить объявление?'
   },
   isVisible: {
      type: Boolean,
      default: false
   }
});

const emit = defineEmits(['close', 'save', 'discard']);

const handleSave = () => {
   emit('save');
};

const handleDiscard = () => {
   emit('discard');
};

const closePopup = () => {
   emit('close');
};
</script>

<style scoped>
.overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(3px);
   z-index: 3000000;
}

.popup-content {
   background: #fff;
   border-radius: 8px;
   padding: 32px;
   position: relative;
   max-width: 370px;
   width: 100%;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
   animation: slide-up 0.3s ease-out;
}

.popup-close-button {
   position: absolute;
   display: flex;
   align-items: center;
   justify-content: center;
   top: 8px;
   right: 8px;
   width: 16px;
   height: 16px;
   background: none;
   border: none;
   border-radius: 50%;
   cursor: pointer;
   font-size: 16px;
   font-weight: bold;
   color: #333;
   transition: background-color 0.2s ease;

   img {
      height: 16px;
   }
}

.popup-text {
   font-size: 20px;
   line-height: 24px;
   font-weight: 700;
   color: #323232;
   margin-bottom: 24px;
}

.popup-buttons {
   display: flex;
   justify-content: space-between;
   gap: 24px;
}

.popup-button {
   padding: 8px 16px;
   border: none;
   width: 100%;
   border-radius: 6px;
   cursor: pointer;
   font-size: 14px;
   transition: all 0.2s ease-in;
   color: white;
   background-color: #3366ff;
}

.popup-button:hover {
   background-color: #274bcc;
}

.popup-button--cancel {
   background-color: #d6efff !important;
   color: #3366ff;
   transition: all 0.2s ease-in;
}

.popup-button--cancel:hover {
   background-color: #A4DCFF !important;
}
</style>

<template>
   <div class="popup-overlay" @click.self="emitClose">
      <div class="popup-content" :style="{ top: top + 'px', left: left + 'px' }">
         <ul class="action-list">
            <li v-for="action in actions" :key="action.label" @click="handleAction(action)">
               <img :src="action.icon" alt="Иконка" class="popup-icon" />
               {{ action.label }}
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import deleteIcon from '../assets/icons/delete.svg';
import addIcon from '../assets/icons/adddoc.svg';
import blockIcon from '../assets/icons/block.svg';

const props = defineProps(['userData', 'top', 'left']);
const emit = defineEmits(['close']);

const actions = [
   { label: 'Опубликовать от имени', icon: addIcon },
   { label: 'Удалить профиль', icon: deleteIcon },
   { label: 'Заблокировать', icon: blockIcon },
];

const handleAction = (action) => {
   console.log(`Выполнено действие: ${action.label} для пользователя ${props.userData.username}`);
};

const emitClose = () => {
   emit('close');
};
</script>

<style scoped>
.popup-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: flex-start;
   align-items: flex-start;
   z-index: 1000;
}

.popup-content {
   background: #fff;
   padding: 16px;
   border-radius: 6px;
   border: 1px solid #3366FF;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
   width: 250px;
   position: absolute;
}

.popup-icon {
   height: 16px;
   margin-right: 8px;
}

.action-list {
   list-style-type: none;
   display: flex;
   flex-direction: column;
   gap: 24px;
   padding: 0;
   margin: 0;
}

.action-list li {
   cursor: pointer;
   display: flex;
   align-items: center;
   font-size: 14px;
   color: #323232;
}
</style>

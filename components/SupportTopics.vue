<template>
   <div class="support-chat">
      <!-- Приветственное сообщение -->
      <div v-if="!selectedTopic" class="welcome-message">
         <div class="avatar">
            <img src="@/assets/icons/supp.svg" alt="Support Avatar" />
         </div>
         <div class="text-block">
            <p>Здравствуйте!</p>
            <span>Вас приветствует служба поддержки Aligo.</span>
            <span>Выберите тему обращения, чтобы начать диалог:</span>
         </div>
      </div>

      <!-- Кнопки с темами обращения -->
      <div v-if="!selectedTopic" class="topics">
         <button v-for="topic in topics" :key="topic.id" class="topic-button" @click="selectTopic(topic)">
            {{ topic.title }}
         </button>
      </div>

      <!-- Отображение выбранной темы -->
      <div v-if="selectedTopic" class="selected-topic">
         <span>{{ selectedTopic.title }}</span>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTechSupportThemes } from '@/services/apiClient'; // Импортируйте функцию для получения тем

// Объявление переменных
const topics = ref([]);
const selectedTopic = ref(null); // Для хранения выбранной темы

// Получаем темы при монтировании компонента
onMounted(async () => {
   try {
      const response = await getTechSupportThemes(); // Получаем данные через API
      if (response.success) {
         topics.value = response.data; // Присваиваем полученные темы в переменную
      }
   } catch (error) {
      console.error('Ошибка при получении тем:', error);
   }
});

// Функция для обработки выбора темы и эмита события
const selectTopic = (topic) => {
   console.log('Выбрана тема:', topic.title);
   selectedTopic.value = topic; // Сохраняем выбранную тему
};
</script>

<style lang="scss" scoped>
.support-chat {
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   max-width: 500px;
}

.welcome-message {
   display: flex;
   align-items: flex-start;
   gap: 16px;
   width: 100%;
   margin-bottom: 12px;
   background: white;
   border-radius: 12px;
}

.avatar {
   display: flex;
   align-items: center;
   justify-content: center;
   max-width: 32px;
   max-height: 32px;
   border-radius: 50%;
   background-color: #3366ff;
   overflow: hidden;
   flex-shrink: 0;
}

.avatar img {
   width: 100%;
   height: auto;
}

.text-block {
   display: flex;
   flex-direction: column;
   gap: 6px;
   color: #323232;
   background-color: #D6EFFF;
   font-size: 14px;
   padding: 12px 16px;
   border-radius: 16px;
}

.text-block p {
   margin: 0;
   font-size: 14px;
   font-weight: bold;
   color: #323232;
}

.text-block span {
   font-size: 14px;
   color: #323232;
}

.topics {
   display: flex;
   flex-wrap: wrap;
   gap: 12px;
   justify-content: center;
   width: 100%;
   padding: 0 48px;
   justify-content: flex-start;
}

.topic-button {
   background-color: #dceeff;
   border: none;
   border-radius: 8px;
   padding: 8px 16px;
   font-size: 14px;
   color: #3366ff;
   cursor: pointer;
   transition: background-color 0.3s ease;
   white-space: nowrap;
}

.topic-button:hover {
   background-color: #b5d7ff;
}

.selected-topic {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}

.selected-topic span {
   font-size: 16px;
   font-weight: bold;
   color: #323232;
}
</style>

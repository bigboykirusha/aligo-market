<template>
   <div class="support-chat">
      <!-- Приветственное сообщение -->
      <div class="welcome-message">
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
      <div class="topics">
         <button v-for="topic in topics" :key="topic.id" class="topic-button" @click="selectTopic(topic)">
            {{ topic.title }}
         </button>
      </div>
   </div>
</template>

<script setup>
const topics = [
   { id: 1, title: "Безопасность и нарушения" },
   { id: 2, title: "Профиль и отзывы" },
   { id: 3, title: "Сообщить о мошенничестве" },
   { id: 4, title: "Вход и регистрация" },
   { id: 5, title: "Объявления" },
];

const selectTopic = (topic) => {
   console.log("Выбрана тема:", topic.title);
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
   /* Синий фон аватарки */
   overflow: hidden;
   /* Если иконка больше, обрезаем */
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
   /* Цвет кнопки */
   border: none;
   border-radius: 8px;
   padding: 8px 16px;
   font-size: 14px;
   color: #3366ff;
   /* Синий текст */
   cursor: pointer;
   transition: background-color 0.3s ease;
   white-space: nowrap;
}

.topic-button:hover {
   background-color: #b5d7ff;
   /* Цвет кнопки при наведении */
}
</style>

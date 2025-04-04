<template>
   <div v-if="isVisible" class="search-card">
      <div class="search-card__content">
         <div class="search-card__header">
            <div class="search-card__title">
               <a :href="url" target="_blank">{{ `${title} в г. ${city}` }}</a>
            </div>
            <p class="search-card__description">Автомобили</p>
         </div>
         <div class="search-card__info">
            <div class="search-card__notifications">
               <div class="search-card__email-switcher-wrapper">
                  <div :class="['search-card__email-switcher', { active: isEmail }]" @click="toggleEmail"></div>
                  <span class="search-card__switch-label">Уведомлять по e-mail</span>
               </div>

               <div class="search-card__telegram-switcher-wrapper">
                  <div :class="['search-card__telegram-switcher', { active: isTelegram }]" @click="toggleTelegram">
                  </div>
                  <span class="search-card__switch-label">Уведомлять в Telegram</span>
               </div>
            </div>
            <button class="search-card__delete-btn" @click="deleteCard">
               <img :src="deleteIcon" alt="Delete" />
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import { deleteFilters } from '~/services/apiClient';
import deleteIcon from '@/assets/icons/delete.svg';

const props = defineProps({
   title: String,
   id: Number,
   url: String,
   city: String,
   isEmail: {
      type: Number,
      default: 0,
   },
   isTelegram: {
      type: Number,
      default: 0,
   },
   createdAt: String
});

const isVisible = ref(true);

const isEmail = ref(props.isEmail === 1);
const isTelegram = ref(props.isTelegram === 1);

const toggleEmail = () => {
   isEmail.value = !isEmail.value;
};

const toggleTelegram = () => {
   isTelegram.value = !isTelegram.value;
};

const deleteCard = () => {
   deleteFilters([{
      "id": props.id,
      "main_category_id": 12,
   }]);

   isVisible.value = false;
};
</script>

<style scoped lang="scss">
.search-card {
   padding: 24px;
   border-radius: 6px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   background: #FFF;
   display: flex;
   flex-direction: column;
   gap: 8px;

   @media (max-width: 480px) {
      padding: 16px;
   }

   &__title {
      font-size: 14px;
      font-weight: bold;
      line-height: 16px;
      color: #3366FF;

      a {
         text-decoration: none;
         color: inherit;
      }
   }

   &__content {
      display: flex;
      gap: 12px;

      @media (max-width: 480px) {
         flex-direction: column;
      }
   }

   &__header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-right: auto;
   }

   &__description {
      font-size: 14px;
      color: #323232;
   }

   &__info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 12px;
      gap: 40px;
      color: #323232;

      @media (max-width: 480px) {
         align-items: flex-end;
      }
   }

   &__notifications {
      display: flex;
      flex-direction: column;
      gap: 8px;
   }

   &__email-switcher-wrapper,
   &__telegram-switcher-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
   }

   &__switch-label {
      font-size: 12px;
      color: #333;
   }

   &__email-switcher,
   &__telegram-switcher {
      width: 32px;
      height: 16px;
      background-color: #ddd;
      border-radius: 32px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.3s ease;
   }

   &__email-switcher.active {
      background-color: #3366FF;
   }

   &__telegram-switcher.active {
      background-color: #3366FF;
   }

   &__email-switcher::before,
   &__telegram-switcher::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: white;
      transition: left 0.3s ease;
   }

   &__email-switcher.active::before {
      left: 18px;
   }

   &__telegram-switcher.active::before {
      left: 18px;
   }

   &__delete-btn {
      background: #D6EFFF;
      height: 34px;
      border-radius: 4px;
      width: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
         background: #A4DCFF;
      }

      img {
         width: 14px;
      }
   }
}
</style>
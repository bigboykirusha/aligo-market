<template>
   <div class="card">
      <div class="card__body">
         <div class="card__title">
            {{ brand }} {{ model }}, {{ year }}
         </div>
         <div class="card__block">
            <div class="card__win">
               <span>Вин: </span>
               <span class="card__win-value">{{ vin }}</span>
            </div>
         </div>
         <div class="card__info">
            <div class="card__date">
               {{ timeAgo }}
            </div>
            <div class="card__buttons">
               <button class="button" @click="updateReport">Обновить отчет</button>
               <button class="button" @click="viewResponseHistory">История ответов</button>
            </div>
         </div>
      </div>
      <div class="card__details">
         <nuxt-link :to="`/car/${url}`" class="button details-button">
            Подробнее
         </nuxt-link>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { useUserStore } from '~/store/user';
import { useChatStore } from '~/store/chatStore';

const props = defineProps({
   id: Number,
   vin: String,
   brand: String,
   model: String,
   year: String,
   created_at: String,
});

const router = useRouter();
const userStore = useUserStore();
const currentChatStore = useChatStore();

const timeAgo = computed(() => calculateTimeAgo(props.created_at));

const calculateTimeAgo = (dateString) => {
   const timeUnits = {
      seconds: ['секунда', 'секунды', 'секунд'],
      minutes: ['минута', 'минуты', 'минут'],
      hours: ['час', 'часа', 'часов'],
      days: ['день', 'дня', 'дней'],
   };

   const getDeclension = (number, unit) => {
      if (number % 10 === 1 && number % 100 !== 11) return unit[0];
      if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return unit[1];
      return unit[2];
   };

   const diff = new Date() - new Date(dateString);
   const units = [1000, 60, 60, 24];
   let time = diff;
   let unitIndex = 0;

   for (let i = 0; i < units.length; i++) {
      time = Math.floor(time / units[i]);
      if (time >= 1) {
         unitIndex = i;
      } else {
         break;
      }
   }

   const unitNames = Object.keys(timeUnits);
   const unit = unitNames[unitIndex];
   const value = time;

   return `${value} ${getDeclension(value, timeUnits[unit])} назад`;
};

const url = computed(() => {
   return [props.brand?.toLowerCase(), props.model?.toLowerCase(), props.year?.toLowerCase(), props.id]
      .filter(Boolean)
      .join('-');
});

const updateReport = () => {
   // Логика обновления отчета
   console.log('Обновить отчет');
};

const viewResponseHistory = () => {
   // Логика просмотра истории ответов
   console.log('История ответов');
};
</script>

<style scoped lang="scss">
.card {
   display: flex;
   flex-direction: column;
   background: #ffffff;
   border-radius: 6px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   padding: 16px;
   transition: transform 0.3s, box-shadow 0.3s;

   &__title {
      font-weight: bold;
      font-size: 16px;
      color: #3366ff;
      text-decoration: none;
      margin-bottom: 8px;
   }

   &__win {
      font-size: 14px;
      margin-bottom: 12px;

      &-value {
         font-weight: 700;
         color: #323232;
      }
   }

   &__block {
      margin-bottom: 8px;
   }

   &__info {
      font-size: 12px;
      color: #787878;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   &__date {
      display: inline-block;
      color: #787878;
      font-size: 12px;
   }

   &__buttons {
      display: flex;
      gap: 12px;

      .button {
         border: none;
         padding: 6px 12px;
         background-color: #3366ff;
         color: white;
         border-radius: 6px;
         cursor: pointer;
         font-size: 12px;
         transition: background-color 0.3s;

         &:hover {
            background-color: #254e92;
         }
      }
   }

   &__details {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
   }

   .details-button {
      border: none;
      padding: 6px 12px;
      background-color: #f0f0f0;
      color: #3366ff;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: background-color 0.3s;

      &:hover {
         background-color: #e0e0e0;
      }
   }
}
</style>

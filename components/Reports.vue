<template>
   <div class="notifications">
      <div class="notifications__header">
         <div class="notifications__title">Проверка авто</div>
         <div class="notifications__search">
            <img :src="searchIcon" alt="Поиск" class="search-icon" />
            <input type="text" placeholder="Поиск по авто" class="search-input" />
         </div>
      </div>

      <div class="notifications__actions">
         <p class="notifications__actions-text">
            Узнайте полную информацию об автомобиле перед покупкой
         </p>
         <div class="notifications__actions-form">
            <input type="text" placeholder="Введите VIN номер" class="actions-input" />
            <button class="actions-button"><img :src="specIcon" alt="">Проверить</button>
         </div>
      </div>
      <!-- Плейсхолдер для пустого списка -->
      <div class="notifications__placeholder">
         <svg height="64" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M2.76802 4.72385C2.76802 4.20513 2.97408 3.70766 3.34087 3.34087C3.70766 2.97408 4.20513 2.76802 4.72385 2.76802H5.61286C6.12929 2.76772 6.62464 2.56319 6.99083 2.19905L7.61314 1.57674C7.7949 1.39396 8.01099 1.24891 8.249 1.14993C8.48701 1.05095 8.74223 1 9 1C9.25777 1 9.51299 1.05095 9.751 1.14993C9.98901 1.24891 10.2051 1.39396 10.3869 1.57674L11.0092 2.19905C11.3754 2.56355 11.8715 2.76802 12.3871 2.76802H13.2762C13.7949 2.76802 14.2923 2.97408 14.6591 3.34087C15.0259 3.70766 15.232 4.20513 15.232 4.72385V5.61286C15.232 6.12849 15.4365 6.62456 15.8009 6.99083L16.4233 7.61314C16.606 7.7949 16.7511 8.01099 16.8501 8.249C16.949 8.48701 17 8.74223 17 9C17 9.25777 16.949 9.51299 16.8501 9.751C16.7511 9.98901 16.606 10.2051 16.4233 10.3869L15.8009 11.0092C15.4368 11.3754 15.2323 11.8707 15.232 12.3871V13.2762C15.232 13.7949 15.0259 14.2923 14.6591 14.6591C14.2923 15.0259 13.7949 15.232 13.2762 15.232H12.3871C11.8707 15.2323 11.3754 15.4368 11.0092 15.8009L10.3869 16.4233C10.2051 16.606 9.98901 16.7511 9.751 16.8501C9.51299 16.949 9.25777 17 9 17C8.74223 17 8.48701 16.949 8.249 16.8501C8.01099 16.7511 7.7949 16.606 7.61314 16.4233L6.99083 15.8009C6.62464 15.4368 6.12929 15.2323 5.61286 15.232H4.72385C4.20513 15.232 3.70766 15.0259 3.34087 14.6591C2.97408 14.2923 2.76802 13.7949 2.76802 13.2762V12.3871C2.76772 11.8707 2.56319 11.3754 2.19905 11.0092L1.57674 10.3869C1.39396 10.2051 1.24891 9.98901 1.14993 9.751C1.05095 9.51299 1 9.25777 1 9C1 8.74223 1.05095 8.48701 1.14993 8.249C1.24891 8.01099 1.39396 7.7949 1.57674 7.61314L2.19905 6.99083C2.56319 6.62464 2.76772 6.12929 2.76802 5.61286V4.72385Z"
               stroke="#D6D6D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.32422 8.99113L8.10224 10.7692L11.6583 7.2131" stroke="#D6D6D6" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round" />
         </svg>

         <p class="notifications__placeholder-text">Отчётов пока нет</p>
         <p class="notifications__placeholder-description">
            Здесь будут собираться купленые на Aligo отчёты
         </p>
      </div>
   </div>
</template>

<script setup>
import searchIcon from '../assets/icons/search-blue.svg';
import specIcon from '../assets/icons/spec-check-icon-w.svg';
import { fetchUserReports } from '@/services/apiClient';

const reports = ref([]);
const loading = ref(true);

onMounted(async () => {
   try {
      const data = await fetchUserReports();
      reports.value = data;
   } catch (err) {
      console.error('Ошибка при загрузке отчетов', err);
   } finally {
      loading.value = false;
   }
});
</script>

<style scoped lang="scss">
.notifications {
   width: 100%;
   margin-bottom: 40px;

   &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      @media (max-width: 480px) {
         flex-direction: column;
         gap: 8px;
         align-items: flex-start;
      }
   }

   &__title {
      color: #3366ff;
      font-size: 20px;
      font-weight: 700;
      white-space: nowrap;
      margin-right: 40px;

      @media (max-width: 768px) {
         margin-right: 16px;
      }
   }

   &__search {
      position: relative;
      width: 100%;
   }

   .search-input {
      width: 100%;
      height: 34px;
      padding: 0 40px;
      display: flex;
      justify-content: center;
      border: 1px solid #D6D6D6;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
   }

   .search-icon {
      position: absolute;
      top: 10px;
      left: 12px;
      width: 16px;
      height: 16px;
   }

   &__actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #d6efff;
      border-radius: 8px;
      padding: 16px 24px;

      @media (max-width: 1024px) {
         gap: 16px;
         padding: 16px;
         flex-direction: column;
         align-items: flex-start;
      }

      &-text {
         font-size: 16px;
         font-weight: 700;
         max-width: 350px;
         color: #323232;

         @media (max-width: 1024px) {
            max-width: 100%;
         }
      }

      &-form {
         display: flex;

         @media (max-width: 480px) {
            width: 100%;
         }
      }

      .actions-input {
         padding: 8px 12px;
         border: 1px solid #D6D6D6;
         border-radius: 4px 0 0 4px;
         height: 34px;
         min-width: 200px;
         font-size: 14px;
         outline: none;

         @media (max-width: 480px) {
            width: 100%;
         }
      }

      .actions-button {
         background-color: #3366ff;
         color: white;
         display: flex;
         align-items: center;
         font-size: 14px;
         height: 34px;
         padding: 12px;
         border-radius: 0 4px 4px 0;
         border: none;
         transition: background-color 0.2s ease;
         cursor: pointer;

         &:hover {
            background-color: #144DF8;
         }

         img {
            margin-right: 8px;
         }
      }
   }

   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 450px;
      width: 320px;
      margin: 0 auto;
      color: #636363;
   }

   &__placeholder-text {
      font-size: 14px;
      font-weight: 700;
      color: #323232;
   }

   &__placeholder-description {
      font-size: 14px;
      color: #323232;
   }
}

.search-input,
.actions-input {
   &:focus {
      border-color: #3366ff;
   }
}
</style>
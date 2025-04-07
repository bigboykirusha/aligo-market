<template>
   <div v-if="hasShortReportData" class="card">
      <div class="card__section">
         <div class="card__info">
            <div class="card__row">
               <img :src="getIcon(shortReport.info_count_owners)" alt="icon" class="card__icon" />
               <span class="card__text card__text--small">
                  {{ shortReport.info_count_owners.title }}
               </span>
            </div>
            <div class="card__row">
               <img :src="getIcon(shortReport.info_accident)" alt="icon" class="card__icon" />
               <span class="card__text card__text--small">
                  {{ shortReport.info_accident.title }}
               </span>
            </div>
         </div>
         <NuxtLink :to="`/report`" class="card__example" target="_blank" rel="noopener noreferrer">
            Пример отчёта
         </NuxtLink>
      </div>
      <div class="card__block">
         <p class="card__text">{{ shortReport.info_count_owners.description ? shortReport.info_count_owners.description
            : `Узнайте историю автомобиля всего
            за 62 ₽` }}</p>
         <button v-show="!shortReport.info_count_owners.description" class="card__button" @click="openPopupHandler">
            <img src="../assets/icons/spec.svg" alt="icon" class="card__button-icon" />
            <span class="card__button-text">Купить полный отчет</span>
         </button>
      </div>
      <NuxtLink :to="`/report`" class="card__example--mobile" target="_blank" rel="noopener noreferrer">
         Пример отчёта
      </NuxtLink>
   </div>
</template>

<script setup>
import { usePayPopupStore } from '@/store/payPopupStore';
import { useLoginModalStore } from '~/store/loginModal';
import { requireReport } from '~/services/apiClient';
import { useUserStore } from '~/store/user';
import doneIcon from '../assets/icons/done-icon.svg';
import alertIcon from '../assets/icons/alert-icon.svg';
import doneIconGray from '../assets/icons/done-icon-gray.svg';

const props = defineProps({
   brand: String,
   model: String,
   year: String,
   id: Number,
   shortReport: Object,
});

const payPopupStore = usePayPopupStore();
const userStore = useUserStore();
const loginModalStore = useLoginModalStore();

const hasShortReportData = computed(() => {
   if (!props.shortReport) return false;

   const { info_count_owners, info_accident } = props.shortReport;
   return (
      info_count_owners?.title ||
      info_count_owners?.description ||
      info_accident?.title
   );
});

const openPopupHandler = () => {
   if (userStore.isLoggedIn) {
      const newLabel = `${props.brand} ${props.model}, ${props.year}`;
      requireReport(props.id);
      payPopupStore.openPopup(newLabel);
   } else {
      loginModalStore.openLoginModal();
   }
};

const getIcon = (info) => {
   if (info.title.includes("Нет данных")) {
      return doneIconGray;
   }
   return info.color_baige === "green" ? doneIcon : alertIcon;
};
</script>

<style scoped lang="scss">
.card {
   background-color: #eef9ff;
   border-radius: 8px;
   padding: 16px 24px;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 16px;
   z-index: 5;
   margin-top: 24px;
   position: relative;

   @media (max-width: 480px) {
      padding: 16px;
   }

   &__info {
      display: flex;
      flex-direction: column;
      gap: 8px;
   }

   &__row {
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 480px) {
         align-items: flex-start;
      }
   }

   &__icon {
      width: 16px;
      height: 16px;
   }

   &__text {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #323232;
      flex: 1;

      &--small {
         font-weight: 400;
      }
   }

   &__example {
      background-color: #eef9ff;
      color: #3366FF;
      border: none;
      outline: none;
      font-size: 14px;
      cursor: pointer;

      &:hover {
         text-decoration: underline;
      }

      @media (max-width: 768px) {
         display: none;
      }

      &--mobile {
         display: none;
         color: #3366FF;
         border: none;
         outline: none;
         font-size: 14px;
         cursor: pointer;

         &:hover {
            text-decoration: underline;
         }

         @media (max-width: 768px) {
            display: block;
         }
      }
   }

   &__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      @media (max-width: 768px) {
         flex-direction: column;
         align-items: flex-start;
         gap: 16px;
      }
   }

   &__section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
   }

   &__button {
      background-color: #3366ff;
      color: white;
      border: none;
      border-radius: 6px;
      height: 34px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
         background-color: #144DF8;
      }

      &-icon {
         width: 16px;
         height: 16px;
      }

      &-text {
         font-size: 14px;
      }
   }
}
</style>
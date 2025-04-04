<template>
   <div class="report-page__overlay">
      <div class="report-page__title">Общая сводка</div>
      <div class="report-page__grid">
         <ReportStatusBlock v-for="(item, index) in reportDataInfo" :key="item.id" :title="item.title" :text="item.text"
            :status="item.status" @click="scrollToSection(item.id)" class="report-status-block" />
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';

const scrollToSection = (id) => {
   nextTick(() => {
      const section = document.getElementById(id);
      if (section) {
         const offset = 60; 

         const rect = section.getBoundingClientRect();
         const top = rect.top + window.pageYOffset - offset;

         window.scrollTo({
            top,
            behavior: 'smooth',
         });
      }
   });
};

const reportDataInfo = ref([
   { id: "pts-data", title: "Данные из ПТС", text: "Найдены характеристики", status: 1 },
   { id: "leasing-contracts", title: "Договоры лизинга", text: "Нет записей", status: 1 },
   { id: "cost-evaluation", title: "Оценка стоимости", text: "4 записи", status: 1 },
   { id: "pts-owners", title: "Владельцев из ПТС", text: "2 владельца (среди них юр. лицо)", status: 2 },
   { id: "taxi-work", title: "Работа в такси", text: "Нет записей", status: 1 },
   { id: "mileage-history", title: "История пробегов", text: "Возможны манипуляции", status: 3 },
   { id: "pledge-data", title: "Данные о залоге", text: "Залог не найден", status: 1 },
   { id: "carsharing-work", title: "Работа в каршеринге", text: "Нет записей", status: 1 },
   { id: "recall-campaigns", title: "Отзывные кампании", text: "Нет записей", status: 1 },
   { id: "restrictions", title: "Наличие ограничений", text: "Нет записей", status: 1 },
   { id: "aligo-listing", title: "Размещение на Aligo", text: "1 объявление", status: 1 },
   { id: "insurance-policies", title: "Страховые полисы", text: "2 записи", status: 1 },
   { id: "wanted-status", title: "Нахождение в розыске", text: "Нет записей", status: 1 },
   { id: "accidents", title: "Участие в ДТП", text: "2 ДТП", status: 3 },
   { id: "fines", title: "Штрафы", text: "1 неоплаченный", status: 3 },
   { id: "auctions", title: "Участие в аукционах", text: "Нет записей", status: 1 },
   { id: "repair-cost", title: "Расчёт стоимости ремонта", text: "2 записи", status: 3 },
   { id: "vin-options", title: "Опции по VIN", text: "Есть записи", status: 1 },
]);
</script>

<style lang="scss" scoped>
.report-page {
   &__overlay {
      background-color: #EEF9FF;
      margin-top: 40px;
      padding: 40px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;

      @media (max-width: 768px) {
         margin-top: 24px;
         padding: 32px 16px;
      }
   }

   &__title {
      width: 100%;
      max-width: 1312px;
      padding: 0 16px;
      font-size: 24px;
      line-height: 30px;
      color: #3366FF;
      font-weight: 700;
      margin-bottom: 32px;

      @media (max-width: 1024px) {
         padding: 0;
      }
   }

   &__grid {
      display: grid;
      width: 100%;
      max-width: 1312px;
      column-gap: 12px;
      row-gap: 24px;
      padding: 0;
      grid-auto-flow: dense;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

      @media (max-width: 768px) {
         row-gap: 16px;
      }

      @media (min-width: 1024px) {
         grid-template-columns: repeat(3, minmax(300px, 1fr));
         padding: 0 16px;
      }
   }
}
</style>
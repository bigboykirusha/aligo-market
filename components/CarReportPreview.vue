<template>
   <div class="report-page__overlay">
      <div class="report-page__title">Общая сводка</div>
      <div class="report-page__grid">
         <ReportStatusBlock v-for="(item, index) in props.reportDataInfo" :key="item.id" :title="item.title" :text="item.text"
            :status="item.status" @click="scrollToSection(item.id)" class="report-status-block" />
      </div>
   </div>
</template>

<script setup>

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

const props = defineProps({
   reportDataInfo: {
      type: Array,
      required: true
   }
});

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
<template>
   <div class="report-page">
      <div v-if="isLoading" class="loading-container">
         <div class="loader"></div>
         <div class="loading-text">
            <p>Загружаем данные об автомобиле...</p>
            <span>Сформированный отчёт будет доступен вам всегда в личном кабинете</span>
         </div>
      </div>

      <div v-else>
         <div class="report-page__info">
            <div class="report-page__details">
               <h2 class="report-page__title">
                  {{ report.auto_technical_specifications[0].brand.title }}
                  {{ report.auto_technical_specifications[0].model.title }},
                  {{ report.auto_technical_specifications[0].year_release.title }}
               </h2>
               <p class="report-page__text">
                  <span class="report-page__label">Госномер:</span>
                  {{ report.auto_registration_data?.[0]?.state_number || 'Не указано' }}
               </p>
               <p class="report-page__text">
                  <span class="report-page__label">VIN:</span>
                  {{ report.auto_registration_data[0]?.vin || 'Не указано' }}
               </p>
               <div class="report-page__block">
                  <ReportInfoBlock :image="historyIcon" :title="formattedUpdatedAt" text="История отчётов"
                     @click="toggleReportPopup" />
                  <ReportInfoBlock :image="updateIcon" title="Вы запрашивали полный отчёт вчера, возможно некоторые данные будут устаревшими
                  и неактуальными" text="Обновить отчёт" @click="openPopupHandler()" />
                  <UpdateReportPopup :isVisible="isReportPopupVisible" @close="toggleReportPopup" />
               </div>
            </div>
            <div class="report-page__slider">
               <CarSlider :images="report.photos" :adsId="report.id" :userId="report.id_user_owner_ads" />
            </div>
         </div>
         <CarReportPreview :reportDataInfo="reportDataInfo" />
         <div class="report-page__sections">
            <ReportSection v-for="item in reportData" :key="item.id" :id="item.id" :title="item.title" :date="item.date"
               :description="item.description">
               <SmallStatusBlock v-if="item.params" :data="item.params" />
               <PtsStatsBlock v-if="item.stats" :data="item.stats" />
               <OwnersBlock v-if="item.owners" :data="item.owners" />
               <AligoAdsBlock v-if="item.history" :data="item.history" :description="item.description"
                  :seller="item.seller" :region="item.region" :price="item.price" :mileage="item.mileage"
                  :isPublished="item.isPublished" :photo="item.photo" />
               <PriceStatsBlock v-if="item.price_history" :data="item.price_history" :icon="item.icon" />
               <CharacteristicsReport v-if="item.characteristics" :data="item.characteristics" :icon="item.icon" />
               <RepairCostReport v-if="item.updates" :data="item" />
               <AccidentReport v-if="item.accidents" :data="item" />
               <MileageChart v-if="item.mileageData" :dataPoints="item.mileageData" :owners="item.ownersData" />
               <TimeLine v-if="item.timelineBlocks" :timelineBlocks="item.timelineBlocks" />
            </ReportSection>
         </div>
      </div>
   </div>
</template>

<script setup>
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ref, computed, onMounted } from 'vue';
import { getReportById, getCarById, fetchUserReports, getUsers } from '~/services/apiClient';
import historyIcon from '@/assets/icons/icon-history.svg'
import updateIcon from '@/assets/icons/update-icon.svg'
import docIcon from '@/assets/icons/doc-icon.svg'
import fineIcon from '@/assets/icons/fine-icon.svg'
import testicon from '@/assets/icons/test-icon.svg'
import { transformAccidentsData, transformAuctionData, transformOwnersData, transformWantedData, transformLeasingData, transformMileageData, transformOsagoData, transformPledgeData, transformPtsData, transformRecallCampaignsData, transformRepairData, transformShortReportToList, transformRestrictionData, transformTaxiData } from '@/services/reportUtils';
import { useRoute } from 'vue-router';
import { usePayPopupStore } from '@/store/payPopupStore';

const formattedUpdatedAt = computed(() => {
   const updatedAt = reportFromApi.value?.data.updated_at;
   console.log(reportFromApi.value?.updated_at)
   if (!updatedAt) return null;

   const date = new Date(updatedAt);
   return `Отчёт об истории от ${format(date, 'd MMMM yyyy года', { locale: ru })}`;
});

const payPopupStore = usePayPopupStore();

const openPopupHandler = () => {
   const newLabel = `Ваше авто`;
   payPopupStore.openPopup(newLabel);
};

const isReportPopupVisible = ref(false);

const toggleReportPopup = () => {
   isReportPopupVisible.value = !isReportPopupVisible.value;
}

const route = useRoute();
const report = ref(null);
const reportFromApi = ref(null);
const reportDataInfo = ref(null);
const isLoading = ref(true);
const accidentsReport = ref(null);
const auctionsReport = ref(null);
const ownersReport = ref(null);
const wantedReport = ref(null);
const leasingReport = ref(null);
const mileageReport = ref(null);
const osagoReport = ref(null);
const pledgeReport = ref(null);
const ptsReport = ref(null);
const recalledReport = ref(null);
const repairReport = ref(null);
const restrictionReport = ref(null);
const taxiReport = ref(null);

const fetchReportDetails = async (id) => {
   isLoading.value = true;
   try {
      report.value = await getCarById(id);
      reportFromApi.value = await getReportById(id);
      if (reportFromApi.value?.data.info_accident) {
         accidentsReport.value = transformAccidentsData(reportFromApi.value.data.info_accident);
      }

      if (reportFromApi.value?.data.info_auction) {
         auctionsReport.value = transformAuctionData(reportFromApi.value.data.info_auction);
      }

      if (reportFromApi.value?.data.info_count_owners) {
         ownersReport.value = transformOwnersData(reportFromApi.value.data.info_count_owners);
      }

      if (reportFromApi.value?.data.info_hijacked) {
         wantedReport.value = transformWantedData(reportFromApi.value.data.info_hijacked);
      }

      if (reportFromApi.value?.data.info_leasing) {
         leasingReport.value = transformLeasingData(reportFromApi.value.data.info_leasing);
      }

      if (reportFromApi.value?.data.info_mileage) {
         mileageReport.value = transformMileageData(reportFromApi.value.data.info_mileage);
      }

      if (reportFromApi.value?.data.info_osago) {
         osagoReport.value = transformOsagoData(reportFromApi.value.data.info_osago);
      }

      if (reportFromApi.value?.data.info_pledge) {
         pledgeReport.value = transformPledgeData(reportFromApi.value.data.info_pledge);
      }

      if (reportFromApi.value?.data.info_pts) {
         ptsReport.value = transformPtsData(reportFromApi.value.data.info_pts);
      }

      if (reportFromApi.value?.data.info_recalled_companies) {
         recalledReport.value = transformRecallCampaignsData(reportFromApi.value.data.info_recalled_companies);
      }

      if (reportFromApi.value?.data.info_repair) {
         repairReport.value = transformRepairData(reportFromApi.value.data.info_repair);
      }

      if (reportFromApi.value?.data.total_short_report) {
         reportDataInfo.value = transformShortReportToList(reportFromApi.value.data.total_short_report);
      }

      if (reportFromApi.value?.data.info_restriction) {
         restrictionReport.value = transformRestrictionData(reportFromApi.value.data.info_restriction);
      }

      if (reportFromApi.value?.data.info_taxi) {
         taxiReport.value = transformTaxiData(reportFromApi.value.data.info_taxi);
      }

   } catch (error) {
      console.error("Ошибка при получении данных:", error);
   } finally {
      isLoading.value = false;
   }
};

onMounted(() => {
   const reportId = Number(route.path.split('/').pop());
   fetchReportDetails(reportId);
   fetchUserReports();
   getUsers();
});

const reportData = computed(() => [
   {
      ...accidentsReport.value,
   },
   {
      ...auctionsReport.value,
   },
   {
      ...ownersReport.value,
   },
   {
      ...wantedReport.value,
   },
   {
      ...leasingReport.value,
   },
   {
      ...mileageReport.value,
   },
   {
      ...osagoReport.value,
   },
   {
      ...pledgeReport.value,
   },
   {
      ...ptsReport.value,
   },
   {
      ...recalledReport.value,
   },
   {
      ...repairReport.value,
   },
   {
      ...restrictionReport.value,
   },
   {
      ...taxiReport.value,
   }
]);
</script>

<style lang="scss" scoped>
.loading-container {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   z-index: 5;

   @media (max-width: 768px) {
      padding: 24px;
   }
}

.loader {
   border: 6px solid #f3f3f3;
   border-top: 6px solid #144DF8;
   border-radius: 50%;
   width: 50px;
   height: 50px;
   animation: spin 2s linear infinite;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}

.loading-text {
   text-align: center;
   color: #323232;
   margin-top: 32px;
   font-size: 16px;
}

.loading-text p {
   margin-bottom: 16px;
   font-weight: 700;
   font-size: 20px;
   line-height: 24px;

}

.loading-text span {
   font-size: 14px;
   line-height: 18px;
}

.report-page {
   margin: 0 auto;
   margin-top: 134px;
   min-height: calc(100vh - 134px);
   min-height: calc(100dvh - 134px);
   width: 100%;

   @media (max-width: 768px) {
      margin-top: 90px;
   }

   &__info {
      display: grid;
      max-width: 1312px;
      grid-template-columns: 1fr 1fr;
      gap: 134px;
      max-height: 480px;
      margin: 0 auto;
      padding: 0 16px;

      @media (max-width: 1024px) {
         display: flex;
         gap: 24px;
         flex-direction: column;
         max-height: fit-content;
      }
   }

   &__block {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }

   &__title {
      font-size: 32px;
      line-height: 36px;
      color: #323232;
      font-weight: 700;
      margin: 0;
      margin-bottom: 12px;
   }

   &__text {
      display: flex;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 12px;
      color: #323232
   }

   &__label {
      color: #787878;
   }

   &__history {
      font-weight: bold;
      margin-top: 10px;
   }

   &__button {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #3366ff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;

      &:hover {
         background-color: #254eda;
      }
   }

   &__slider {
      height: 400px;
      max-width: 640px;
      width: 100%;

      @media (max-width: 1024px) {
         max-width: 100%;
      }

      @media (max-width: 768px) {
         height: 360px;
         max-width: 100%;
      }
   }

   &__sections {
      max-width: 1312px;
      margin: 0 auto;
      padding: 0 16px;
   }
}
</style>
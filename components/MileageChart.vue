<template>
   <div class="chart-container">
      <div class="chart-info">
         <div class="label-left">Пробег, тыс. км</div>
         <div class="label-right">
            Пробег на {{ latestDate }}: {{ latestMileage.toLocaleString() }} км
         </div>
      </div>
      <canvas ref="chartRef"></canvas>

      <div class="owners-bar">
         <div v-for="(segment, index) in segments" :key="index" class="owner-segment" :style="{
            width: `${(segment.days / totalDays) * 100}%`,
            backgroundColor: segment.color,
            borderTopLeftRadius: index === '0',
            borderTopRightRadius: index === '0'
         }">
            <span class="owners-text"></span>
         </div>
      </div>
      <div class="owners-label">Владельцы</div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { format, differenceInDays, parse } from 'date-fns';
import { ru } from 'date-fns/locale';

const latestPoint = computed(() => {
   const sorted = [...props.dataPoints].sort((a, b) => new Date(b.date) - new Date(a.date));
   return sorted[0];
});

const latestDate = computed(() =>
   format(new Date(latestPoint.value.date), 'd MMMM yyyy', { locale: ru })
);

const latestMileage = computed(() => latestPoint.value.mileage);

const ownerColors = [
   '#A4DCFF', // Голубой
   '#AFF1CA', // Светло-зеленый
   '#D6C7FF', // Лаванда
   '#FDCDFF', // Розовый
   '#D6D6D6', // Серый
   '#FFC1C1', // Светло-красный
   '#FFEB99', // Желтый
   '#B3FFB3', // Светло-зеленый
   '#FFCC99', // Оранжевый
   '#C4E1FF', // Голубой
   '#F2B5D4', // Розово-фиолетовый
   '#FFB3E6', // Лавандовый розовый
   '#FF9A8B', // Персиковый
   '#D1F1FF', // Бледно-голубой
   '#FFE1A1'  // Желтоватый
];

const calculateOwnerSegments = (owners) => {
   const segments = [];
   console.log(owners)
   let totalDays = 0;

   const ownerDates = owners.map(owner => parse(owner.date, 'yyyy-MM-dd', new Date()));

   totalDays = differenceInDays(new Date(), ownerDates[ownerDates.length - 1]);


   for (let i = 0; i < ownerDates.length; i++) {
      let days = 0;

      if (i === 0) {
         days = differenceInDays(ownerDates[1], ownerDates[0]);
      }
      else if (i === 1) {
         days = differenceInDays(ownerDates[2], ownerDates[1]);
      }
      else {
         days = differenceInDays(new Date(), ownerDates[2]);
      }

      console.log(`Owner ${owners[i].name} has ${days} days`);

      segments.push({ name: owners[i].name, days, color: ownerColors[i] });
   }

   return { segments, totalDays };
};


const { $chart } = useNuxtApp();
const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
   dataPoints: {
      type: Array,
      required: true,
   },
   owners: {
      type: Array,
      required: true,
   },
});

const { segments, totalDays } = calculateOwnerSegments(props.owners);

const createChart = () => {
   if (!chartRef.value) return;

   if (chartInstance) {
      chartInstance.destroy();
   }

   const ctx = chartRef.value.getContext('2d');
   chartInstance = new $chart(ctx, {
      type: 'line',
      data: {
         labels: props.dataPoints.map(point => format(new Date(point.date), 'MMM d', { locale: ru })),
         datasets: [{
            data: props.dataPoints.map(point => point.mileage),
            borderColor: '#3366FF',
            backgroundColor: 'rgba(51, 102, 255, 0.15)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(51, 102, 255, 1)',
         }],
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: false,
            },
         },
         scales: {
            x: {
               grid: { display: false },
               ticks: {
                  callback: function (val, index, ticks) {
                     const date = new Date(props.dataPoints[index].date);
                     const currentYear = date.getFullYear();

                     const prevDate = index > 0 ? new Date(props.dataPoints[index - 1].date) : null;
                     const prevYear = prevDate ? prevDate.getFullYear() : null;

                     const formatted = format(date, 'd MMM', { locale: ru });
                     return currentYear !== prevYear ? `${formatted} ${currentYear}` : formatted;
                  }
               }
            },
            y: {
               grid: { display: true },
               ticks: {
                  display: true,
                  callback: function (value, index, ticks) {
                     if (index === 0) return '';
                     return value;
                  },
               },
            }
         }
      },
   });
};

watch(() => props.dataPoints, createChart, { deep: true });
onMounted(createChart);
</script>

<style scoped>
.chart-container {
   width: 100%;
   max-width: 1312px;
   position: relative;
}

canvas {
   width: 100% !important;
   max-height: 400px;
}

.chart-info {
   display: flex;
   justify-content: space-between;
   margin-bottom: 8px;
   margin-top: 24px;
   font-size: 12px;
   line-height: 16px;
}

.label-left {
   text-align: left;
   color: #A8A8A8;
}

.label-right {
   text-align: right;
   color: #323232;
}

.owners-bar {
   margin-top: 20px;
   height: 14px;
   display: flex;
   gap: 2px;
   background-color: #f2f2f2;
   border-radius: 24px;
   overflow: hidden;
}

.owner-segment {
   height: 14px;
   color: white;
   font-size: 12px;
   font-weight: bold;
   display: flex;
   align-items: center;
   justify-content: center;
}

.owners-text {
   font-size: 12px;
   line-height: 16px;
   color: #323232;
   font-weight: 400;
   margin-right: auto;
   margin-left: 8px;
}

.owners-label {
   font-size: 12px;
   line-height: 16px;
   color: #A8A8A8;
   margin-top: 8px;
}
</style>
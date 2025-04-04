<template>
   <div class="chart-container">
      <div class="chart-info">
         <div class="label-left">Пробег, тыс. км</div>
         <div class="label-right">Пробег на 19 мая 2023: 78 000 км</div>
      </div>
      <canvas ref="chartRef"></canvas>

      <div class="owners-bar">
         <div v-for="(segment, index) in segments" :key="index" class="owner-segment" :style="{
            width: `${(segment.days / totalDays) * 100}%`,
            backgroundColor: segment.color,
            borderTopLeftRadius: index === '0',
            borderTopRightRadius: index === '0'
         }">
            <span class="owners-text">{{ segment.name }}</span>
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

const owners = [
   { name: '1', date: '2025-01-01' },
   { name: '2', date: '2025-01-19' },
   { name: '3', date: '2025-02-04' },
];

const ownerColors = ['#A4DCFF', '#AFF1CA', '#D6C7FF', '#FDCDFF', '#D6D6D6'];

const calculateOwnerSegments = (owners) => {
   const segments = [];
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
});

const { segments, totalDays } = calculateOwnerSegments(owners);

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
                  display: true,
               },
            },
            y: {
               grid: { display: true },
               ticks: {
                  display: true,
               },
            },
         },
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
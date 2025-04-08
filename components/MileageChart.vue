<template>
   <div class="chart-container">
      <div v-if="latestDate && latestMileage" class="chart-info">
         <div class="label-left">Пробег, тыс. км</div>
         <div class="label-right">
            Пробег на {{ latestDate }}: {{ latestMileage.toLocaleString() }} км
         </div>
      </div>

      <canvas v-if="props.dataPoints.length > 0" ref="chartRef"></canvas>

      <div v-if="segments.length > 0" class="owners-bar">
         <div v-for="(segment, index) in segments" :key="index" class="owner-segment" :style="{
            width: `${(segment.days / totalDays) * 100}%`,
            backgroundColor: segment.color,
            borderTopLeftRadius: index === 0,
            borderTopRightRadius: index === segments.length - 1
         }">
            <span class="owners-text"></span>
         </div>
      </div>

      <div v-if="segments.length > 0" class="owners-label">Владельцы</div>
   </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { format, differenceInDays, parse } from 'date-fns';
import { ru } from 'date-fns/locale';

const latestPoint = computed(() => {
   const sorted = [...props.dataPoints].sort((a, b) => new Date(b.date) - new Date(a.date));
   return sorted[0];
});

const latestDate = computed(() => {
   if (!latestPoint.value || !latestPoint.value.date) {
      return null;
   }
   return format(new Date(latestPoint.value.date), 'd MMMM yyyy', { locale: ru });
});
const latestMileage = computed(() => latestPoint.value.mileage);

const ownerColors = [
   '#A4DCFF', '#AFF1CA', '#D6C7FF', '#FDCDFF', '#D6D6D6', '#FFC1C1',
   '#FFEB99', '#B3FFB3', '#FFCC99', '#C4E1FF', '#F2B5D4', '#FFB3E6',
   '#FF9A8B', '#D1F1FF', '#FFE1A1'
];

const calculateOwnerSegments = (owners) => {
   const segments = [];
   let totalDays = 0;

   if (owners.length === 0) {
      return { segments, totalDays };
   }

   const ownerDates = owners.map(owner => parse(owner.date, 'yyyy-MM-dd', new Date()));

   if (owners.length === 1) {
      totalDays = differenceInDays(new Date(), ownerDates[0]);
   } else {
      totalDays = differenceInDays(new Date(), ownerDates[ownerDates.length - 1]);
   }

   for (let i = 0; i < ownerDates.length; i++) {
      let days = 0;

      if (i === 0 && ownerDates.length > 1) {
         days = differenceInDays(ownerDates[1], ownerDates[0]);
      } else if (i === ownerDates.length - 1) {
         days = differenceInDays(new Date(), ownerDates[i]);
      } else {
         days = differenceInDays(ownerDates[i + 1], ownerDates[i]);
      }

      const colorIndex = i % ownerColors.length;
      segments.push({ name: owners[i].name, days, color: ownerColors[colorIndex] });
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
   if (!chartRef.value || props.dataPoints.length === 0) return;

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
            legend: { display: false },
         },
         scales: {
            x: {
               grid: { display: false },
               offset: false,
               bounds: 'data',
               clip: true,
               ticks: {
                  align: 'inner',
                  padding: 0,
                  maxRotation: 0,
                  minRotation: 0,
                  callback: function (val, index) {
                     const point = props.dataPoints[index]
                     if (!point) return ''
                     const date = new Date(point.date)
                     const currentYear = date.getFullYear()
                     const prevDate = index > 0 ? new Date(props.dataPoints[index - 1].date) : null
                     const prevYear = prevDate ? prevDate.getFullYear() : null
                     const formatted = format(date, 'd MMM', { locale: ru })
                     return currentYear !== prevYear ? `${formatted} ${currentYear}` : formatted
                  }
               },
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
   margin-left: 50px;
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
   margin-left: 50px;
}
</style>
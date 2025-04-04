<template>
   <div class="grid-container">
      <div v-for="(stat, index) in data" :key="index" class="stat-item">
         <div class="stat-title">{{ stat.title }}:</div>
         <div class="stat-description">{{ stat.description }}</div>
      </div>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
   data: {
      type: Array,
      required: true
   }
});
</script>

<style scoped>
.grid-container {
   display: grid;
   grid-template-columns: repeat(1, 1fr);
   gap: 12px;
   margin-top: 24px;
}

@media (min-width: 768px) {
   .grid-container {
      grid-template-columns: repeat(2, 1fr);
   }
}

@media (min-width: 1024px) {
   .grid-container {
      grid-template-columns: repeat(3, 1fr);
   }
}

.stat-item {
   display: flex;
   gap: 8px;
   border-radius: 8px;
   background-color: #ffffff;
}

.stat-title {
   color: #787878;
   font-size: 14px;
   line-height: 18px;
}

.stat-description {
   color: #323232;
   font-size: 14px;
   line-height: 18px;
}
</style>
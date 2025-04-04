<template>
   <div class="price-history-container">
      <div v-for="(item, index) in data" :key="index" class="price-history-item">
         <div class="price-title">
            <img :src="icon" alt="icon" class="price-icon" />
            {{ item.price_title }}
            <span v-if="item.status" class="status-container">
               <img :src="item.status === 1 ? doneIcon : alertIcon" alt="status-icon" class="status-icon" />
               {{ item.status === 1 ? 'Оплачено' : 'Не оплачено' }}
            </span>
         </div>
         <div class="grid-container">
            <div v-for="(stat, statIndex) in item.price_stats" :key="statIndex" class="stat-item">
               <div class="stat-description"> <span class="stat-title">{{ stat.title }}:</span>{{ stat.description }}
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';
import doneIcon from '@/assets/icons/done-icon.svg';
import alertIcon from '@/assets/icons/alert-icon.svg';

defineProps({
   data: {
      type: Array,
      required: true
   },
   icon: {
      type: String,
      required: true
   },
});
</script>

<style lang="scss" scoped>
.price-history-container {
   display: flex;
   flex-direction: column;
   gap: 24px;
   margin-top: 24px;
}

.price-history-item {}

.price-title {
   font-size: 14px;
   line-height: 18px;
   font-weight: 700;
   color: #323232;
   margin-bottom: 8px;
   display: flex;
   align-items: center;
   gap: 8px;
}

.price-icon {
   height: 16px;
}

.status-container {
   display: flex;
   align-items: center;
   gap: 8px;
   margin-left: 8px;
   font-weight: bold;
}

.status-icon {
   height: 16px;
   width: 16px;
}

.grid-container {
   display: flex;
   flex-direction: column;
   gap: 8px;
   padding-left: 24px;

   @media (max-width: 768px) {
      padding-left: 0;
   }
}

.stat-item {
   display: flex;
}

.stat-title {
   color: #787878;
   font-size: 14px;
   line-height: 18px;
   margin-right: 8px;
}

.stat-description {
   color: #323232;
   font-size: 14px;
   line-height: 18px;
}
</style>
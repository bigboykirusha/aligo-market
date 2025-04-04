<template>
   <div class="characteristics-container">
      <div v-for="(category, index) in data" :key="index" class="characteristics-category">
         <div class="category-title">
            {{ category.title }}
         </div>
         <div class="grid-container">
            <div v-for="(detail, detailIndex) in category.details" :key="detailIndex" class="detail-item">
               <template v-if="detail.key === 'Фото'">
                  <img :src="detail.value" alt="Фото" class="characteristics-image" />
               </template>
               <template v-else>
                  <div class="detail-value"><span class="detail-title">{{ detail.key }}:</span>{{ detail.value }}</div>
               </template>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';

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

<style scoped>
.characteristics-container {
   display: flex;
   flex-direction: column;
   gap: 24px;
   margin-top: 24px;
}

.characteristics-category {}

.category-title {
   font-size: 14px;
   line-height: 18px;
   font-weight: 700;
   color: #323232;
   margin-bottom: 8px;
   display: flex;
   align-items: center;
   gap: 8px;
}

.grid-container {
   display: flex;
   flex-direction: column;
   gap: 8px;
}

.detail-item {
   display: flex;
   gap: 8px;
   align-items: center;
}

.detail-title {
   color: #787878;
   font-size: 14px;
   line-height: 18px;
   margin-right: 8px;
}

.detail-value {
   color: #323232;
   font-size: 14px;
   line-height: 18px;
}

.characteristics-image {
   width: 100%;
   max-width: 830px;
   margin-top: 24px;
   margin-bottom: 8px;
}
</style>
<template>
   <div v-for="(update, index) in data.updates" :key="index" class="update-section">
      <div v-for="(detail, detailIndex) in update.details" :key="detailIndex" class="detail-section">
         <div class="price-range-container">
            <img src="../assets/icons/orders-icon.svg" class="price-range-icon" />
            <p class="price-range">{{ detail.price_range }}</p>
         </div>
         <p class="detail-date">{{ detail.date }}</p>

         <div class="breakdown">
            <div class="title">Детализация стоимости</div>
            <div v-for="(item, itemIndex) in detail.breakdown" :key="itemIndex" class="breakdown-item">
               <span class="breakdown-category">{{ item.category }}:</span>
               <span class="breakdown-cost">{{ item.cost }}</span>
            </div>
         </div>

         <div class="repairs">
            <div v-if="detail.repairs.partial" class="title">Частичный ремонт</div>
            <ul v-if="detail.repairs.partial">
               <li v-for="(repair, rIndex) in detail.repairs.partial" :key="rIndex">{{ repair }}</li>
            </ul>

            <div v-if="detail.repairs.painting" class="title">Окраска поверхности</div>
            <ul v-if="detail.repairs.painting">
               <li v-for="(paint, pIndex) in detail.repairs.painting" :key="pIndex">{{ paint }}</li>
            </ul>

            <div class="title">Замена</div>
            <ul>
               <li v-for="(replace, rpIndex) in detail.repairs.replacement" :key="rpIndex">{{ replace }}</li>
            </ul>

            <div v-if="detail.repairs.additional" class="title">Дополнительные работы</div>
            <ul v-if="detail.repairs.additional">
               <li v-for="(additional, aIndex) in detail.repairs.additional" :key="aIndex">{{ additional }}</li>
            </ul>
         </div>
      </div>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
   data: {
      type: Object,
      required: true
   }
});
</script>

<style lang="scss" scoped>
.update-section {
   display: flex;
   flex-direction: column;
   gap: 40px;
   margin-top: 24px;
}

.price-range-container {
   display: flex;
   gap: 8px;
   align-items: center;
   margin-bottom: 4px;
}

.price-range-icon {
   height: 16px;
}

.description {
   font-size: 14px;
   color: #555;
}

.date,
.update-date,
.detail-date {
   font-size: 12px;
   color: #888;
}

.price-range {
   font-size: 14px;
   line-height: 18px;
   font-weight: 700;
   color: #323232;
}

.breakdown-item {
   display: flex;
   gap: 8px;
   font-size: 14px;
   line-height: 18px;
   color: #323232;
   margin-bottom: 8px;
}

.breakdown-category {
   color: #787878;
}

.title {
   margin-top: 24px;
   margin-bottom: 8px;
   font-size: 14px;
   line-height: 18px;
   font-weight: 700;
   color: #323232;
}

ul {
   display: flex;
   flex-direction: column;
   gap: 8px;
   padding-left: 24px;
   font-size: 14px;
   color: #444;
   list-style-type: disc;
   list-style-position: inside;

   @media (max-width: 768px) {
      padding-left: 0;
   }
}

li {
   position: relative;
}

li::marker {
   color: #3366FF;
   font-size: 14px;
}
</style>
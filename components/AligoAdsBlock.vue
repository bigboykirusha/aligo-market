<template>
   <div class="owner-container">
      <div class="ad-card">
         <div class="ad-content">
            <div class="ad-image">
               <img :src="getImageUrl(photo, placeholderImage)" class="placeholder-image" />
            </div>

            <div class="ad-info">
               <div class="ad-details">
                  <div><span class="ad-label">Статус:</span> {{ isPublished ? `Опубликовано` : `Снято с публикации` }}
                  </div>
                  <div><span class="ad-label">Продавец:</span> {{ seller || 'Не указан' }}</div>
                  <div><span class="ad-label">Регион:</span> {{ region || 'Не указан' }}</div>
                  <div><span class="ad-label">Цена:</span> {{ price ? `${price} ₽` : 'Не указана' }}</div>
                  <div><span class="ad-label">Пробег:</span> {{ mileage || 'Не указан' }}</div>
               </div>
            </div>

            <div class="ad-description">
               <div><span class="ad-label">Комментарий:</span> {{ description }}</div>
            </div>
         </div>
      </div>

      <div v-for="(owner, index) in data" :key="index" class="owner-block">
         <div class="owner-header">
            <div class="owner-type">
               <img :src="historyIcon" class="owner-icon" />
               {{ owner.type }}
            </div>
         </div>

         <div class="events-table">
            <div class="table-header">
               <div class="header-item">Дата</div>
               <div class="header-item">Пробег</div>
               <div class="header-item">Цена</div>
            </div>

            <div v-for="(event, eventIndex) in owner.events" :key="eventIndex" class="event-row">
               <div class="event-item">{{ event.date }}</div>
               <div class="event-item">{{ event.event }}</div>
               <div class="event-item">{{ event.region }}</div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';
import historyIcon from '@/assets/icons/icon-history.svg';
import placeholderImage from '@/assets/icons/placeholder.png';
import { getImageUrl } from '~/services/imageUtils';

defineProps({
   data: {
      type: Array,
      required: true
   },
   description: {
      type: String,
      default: null
   },
   date: {
      type: String,
      default: null
   },
   seller: {
      type: String,
      default: null
   },
   region: {
      type: String,
      default: null
   },
   price: {
      type: Number,
      default: null
   },
   mileage: {
      type: Number,
      default: null
   },
   isPublished: {
      type: Number,
      default: null
   },
   photo: {
      type: String,
      default: null
   },
});
</script>

<style lang="scss" scoped>
.owner-container {
   display: flex;
   flex-direction: column;
   gap: 24px;
   margin-top: 24px;
}

.ad-card {
   background-color: #EEF9FF;
   border-radius: 8px;
   display: flex;
   flex-direction: column;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

   @media (max-width: 768px) {
      padding: 16px;
   }
}

.ad-content {
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
   align-items: center;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }
}

.ad-image {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   object-fit: cover;
   max-width: 291px;
   height: 218px;

   @media (max-width: 768px) {
      max-width: 100%;
   }
}

.placeholder-image {
   width: 100%;
   max-width: 291px;
   height: 218px;
   background-color: #d1d5db;
   display: flex;
   align-items: center;
   justify-content: center;
   object-fit: cover;
   color: #6b7280;
   font-size: 14px;
   border-radius: 8px 0 0 8px;

   @media (max-width: 768px) {
      border-radius: 8px;
      max-width: 100%;
   }
}

.ad-info {
   display: flex;
   flex-direction: column;
   flex: 1;
   margin-bottom: auto;
   padding: 40px 0;
   gap: 8px;

   @media (max-width: 768px) {
      padding: 0;
   }
}

.ad-details {
   font-size: 14px;
   display: flex;
   flex-direction: column;
   gap: 8px;
   color: #323232;
}

.ad-label {
   color: #787878;
}

.ad-description {
   font-size: 14px;
   padding: 40px 0;
   margin-bottom: auto;
   margin-right: 80px;
   color: #323232;
   flex: 1;
   display: -webkit-box;
   -webkit-line-clamp: 5;
   -webkit-box-orient: vertical;
   overflow: hidden;
   text-overflow: ellipsis;

   @media (max-width: 768px) {
      padding: 0;
   }
}

.owner-block {
   display: flex;
   flex-direction: column;
   gap: 16px;
}

.owner-header {
   font-size: 14px;
   line-height: 18px;
   color: #323232;
   display: flex;
   gap: 4px;
   flex-direction: column;
}

.owner-type {
   display: flex;
   font-weight: 700;
   align-items: center;
}

.owner-icon {
   width: 18px;
   height: 18px;
   margin-right: 6px;
}

.events-table {
   display: grid;
   max-width: 800px;
   gap: 16px;
   grid-template-columns: 1fr 2fr 2fr;
   font-size: 14px;
   line-height: 18px;
   margin-left: 24px;

   @media (max-width: 768px) {
      margin-left: 0;
   }
}

.table-header {
   display: contents;
   color: #A8A8A8;
}

.header-item {
   padding-bottom: 4px;
   border-bottom: 2px solid #EEEEEE;
}

.event-row {
   display: contents;
}

.event-item {
   color: #323232;
}
</style>

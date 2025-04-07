<template>
   <div class="owner-container" v-if="data && data.length">
      <div v-for="(owner, index) in data" :key="index" class="owner-container__block">
         <div class="owner-container__header">
            <div class="owner-container__type">
               <img v-if="owner.type === 'Физическое лицо'" :src="personIcon" alt="Физическое лицо"
                  class="owner-container__icon" />
               <img v-if="owner.type === 'Юридическое лицо'" :src="companyIcon" alt="Юридическое лицо"
                  class="owner-container__icon" />
               {{ owner.type }}
            </div>
            <div class="owner-container__date">{{ owner.date }}</div>
         </div>

         <div class="owner-container__events-table" v-if="owner.events && owner.events.length">
            <div class="owner-container__table-header">
               <div class="owner-container__header-item">Дата</div>
               <div class="owner-container__header-item">Событие</div>
               <div class="owner-container__header-item">Регион</div>
            </div>

            <div v-for="(event, eventIndex) in owner.events" :key="eventIndex" class="owner-container__event-row">
               <div class="owner-container__event-item">{{ event.date }}</div>
               <div class="owner-container__event-item">{{ event.event }}</div>
               <div class="owner-container__event-item">{{ event.region }}</div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { defineProps } from 'vue';
import personIcon from '@/assets/icons/person-icon.svg'
import companyIcon from '@/assets/icons/company-icon.svg'

defineProps({
   data: {
      type: Array,
      required: true
   }
});
</script>

<style lang="scss" scoped>
.owner-container {
   display: flex;
   flex-direction: column;
   gap: 24px;
   margin-top: 24px;

   &__block {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__date {
      margin-left: 24px;
   }

   &__header {
      font-size: 14px;
      line-height: 18px;
      color: #323232;
      display: flex;
      gap: 4px;
      flex-direction: column;
   }

   &__type {
      display: flex;
      font-weight: 700;
      align-items: center;
   }

   &__icon {
      width: 18px;
      height: 18px;
      margin-right: 6px;
   }

   &__events-table {
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

   &__table-header {
      display: contents;
      color: #A8A8A8;
   }

   &__header-item {
      padding-bottom: 4px;
      border-bottom: 2px solid #EEEEEE;
   }

   &__event-row {
      display: contents;
   }

   &__event-item {
      color: #323232;
   }
}
</style>
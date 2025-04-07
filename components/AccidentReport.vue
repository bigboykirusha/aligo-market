<template>
   <div v-for="(accident, index) in data.accidents" :key="index" class="accident-section">
      <div v-for="(detail, detailIndex) in accident.details" :key="detailIndex" class="detail-section">
         <!-- Заголовок ДТП -->
         <div v-if="!isTimeline" class="title">{{ detail.accidentType }}, {{ detail.otherParticipants.length + 1 }}
            участника</div>
         <div v-if="!isTimeline" class="accident-header">
            <p class="accident-date">{{ detail.date }},</p>
            <p class="accident-location">{{ detail.location }}</p>
         </div>

         <!-- Информация о повреждениях автомобиля -->
         <div class="damages">
            <div class="title">Повреждение автомобиля из отчета</div>
            <ul>
               <li v-for="(damage, dIndex) in detail.damages" :key="dIndex">
                  {{ damage.part }} — {{ damage.description }}
               </li>
            </ul>
         </div>
         <!-- Картинка после повреждений (если isTimeline не передан) -->
         <img v-if="!isTimeline" src="../assets/icons/car-damage.svg" alt="Image for damages" class="accident-image" />

         <!-- Участники ДТП -->
         <div v-if="detail.otherParticipants && detail.otherParticipants.length" class="other-participants">
            <div v-for="(participant, pIndex) in detail.otherParticipants" :key="pIndex">
               <p class="participant-title">Участник {{ pIndex + 2 }} ({{ participant.name || 'нет данных' }})</p>
               <ul>
                  <li v-for="(damage, dIndex) in participant.damages" :key="dIndex">
                     {{ damage.part }} — {{ damage.description }}
                  </li>
               </ul>
               <img v-if="!isTimeline" src="../assets/icons/car-damage.svg" alt="Image for participants"
                  class="accident-image" />
            </div>
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
   },
   isTimeline: {
      type: Boolean,
      default: false
   }
});
</script>


<style lang="scss" scoped>
.accident-section {
   display: flex;
   flex-direction: column;
   gap: 40px;
}

.accident-header {
   display: flex;
   gap: 8px;
   font-size: 14px;
   color: #323232;
   margin-bottom: 8px;
}

.accident-date,
.accident-location {
   font-size: 12px;
   color: #888;
}

.damages,
.other-participants,
.repairs {
   margin-top: 20px;
}

.other-participants {
   display: flex;
   flex-direction: column;
   gap: 24px;
}

.title {
   margin-bottom: 8px;
   font-size: 14px;
   margin-top: 24px;
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

.participant-title {
   font-weight: 700;
   font-size: 14px;
   margin-bottom: 8px;
   color: #323232;
}

.no-data {
   font-size: 14px;
   color: #888;
}

.accident-image {
   width: 100%;
   max-width: 284px;
   margin-top: 24px;
}
</style>
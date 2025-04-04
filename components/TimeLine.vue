<template>
   <div class="timeline-container">
      <div class="timeline">
         <div class="timeline-global-block" v-for="(block, blockIndex) in timelineBlocks" :key="blockIndex">
            <!-- Линия -->
            <div class="timeline-line" :style="{ backgroundColor: block.color }"></div>

            <div class="timeline-item" v-for="(event, index) in block.events" :key="index">
               <!-- Если есть картинка - используем её вместо точки -->
               <template v-if="event.image">
                  <div class="timeline-image">
                     <OwnerIcon :color="iconColors[block.color]" v-if="event.image === 'owner'" />
                     <CarIcon :color="iconColors[block.color]" v-else-if="event.image === 'car'" />
                     <CrashIcon :color="iconColors[block.color]" v-else-if="event.image === 'crash'" />
                     <PostIcon :color="iconColors[block.color]" v-else-if="event.image === 'post'" />
                  </div>
               </template>

               <!-- Иначе точка с нужным цветом -->
               <template v-else>
                  <div class="timeline-dot" :style="{ backgroundColor: dotColors[block.color] || '#CCCCCC' }"></div>
               </template>

               <!-- Контент -->
               <div class="timeline-content">
                  <div class="timeline-description" :style="{ color: iconColors[block.color] }">{{ event.description }}
                  </div>
                  <div class="timeline-date">{{ event.date }}</div>
                  <div class="timeline-region">{{ event.region }}</div>
                  <AccidentReport v-if="event.accidents" isTimeline :data="event" />

                  <!-- Детали -->
                  <div v-if="event.details" class="timeline-details">
                     <div v-for="(detail, detailIndex) in event.details" :key="detailIndex" class="timeline-detail">
                        <span class="timeline-info">{{ detail.key }}:</span> {{ detail.value }}
                     </div>
                  </div>

                  <!-- Кнопка -->
                  <div v-if="event.button" class="timeline-button">
                     <button>{{ event.button }}</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
defineProps({
   timelineBlocks: {
      type: Array,
      required: true,
   }
});

const dotColors = {
   '#EEF9FF': '#A4DCFF',
   '#E5FFF0': '#AFF1CA',
   '#EFE9FF': '#D6C7FF',
   '#FEEAFF': '#FDCDFF',
   '#EEEEEE': '#D6D6D6',
};

const iconColors = {
   '#EEF9FF': '#3366FF',
   '#E5FFF0': '#3BBC71',
   '#EFE9FF': '#5F2EEA',
   '#FEEAFF': '#F567F9',
   '#EEEEEE': '#787878',
};
</script>

<style scoped>
.timeline-container {
   display: flex;
   padding-top: 40px;
   flex-direction: column;
   align-items: center;
}

.timeline {
   position: relative;
   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: flex-start;
}

.timeline-global-block {
   position: relative;
   width: 100%;
}

.timeline-line {
   position: absolute;
   top: 0;
   bottom: 0;
   width: 12px;
   border-radius: 12px;
   margin-top: 26px;
   margin-bottom: 8px;
   z-index: 1;
}

.timeline-item {
   display: flex;
   position: relative;
   margin-bottom: 40px;
}

.timeline-dot {
   position: absolute;
   top: 3px;
   width: 12px;
   height: 12px;
   border-radius: 50%;
   z-index: 2;
}

.timeline-content {
   margin-left: 40px;
   width: 100%;
}

.timeline-description {
   font-weight: 700;
   font-size: 16px;
   line-height: 20px;
   margin-bottom: 4px;
}

.timeline-date {
   font-size: 14px;
   line-height: 18px;
   font-weight: 700;
   margin-bottom: 16px;
   color: #323232;
}

.timeline-image {
   position: absolute;
   left: -3px;
   width: 20px;
   height: 20px;
   z-index: 3;
}

.timeline-region {
   color: #323232;
   font-size: 14px;
   line-height: 18px;
   margin-bottom: 8px;
}

.timeline-details {
   font-size: 14px;
   display: flex;
   flex-direction: column;
   gap: 8px;
   line-height: 18px;
   color: #323232;
}

.timeline-button button {
   font-size: 14px;
   line-height: 18px;
   margin-top: 8px;
   background: none;
   border: none;
   color: #3366FF;
   cursor: pointer;
}

.timeline-info {
   color: #787878;
}
</style>
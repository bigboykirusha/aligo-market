<template>
   <div class="container">
      <div class="text-block" v-for="(text, index) in [firstText, secondText]" :key="index">
         <div class="vertical-line"></div>
         <div class="text-content">
            <p>{{ text }}</p>
         </div>
      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   firstText: String,
   secondText: String,
});
</script>

<style lang="scss" scoped>
.container {
   display: flex;
   column-gap: 32px;
   justify-content: space-between;
   align-items: stretch;
   height: 100%;
   max-width: 1280px;
   margin: 40px auto;

   @media (max-width: 768px) {
      flex-direction: column;
      margin: 32px auto;
   }

   .text-block {
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;

      .vertical-line {
         position: absolute;
         left: 0;
         top: 0;
         bottom: 0;
         width: 2px;
         background-color: #3366FF;

         @media (max-width: 768px) {
            display: none;
         }
      }

      .text-content {
         display: flex;
         align-items: center;
         padding-left: 16px;
         font-size: 14px;
         color: #323232;
         flex: 1;

         @media (max-width: 768px) {
            padding-left: 0;
         }

         p {
            margin: 0;
         }
      }
   }
}
</style>

<template>
   <div class="container">
      <div class="text-block" v-for="(text, index) in texts" :key="index">
         <div class="vertical-line"></div>
         <div class="text-content">
            <div>{{ text }}</div>
         </div>
      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   firstText: {
      type: String,
      required: true,
   },
   secondText: {
      type: String,
      required: true,
   },
});

const texts = [props.firstText, props.secondText];
</script>

<style lang="scss" scoped>
.container {
   display: flex;
   column-gap: 32px;
   justify-content: space-between;
   align-items: stretch;
   height: 100%;
   max-width: 1312px;
   padding: 0 16px;
   margin: 0 auto;
   margin-bottom: 40px;

   @media screen and (max-width: 768px) {
      flex-direction: column;
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

         @media screen and (max-width: 768px) {
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

         @media screen and (max-width: 768px) {
            padding-left: 0;
         }
      }
   }
}
</style>

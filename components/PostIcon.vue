<template>
   <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
         d="M9.00012 1V4.55556C9.00012 4.7913 9.09377 5.0174 9.26047 5.18409C9.42717 5.35079 9.65326 5.44444 9.88901 5.44444H13.4446"
         :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path
         d="M11.6667 17H2.77778C2.30628 17 1.8541 16.8127 1.5207 16.4793C1.1873 16.1459 1 15.6937 1 15.2222V2.77778C1 2.30628 1.1873 1.8541 1.5207 1.5207C1.8541 1.1873 2.30628 1 2.77778 1H9L13.4444 5.44444V15.2222C13.4444 15.6937 13.2571 16.1459 12.9237 16.4793C12.5903 16.8127 12.1382 17 11.6667 17Z"
         :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
   </svg>
</template>

<script setup>
defineProps({
   color: {
      type: String,
      default: '#3366FF' 
   }
});
</script>
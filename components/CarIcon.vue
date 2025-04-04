<template>
   <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
         d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
         :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path
         d="M15.0004 14C16.1049 14 17.0004 13.1046 17.0004 12C17.0004 10.8954 16.1049 10 15.0004 10C13.8958 10 13.0004 10.8954 13.0004 12C13.0004 13.1046 13.8958 14 15.0004 14Z"
         :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path
         d="M3 12H1V6L3 1H12L16 6H17C17.5304 6 18.0391 6.21071 18.4142 6.58579C18.7893 6.96086 19 7.46957 19 8V12H17M13 12H7M1 6H16M10 6V1"
         :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
   </svg>
</template>

<script setup>
defineProps({
   color: {
      type: String,
      required: true
   }
});
</script>
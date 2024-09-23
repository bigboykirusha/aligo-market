<template>
   <div class="container">
      <Header />
      <NotFound />
      <Footer />
   </div>
</template>

<script setup lang="ts">
import NotFound from './components/NotFound.vue';

</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
   min-height: 100vh;
   justify-content: space-between;
}
</style>
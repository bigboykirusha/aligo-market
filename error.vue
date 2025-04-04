<template>
   <div class="container">
      <Header />
      <NotFound />
      <Footer />
   </div>
</template>

<script setup>
import NotFound from './components/NotFound.vue';
</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
}
</style>
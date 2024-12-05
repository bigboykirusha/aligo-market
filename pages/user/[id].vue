<template>
   <div class="wrapper">
      <UserInfo :userId="userId" />
      <div class="block">
         <CardListUser :userId="userId" title="Объявления пользователя" />
         <ReviewListUser :userId="userId" />
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = ref(route.params.id);

watch(() => route.params.id, (newId) => {
   userId.value = newId;
});
</script>

<style scoped lang="scss">
.wrapper {
   max-width: 1312px;
   width: 100%;
   margin: 0 auto;
   padding: 0 16px;
   display: flex;
   flex-direction: row;
   gap: 40px;
   margin-top: 158px;
   justify-content: space-between;
   margin-bottom: 24px;

   @media  (max-width: 768px) {
      margin-top: 70px;
      margin-bottom: 94px;
      flex-direction: column;
   }
}

.block {
   display: flex;
   width: 100%;
   flex-direction: column;
   gap: 40px;
}
</style>
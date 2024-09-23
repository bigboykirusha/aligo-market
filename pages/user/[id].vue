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
   padding: 0 16px;
   display: flex;
   flex-direction: row;
   gap: 40px;
   margin: 158px auto;
   justify-content: space-between;
   margin-bottom: 72px;

   @media screen and (max-width: 768px) {
      margin-top: 120px;
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
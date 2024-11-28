<template>
   <button class="complain-button">
      <img class="complain-button__icon" src="../assets/icons/alert.svg" alt="Иконка" />
      <span class="complain-button__text">Пожаловаться на объявление</span>
   </button>
</template>

<script>
export default {
   name: "ComplainButton"
};
</script>

<style scoped lang="scss">
.complain-button {
   background-color: #d6efff;
   border-radius: 6px;
   margin-top: 8px;
   padding: 12px;
   height: 34px;
   display: flex;
   align-items: center;
   gap: 8px;
   border: none;
   cursor: pointer;

   &__icon {
      width: 16px;
      height: 16px;
   }

   &__text {
      color: #3366ff;
      font-size: 14px;
   }
}
</style>
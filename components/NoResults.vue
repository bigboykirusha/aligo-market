<template>
   <div class="no-results">
      <div class="no-results__content">
         <img src="../assets/icons/sad-smile.svg" alt="No Results" class="no-results__icon" />
         <p v-if="!isSearchPage" class="no-results__description">Установите более мягкие критерии поиска или выберите
            другой регион поиска
            объявлений</p>
         <div v-else class="no-results__text">
            <p>По вашему запросу ничего не найдено, попробуйте сформулировать иначе</p>
            <p><span @click="toggleSaved">Подпишитесь на обновления</span>, и мы уведомим вас, когда объявление появится
            </p>
         </div>
      </div>
   </div>
</template>

<script setup>
import { useRoute } from '#app';
import { useLoginModalStore } from '~/store/loginModal';
import { useUserStore } from '~/store/user';

const route = useRoute();
const loginModalStore = useLoginModalStore();
const userStore = useUserStore();
const isSearchPage = computed(() => route.path.startsWith('/search'));

const toggleSaved = () => {
   if (!userStore.isLoggedIn) {
      loginModalStore.openLoginModal();
   }
};
</script>

<style lang="scss" scoped>
.no-results {
   text-align: left;

   &__title {
      font-size: 24px;
      font-weight: bold;
      color: #323232;
      margin-bottom: 16px;
   }

   &__content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;
   }

   &__icon {
      width: 40px;
      height: 40px;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__description {
      font-size: 16px;
      max-width: 400px;
      color: #323232;
   }

   &__text {
      display: flex;
      flex-direction: column;
      font-weight: 400;
      max-width: 800px;
      font-size: 16px;
      color: #323232;

      span {
         text-decoration: underline;
         color: #3366FF;
         cursor: pointer;
      }
   }
}
</style>
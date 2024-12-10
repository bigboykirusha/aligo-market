<template>
   <div class="container">
      <CreateAdForm v-if="!isAdSended" @sendAd="handleSendAd" />
      <SaveAdPopup v-if="isPopupVisible && isAnyFieldFilled" :title="'Хотите сохранить объявление в черновики?'"
         :isVisible="isPopupVisible" @close="closePopup" @save="saveAd" @discard="discardAd" />
   </div>
   <CreateAdComplite v-if="isAdSended" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCreateStore } from '../store/create.js';
import { useUserStore } from '../store/user.js';
import { useTabsStore } from '~/store/tabsStore.js';
import { useRouter } from '#vue-router';
import { publishFromArchive } from '../services/apiClient.js';

const createStore = useCreateStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();

const isAdSended = ref(false);
const isPopupVisible = ref(false);
const router = useRouter();

createStore.initializeUserData();

const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled);  // Проверка на наличие заполненных полей

// Показывать попап перед переходом на другую страницу, если есть незаполненные поля
router.beforeEach((to, from, next) => {
   if (isAnyFieldFilled.value && !isAdSended.value) {
      isPopupVisible.value = true;  // Показываем попап, если есть незаполненные поля и объявление не отправлено
      next(false);  // Останавливаем переход, пока не будет решено
   } else {
      next();  // Разрешаем переход
   }
});

// Обработка отправки объявления
const handleSendAd = async () => {
   if (createStore.id) {
      if (createStore.is_in_archive) {
         await publishFromArchive(createStore.id);
         await createStore.updateCarAd();
      } else {
         await createStore.updateCarAd();
      }
   } else {
      await createStore.sendCarAd();
   }

   if (createStore.is_draft === 1) {
      router.push('/');  // Переход на главную страницу после сохранения черновика
   } else {
      isAdSended.value = true;
   }
   createStore.resetParams();
   tabsStore.resetTabs();
};

const saveAd = async () => {
   router.push('/');  // Переход на главную страницу после сохранения
   createStore.setIsDraft(1);  // Устанавливаем статус черновика
   await createStore.sendCarAd();
   createStore.resetParams();
   await userStore.fetchUserCounts();
   isPopupVisible.value = false;  // Закрываем попап
   tabsStore.resetTabs();
};

const discardAd = () => {
   createStore.resetParams();
   router.push('/');  // Переход на главную страницу после отказа
   isPopupVisible.value = false;  // Закрываем попап
   tabsStore.resetTabs();
};

const closePopup = () => {
   isPopupVisible.value = false;
};
</script>

<style scoped lang="scss">
.container {
   flex: 1;
   height: 100%;
   max-width: 1312px;
   width: 100%;
   padding: 0 16px;
   padding-bottom: 16px;
   margin: 0 auto;
}
</style>

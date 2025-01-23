<template>
   <div class="container">
      <CreateAdForm v-if="!isAdSended" @sendAd="handleSendAd" @saveAd="handleSaveAd" />
      <SaveAdPopup v-if="isPopupVisible && isAnyFieldFilled" :title="'Хотите сохранить объявление в черновики?'"
         :isVisible="isPopupVisible" @close="closePopup" @save="saveAd" @discard="discardAd" />
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCreateStore } from '../store/create.js';
import { useUserStore } from '../store/user.js';
import { useTabsStore } from '~/store/tabsStore.js';
import { useRouter } from '#vue-router';
import { publishFromArchive } from '../services/apiClient.js';
import { usePopupStore } from '../store/popup.js';

const createStore = useCreateStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const popupStore = usePopupStore();

const isAdSended = ref(false);
const isPopupVisible = ref(false);
const router = useRouter();

createStore.initializeUserData();

const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled);  // Проверка на наличие заполненных полей

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
      isAdSended.value = 1;
   } else if (createStore.is_draft === 0) {
      isAdSended.value = 2;
   }
   router.push('/');
   createStore.resetParams();
   tabsStore.resetTabs();
};

const handleSaveAd = () => {
   isPopupVisible.value = true;
};

const saveAd = async () => {
   createStore.setIsDraft(1);
   await createStore.sendCarAd();
   createStore.resetParams();
   await userStore.fetchUserCounts();
   isPopupVisible.value = false;
   tabsStore.resetTabs();
   router.push('/');
};

const discardAd = () => {
   createStore.resetParams();
   isPopupVisible.value = false;
   tabsStore.resetTabs();
   router.push('/');
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

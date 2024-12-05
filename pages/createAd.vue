<template>
   <div class="container">
      <div v-if="!isAdSended">
         <CreateAdForm @sendAd="handleSendAd" />
      </div>
      <div v-else>
         <CreateAdComplite />
      </div>
      <SaveAdPopup v-if="isPopupVisible && isAnyFieldFilled" :title="'Хотите сохранить объявление в черновики?'"
         :isVisible="isPopupVisible" @close="closePopup" @save="saveAd" @discard="discardAd" />
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useCreateStore } from '../store/create.js';
import { useUserStore } from '../store/user.js';
import { publishFromArchive } from '../services/apiClient.js';

const createStore = useCreateStore();
const userStore = useUserStore();
const isAdSended = ref(false);
const isPopupVisible = ref(false);

createStore.initializeUserData();

const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled);

onBeforeRouteLeave((to, from, next) => {
   if (isAnyFieldFilled.value) {
      isPopupVisible.value = true;
      savedRoute.value = to;
      nextFunction.value = next;
   } else {
      next();
   }
});

const beforeUnloadHandler = (event) => {
   if (isAnyFieldFilled.value) {
      event.preventDefault();
      event.returnValue = '';
   }
};

onMounted(() => {
   window.addEventListener('beforeunload', beforeUnloadHandler);
});

onBeforeUnmount(() => {
   window.removeEventListener('beforeunload', beforeUnloadHandler);
});

const handleSendAd = async () => {
   await handleAdAction(0);
   isAdSended.value = true;
};

const saveAd = async () => {
   createStore.setIsDraft(1);
   await createStore.sendCarAd();
   createStore.resetParams();
   await userStore.fetchUserCounts();
   closePopup();
   nextFunction.value();
};

const handleAdAction = async (draftStatus) => {
   createStore.setIsDraft(draftStatus);
   if (createStore.id) {
      if (createStore.is_in_archive) {
         await publishFromArchive(createStore.id);
         await createStore.updateCarAd()
      } else { await createStore.updateCarAd() }
   } else {
      await createStore.sendCarAd();
   }
   isAdSended.value = true;
};

const closePopup = () => {
   isPopupVisible.value = false;
};

const discardAd = () => {
   createStore.resetParams();
   closePopup();
   nextFunction.value();
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

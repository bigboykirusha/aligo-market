<template>
   <div class="container">
      <div v-if="!isAdSended">
         <CreateAdMenu @selectionChanged="handleSelectionChanged" />
         <div v-if="isSelectionComplete">
            <CreateAdForm @sendAd="handleSendAd" />
         </div>
      </div>
      <div v-else>
         <CreateAdComplite />
      </div>
      <SaveAdPopup v-if="isPopupVisible && isSelectionComplete && isAnyFieldFilled"
         :title="'Хотите сохранить объявление в черновики?'" :isVisible="isPopupVisible" @close="closePopup"
         @save="saveAd" @discard="discardAd" />
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useCreateStore } from '../store/create.js';
import { useUserStore } from '../store/user.js';
import { useRoute } from 'vue-router';
import { publishFromArchive } from '../services/apiClient.js'

const route = useRoute();

const createStore = useCreateStore();
const userStore = useUserStore();
const savedRoute = ref(null);
const nextFunction = ref(null);
const selectedItem = ref({ main: null, sub: null });
const isAdSended = ref(false);
const isPopupVisible = ref(false);

createStore.initializeUserData();

const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled);
const isSelectionComplete = computed(() => {
   return selectedItem.value.main === 'auto' &&
      (selectedItem.value.sub === 'Новые' || selectedItem.value.sub === 'C пробегом');
});

watch(isSelectionComplete, (newVal, oldVal) => {
   if (oldVal && !newVal) {
      isPopupVisible.value = true;
   }
});

onBeforeRouteLeave((to, from, next) => {
   if (isSelectionComplete.value && isAnyFieldFilled.value) {
      isPopupVisible.value = true;
      savedRoute.value = to;
      nextFunction.value = next;
   } else {
      next();
   }
});

const handleSendAd = async () => {
   isAdSended.value = true;
   createStore.setIsDraft(0);

   if (createStore.id) {
      if (createStore.is_in_archive) {
         await createStore.updateCarAd();
         await publishFromArchive(createStore.id);
      } else if (createStore.is_published) {
         await createStore.updateCarAd();
         await publishFromArchive(createStore.id);
      } else {
         await createStore.updateCarAd();
      }
   } else {
      await createStore.sendCarAd();
   }
   createStore.resetParams();
   await userStore.fetchUserCounts();
};

const saveAd = async () => {
   createStore.setIsDraft(1);
   if (createStore.id) {
      if (createStore.is_in_archive) {
         await publishFromArchive(createStore.id);
         createStore.setIsDraft(1);
         await createStore.updateCarAd();
      } else if (!createStore.is_published) {
         await publishFromArchive(createStore.id);
         createStore.setIsDraft(1);
         await createStore.updateCarAd();
      } else {
         await createStore.updateCarAd();
      }
   } else {
      await createStore.sendCarAd();
   }
   createStore.resetParams();
   await userStore.fetchUserCounts();
   closePopup();
   nextFunction.value();
};


const closePopup = async () => {
   isPopupVisible.value = false;
};

const discardAd = async () => {
   createStore.resetParams();
   closePopup();
   nextFunction.value();
};

const handleSelectionChanged = (item) => {
   selectedItem.value = item;
   updateConditionId(item);
};

const updateConditionId = (item) => {
   if (item.main === 'auto') {
      if (item.sub === 'Новые') {
         createStore.setConditionId(1);
      } else if (item.sub === 'C пробегом') {
         createStore.setConditionId(2);
      } else {
         createStore.setConditionId(null);
      }
   }
   createStore.updateStateId();
};

onMounted(() => {
   const main = route.query.main || null;
   const sub = route.query.sub || null;
   selectedItem.value = { main, sub };
});
</script>

<style scoped lang="scss">
.container {
   flex: 1;
   height: 100%;
   max-width: 1312px;
   width: 100%;
   padding: 0 16px;
   margin: 0 auto;
}
</style>

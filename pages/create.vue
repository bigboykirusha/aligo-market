<template>
   <div class="container">
      <!-- Показываем CreateAdForm только после загрузки данных -->
      <CreateAdForm v-if="!isLoading" @sendAd="handleSendAd" @saveAd="handleSaveAd" :isPublishing="isPublishing"
         :isSaving="isSaving" />
      <SaveAdPopup v-if="isPopupVisible && isAnyFieldFilled" title="Хотите сохранить объявление в черновики?"
         :isVisible="isPopupVisible" @close="closePopup" @save="saveAd" @discard="discardAd" />
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useCreateStore } from '../store/create.js';
import { useUserStore } from '../store/user.js';
import { useTabsStore } from '~/store/tabsStore.js';
import { useRouter, useRoute, onBeforeRouteLeave } from '#vue-router';
import { useCookie } from '#app';

// Инициализация стора и роутинга
const createStore = useCreateStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const router = useRouter();
const route = useRoute();

// Состояния компонента
const isPopupVisible = ref(false);
const isPublishing = ref(false);
const isSaving = ref(false);
const isLoading = ref(true);

// Проверяем, заполнены ли поля
const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled);

// Функция отправки объявления
const handleSendAd = async () => {
   isPublishing.value = true;
   try {
      const response = await createStore.setField('is_draft', 0);
      if (!response?.success) throw response.error;
   } catch (error) {
      console.error('Ошибка отправки объявления:', error);
   } finally {
      setTimeout(() => {
         router.push('/profile/ads/all');
         isPublishing.value = false;
      }, 500);
   }
};

// Функция сохранения в черновики
const saveAd = async () => {
   isSaving.value = true;
   try {
      const response = await createStore.setField('is_draft', 1);
      if (!response?.success) throw response.error;
   } catch (error) {
      console.error('Ошибка при сохранении объявления:', error);
   } finally {
      setTimeout(() => {
         router.push('/profile/ads/drafts');
         isSaving.value = false;
      }, 500);
   }
};

// Открытие попапа для сохранения в черновики
const handleSaveAd = () => {
   saveAd()
};

// Закрытие попапа без сохранения
const closePopup = () => {
   isPopupVisible.value = false;
};

// Отмена объявления и возврат на главную
const discardAd = () => {
   resetState();
};

// Сброс состояния
const resetState = () => {
   createStore.resetParams();
   tabsStore.resetTabs();
   userStore.fetchUserCounts();
   isPopupVisible.value = false;
};

// Автоматическое обновление параметров в URL
watch(
   () => [createStore.id, createStore.id_user_owner_ads],
   ([id, owner]) => {
      if (id && owner) {
         router.replace({ query: { ...route.query, id, id_user_owner_ads: owner } });
      }
   },
   { immediate: true }
);

const userData = useCookie('userData');

// Проверка данных из cookies при монтировании компонента
onMounted(async () => {
   const urlId = route.query.id_user_owner_ads;

   if (userData.value) {
      const { token, user_id } = userData.value;
      if (token && user_id.toString() === urlId) {
         console.log('Токен существует и user_id совпадает с id в URL.');
         await createStore.setStoreFromApi(route.query.id);
      } else {
         console.log('Токен или user_id не совпадают.');
      }
   } else {
      console.log('Данные пользователя не найдены в cookies.');
   }

   isLoading.value = false;
});

// Автосохранение перед выходом со страницы
onBeforeRouteLeave((to, from, next) => {
   if (!createStore.id) {
      next();
      return;
   }
   createStore.autoSaveField('is_finished', 1);
   resetState();
   next();
});
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
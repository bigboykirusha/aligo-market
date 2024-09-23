<template>
   <div class="characteristics">
      <BlockTitle text="Параметры объявления" />
      <div class="characteristics__content">
         <AutosTextAreaTemplate label="Описание" placeholder="Нажмите для ввода" :option="createStore.ads_description"
            @update:option="handleDescription" />
         <AutosAddressInput label="Адрес" @update:address="handlePlace" :option="createStore.place_inspection"/>
         <AutosTextTemplate label="Цена, ₽" placeholder="Нажмите для ввода" :option="createStore.amount"
            validationType="number" @update:option="handleAmount" :isEmpty="checkIfEmpty(createStore.amount)"/>
      </div>
      <BlockTitle text="Контакты" />
      <div class="characteristics__content">
         <PhoneTextCreate label="Телефон" placeholder="Нажмите для ввода" :option="createStore.phone"
            @update:option="handlePhone" />
         <AutosTextTemplate label="Имя пользователя" placeholder="Нажмите для ввода" :option="createStore.username"
            @update:option="handleUsername" :isEmpty="checkIfEmpty(createStore.username)"/>
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Метод коммуникации"
            :initialSelectedOption="createStore.communication_method_id" :options="CommunicationMethodOptions"
            @updateSort="handleCommunicationMethodUpdate" />
         <AutosTextTemplate label="Email" placeholder="Нажмите для ввода" :option="createStore.email"
            validationType="email" @update:option="handleEmail" :isEmpty="checkIfEmpty(createStore.email)"/>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCreateStore } from '../store/create';
import { getCommunicationMethod } from '../services/apiClient';

const loading = ref(true);
const createStore = useCreateStore();
const isMobile = ref(false);
const CommunicationMethodOptions = ref([]);

const fetchOptions = async () => {
   try {
      await Promise.all([
         fetchCommunicationMethod()
      ]);
      loading.value = false;
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const fetchCommunicationMethod = async () => {
   try {
      CommunicationMethodOptions.value = await getCommunicationMethod();
   } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
   }
};

const checkIfEmpty = (item) => {
   if (createStore.id && !item) {
      return true; 
   }
   return false;
};

const handleDescription = (selectedOptions) => createStore.setAdsDescription(selectedOptions);
const handleUsername = (selectedOptions) => createStore.setUsername(selectedOptions);
const handleEmail = (selectedOptions) => createStore.setEmail(selectedOptions);
const handlePhone = (selectedOptions) => createStore.setPhone(selectedOptions);
const handlePlace = (selectedOptions) => createStore.setPlaceInspection(selectedOptions);
const handleAmount = (selectedOptions) => createStore.setAmount(selectedOptions);
const handleCommunicationMethodUpdate = (value) => createStore.setCommunicationMethodId(value);

onMounted(() => {
   fetchOptions();

   if (window.innerWidth <= 1250) {
      isMobile.value = true;
   }

   window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 1250;
   });
});

onUnmounted(() => {
   window.removeEventListener('resize', () => { });
});
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: column;
   gap: 40px;

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }
}
</style>
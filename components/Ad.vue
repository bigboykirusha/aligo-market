<template>
   <div class="characteristics">
      <BlockTitle text="Параметры объявления" />
      <div class="characteristics__content">
         <AutosTextAreaTemplate label="Описание" placeholder="Нажмите для ввода" :option="createStore.ads_description"
            @update:option="(value) => handleFieldUpdate('ads_description', value)" />
         <AutosTextTemplate label="Цена, ₽" placeholder="Нажмите для ввода" :option="createStore.amount"
            validationType="number" @update:option="(value) => handleFieldUpdate('amount', value)" />
      </div>
      <BlockTitle text="Местоположение" />
      <div class="characteristics__content">
         <CityAutosCreate @updateCity="handleCitySelection" />
         <AutosAddressInput label="Место осмотра"
            @update:address="(value) => handleFieldUpdate('place_inspection', value)"
            :option="createStore.place_inspection" />
      </div>
      <BlockTitle text="Контакты" />
      <div class="characteristics__content">
         <PhoneTextCreate label="Телефон" placeholder="Нажмите для ввода" :option="createStore.phone"
            @update:option="(value) => handleFieldUpdate('phone', value)" />
         <AutosTextTemplate v-show="!userStore.username" label="Имя пользователя" placeholder="Нажмите для ввода"
            validationType="name" :option="createStore.username"
            @update:option="(value) => handleFieldUpdate('username', value)" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Способ связи" :initialSelectedOption="createStore.communication_method_id"
            :options="CommunicationMethodOptions"
            @updateSort="(value) => handleFieldUpdate('communication_method_id', value)" />
         <AutosEmailInput label="Email" placeholder="Нажмите для ввода" :option="createStore.email"
            validationType="email" @update:option="(value) => handleFieldUpdate('email', value)" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCreateStore } from '../store/create';
import { useUserStore } from '~/store/user';
import { getCommunicationMethod } from '../services/apiClient';
import { fetchDataWithCache } from '../services/createUtils';

const loading = ref(true);
const createStore = useCreateStore();
const userStore = useUserStore();
const CommunicationMethodOptions = ref([]);

const handleFieldUpdate = (field, value) => {
   createStore.setField(field, value);
};

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
   CommunicationMethodOptions.value = await fetchDataWithCache('CommunicationMethod', getCommunicationMethod);
};

const handleCitySelection = (value) => {
   createStore.setField('city_id', value.id);
   createStore.setField('city_name', value.title);
};

onMounted(() => {
   fetchOptions();
});
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: column;
   gap: 40px;

   @media (max-width: 768px) {
      padding-bottom: 70px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }
}
</style>
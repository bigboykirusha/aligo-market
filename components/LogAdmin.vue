<template>
   <div class="log-table">
      <div class="log-table__header">
         <div class="log-table__controls">
            <div class="log-table__search">
               <img src="../assets/icons/search-blue.svg" alt="Иконка поиска" class="log-table__search-icon" />
               <input type="text" placeholder="Поиск но номеру лога..." class="log-table__search-input" />
            </div>
            <button @click="saveLogs" class="log-table__button">
               <img src="../assets/icons/save-icon.svg" alt="Иконка профиля" class="log-table__icon" /> Скачать логи
            </button>
         </div>
      </div>
      <div class="log-table__content">
         <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" :defaultColDef="defaultColDef"
            class="ag-theme-quartz log-table__grid" :pagination="true" :paginationPageSize="20" :rowHeight="40" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { getUserDetails } from '../services/apiClient';

const rowData = ref([]);
const logCount = ref(0);

const colDefs = ref([
   { headerName: "ID", field: "id", flex: 1 },
   { headerName: "Дата", field: "auth_time", flex: 1 },
   { headerName: "Время", valueGetter: params => new Date(params.data.auth_time).toLocaleTimeString(), flex: 1 },
   { headerName: "Действие", field: "action", flex: 1 },
   {
      headerName: "Ссылка",
      field: "auth_url",
      cellRenderer: params => {
         if (!params.value) return '';
         return `<a href="${params.value}" target="_blank">${params.value}</a>`;
      },
      flex: 1
   }
]);

const defaultColDef = ref({
   sortable: true,
   filter: true,
   headerClass: 'custom-header',
   resizable: true,
});

const fetchLogData = async () => {
   try {
      const response = await getUserDetails();
      rowData.value = response.data.users_auth_events.map(event => ({
         id: event.id,
         auth_time: event.auth_time,
         action: 'Авторизация',
         auth_url: event.auth_url,
      }));
      logCount.value = rowData.value.length;
      console.log('Логи:', rowData.value);
   } catch (error) {
      console.error('Ошибка при получении данных логов:', error);
   }
};

const saveLogs = () => {
   const headers = colDefs.value.map(col => col.headerName).join(',');
   const csvData = rowData.value.map(row => [
      row.id,
      row.auth_time,
      new Date(row.auth_time).toLocaleTimeString(),
      row.action,
      row.auth_url
   ].join(',')).join('\n');

   const csvContent = `data:text/csv;charset=utf-8,${headers}\n${csvData}`;
   const encodedUri = encodeURI(csvContent);
   const link = document.createElement('a');
   link.setAttribute('href', encodedUri);
   link.setAttribute('download', 'logs.csv');
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
};

onMounted(fetchLogData);
</script>

<style scoped lang="scss">
@import "../node_modules/ag-grid-community/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/styles/ag-theme-quartz.css";

.log-table {
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 100%;

   &__button {
      padding: 8px 10px;
      font-size: 14px;
      line-height: 18px;
      background-color: #3366FF;
      color: #FFFFFF;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.3s;

      &:hover {
         background-color: #144DF8;
      }
   }

   &__icon {
      width: 16px;
      margin-right: 8px;
   }

   &__header {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      border-radius: 6px;
      align-items: center;
      margin-bottom: 16px;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
   }

   &__title {
      font-size: 24px;
      color: #003BCE;
      font-weight: 700;
      line-height: 1;
   }

   &__controls {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: flex-end;
      column-gap: 16px;
   }

   &__search {
      position: relative;
      display: flex;
      align-items: center;
      background-color: #FFFFFF;
      border-radius: 6px;
      height: 34px;
      padding: 0 10px;
      border: 1px solid #d6d6d6;
   }

   &__search-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
   }

   &__search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #323232;

      &::placeholder {
         color: #a0a0a0;
      }
   }

   &__content {
      flex-grow: 1;
      width: 100%;
      overflow-y: auto;

      ::-webkit-scrollbar {
         width: 8px;
      }

      ::-webkit-scrollbar-track {
         background: #F0F0F0;
         border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
         background: #3366FF;
         border-radius: 4px;
      }
   }

   &__grid {
      height: 100%;
      width: 100%;
   }
}

.ag-theme-quartz .ag-cell {
   font-size: 14px;
   color: #323232;
}

.ag-theme-quartz .ag-cell:empty {
   content: "-";
}

.ag-theme-quartz .settings-header {
   pointer-events: none;
   background-color: #ffffff;
}

.ag-theme-quartz .custom-header {
   font-size: 12px;
   font-weight: 400;
   color: #A8A8A8;
   background-color: #ffffff;
}

.ag-theme-quartz .ag-cell {
   border-bottom: none;
}

.ag-theme-quartz .ag-row {
   border-bottom: none;
}

.ag-theme-quartz .ag-root-wrapper {
   --ag-borders: none;
   border-radius: 6px;
}

.ag-body-vertical-scroll {
   margin-left: 16px;
}

.user-table__icon {
   width: 16px;
   height: 16px;
   margin-left: 4px;
   cursor: pointer;
}
</style>

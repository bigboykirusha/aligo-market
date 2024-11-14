<template>
   <div class="user-table">
      <div class="user-table__header">
         <div class="user-table__title">Пользователи ({{ userCount }})</div>
         <div class="user-table__controls">
            <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" placeholder="Все" />
            <div class="user-table__search">
               <img src="../assets/icons/search-blue.svg" alt="Иконка поиска" class="user-table__search-icon" />
               <input type="text" placeholder="Поиск..." class="user-table__search-input" />
            </div>
            <button @click="createNewUser" class="user-table__button">
               <img src="../assets/icons/add.svg" alt="Иконка профиля" class="user-table__icon" /> Новый профиль
            </button>
         </div>
      </div>
      <div class="user-table__content">
         <ag-grid-vue :rowData="rowData" :columnDefs="colDefs" class="ag-theme-quartz user-table__grid"
            :defaultColDef="defaultColDef" :pagination="true" :paginationPageSize="20" :rowHeight="40" />
      </div>
      <UserSettingsPopup v-if="isPopupVisible" :userData="selectedUser" :top="popupTop" :left="popupLeft"
         @close="closePopup" />
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import { getUsers } from '../services/apiClient';
import settingIcon from '../assets/icons/setting.svg';
import arrowIcon from '../assets/icons/arrow-back.svg';
import tooltipIcon from '@/assets/icons/tooltip.svg';
import { useRouter } from 'vue-router';

const router = useRouter();
const rowData = ref([]);
const userCount = ref(0);
const isPopupVisible = ref(false);
const selectedUser = ref(null);
const popupTop = ref(0);
const popupLeft = ref(0);

const defaultColDef = {
   headerClass: 'custom-header',
   resizable: false,
};

const colDefs = ref([
   {
      headerName: "",
      field: "settings",
      width: 32,
      suppressMovable: true,
      suppressSizeToFit: true,
      cellRenderer: (params) => {
         const iconWrapper = document.createElement('div');
         iconWrapper.className = 'settings-icon-wrapper';
         const icon = document.createElement('img');
         icon.src = settingIcon;
         icon.alt = "Настройки";
         icon.className = "user-table__settings-icon";
         icon.style.cursor = 'pointer';
         iconWrapper.appendChild(icon);
         icon.addEventListener("click", (event) => handleSettingsClick(params.data, event));
         return iconWrapper;
      },
      headerClass: 'settings-header',
   },
   { headerName: "ID", field: "id", valueGetter: params => params.data.unique_code || '-', flex: 1 },
   { headerName: "Имя", field: "username", valueGetter: params => params.data.username || '-', flex: 1 },
   { headerName: "Логин", field: "login", valueGetter: params => params.data.login || '-', flex: 1 },
   { headerName: "Email", field: "email", valueGetter: params => params.data.email || '-', flex: 1 },
   { headerName: "Телефон", field: "phone", valueGetter: params => params.data.phone || '-', flex: 1 },
   { headerName: "Город", field: "city", valueGetter: params => params.data.city || '-', flex: 1 },
   { headerName: "Адрес", field: "address", valueGetter: params => params.data.address || '-', flex: 1 },
   {
      headerName: "Объяв. (О|С|А)",
      field: "ads",
      flex: 1,
      headerTooltip: "Подсказка для Объяв. (О|С|А)",
      cellRenderer: () => '<div>-</div>',
      headerClass: 'header-with-icon',
   },
   {
      headerName: "Объяв. (О|С|А)",
      field: "ads",
      flex: 1,
      headerTooltip: "Подсказка для Объяв. (О|С|А)",
      cellRenderer: () => '<div>-</div>',
      headerClass: 'header-with-icon',
   },
   {
      headerName: "",
      field: "arrow",
      width: 32,
      suppressMovable: true,
      suppressSizeToFit: true,
      cellRenderer: (params) => {
         const iconWrapper = document.createElement('div');
         iconWrapper.className = 'arrow-icon-wrapper';
         const icon = document.createElement('img');
         icon.src = arrowIcon;
         icon.alt = "Стрелка";
         icon.className = "user-table__arrow-icon";
         icon.style.cursor = 'pointer';
         iconWrapper.appendChild(icon);
         icon.addEventListener("click", () => handleArrowClick(params.data));
         return iconWrapper;
      },
      headerClass: 'settings-header',
   },
]);

const sortOptions = [
   { label: 'Частные профили', value: 'desc' },
   { label: 'Коммерческие', value: 'asc' },
   { label: 'Заблокированные', value: 'asc' },
];

const createNewUser = () => {
   const newUser = {
      id: rowData.value.length + 1,
      username: "Новый пользователь",
      login: "новый_логин",
      email: "-",
      phone: "-",
      city: "-",
      address: "-",
   };
   rowData.value.unshift(newUser);
   userCount.value = rowData.value.length;
};

const handleSortUpdate = (order_by) => {
   console.log(order_by);
};

const fetchData = async () => {
   try {
      const response = await getUsers();
      rowData.value = response.data;
      userCount.value = rowData.value.length;
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   }
};

const handleSettingsClick = (userData, event) => {
   selectedUser.value = userData;
   isPopupVisible.value = true;

   const rect = event.currentTarget.getBoundingClientRect();
   popupTop.value = rect.top + window.scrollY;
   popupLeft.value = rect.left + window.scrollX;
};

const handleArrowClick = (userData) => {
   const userId = userData.id;
   router.push(`/profile/${userId}`);
};

const closePopup = () => {
   isPopupVisible.value = false;
};

onMounted(fetchData);
</script>

<style lang="scss">
@import "../node_modules/ag-grid-community/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/styles/ag-theme-quartz.css";

.user-table {
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 100%;

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
      column-gap: 16px;
   }

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
      width: 18px;
      height: 18px;
      margin-right: 8px;
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

   &__settings-icon {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
   }

   &__arrow-icon {
      transform: rotate(180deg);
      width: 14px;
   }

   &__content {
      flex-grow: 1;
      width: 100%;
      height: 100%;
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
      overflow: visible;
   }
}

.settings-icon-wrapper {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;

   &:hover .user-table__settings-icon {
      transform: rotate(-45deg);
   }
}

.arrow-icon-wrapper {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
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

.ag-theme-quartz .ag-column-resizer {
   display: none !important;
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

.header-with-icon {
   font-size: 12px;
   font-weight: 400;
   color: #A8A8A8;
   background-color: #ffffff;
}

.header-with-icon::after {
   content: url('../assets/icons/tooltip.svg');
   display: inline-block;
   width: 16px;
   height: 16px;
   margin-left: 2px;
   cursor: pointer;
   vertical-align: middle;
}

.ag-theme-quartz .ag-paging-panel {
   display: none;
}
</style>

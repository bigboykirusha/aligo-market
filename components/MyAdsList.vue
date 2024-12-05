<template>
   <div class="cards">
      <div v-if="!isArchivePage && adsCount > 4" class="cards__header">
         <div class="cards__check">
            <input type="checkbox" id="select-all" class="cards__select-all" :checked="areAllSelected"
               @change="toggleSelectAll" />
            <AdsDropdown v-if="isAdsPage" :options="sortOptions" @updateSort="handleSortUpdate"
               placeholder="Выбрать объявления" />
         </div>
         <template v-if="isAdsPage">
            <button v-if="showTakeOffPublication" class="cards__selection-button" @click="handleUnpublishClick">
               <img src="@/assets/icons/stop.svg" alt="Снять с публикации" />
               <span>Снять с публикации</span>
            </button>
            <button v-if="false" class="cards__selection-button" @click="handleRepublish">
               <img src="@/assets/icons/again.svg" alt="Опубликовать снова" />
               <span>Опубликовать снова</span>
            </button>
         </template>
         <button class="cards__selection-button" @click="handleArchiveClick">
            <img :src="archiveIcon" alt="Удалить" />
            <span>Переместить в архив</span>
         </button>
      </div>
      <div class="cards__main">
         <MyAdsCardSkeleton v-if="loading" v-for="index in 2" :key="index" />
         <MyAdsCard v-else v-for="ad in adsMain" :key="ad.id" v-bind="mapAdProps(ad)"
            @updateData="emit('refreshAds')" />
      </div>
      <div v-if="!isArchivePage && adsCount < 5" class="cards__selection">
         <div class="cards__popup">
            <input type="checkbox" id="select-all-items" class="cards__selection-checkbox" :checked="areAllSelected"
               @change="toggleSelectAll" />
            <span class="cards__selection-count">{{ selectedCount }} выбранных</span>
         </div>
         <template v-if="isAdsPage">
            <button v-if="showTakeOffPublication" class="cards__selection-button" @click="handleUnpublishClick">
               <img src="@/assets/icons/stop.svg" alt="Снять с публикации" />
               <span>Снять с публикации</span>
            </button>
            <button v-if="showRepublish" class="cards__selection-button" @click="handleRepublish">
               <img src="@/assets/icons/again.svg" alt="Опубликовать снова" />
               <span>Опубликовать снова</span>
            </button>
         </template>
         <button class="cards__selection-button" @click="handleArchiveClick">
            <img :src="archiveIcon" alt="Удалить" />
            <span>Переместить в архив</span>
         </button>
      </div>
      <PopupDialog v-if="showArchiveConfirm" :message="'Вы уверены, что хотите перенести объявление в архив?'"
         :confirmText="'Перенести'" :cancelText="'Отменить'" :closeIcon="closeIcon" @confirm="confirmArchive"
         @cancel="closeConfirmPopup" @close="closeConfirmPopup" />
      <PopupDialog v-if="showUnpublishConfirm" :message="'Вы уверены, что хотите снять объявление с публикации?'"
         :confirmText="'Снять'" :cancelText="'Отменить'" :closeIcon="closeIcon" @confirm="confirmUnpublish"
         @cancel="closeConfirmPopup" @close="closeConfirmPopup" />
   </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useSelectedAdsStore } from '../store/selectedAds';
import { useUserStore } from '../store/user';
import { useSelectedDraftsStore } from '../store/selectedDrafts';
import archiveIcon from "../assets/icons/archive.svg";
import closeIcon from '../assets/icons/close.svg';

const route = useRoute();
const isArchivePage = computed(() => route.path.includes('/myself/archive'));
const isAdsPage = computed(() => route.path.includes('/myself/ads'));

const showArchiveConfirm = ref(false);
const showUnpublishConfirm = ref(false);

const confirmArchive = async () => {
   await handleDeleteAds();
   console.log('Переместить в архив');
   closeConfirmPopup();
};

const confirmUnpublish = async () => {
   await handleTakeOffPublication();
   closeConfirmPopup();
};

const closeConfirmPopup = () => {
   showArchiveConfirm.value = false;
   showUnpublishConfirm.value = false;
};

const props = defineProps({
   adsMain: {
      type: Array,
      required: true,
   },
});

const emit = defineEmits(['updateSort', 'refreshAds']);

const sortOptions = [
   { label: 'Опубликованные', value: '1' },
   { label: 'Снятые с публикации', value: '0' },
];

const handleSortUpdate = (order_by) => {
   emit('updateSort', order_by);
   showRepublish.value = order_by === '0';
   showTakeOffPublication.value = order_by === '1';
   store.value.deselectAll();
};

const loading = ref(true);
const store = ref(null);
const userStore = useUserStore();

watchEffect(() => {
   if (isAdsPage.value) {
      store.value = useSelectedAdsStore();
   } else if (route.path.includes('/myself/drafts')) {
      store.value = useSelectedDraftsStore();
   }
});
const adsCount = computed(() => userStore.countAds);
const selectedCount = computed(() => store.value?.selectedAdIds.length || 0);

const areAllSelected = computed(() => {
   const allIds = props.adsMain.map(ad => ad.id);
   return allIds.length > 0 && allIds.every(id => store.value.selectedAdIds.includes(id));
});

const toggleSelectAll = async (event) => {
   const allIds = props.adsMain.map(ad => ad.id);
   if (event.target.checked) {
      await store.value.selectAll(allIds);
   } else {
      await store.value.deselectAll();
   }
};

watch(() => props.adsMain, (newAds) => {
   loading.value = !newAds.length;
});

const handleDeleteAds = async () => {
   try {
      await store.value.deleteAds(store.value.selectedAdIds);
      store.value.deselectAll();
   } catch (error) {
      console.error('Ошибка удаления:', error);
   }
   emit('refreshAds');
};

const handleTakeOffPublication = async () => {
   try {
      await store.value.takeOffPublication(store.value.selectedAdIds);
      store.value.deselectAll();
   } catch (error) {
      console.error('Ошибка снятия с публикации:', error);
   }
   emit('refreshAds');
};

const handleRepublish = async () => {
   try {
      await store.value.republish(store.value.selectedAdIds);
      store.value.deselectAll();
   } catch (error) {
      console.error('Ошибка публикации снова:', error);
   }
   emit('refreshAds');
};

const handleUnpublishClick = () => {
   if (selectedCount.value > 0) {
      showUnpublishConfirm.value = true;
   } else {
      alert('Выберите хотя бы одно объявление для снятия с публикации.');
   }
};

const handleRepublishClick = () => {
   if (selectedCount.value > 0) {
      handleRepublish();
   } else {
      alert('Выберите хотя бы одно объявление для повторной публикации.');
   }
};

const handleArchiveClick = () => {
   if (selectedCount.value > 0) {
      showArchiveConfirm.value = true;
   } else {
      alert('Выберите хотя бы одно объявление для перемещения в архив.');
   }
};

const showRepublish = ref(false);
const showTakeOffPublication = ref(false);

const mapAdProps = (ad) => ({
   id: ad.id,
   images: ad.photos || ['../assets/icons/placeholder.png'],
   description: ad.ads_parameter.ads_description || undefined,
   price: ad.ads_parameter.amount || "Цена не указана",
   place: ad.ads_parameter.place_inspection || undefined,
   brand: ad.auto_technical_specifications[0]?.brand?.title || undefined,
   model: ad.auto_technical_specifications[0]?.model?.title || undefined,
   year: ad.auto_technical_specifications[0]?.year_release?.title || undefined,
   is_published: ad.is_published || undefined,
   count_go_ad_page: ad.statistic_view.count_go_ad_page || undefined,
   count_add_to_favorite: ad.statistic_view.count_add_to_favorite || undefined,
   count_who_view_seller_contact: ad.statistic_view.count_who_view_seller_contact || undefined,
   main_id: ad.main_id || undefined,
   created_at: ad.created_at
});
</script>

<style scoped lang="scss">
.cards {
   width: 100%;
   position: relative;

   .cards__header {
      display: flex;
      position: relative;
      width: 100%;
      background-color: #ffffff;
      align-items: center;
      gap: 40px;
      z-index: 5;
      padding-bottom: 16px;
      padding-left: 16px;
      padding-right: 24px;

      @media (max-width: 991px) {
         gap: 10px;
         justify-content: space-between;
      }
   }

   &__main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      height: auto;
      overflow-y: auto;
      padding: 2px 0;

   }

   &__check {
      display: flex;
      gap: 16px;
      align-items: center;

      @media (max-width: 991px) {
         margin-right: auto;
      }
   }

   &__select-all,
   &__selection-checkbox {
      width: 16px;
      height: 16px;
   }

   &__popup {
      display: flex;
      align-items: center;
      margin-right: auto;
   }

   &__selection {
      display: flex;
      align-items: center;
      border-radius: 6px;
      border: 1px solid #ccc;
      padding: 16px;
      gap: 40px;
      margin: 16px 0;

      @media (max-width: 991px) {
         gap: 24px;
      }

      @media (max-width: 480px) {
         padding: 8px 16px;
         margin-bottom: 0;
      }

      &-count {
         font-size: 14px;
         color: #323232;
         margin-left: 8px;
      }

      &-button {
         display: flex;
         align-items: center;
         color: #3366FF;
         padding: 5px 10px;
         border-radius: 12px;
         background-color: transparent;
         gap: 8px;
         font-size: 14px;
         border: none;
         cursor: pointer;
         transition: all 0.3s ease;

         &:hover {
            background-color: #D6EFFF;
         }

         img {
            width: 16px;
            height: 16px;
         }

         @media (max-width: 991px) {
            min-width: 34px;
            padding: 0 9px;
            background: #D6EFFF;
            border-radius: 6px;
            height: 34px;

            span {
               display: none;
            }
         }
      }
   }
}

.switcher {
   display: flex;
   background-color: #EEEEEE;
   border-radius: 4px;
   margin-bottom: 26px;
   width: fit-content;

   &__item {
      padding: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: inherit;
      transition: background-color 0.3s ease;

      &:hover {
         background-color: #D6EFFF;
      }

      &:first-child {
         border: 1px solid #D6D6D6;
         border-radius: 4px 0 0 4px;
         border-right: none;
      }

      &:last-child {
         border: 1px solid #D6D6D6;
         border-radius: 0 4px 4px 0;
      }

      &--active {
         background-color: #fff;

         &:hover {
            background-color: #fff;
         }
      }

      img {
         width: 14px;
         height: 14px;
         object-fit: cover;
      }
   }
}
</style>

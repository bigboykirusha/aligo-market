<template>
   <div class="cards">
      <div v-show="pageType === 'all' || pageType === 'drafts'" class="cards__header">
         <div class="cards__check">
            <CheckboxUI :modelValue="areAllSelected" @update:modelValue="toggleSelectAll" />
            <AdsDropdown v-show="pageType === 'all'" :options="sortOptions" @updateSort="handleSortUpdate"
               placeholder="Все" />
         </div>

         <button v-if="showUnpublishButton" class="cards__selection-button" @click="handleUnpublishClick">
            <img src="@/assets/icons/stop.svg" alt="Снять с публикации" />
            <span>Снять с публикации</span>
         </button>

         <button v-if="showRepublishButton" class="cards__selection-button" @click="handleRepublish">
            <img src="@/assets/icons/again.svg" alt="Опубликовать снова" />
            <span>Опубликовать снова</span>
         </button>

         <button v-if="showArchiveButton" class="cards__selection-button" @click="handleArchiveClick">
            <img :src="archiveIcon" alt="Удалить" />
            <span>Переместить в архив</span>
         </button>
      </div>

      <div class="cards__main">
         <MyPublicationsCardSkeleton v-if="isLoading" v-for="index in xCountOnPage" :key="index" />
         <MyPublicationsCard v-if="!isLoading && adsMain.length > 0" v-for="ad in adsMain" :key="ad.id"
            :pageType="props.pageType" v-bind="mapAdProps(ad)" @updateData="handleUpdateData"
            @deleteAd="handleDeleteAd" />
         <div v-if="!isLoading && adsMain.length == 0" class="my-ads__placeholder">
            <svg height="64" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M8.71484 1V4.42857C8.71484 4.6559 8.80515 4.87392 8.9659 5.03466C9.12664 5.19541 9.34466 5.28571 9.57199 5.28571H13.0006"
                  stroke="#D6D6D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
               <path
                  d="M11.2857 16.4286H2.71429C2.25963 16.4286 1.82359 16.248 1.5021 15.9265C1.18061 15.605 1 15.1689 1 14.7143V2.71429C1 2.25963 1.18061 1.82359 1.5021 1.5021C1.82359 1.18061 2.25963 1 2.71429 1H8.71429L13 5.28571V14.7143C13 15.1689 12.8194 15.605 12.4979 15.9265C12.1764 16.248 11.7404 16.4286 11.2857 16.4286Z"
                  stroke="#D6D6D6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="my-ads__placeholder-text">Объявлений пока нет</p>
            <p class="my-ads__placeholder-description">
               У вас пока нет объявлений в этой категории. Вы можете создать новое объявление, нажав на кнопку
               <nuxt-link to="/create" class="clickable" style="color: #3366FF; cursor: pointer;">
                  «Разместить объявление»
               </nuxt-link>.
            </p>
         </div>
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
import { ref, computed } from 'vue';
import archiveIcon from "../assets/icons/archive.svg";
import { useSelectedAdsStore } from '~/store/selectedAds';
import { useSelectedDraftsStore } from '~/store/selectedDrafts';
import { usePopupErrorStore } from '~/store/popupErrorStore';
import closeIcon from '../assets/icons/close.svg';

const props = defineProps({
   adsMain: { type: Array, required: true },
   isLoading: { type: Boolean, required: true },
   pageType: { type: String, required: true },
   xCountOnPage: { type: Number, required: true, default: 0 }
});
const emit = defineEmits(['updateSort', 'refreshAds', 'deleteAd']);

const showArchiveConfirm = ref(false);
const showUnpublishConfirm = ref(false);

const order_by = ref(null);
const popupErrorStore = usePopupErrorStore();

const showUnpublishButton = computed(() => props.pageType === 'all' && order_by.value === '1');
const showRepublishButton = computed(() => props.pageType === 'all' && order_by.value === '0');
const showArchiveButton = computed(() => props.pageType !== 'archive' && (props.pageType === 'all' ? order_by.value !== '2' : true));

const confirmArchive = async () => {
   await handleAction('deleteAd', 'перемещении в архив');
};

const confirmUnpublish = async () => {
   await handleAction('takeOffPublication', 'снятии с публикации');
};

const handleUnpublishClick = () => {
   if (selectedCount.value > 0) {
      showUnpublishConfirm.value = true;
   } else {
      popupErrorStore.showError('Выберите хотя бы одно объявление для снятия с публикации');
   }
};

const handleRepublish = async () => {
   await handleAction('republish', 'Опубликовать снова');
};

const handleArchiveClick = () => {
   if (selectedCount.value > 0) {
      showArchiveConfirm.value = true;
   } else {
      popupErrorStore.showError('Выберите хотя бы одно объявление для перемещения в архив');
   }
};

const closeConfirmPopup = () => {
   showArchiveConfirm.value = false;
   showUnpublishConfirm.value = false;
};

const sortOptions = [
   { label: 'Все', value: null },
   { label: 'Опубликованные', value: '1' },
   { label: 'Снятые с публикации', value: '0' },
   { label: 'На модерации', value: '2' },
];

const store = computed(() => props.pageType === 'all' ? useSelectedAdsStore() : useSelectedDraftsStore());

const selectedCount = computed(() => store.value?.selectedAdIds.length || 0);

const areAllSelected = computed(() =>
   props.adsMain.length > 0 &&
   props.adsMain.every(ad => store.value.selectedAdIds.includes(ad.id))
);

const toggleSelectAll = (value) => {
   if (!store.value) return;

   if (value) {
      const allIds = props.adsMain.map(ad => ad.id);
      store.value.selectAll(allIds);
   } else {
      store.value.deselectAll();
   }
};

const handleUpdateData = () => {
   emit('refreshAds');
};

const handleDeleteAd = (id) => {
   emit('deleteAd', id);
   showArchiveConfirm.value = false;
   showUnpublishConfirm.value = false;
};

const handleAction = async (action, message) => {
   if (selectedCount.value > 0) {
      try {
         await store.value[action](store.value.selectedAdIds);
         store.value.deselectAll();
         showArchiveConfirm.value = false;
         showUnpublishConfirm.value = false;
         emit('refreshAds');
      } catch (error) {
         console.error(`Ошибка при ${message}:`, error);
         popupErrorStore.showError(`Ошибка при ${message.toLowerCase()}. Пожалуйста, попробуйте снова.`);
      }
   } else {
      popupErrorStore.showError(`Выберите хотя бы одно объявление для ${message.toLowerCase()}.`);
   }
};

const handleSortUpdate = (value) => {
   order_by.value = value;
   emit('updateSort', value);
   store.value.deselectAll();
};

const mapAdProps = (ad) => ({
   id: ad.id,
   images: ad.photos,
   description: ad.ads_parameter?.ads_description,
   price: ad.ads_parameter?.amount,
   place: ad.ads_parameter?.place_inspection,
   brand: ad.auto_technical_specifications?.[0]?.brand?.title,
   model: ad.auto_technical_specifications?.[0]?.model?.title,
   year: ad.auto_technical_specifications?.[0]?.year_release?.title,
   is_published: ad.is_published,
   is_moderation: ad.is_moderation,
   is_not_confirmed_email: ad.is_not_confirmed_email,
   count_go_ad_page: ad.statistic_view?.count_go_ad_page,
   count_add_to_favorite: ad.statistic_view?.count_add_to_favorite,
   count_who_view_seller_contact: ad.statistic_view?.count_who_view_seller_contact,
   main_id: ad.main_id,
   created_at: ad.created_at,
   delete_after_days: ad.delete_after_days,
});
</script>

<style scoped lang="scss">
.fade-slide-enter-active,
.fade-slide-leave-active {
   transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
   opacity: 0;
   transform: translateY(20px);
}

.cards {
   width: 100%;
   position: relative;

   .cards__header {
      display: flex;
      position: relative;
      padding-right: 16px;
      width: 100%;
      background-color: #ffffff;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      z-index: 5;
   }

   &__main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: 40px;
      transition: all 0.3s ease;

      @media (max-width: 991px) {
         margin-bottom: 32px;
      }
   }

   &__check {
      display: flex;
      padding-left: 16px;
      gap: 16px;
      align-items: center;

      @media (max-width: 480px) {
         width: 100%;
      }
   }

   &__select-all,
   &__selection-checkbox {
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      width: 16px;
      height: 16px;
   }

   &__select-all {
      margin-left: 16px;
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
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
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
         padding: 6px 12px;
         height: 34px;
         border-radius: 18px;
         background-color: white;
         gap: 8px;
         font-size: 14px;
         border: none;
         cursor: pointer;
         transition: background-color 0.2s ease;

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

.my-ads {
   &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
      height: 300px;
      width: 320px;
      margin: 0 auto;
      color: #636363;
   }

   &__placeholder-icon {
      height: 64px;
   }

   &__placeholder-text {
      font-size: 14px;
      font-weight: 700;
      color: #323232;
   }

   &__placeholder-description {
      font-size: 14px;
      color: #323232;
   }
}
</style>
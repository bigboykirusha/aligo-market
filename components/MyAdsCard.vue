<template>
   <div class="card">
      <input type="checkbox" v-if="!isArchivePage" :id="`checkbox-${id}`" class="card__checkbox" :checked="isSelected"
         @change="toggleSelection" />
      <div :class="['card__image', { 'card__image--dimmed': isArchivePage }]">
         <Swiper v-if="images.length" :modules="[SwiperAutoplay, SwiperPagination]" :slides-per-view="1"
            :pagination="{ clickable: true }" :loop="true">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <img :src="getImageUrl(image.path)" alt="Slide image" />
            </SwiperSlide>
         </Swiper>
         <img v-else src='../assets/icons/placeholder.png' alt="Placeholder image" class="card__placeholder" />
      </div>
      <div class="card__section">
         <div ref="popupRef" class="popup-main" :class="{ 'popup-main--active': showPopup }" @pointerdown.stop>
            <ul class="popup-main__list">
               <li class="popup-main__item" v-for="(option, index) in popupOptions" :key="index" @click="option.action">
                  <img :src="option.icon" :alt="option.text" class="popup-main__icon" />
                  {{ option.text }}
               </li>
            </ul>
         </div>
         <div class="card__body">
            <div class="card__container">
               <nuxt-link :to="`/car/${url}`" class="card__title">{{ displayTitle }}</nuxt-link>
               <div class="card__block">
                  <span class="card__price">{{ formatNumberWithSpaces(Number(price)) }}</span>
                  <span v-if="price !== 'Цена не указана'" class="card__currency">₽</span>
               </div>
               <div class="card__description">{{ description || 'Описание не указано' }}</div>
               <div class="card__info">
                  <div class="card__location">{{ place || 'Адрес не указан' }}</div>
                  <div class="card__date">{{ timeAgo }}</div>
               </div>
            </div>
            <div class="card__mobile">
               <div class="button-2" @click="handleButtonMainClick">
                  <img :src="buttonIcon" alt="Action icon" class="button-2__icon" />
                  <span class="button-2__text">{{ buttonText }}</span>
               </div>
               <div class="button-2" @click="handleButtonClick">
                  <img :src="optionsIcon" alt="Options icon" class="button-2__icon" />
               </div>
            </div>
         </div>
         <div class="card__more">
            <div v-if="!isDraft && !isArchivePage" class="card__more-column">
               <div class="button">
                  <span class="button__text">{{ isPublished ? 'Опубликовано' : 'Снято с публикации' }}</span>
               </div>
               <div class="button__block">
                  <div class="button" v-for="(icon, idx) in statsIcons" :key="idx">
                     <img :src="icon.src" :alt="icon.alt" class="button__icon" />
                     <span class="button__text">{{ icon.count }}</span>
                  </div>
               </div>
            </div>
            <div class="card__more-row">
               <div class="button-2" @click="handleButtonMainClick">
                  <img :src="buttonIcon" alt="Action icon" class="button-2__icon" />
                  <span class="button-2__text">{{ buttonText }}</span>
               </div>
               <div class="button-2" @click="handleButtonClick">
                  <img :src="isDraft || isArchivePage ? deleteIcon : optionsIcon" alt="Options or delete icon"
                     class="button-2__icon" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <PopupDialog v-if="showPopup2" :message="'Вы уверены, что хотите снова опубликовать это объявление?'"
      :confirmText="'Опубликовать'" :cancelText="'Редактировать'" :closeIcon="closeIcon" @confirm="confirmPublishAgain"
      @cancel="editAd" @close="closePopupTemplate" />
   <PopupDialog v-if="showDeleteConfirm" :message="'Вы уверены, что хотите удалить объявление?'"
      :confirmText="'Удалить'" :cancelText="'Отменить'" :closeIcon="closeIcon" @confirm="confirmDelete"
      @cancel="closeConfirmPopup" @close="closeConfirmPopup" />
   <PopupDialog v-if="showArchiveConfirm" :message="'Вы уверены, что хотите перенести объявление в архив?'"
      :confirmText="'Перенести'" :cancelText="'Отменить'" :closeIcon="closeIcon" @confirm="confirmArchive"
      @cancel="closeConfirmPopup" @close="closeConfirmPopup" />
   <PopupDialog v-if="showUnpublishConfirm" :message="'Вы уверены, что хотите снять объявление с публикации?'"
      :confirmText="'Снять'" :cancelText="'Отменить'" :closeIcon="closeIcon" @confirm="confirmUnpublish"
      @cancel="closeConfirmPopup" @close="closeConfirmPopup" />
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { useSelectedAdsStore } from '../store/selectedAds.js';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { useSelectedDraftsStore } from '../store/selectedDrafts.js';
import { getImageUrl } from '../services/imageUtils'
import { useCreateStore } from '~/store/create.js';
import { deleteFromArchive, publishFromArchive } from "../services/apiClient.js";
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['updateData']);

import deleteIcon from '../assets/icons/delete.svg';
import optionsIcon from '../assets/icons/options.svg';
import rocketIcon from "../assets/icons/roket.svg";
import editIcon from "../assets/icons/edit.svg";
import againIcon from "../assets/icons/again.svg";
import personIcon from "../assets/icons/person.svg";
import favIcon from "../assets/icons/fav.svg";
import eyeIcon from "../assets/icons/eye.svg";
import archiveIcon from "../assets/icons/archive.svg";
import stopIcon from '@/assets/icons/stop.svg';
import closeIcon from '../assets/icons/close.svg';

const props = defineProps({
   id: Number,
   main_id: Number,
   description: String,
   price: [Number, String],
   place: String,
   brand: String,
   model: String,
   year: String,
   is_published: Number,
   count_who_view_seller_contact: {
      type: Number,
      default: 0
   },
   count_add_to_favorite: {
      type: Number,
      default: 0
   },
   count_go_ad_page: {
      type: Number,
      default: 0
   },
   images: Array,
   created_at: String,
});

const url = `${props.brand.toLowerCase()}-${props.model.toLowerCase()}-${props.year.toLowerCase()}-${props.id}`;
const route = useRoute();
const router = useRouter();
const createStore = useCreateStore();
let store = ref(null);

watchEffect(() => {
   if (route.path.includes('/profile/ads')) {
      store.value = useSelectedAdsStore();
   } else if (route.path.includes('/profile/drafts')) {
      store.value = useSelectedDraftsStore();
   }
});

const showPopup = ref(false);
const showPopup2 = ref(false);
const popupRef = ref(null);
const popupRef2 = ref(null);

const showDeleteConfirm = ref(false);
const showArchiveConfirm = ref(false);
const showUnpublishConfirm = ref(false);

const confirmDelete = async () => {
   await deleteFromArchive(props.id);
   console.log('Объявление успешно удалено из архива');
   emit('updateData');
   showPopup.value = false;
   closeConfirmPopup();
};

const confirmArchive = async () => {
   await store.value.deleteAds([props.id]);
   console.log('Переместить в архив');
   emit('updateData');
   showPopup.value = false;
   closeConfirmPopup();
};

const confirmUnpublish = async () => {
   await store.value.takeOffPublication([props.id]);
   emit('updateData');
   showPopup.value = false;
   closeConfirmPopup();
};

const closeConfirmPopup = () => {
   showDeleteConfirm.value = false;
   showArchiveConfirm.value = false;
   showUnpublishConfirm.value = false;
   showPopup2.value = false;
};

const handleClickOutside = (event) => {
   const isOutsidePopup1 = popupRef.value && !popupRef.value.contains(event.target);
   const isOutsidePopup2 = popupRef2.value && !popupRef2.value.contains(event.target);

   if (isOutsidePopup1) {
      showPopup.value = false;
   }
   if (isOutsidePopup2) {
      showPopup2.value = false;
   }
};

const isSelected = computed(() => store.value?.selectedAdIds.includes(props.id));
const isDraft = computed(() => route.path === '/profile/drafts');
const isArchivePage = computed(() => route.path === '/profile/archive');
const isPublished = computed(() => props.is_published === 1);

const buttonIcon = computed(() => (isArchivePage.value ? againIcon : (isDraft.value ? editIcon : rocketIcon)));
const buttonText = computed(() => (isArchivePage.value ? 'Опубликовать снова' : (isDraft.value ? 'Продолжить' : 'Продвигать')));

const statsIcons = computed(() => [
   { src: personIcon, count: props.count_who_view_seller_contact, alt: 'Просмотры контактов' },
   { src: favIcon, count: props.count_add_to_favorite, alt: 'Добавления в избранное' },
   { src: eyeIcon, count: props.count_go_ad_page, alt: 'Просмотры страницы' },
]);

const popupOptions = computed(() => {
   if (isPublished.value) {
      return [
         { text: 'Редактировать', icon: editIcon, action: editAd },
         { text: 'Снять с публикации', icon: stopIcon, action: togglePublication },
         { text: 'Переместить в архив', icon: archiveIcon, action: moveToArchive }
      ];
   } else {
      return [
         { text: 'Редактировать', icon: editIcon, action: editAd },
         { text: 'Опубликовать снова', icon: againIcon, action: publishAgain },
         { text: 'Переместить в архив', icon: archiveIcon, action: moveToArchive }
      ];
   }
});

const displayTitle = computed(() => {
   const brandText = props.brand ? props.brand : 'Название не указано';
   const modelText = props.model ? props.model : '';
   const yearText = props.year ? props.year : '';

   return [brandText, modelText, yearText].filter(Boolean).join(' ');
});

const togglePopup = () => {
   showPopup.value = !showPopup.value;
};

function calculateTimeAgo(dateString) {
   const now = new Date();
   const date = new Date(dateString);
   const diff = now - date;

   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) {
      return `${days} ${days % 10 === 1 && days % 100 !== 11 ? 'день' :
         (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) ? 'дня' :
            'дней'} назад`;
   } else if (hours > 0) {
      return `${hours} ${hours % 10 === 1 && hours % 100 !== 11 ? 'час' :
         (hours % 10 >= 2 && hours % 10 <= 4 && (hours % 100 < 10 || hours % 100 >= 20)) ? 'часа' :
            'часов'} назад`;
   } else if (minutes > 0) {
      return `${minutes} ${minutes % 10 === 1 && minutes % 100 !== 11 ? 'минута' :
         (minutes % 10 >= 2 && minutes % 10 <= 4 && (minutes % 100 < 10 || minutes % 100 >= 20)) ? 'минуты' :
            'минут'} назад`;
   } else {
      return `${seconds} ${seconds % 10 === 1 && seconds % 100 !== 11 ? 'секунда' :
         (seconds % 10 >= 2 && seconds % 10 <= 4 && (seconds % 100 < 10 || seconds % 100 >= 20)) ? 'секунды' :
            'секунд'} назад`;
   }
}

const timeAgo = computed(() => calculateTimeAgo(props.created_at));

const editAd = async () => {
   try {
      await createStore.setStoreFromApi(props.id);

      const conditionId = createStore.condition_id;
      const subValue = conditionId === 1 ? 'Новые' : 'C пробегом';

      if (subValue) {
         router.push({
            path: '/create',
            query: {
               main: 'auto',
               sub: subValue
            }
         });
      }
   } catch (error) {
      console.error('Ошибка при загрузке черновика: ', error);
   }
   console.log('Редактировать');
   showPopup.value = false;
};

const publishAgain = async () => {
   showPopup2.value = true;
};

const closePopupTemplate = async () => {
   showPopup2.value = false;
};

const confirmPublishAgain = async () => {
   await publishFromArchive(props.id);
   console.log('Объявление успешно опубликовано');
   emit('updateData');
   showPopup2.value = false;
};

const moveToArchive = async () => {
   showArchiveConfirm.value = true;
};

const togglePublication = async () => {
   showUnpublishConfirm.value = true;
};

const toggleSelection = () => {
   store.value?.toggleAd(props.id);
};

const handleButtonClick = async () => {
   if (isDraft.value) {
      showDeleteConfirm.value = true;
   } else if (route.path.includes('/profile/ads')) {
      togglePopup();
   } else if (isArchivePage.value) {
      showDeleteConfirm.value = true;
   }
};

const handleButtonMainClick = async () => {
   if (isArchivePage.value) {
      try {
         await editAd();
         // await publishFromArchive(props.id);
         emit('updateData');
         console.log('Объявление успешно опубликовано');
      } catch (error) {
         console.error('Ошибка при публикации объявления: ', error);
      }
   } else if (isDraft.value) {
      try {
         await createStore.setStoreFromApi(props.id);

         const conditionId = createStore.condition_id;
         const subValue = conditionId === 1 ? 'Новые' : 'C пробегом';

         if (subValue) {
            router.push({
               path: '/create',
               query: {
                  main: 'auto',
                  sub: subValue
               }
            });
         }
      } catch (error) {
         console.error('Ошибка при загрузке черновика: ', error);
      }
      emit('updateData');
   } else {
      console.log('Продвигать');
   }
};

onMounted(() => {
   document.addEventListener('pointerdown', handleClickOutside);

});

onBeforeUnmount(() => {
   document.removeEventListener('pointerdown', handleClickOutside);
});
</script>

<style scoped lang="scss">
.card {
   display: flex;
   min-height: 200px;
   min-width: 200px;
   position: relative;
   flex-direction: row;
   background: #ffffff;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   border-radius: 6px;
   transition: transform 0.3s, box-shadow 0.3s;

   @media (max-width: 1200px) {
      min-height: 160px;
      min-width: 160px;
   }

   @media (max-width: 480px) {
      min-height: 145px;
      min-width: 145px;
   }

   &:hover {
      .card__buttons {
         transform: none;
         opacity: 1;
      }
   }

   &__image {
      width: 200px;
      max-height: 200px;
      cursor: pointer;

      &--dimmed {
         filter: brightness(0.5);
         opacity: 0.8;
      }

      @media (max-width: 1200px) {
         width: 160px;
         max-height: 160px;
      }

      @media (max-width: 480px) {
         width: 145px;
         max-height: 145px;
      }
   }

   &__placeholder {
      width: 200px;
      max-height: 200px;
      object-fit: cover;

      @media (max-width: 1200px) {
         width: 160px;
         max-height: 160px;
      }

      @media (max-width: 480px) {
         width: 145px;
         max-height: 145px;
      }
   }

   &__title {
      font-weight: bold;
      font-size: 16px;
      color: #3366ff;
      text-decoration: none;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   &__section {
      display: flex;
      flex-direction: row;
      width: 100%;

      @media (max-width: 1200px) {
         flex-direction: column;
         width: 100%;
      }
   }

   &__block {
      display: flex;
      gap: 5px;
   }

   &__price,
   &__currency {
      font-weight: bold;
      font-size: 14px;
      color: black;
   }

   &__location,
   &__date {
      font-size: 12px;
      color: #a8a8a8;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 1200px) {
         display: none;
      }
   }

   &__body {
      display: flex;
      flex-direction: column;
      position: relative;
      gap: 10px;
      width: 100%;
      max-width: 320px;
      height: 100%;
      padding: 16px;

      @media (max-width: 1200px) {
         flex-direction: row;
         max-width: 100%;
         width: 100%;
         justify-content: space-between;
         padding-bottom: 0;
      }

      @media (max-width: 768px) {
         flex-direction: column;
         gap: 24px;
         justify-content: flex-start;
      }
   }

   &__container {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;

      @media (max-width: 1200px) {
         gap: 0;
      }

      @media (max-width: 768px) {
         height: fit-content;
      }
   }

   &__more {
      display: flex;
      gap: 86px;
      width: 100%;
      height: 100%;
      flex-direction: row;
      padding: 16px;
      margin-left: auto;
      justify-content: space-between;

      @media (max-width: 1200px) {
         margin: 0;
         justify-content: flex;
      }

      @media (max-width: 768px) {
         display: none;
      }
   }

   &__more-column {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @media (max-width: 1200px) {
         gap: 8px;
      }
   }

   &__more-row {
      display: flex;
      flex-direction: row;
      gap: 10px;
      width: fit-content;
      justify-content: flex-end;
      margin-left: auto;

      @media (max-width: 1200px) {
         display: none;
      }
   }

   &__mobile {
      display: none;
      flex-direction: row;
      gap: 10px;

      @media (max-width: 1200px) {
         display: flex;
      }
   }

   &__description {
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 1200px) {
         display: none;
      }
   }

   &__info {
      margin-top: auto;

      @media (max-width: 768px) {
         display: none;
      }
   }

   .button {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: #EEF9FF;
      border-radius: 12px;
      transition: background-color 0.3s;
      width: fit-content;

      span {
         text-wrap: nowrap;
      }

      @media (max-width: 480px) {
         padding: 5px 8px;
      }

      &__icon {
         height: 14px;

         @media (max-width: 768px) {
            height: 12px;
         }
      }

      &__block {
         display: flex;
         flex-direction: column;
         gap: 16px;

         @media (max-width: 1200px) {
            display: flex;
            flex-direction: row;
         }

         @media (max-width: 768px) {
            gap: 8px;
         }
      }

      &__text {
         font-weight: 400;
         font-size: 14px;
         color: #3366ff;
      }
   }

   .button-2 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      min-width: 34px;
      padding: 0 9px;
      background: #D6EFFF;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
      width: fit-content;
      height: 34px;

      &__icon {
         height: 16px;
      }

      &__text {
         font-weight: 400;
         font-size: 14px;
         color: #3366ff;
         text-wrap: nowrap;

         @media (max-width: 1200px) {
            display: none;
         }
      }

      &:hover {
         background: #9ed2f1;
      }
   }
}

.card__checkbox {
   position: absolute;
   top: 16px;
   z-index: 3;
   left: 16px;
   width: 16px;
   height: 16px;
   cursor: pointer;
}

.swiper {
   height: 200px;
   width: 200px;
   border-radius: 6px 0 0 6px;

   @media (max-width: 1200px) {
      height: 160px;
      width: 160px;
   }

   @media (max-width: 480px) {
      height: 145px;
      width: 145px;
   }

   img {
      height: 200px;
      width: 100%;
      object-fit: cover;

      @media (max-width: 1200px) {
         height: 160px;
      }

      @media (max-width: 480px) {
         height: 145px;
      }
   }
}

.popup-main {
   position: absolute;
   background-color: #fff;
   top: 16px;
   right: 16px;
   border: 1px solid #3366FF;
   border-radius: 6px;
   padding: 16px;
   display: flex;
   flex-direction: column;
   z-index: 9;
   transform: scale(0);
   transform-origin: top right;
   transition: opacity 0.3s ease, transform 0.3s ease;

   @media (max-width: 768px) {
      top: 0;
      right: 0;
      padding: 8px;
      height: 145px;
   }

   &.popup-main--active {
      opacity: 1;
      transform: scale(1);
   }

   &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0;
   }

   &__item {
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 14px;
      border-radius: 12px;
      color: #323232;
      background-color: #fff;
      transition: background-color 0.2s;

      &:hover {
         background-color: #D6EFFF;
      }
   }

   &__icon {
      height: 14px;
      margin-right: 8px;
   }
}
</style>

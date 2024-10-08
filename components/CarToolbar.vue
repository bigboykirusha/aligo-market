<template>
   <div class="car-ad">
      <div class="car-ad__header">
         <div class="button">
            <span class="button__text">{{ statusText }}</span>
         </div>
         <span class="car-ad__text">Срок 30 дней истек</span>
         <div class="button__block">
            <div class="button" v-for="(icon, idx) in statsIcons" :key="idx">
               <img :src="icon.src" :alt="icon.alt" class="button__icon" />
               <span class="button__text">{{ icon.count || 0 }}</span>
            </div>
         </div>
      </div>

      <ul class="popup__list">
         <li class="popup__item" v-if="!isArchived && isPublished" @click="togglePublication">
            <img :src="publicationIcon" alt="Снять с публикации" class="popup__icon" />
            <span class="popup__text">Снять с публикации</span>
         </li>

         <li class="popup__item" v-else-if="!isArchived && !isPublished" @click="publishFromArchive(props.id)">
            <img :src="publicationIcon" alt="Опубликовать снова" class="popup__icon" />
            <span class="popup__text">Опубликовать снова</span>
         </li>

         <li class="popup__item" v-if="!isArchived" @click="editAd">
            <img :src="editIcon" alt="Редактировать" class="popup__icon" />
            <span class="popup__text">Редактировать</span>
         </li>

         <li class="popup__item" v-if="!isArchived" @click="moveToArchive">
            <img :src="archiveIcon" alt="Переместить в архив" class="popup__icon" />
            <span class="popup__text">Переместить в архив</span>
         </li>

         <li class="popup__item" v-if="isArchived" @click="publishFromArchive(props.id)">
            <img :src="againIcon" alt="Опубликовать снова" class="popup__icon" />
            <span class="popup__text">Опубликовать снова</span>
         </li>

         <li class="popup__item" v-if="isArchived" @click="deleteFromArchive(props.id)">
            <img :src="deleteIcon" alt="Удалить" class="popup__icon" />
            <span class="popup__text">Удалить</span>
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useSelectedAdsStore } from '../store/selectedAds.js';
import { useSelectedDraftsStore } from '../store/selectedDrafts.js';
import { useCreateStore } from '~/store/create.js';
import { publishFromArchive, deleteFromArchive } from "../services/apiClient.js";
import { useRoute, useRouter } from 'vue-router';

import deleteIcon from '../assets/icons/delete.svg';
import editIcon from "../assets/icons/edit.svg";
import againIcon from "../assets/icons/again.svg";
import personIcon from "../assets/icons/person.svg";
import favIcon from "../assets/icons/fav.svg";
import eyeIcon from "../assets/icons/eye.svg";
import archiveIcon from "../assets/icons/archive.svg";
import stopIcon from "../assets/icons/stop.svg";

const props = defineProps({
   id: Number,
   is_published: Number,
   is_in_archive: Number,
   count_who_view_seller_contact: Number,
   count_add_to_favorite: Number,
   count_go_ad_page: Number
});

const isPublished = computed(() => props.is_published === 1);
const isArchived = computed(() => props.is_in_archive === 1);
const publicationIcon = computed(() => isPublished.value ? stopIcon : againIcon);

const statsIcons = computed(() => [
   { src: personIcon, count: props.count_who_view_seller_contact, alt: 'Просмотры контактов' },
   { src: favIcon, count: props.count_add_to_favorite, alt: 'Добавления в избранное' },
   { src: eyeIcon, count: props.count_go_ad_page, alt: 'Просмотры страницы' }
]);

const statusText = computed(() => {
   if (isArchived.value) {
      return 'В архиве';
   }
   return isPublished.value ? 'Опубликовано' : 'Снято с публикации';
});

const router = useRouter();
const route = useRoute();
const createStore = useCreateStore();

const store = useSelectedAdsStore();

const editAd = async () => {
   try {
      await createStore.setStoreFromApi(props.id);
      const conditionId = createStore.condition_id;
      const subValue = conditionId === 1 ? 'Новые' : 'C пробегом';

      if (subValue) {
         router.push({
            path: '/createAd',
            query: {
               main: 'auto',
               sub: subValue
            }
         });
      }
   } catch (error) {
      console.error('Ошибка при загрузке черновика: ', error);
   }
};

const moveToArchive = () => {
   if (store) {
      store.deleteAds([props.id]);
   }
   console.log('Переместить в архив');
};

const deleteAd = async () => {
   console.log('Удалить');
};

const togglePublication = async () => {
   console.log('Снять с публикации');
   if (store) {
      store.takeOffPublication([props.id]);
   }
};
</script>

<style lang="scss" scoped>
.car-ad {
   background-color: #D6EFFF;
   padding: 24px;
   border-radius: 6px;
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;
   display: flex;
   flex-direction: column;
   gap: 20px;
   margin-bottom: 24px;

   @media (max-width: 768px) {
      gap: 16px;
   }

   &__header {
      display: flex;
      align-items: center;
      gap: 24px;
      row-gap: 16px;
      flex-wrap: wrap;
   }

   &__text {
      font-size: 12px;
      color: #787878;
   }

   .button {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 24px;
      padding: 3px 10px;
      background: #EEF9FF;
      border-radius: 12px;
      transition: background-color 0.3s;
      width: fit-content;

      &__text {
         font-weight: 400;
         font-size: 14px;
         color: #3366ff;
         text-wrap: nowrap;
         line-height: 1;
      }

      &__icon {
         height: 13px;

         @media (max-width: 768px) {
            height: 12px;
         }
      }

      &__block {
         display: flex;
         gap: 16px;

         @media (max-width: 768px) {
            gap: 8px;
         }
      }
   }

   .popup__list {
      display: flex;
      gap: 24px;
      list-style: none;
      padding: 0;
      flex-wrap: wrap;

      .popup__item {
         display: flex;
         background-color: white;
         align-items: center;
         gap: 8px;
         padding: 8px;
         border-radius: 6px;
         cursor: pointer;
         font-size: 14px;
         font-weight: 400;
         color: #3366ff;
         transition: $transition-1;

         &:hover {
            background-color: #EEF9FF;
         }

         @media (max-width: 768px) {
            padding: 8px 10.5px;
         }

         .popup__icon {
            height: 16px;

            @media (max-width: 768px) {
               height: 14px;
            }
         }

         .popup__text {
            @media (max-width: 768px) {
               display: none;
            }
         }

         &.popup__item:first-child .popup__text {
            display: inline;
         }
      }
   }
}
</style>

<template>
   <div class="car-ad">
      <div class="car-ad__header">
         <div class="button button--main">
            <span class="button__text">{{ statusText }}</span>
         </div>
         <span v-if="isArchived" class="car-ad__text">Срок 30 дней истек</span>
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

         <li class="popup__item" v-else-if="!isArchived && !isPublished" @click="rePublishAdFromArchive(props.id)">
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

         <li class="popup__item" v-if="isArchived" @click="rePublishAdFromArchive(props.id)">
            <img :src="againIcon" alt="Опубликовать снова" class="popup__icon" />
            <span class="popup__text">Опубликовать снова</span>
         </li>

         <li class="popup__item" v-if="isArchived" @click="deleteAdFromArchive(props.id)">
            <img :src="deleteIcon" alt="Удалить" class="popup__icon" />
            <span class="popup__text">Удалить</span>
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSelectedAdsStore } from '../store/selectedAds.js';
import { useCreateStore } from '~/store/create.js';
import { useRouter } from 'vue-router';
import { deleteFromArchive } from '../services/apiClient.js';
import { usePopupStore } from '../store/popup.js';

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

const isPublished = ref(props.is_published === 1);
const isArchived = ref(props.is_in_archive === 1);
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
const createStore = useCreateStore();
const store = useSelectedAdsStore();

const editAd = async () => {
   try {
      await createStore.setStoreFromApi(props.id);
      router.push('/createAd');
   } catch (error) {
      console.error('Ошибка при загрузке черновика: ', error);
   }
};

const moveToArchive = () => {
   if (store) {
      store.deleteAds([props.id]);
      isArchived.value = true;
      isPublished.value = false;
   }
   console.log('Перемещено в архив');
};

const togglePublication = async () => {
   console.log('Снять с публикации');
   if (store) {
      store.takeOffPublication([props.id]);
      isPublished.value = false;
      isArchived.value = false;
   }
};

const rePublishAdFromArchive = (id) => {
   console.log('Опубликовать снова');
   if (store) {
      store.republish([id]);
      isPublished.value = true;
      isArchived.value = false;
   }
};

const deleteAdFromArchive = (id) => {
   console.log('Удалить из архива');
   deleteFromArchive(id);
   router.push('/');
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
   gap: 16px;
   margin-bottom: 24px;

   @media (max-width: 768px) {
      gap: 16px;
      padding: 24px 16px;
      margin-bottom: 16px;
      border-radius: 0;
   }

   &__header {
      display: flex;
      align-items: center;
      gap: 16px;
      row-gap: 16px;
      flex-wrap: wrap;

      @media (max-width: 768px) {}
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
      padding: 0 12px;
      background: #EEF9FF;
      border-radius: 12px;
      transition: background-color 0.3s;
      width: fit-content;

      &--main {
         padding: 0 16px;
      }

      &__text {
         font-weight: 400;
         font-size: 14px;
         line-height: 18px;
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

      @media (max-width: 768px) {
         gap: 8px;
      }

      .popup__item {
         display: flex;
         background-color: white;
         align-items: center;
         gap: 8px;
         padding: 8px 12px;
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
            width: 16px;

            @media (max-width: 768px) {
               height: 14px;
            }
         }

         .popup__text {
            color: #323232;

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

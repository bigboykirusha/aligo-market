<template>
   <div class="card">
      <div class="card__image">
         <Swiper v-if="images.length" :modules="[SwiperAutoplay, SwiperPagination]" :slides-per-view="1"
            :pagination="{ clickable: true }" :loop="true">
            <SwiperSlide v-for="(image, index) in images" :key="index">
               <img :src="getImageUrl(image.path)" alt="Slide image" />
            </SwiperSlide>
         </Swiper>
         <img v-else src="../assets/icons/placeholder.png" alt="Placeholder image" class="card__placeholder" />
      </div>
      <div class="card__section">
         <div class="card__body">
            <div class="card__container">
               <nuxt-link custom :to="`/car/${id}`" class="card__title">{{ displayTitle }}</nuxt-link>
               <div class="card__block">
                  <span class="card__price">{{ formattedPrice }}</span>
                  <span v-if="price !== 'Цена не указана'" class="card__currency">₽</span>
               </div>
               <div class="card__description">{{ description || 'Описание не указано' }}</div>
               <div class="card__info">
                  <div class="card__location">{{ place || 'Адрес не указан' }}</div>
                  <div class="card__date">{{ timeAgo }}</div>
               </div>
            </div>
            <div class="card__mobile">
               <div class="button-2" @click="togglePopup">
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
               <div class="button-2" @click="togglePopup">
                  <img :src="optionsIcon" alt="Options or delete icon" class="button-2__icon" />
               </div>
               <div ref="popupRef" :class="['popup-main', { 'popup--active': showPopup }]" @pointerdown.stop>
                  <ul class="popup-main__list">
                     <li class="popup-main__item" v-for="(option, index) in popupOptions" :key="index"
                        @click="option.action">
                        <img :src="option.icon" :alt="option.text" class="popup-main__icon" />
                        {{ option.text }}
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { formatNumberWithSpaces } from '../services/amountUtils.js';
import { getImageUrl } from '../services/imageUtils';

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
   count_who_view_seller_contact: { type: Number, default: 0 },
   count_add_to_favorite: { type: Number, default: 0 },
   count_go_ad_page: { type: Number, default: 0 },
   images: Array,
   created_at: String,
});

const showPopup = ref(false);
const popupRef = ref(null);

const isPublished = computed(() => props.is_published === 1);

const statsIcons = computed(() => [
   { src: personIcon, count: props.count_who_view_seller_contact, alt: 'Просмотры контактов' },
   { src: favIcon, count: props.count_add_to_favorite, alt: 'Добавления в избранное' },
   { src: eyeIcon, count: props.count_go_ad_page, alt: 'Просмотры страницы' },
]);

const popupOptions = computed(() => {
   const baseOptions = [
      { text: 'Продвигать', icon: rocketIcon, action: editAd },
      { text: 'Редактировать', icon: editIcon, action: editAd },
      { text: 'Удалить', icon: deleteIcon, action: editAd }
   ];

   if (isPublished.value) {
      return [
         ...baseOptions,
         { text: 'Снять с публикации', icon: stopIcon, action: editAd },
         { text: 'Переместить в архив', icon: archiveIcon, action: editAd }
      ];
   } else {
      return [
         ...baseOptions,
         { text: 'Опубликовать снова', icon: againIcon, action: editAd },
         { text: 'Переместить в архив', icon: archiveIcon, action: editAd }
      ];
   }
});

const displayTitle = computed(() => {
   return [props.brand || 'Название не указано', props.model, props.year]
      .filter(Boolean)
      .join(' ');
});

const formattedPrice = computed(() => {
   return formatNumberWithSpaces(props.price) !== 'Цена не указана' ?
      formatNumberWithSpaces(props.price) : 'Цена не указана';
});

const calculateTimeAgo = (dateString) => {
   const now = new Date();
   const date = new Date(dateString);
   const diff = now - date;
   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) return formatTimeUnit(days, 'день');
   if (hours > 0) return formatTimeUnit(hours, 'час');
   if (minutes > 0) return formatTimeUnit(minutes, 'минута');
   return formatTimeUnit(seconds, 'секунда');
};

const formatTimeUnit = (unit, singular) => {
   const pluralForms = {
      день: ['день', 'дня', 'дней'],
      час: ['час', 'часа', 'часов'],
      минута: ['минута', 'минуты', 'минут'],
      секунда: ['секунда', 'секунды', 'секунд']
   };
   const form = unit % 10 === 1 && unit % 100 !== 11 ? pluralForms[singular][0] :
      (unit % 10 >= 2 && unit % 10 <= 4 && (unit % 100 < 10 || unit % 100 >= 20)) ?
         pluralForms[singular][1] :
         pluralForms[singular][2];
   return `${unit} ${form} назад`;
};

const timeAgo = computed(() => calculateTimeAgo(props.created_at));

const togglePopup = () => showPopup.value = !showPopup.value;

const editAd = async () => {
   console.log('Редактировать');
};

const handleClickOutside = (event) => {
   if (popupRef.value && !popupRef.value.contains(event.target)) {
      showPopup.value = false;
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
      position: relative;
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

.swiper {
   height: 200px;
   width: 200px;

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
   top: 0;
   right: 0;
   background: white;
   border: 1px solid #3366FF;
   border-radius: 6px;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
   z-index: 20;
   opacity: 0;
   transform: scale(0);
   transform-origin: top right;
   transition: opacity 0.3s ease, transform 0.3s ease;

   &.popup--active {
      opacity: 1;
      transform: scale(1);
   }
}

.popup-main__list {
   list-style: none;
   display: flex;
   flex-direction: column;
   gap: 24px;
   padding: 24px;
   margin: 0;

   @media (max-width: 1200px) {
      gap: 16px;
      padding: 16px;
   }
}

.popup-main__item {
   cursor: pointer;
   display: flex;
   align-items: center;
   gap: 8px;
   font-size: 14px;
   color: #323232;
   white-space: nowrap;

   img {
      width: 15px;
   }
}
</style>

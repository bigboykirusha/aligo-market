<template>
   <div class="photo-uploader">
      <label>{{ label }}</label>
      <div class="photo-uploader__photos">
         <!-- Отображаем как файлы с сервера, так и загруженные -->
         <div v-for="(photo, index) in localPhotos" :key="photo.id || index" class="photo-uploader__photo">
            <img :src="getImageUrl(photo)" alt="uploaded photo" />
            <!-- Кнопка удаления для фото с сервера и для локальных фото -->
            <button v-if="photo.is_file === 1 || photo.is_file === 0" @click="removePhoto(index, photo)"
               class="photo-uploader__remove-btn">
               <img src="../assets/icons/close-white.svg" alt="" />
            </button>
         </div>
         <div v-if="localPhotos.length < maxPhotos" class="photo-uploader__add-btn" @click="triggerFileInput">
            <input type="file" ref="fileInput" @change="onPhotoSelected" multiple />
            <span>
               <img src="../assets/icons/photo-add.svg" alt="" />
            </span>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useCreateStore } from '@/store/create'; // Импортируем store

const props = defineProps({
   label: {
      type: String,
      default: 'Фотографии* до 10 шт',
   },
   maxPhotos: {
      type: Number,
      default: 10,
   },
   photos: {
      type: Array,
      default: () => [],
   },
});

const emit = defineEmits(['updatePhotos']);
const localPhotos = ref([...props.photos]);
const baseUrl = 'https://dev.aligo.pro';
const createStore = useCreateStore(); // Получаем store для работы с массивом idsDeletePhotos

watch(
   () => props.photos,
   (newPhotos) => {
      localPhotos.value = newPhotos;
   }
);

const onPhotoSelected = (event) => {
   const files = event.target.files;
   if (!files) return;

   const newPhotos = Array.from(files).slice(0, props.maxPhotos - localPhotos.value.length);

   // Добавляем файлы пользователя в локальные фото
   newPhotos.forEach(file => {
      localPhotos.value.push({ file, is_file: 1 }); // Отметка, что это файл пользователя
   });

   emit('updatePhotos', localPhotos.value);
};

const removePhoto = (index, photo) => {
   // Если фото с сервера, добавляем его ID в список удаленных
   if (photo.is_file === 0 && photo.id) {
      createStore.setIdsDeletePhotos(photo.id); // Добавляем ID удаленной фотографии
   }

   // Удаляем фото из локального массива
   localPhotos.value.splice(index, 1);
   emit('updatePhotos', localPhotos.value);
};

const triggerFileInput = () => {
   if (fileInput.value) {
      fileInput.value.click();
   }
};

const fileInput = ref(null);

// Функция для получения URL изображения
const getImageUrl = (photo) => {
   if (photo.is_file === 0) {
      // Для серверных фото (полученных через API)
      return `${baseUrl}/${photo.path}`;
   } else {
      // Для файлов пользователя
      return URL.createObjectURL(photo.file);
   }
};

onMounted(() => {
   // Инициализация данных (загрузка фото с бека)
   localPhotos.value = [...props.photos];
});
</script>

<style lang="scss" scoped>
.photo-uploader {
   display: flex;
   flex-direction: row;

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__photos {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
   }

   &__photo {
      position: relative;
      transition: transform 0.3s ease;
      cursor: pointer;

      img {
         width: 85px;
         height: 65px;
         object-fit: cover;
         border-radius: 6px;
         transition: transform 0.3s ease;
      }

      &:hover {
         transform: scale(1.02);

         img {
            transform: scale(1.02);
         }
      }
   }

   &__remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease;

      img {
         width: 10px;
         height: 10px;
      }

      &:hover {
         background-color: rgba(255, 0, 0, 0.8);
      }
   }

   &__add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 85px;
      height: 65px;
      background-color: #d6efff;
      cursor: pointer;
      border-radius: 6px;
      position: relative;
      transition: background-color 0.3s ease, transform 0.3s ease;

      &:hover {
         background-color: #bce0ff;
         transform: scale(1.02);
      }

      input[type='file'] {
         position: absolute;
         opacity: 0;
         width: 0;
         height: 0;
         pointer-events: none;
      }

      span {
         font-size: 12px;
         color: #333;
         text-align: center;

         svg {
            display: block;
            margin: 0 auto 5px;
            color: #333;
         }
      }
   }
}
</style>
<template>
   <div v-if="photos.length" :class="containerClass">
      <div v-if="imagePhotos.length" :class="containerClass">
         <template v-if="imagePhotos.length === 1">
            <img :src="getImageUrl(imagePhotos[0].path)" :class="photoClass(1)" loading="lazy" />
         </template>

         <template v-else-if="imagePhotos.length === 2">
            <div class="chat-photo-group">
               <img v-for="(photo, index) in imagePhotos" :key="index" :src="getImageUrl(photo.path)" loading="lazy"
                  :class="photoClass(2)" />
            </div>
         </template>

         <template v-else-if="imagePhotos.length === 3">
            <img :src="getImageUrl(imagePhotos[0].path)" :class="photoClass(1)" />
            <div class="chat-photo-group">
               <img v-for="(photo, index) in imagePhotos.slice(1)" :key="index" :src="getImageUrl(photo.path)"
                  loading="lazy" :class="photoClass(2)" />
            </div>
         </template>

         <template v-else-if="imagePhotos.length === 4">
            <img :src="getImageUrl(imagePhotos[0].path)" :class="photoClass(1)" />
            <div class="chat-photo-grid chat-photo-grid--three">
               <img v-for="(photo, index) in imagePhotos.slice(1)" :key="index" :src="getImageUrl(photo.path)"
                  loading="lazy" :class="photoClass(3)" />
            </div>
         </template>

         <template v-else-if="imagePhotos.length === 5">
            <img :src="getImageUrl(imagePhotos[0].path)" :class="photoClass(1)" />
            <div class="chat-photo-grid chat-photo-grid--four">
               <img v-for="(photo, index) in imagePhotos.slice(1)" :key="index" :src="getImageUrl(photo.path)"
                  loading="lazy" :class="photoClass(2)" />
            </div>
         </template>
      </div>

      <div v-if="filePhotos.length" class="chat-file-container">
         <div v-for="(file, index) in filePhotos" :key="index" class="chat-file">
            <img src="../assets/icons/file-icon.svg" alt="File Icon" class="chat-file-icon" />
            <span class="chat-file-name">{{ file.title }} <span class="chat-file-size">4.2 МБ</span></span>

         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { getImageUrl } from '../services/imageUtils'

const props = defineProps({
   photos: {
      type: Array,
      required: true,
   },
});

const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

const imagePhotos = computed(() =>
   props.photos.filter(photo => imageExtensions.includes(photo.path.split('.').pop().toLowerCase()))
);

const filePhotos = computed(() =>
   props.photos.filter(photo => !imageExtensions.includes(photo.path.split('.').pop().toLowerCase()))
);

const containerClass = computed(() => ({
   'chat-photo-container': true,
   'chat-photo-container--multiple': imagePhotos.value.length > 1,
}));

const photoClass = (count) => {
   switch (count) {
      case 1:
         return 'chat-photo chat-photo--single';
      case 2:
         return 'chat-photo chat-photo--half';
      case 3:
         return 'chat-photo chat-photo--third';
      default:
         return 'chat-photo';
   }
};
</script>

<style lang="scss" scoped>
.chat-photo-container {
   display: flex;
   flex-direction: column;
   gap: 8px;
   max-width: 300px;
}

.chat-photo {
   border-radius: 6px;
   object-fit: cover;

   &--single,
   &--full {
      width: 100%;
      height: auto;
   }

   &--half {
      width: calc(50% - 4px);
   }

   &--third {
      width: calc(33.33% - 6px);
   }
}

.chat-photo-group {
   display: flex;
   gap: 8px;
}

.chat-photo-grid {
   display: flex;
   flex-wrap: wrap;
   gap: 8px;

   &--three {
      .chat-photo {
         &--third {
            width: calc(33.33% - 6px);
         }
      }
   }

   &--four {
      .chat-photo {
         &--half {
            width: calc(50% - 4px);
         }
      }
   }
}

.chat-file-container {
   display: flex;
   flex-direction: column;
   gap: 8px;
}

.chat-file {
   display: flex;
   align-items: center;
   gap: 12px;
}

.chat-file-icon {
   height: 100%;
}

.chat-file-name {
   display: flex;
   flex-direction: column;
   font-size: 14px;
   line-height: 18px;
   color: #3366FF;
}

.chat-file-size {
   font-size: 12px;
   line-height: 16px;
   color: #3366FF;
}
</style>
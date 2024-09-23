<template>
   <li class="card">
      <nuxt-link :to="category.href" class="card__cover">
         <img :src="category.imgSrc" :alt="category.imgAlt" class="card__cover-img" loading="lazy" />
         <img :src="category.icon" alt="" class="card__icon">
         <span class="card__title">{{ category.title }}</span>
      </nuxt-link>
      <ul class="card__list">
         <li v-for="(subcategory, index) in category.subcategories" :key="index" class="card__list-item">
            <nuxt-link :to="subcategory.href" class="card__list-item-link">{{ subcategory.title }}</nuxt-link>
         </li>
      </ul>
   </li>
</template>

<script setup>
const props = defineProps({
   category: {
      type: Object,
      required: true
   }
});
</script>

<style scoped lang="scss">
.card {
   display: flex;
   flex-direction: column;
   gap: 7px;

   &__cover {
      position: relative;
      width: 100%;
      padding-bottom: 31%;
      background: #D6EFFF;
      border-radius: 6px;
      overflow: hidden;
      text-decoration: none;
      transition: opacity 0.3s;

      &:hover {
         opacity: 0.7;
      }

      @media (max-width: 850px) {
         display: flex;
         align-items: center;
         gap: 6px;
         padding: 8px 6px 8px 11px;
      }
   }

   &__cover-img {
      position: absolute;
      top: 0;
      right: -20px;
      width: 100%;
      height: 100%;
      object-fit: contain;

      @media (max-width: 850px) {
         display: none;
      }
   }

   &__icon {
      display: none;

      @media (max-width: 850px) {
         display: block;
         width: 18px;
         height: 18px;
      }

      @media (max-width: 330px) {
         width: 14px;
         height: 14px;
      }
   }

   &__title {
      position: absolute;
      top: 10px;
      left: 12px;
      font-weight: 700;
      font-size: 16px;
      color: #007BFF;
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (max-width: 850px) {
         position: static;
         font-weight: 400;
         font-size: 14px;
         width: 100%;
      }

      @media (max-width: 330px) {
         font-size: 13px;
      }
   }

   &__list {
      list-style: none;
      padding: 0;
      margin: 0;
   }

   &__list-item {
      margin-bottom: 1px;

      &:last-child {
         margin-bottom: 0;
      }

      @media (max-width: 600px) {
         &:nth-child(3) {
            display: none;
         }
      }
   }

   &__list-item-link {
      font-size: 14px;
      color: #007BFF;
      text-decoration: none;
      transition: opacity 0.3s;
      text-overflow: ellipsis;

      &:hover {
         opacity: 0.7;
      }
   }
}
</style>
<template>
   <div class="layout-2">
      <div class="layout-2__container site-container">
         <ul class="layout-2__list">
            <CategoryCard v-for="(category, index) in categories" :key="index" :category="category" />
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import CategoryCard from './CategoryCard.vue';

import carImage from '../assets/images/svg/car.svg';
import discImage from '../assets/icons/disc_car.svg';
import motoImage from '../assets/icons/moto_car.svg';

import carIcon from '../assets/icons/car.svg';
import discIcon from '../assets/icons/disc.svg';
import motoIcon from '../assets/images/svg/moto.svg';

const categories = ref([
   {
      href: '/auto',
      imgSrc: carImage,
      imgAlt: 'Автомобили',
      title: 'Автомобили',
      icon: carIcon,
      subcategories: [
         { href: '/auto', title: 'Подержанные авто' },
         { href: '/auto', title: 'Новые авто' }
      ]
   },
   {
      href: '/parts',
      imgSrc: discImage,
      imgAlt: 'Диски',
      title: 'Автотовары',
      icon: discIcon,
      subcategories: [
         { href: '/parts', title: 'Шины' },
         { href: '/parts', title: 'Диски' }
      ]
   },
   {
      href: '/moto',
      imgSrc: motoImage,
      imgAlt: 'Мототехника',
      title: 'Мототехника',
      icon: motoIcon,
      subcategories: [
         { href: '/moto', title: 'Мотоциклы' },
         { href: '/moto', title: 'Квадроциклы' }
      ]
   }
]);
</script>

<style scoped lang="scss">
.layout-2 {
   margin-top: 134px;
   padding: 0 16px;
   margin-bottom: 40px;

   @media (max-width: 991px) {
      margin-top: 118px;
   }

   @media (max-width: 768px) {
      margin-top: calc(66px + 24px);
   }

   &__container {
      max-width: 1280px;
      margin: 0 auto;
   }

   &__list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;


      @media (max-width: 600px) {
         display: flex;
         flex-direction: column;
         gap: 16px
      }
   }
}
</style>

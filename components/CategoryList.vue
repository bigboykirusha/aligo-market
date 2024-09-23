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
import { useI18n } from 'vue-i18n';
import CategoryCard from './CategoryCard.vue';

import carImage from '../assets/images/svg/car.svg';
import houseImage from '../assets/images/house.svg';
import peopleImage from '../assets/images/work.svg';
import servImage from '../assets/images/serv.svg';
import itemsImage from '../assets/images/items.svg';

import carIcon from '../assets/icons/car.svg';
import houseIcon from '../assets/icons/house.svg';
import peoplesIcon from '../assets/images/svg/peoples.svg';
import servicesIcon from '../assets/icons/servises.svg';
import goodsIcon from '../assets/images/svg/goods.svg';

const { t } = useI18n();

const generateSubcategories = (basePath, subcategories) => {
   return subcategories.map(subcategory => ({
      href: basePath,
      title: t(subcategory)
   }));
};

const categories = ref([
   {
      href: '/autos',
      imgSrc: carImage,
      imgAlt: t('categories.auto'),
      title: t('categories.auto'),
      icon: carIcon,
      subcategories: generateSubcategories('/autos', [
         'categories.autoUsed',
         'categories.autoNew'
      ])
   },
   {
      href: '/realty',
      imgSrc: houseImage,
      imgAlt: t('categories.realty'),
      title: t('categories.realty'),
      icon: houseIcon,
      subcategories: generateSubcategories('/realty', [
         'categories.realtyFlats',
         'categories.realtyHouses',
         'categories.realtyGarages'
      ])
   },
   {
      href: '/job',
      imgSrc: peopleImage,
      imgAlt: t('categories.job'),
      title: t('categories.job'),
      icon: peoplesIcon,
      subcategories: generateSubcategories('/job', [
         'categories.jobVacancies',
         'categories.jobResumes'
      ])
   },
   {
      href: '/services',
      imgSrc: servImage,
      imgAlt: t('categories.service'),
      title: t('categories.service'),
      icon: servicesIcon,
      subcategories: generateSubcategories('/services', [
         'categories.serviceMaster',
         'categories.serviceManicure',
         'categories.serviceCleaning'
      ])
   },
   {
      href: '/goods',
      imgSrc: itemsImage,
      imgAlt: t('categories.product'),
      title: t('categories.product'),
      icon: goodsIcon,
      subcategories: generateSubcategories('/goods', [
         'categories.productKidsClothes',
         'categories.productElectronics',
         'categories.productFood'
      ])
   }
]);
</script>

<style scoped lang="scss">
.layout-2 {
   margin-top: 134px;
   padding: 0 16px;
   margin-bottom: 40px;

   @media screen and (max-width: 991px) {
      margin-top: 118px;
   }

   &__container {
      max-width: 1280px;
      margin: 0 auto;
   }

   &__list {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 24px;

      @media (max-width: 1200px) {
         grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 1000px) {
         grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 600px) {
         grid-template-columns: repeat(2, 1fr);
         gap: 16px;
      }

      @media (max-width: 330px) {
         gap: 10px 18px;
      }

      @media (max-width: 280px) {
         grid-template-columns: 1fr;
      }
   }
}
</style>

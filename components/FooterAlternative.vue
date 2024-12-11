<template>
   <footer class="footer" :class="{ 'footer--visible': isVisible }" @mouseenter="cancelAutoHide"
      @mouseleave="startAutoHide" v-if="!isCreateAdPage">
      <div class="footer__row">
         <div class="footer__container">
            <div class="footer__bottom">
               <ul class="footer__links">
                  <li><nuxt-link to="/autos">Правила</nuxt-link></li>
                  <li><nuxt-link to="/autos">Соглашение</nuxt-link></li>
                  <li><nuxt-link to="/autos">Конфиденциальность</nuxt-link></li>
               </ul>
               <div class="footer__text">
                  Aligo corporate co ltd. 2024г. Мы делаем Грузию мобильнее.
               </div>
            </div>
            <nuxt-link to="/" class="footer__logo">
               <img src="../assets/icons/white-logo.svg" alt="Логотип">
            </nuxt-link>
         </div>
      </div>
   </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const isVisible = ref(false);
const isCreateAdPage = ref(false);
let lastScrollTop = 0;
let autoHideTimeout = null;

const route = useRoute();

const handleScroll = () => {
   const currentScrollTop = window.scrollY;
   if (currentScrollTop < lastScrollTop) {
      isVisible.value = true;
      startAutoHide();
   } else {
      isVisible.value = false;
      cancelAutoHide();
   }
   lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

const startAutoHide = () => {
   cancelAutoHide();
   autoHideTimeout = setTimeout(() => {
      isVisible.value = false;
   }, 3000);
};

const cancelAutoHide = () => {
   clearTimeout(autoHideTimeout);
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
   isCreateAdPage.value = route.name === 'createAd';
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
   cancelAutoHide();
});
</script>

<style scoped lang="scss">
.footer {
   margin-top: 40px;
   position: fixed;
   display: none;
   bottom: 0;
   left: 0;
   width: 100%;
   transform: translateY(100%);
   transition: transform 0.3s ease-in-out;
   z-index: 1000;

   @media (max-width: 768px) {
      display: none;
   }

   &--visible {
      transform: translateY(0);
   }

   &__row {
      background: #3366FF;
   }

   &__container {
      max-width: 1312px;
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      padding: 0 16px;

      @media (max-width: 768px) {
         align-items: flex-start;
      }
   }

   &__logo {
      transition: $transition-1;
      outline: none;
      height: 24px;
      margin: 16px 0;

      @media (max-width: 768px) {
         position: absolute;
         top: 0;
         right: 16px;
         height: 16px;
      }

      img {
         height: 24px;

         @media (max-width: 768px) {
            height: 16px;
         }
      }
   }

   &__bottom {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: 16px 0;

      @media (max-width: 768px) {
         gap: 10px;
      }
   }

   &__links {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 16px;

      @media (max-width: 768px) {
         flex-direction: column;
         align-items: flex-start;
         gap: 8px;
      }

      li a {
         color: $white;
         font-weight: 400;
         font-size: 12px;
         text-decoration: underline;
         transition: $transition-1;
         line-height: 1;
         vertical-align: middle;

         &:hover {
            text-decoration: none;
         }
      }
   }

   &__text {
      font-weight: 400;
      font-size: 10px;
      color: #D6EFFF;
   }
}
</style>

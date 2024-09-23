<template>
   <div class="language-switcher">
      <div class="language-switcher__current" @click="toggleLanguageSwitcherList">
         <img class="language-switcher__flag" :src="currentLanguage.flag" :alt="currentLanguage.code" />
         <span class="language-switcher__name">{{ currentLanguage.name }}</span>
      </div>
      <div class="language-switcher__list-wrapper" :class="{ 'language-switcher__list-wrapper--active': isActive }">
         <ul class="language-switcher__list">
            <li class="language-switcher__list-item" v-for="language in sortedLanguages" :key="language.code"
               @click="switchLanguage(language)">
               <div class="language-switcher__language"
                  :class="{ 'language-switcher__language--current': language.code === currentLanguage.code }">
                  <img class="language-switcher__flag" :src="language.flag" :alt="language.code" />
                  {{ language.name }}
               </div>
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

import flagRU from '../assets/icons/ru.svg';
import flagGE from '../assets/icons/ge.png';
import flagEN from '../assets/icons/en.png';

const { locale, setLocale } = useI18n();
const isActive = ref(false);

const languages = ref([
   { code: 'ru', name: 'RU', flag: flagRU },
   { code: 'ge', name: 'GE', flag: flagGE },
   { code: 'en', name: 'EN', flag: flagEN },
]);

const currentLanguage = ref(languages.value.find(lang => lang.code === locale.value) || languages.value[0]);

const toggleLanguageSwitcherList = (event) => {
   event.stopPropagation();
   isActive.value = !isActive.value;
};

const switchLanguage = (language) => {
   if (currentLanguage.value.code !== language.code) {
      currentLanguage.value = language;
      setLocale(language.code);
   }
   isActive.value = false;
};

const sortedLanguages = computed(() => {
   return [currentLanguage.value, ...languages.value.filter(lang => lang.code !== currentLanguage.value.code)];
});

watch(locale, (newLocale) => {
   currentLanguage.value = languages.value.find(lang => lang.code === newLocale);
});

const closeListOnScroll = () => {
   isActive.value = false;
};

onMounted(() => {
   currentLanguage.value = languages.value.find(lang => lang.code === locale.value) || languages.value[0];
   document.addEventListener('click', () => {
      isActive.value = false;
   });
   window.addEventListener('scroll', closeListOnScroll);
});

onUnmounted(() => {
   window.removeEventListener('scroll', closeListOnScroll);
});
</script>


<style lang="scss" scoped>
.language-switcher {
   position: relative;
   display: flex;
   align-items: center;
   height: 100%;

   &__current {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px 10px 0;
      font-size: 12px;
      line-height: 100%;
      color: $main-text;
      cursor: pointer;
      transition: $transition-1;

      @media screen and (max-width: 600px) {
         padding: 10px 0;
      }

      &:hover {
         color: $main-button;
      }
   }

   &__flag {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      object-fit: cover;

      @media screen and (max-width: 600px) {
         width: 12px;
         height: 12px;
      }
   }

   &__list-wrapper {
      position: absolute;
      top: -4px;
      left: 0;
      z-index: 100;
      display: none;
      width: 100vw;
      max-width: 180px;
      background: $white;
      border: 1px solid $main-button;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
      border-radius: 0 0 4px 4px;
      overflow: hidden;

      @media screen and (max-width: 600px) {
         top: -5px;
         left: -16px;
         border-radius: 0 0 6px 0;
      }

      &--active {
         display: block;
      }
   }

   &__list {
      list-style: none;
      margin: 0;
      padding: 0;
   }

   &__list-item {
      cursor: pointer;
   }

   &__language {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 12px;
      font-size: 12px;
      color: $main-text;

      &--current {
         height: 43px;
         border-bottom: 1px solid $color-block;
         pointer-events: none;

         &::after {
            content: '';
            display: block;
            width: 16px;
            height: 12px;
            background: url('../assets/icons/check-icon.svg') center center / contain no-repeat;
            margin-left: auto;
         }
      }
   }

   &__name {
      font-weight: 400;
      font-size: 12px;
      line-height: 1.25em;
      color: $white;
   }
}
</style>

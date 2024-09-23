<template>
   <section class="layout">
      <div class="layout__container">
         <div class="layout__content">
            <h2 class="layout__title">{{ $t('info.title') }}</h2>
            <p class="layout__paragraph">{{ $t('info.paragraphs.0') }}</p>
            <p class="layout__paragraph">{{ $t('info.paragraphs.1') }}</p>
            <p class="layout__paragraph">{{ $t('info.paragraphs.2') }}</p>
            <p class="layout__paragraph">{{ $t('info.paragraphs.3') }}</p>
         </div>
      </div>
   </section>
</template>

<style scoped lang="scss">
.layout {
   max-width: 1280px;
   width: 100%;
   margin: 72px auto;

   &__content {
      columns: 2;
      column-gap: 27px;

      @media screen and (max-width: 900px) {
         columns: 1;
      }
   }

   &__title {
      margin: 0;
      margin-bottom: 16px;
   }

   &__paragraph {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      line-height: 1.29em;
      margin-bottom: 1.29em;

      &:last-child {
         margin-bottom: 0;
      }

      @media screen and (max-width: 600px) {
         &:not(:first-of-type) {
            display: none;
         }
      }

      &--highlight {
         color: #787878;
      }
   }

   &__list {
      list-style: none;
      display: inline-block;
      width: 100%;
      columns: 2;
      column-gap: 3em;
      font-size: 14px;
      padding-left: 1.5em;
      margin-bottom: 1.29em;

      @media screen and (max-width: 600px) {
         columns: 1;
      }

      &:last-child {
         margin-bottom: 0;
      }

      &-item {
         position: relative;
         font-size: 14px;
         line-height: 1.29em;
         margin-bottom: 1.29em;

         &::before {
            position: absolute;
            left: -1.5em;
            top: 0.2em;
            content: '';
            display: block;
            width: 1em;
            height: 1em;
         }
      }
   }
}
</style>

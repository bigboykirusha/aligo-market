<template>
   <section class="layout">
      <div class="layout__container">
         <div class="layout__content">
            <h1 class="layout__title">🚗 Aligo – сервис бесплатных объявлений для всех!</h1>
            <p class="layout__paragraph">Мы – небольшая, но амбициозная команда разработчиков, которая создает удобный,
               современный и максимально доступный сервис для покупки и продажи автомобилей, мототехники, запчастей и
               аксессуаров. Aligo – это простота, удобство и никаких лишних комиссий!</p>
            <p class="layout__paragraph">Наши пользователи могут бесплатно размещать объявления, быстро находить нужные
               товары и легко связываться с продавцами. Мы уверены, что поиск машины, редкой детали или нужного
               аксессуара не должен превращаться в сложный квест. Именно поэтому мы сделали Алиго интуитивно понятным и
               доступным для каждого.</p>
            <p class="layout__paragraph">Присоединяйтесь к нам и помогайте делать его лучше! Aligo – там, где автомобили
               находят своих владельцев. 🚀</p>
         </div>
      </div>
   </section>
</template>

<style scoped lang="scss">
.layout {
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;

   &__content {
      column-count: 1;
   }

   &__title {
      margin: 0;
      margin-bottom: 16px;
      font-size: 24px;
      color: #323232;
   }

   &__paragraph {
      display: block;
      color: #323232;
      font-size: 14px;
      line-height: 1.29;
      margin-bottom: 18px;

      &:last-child {
         margin-bottom: 0;
      }
   }
}
</style>

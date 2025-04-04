<template>
   <div class="car-info__wrapper">
      <div class="car-info__slider">
         <template v-if="car">
            <CarSlider :images="car.photos" :adsId="car.id" :carData="car" :userId="car.id_user_owner_ads" />
         </template>
         <template v-else>
            <div class="skeleton skeleton-slider"></div>
         </template>
      </div>

      <div class="car-contact-wrapper">
         <template v-if="car">
            <CarContact :id_user_owner_ads="car.id_user_owner_ads"
               :brand="car.auto_technical_specifications[0]?.brand?.title"
               :model="car.auto_technical_specifications[0]?.model?.title"
               :year="car.auto_technical_specifications[0]?.year_release?.title" :amount="car.ads_parameter.amount"
               :username="car.ads_parameter?.username || car.ads_parameter?.login || 'Имя не указано'"
               :place="car.ads_parameter?.place_inspection || 'Не указано'" :id="car.id"
               :is_in_favorites="car.is_in_favorites" :latitude="car.ads_parameter?.latitude"
               :longitude="car.ads_parameter?.longitude" :photos="car.photos" />
         </template>
         <template v-else>
            <CarContactSkeleton />
         </template>
      </div>

      <template v-if="car">
         <Spec :brand="car.auto_technical_specifications[0]?.brand?.title"
            :model="car.auto_technical_specifications[0]?.model?.title"
            :year="car.auto_technical_specifications[0]?.year_release?.title" :shortReport="car.short_report"
            :id="car.id" />
      </template>
      <template v-else>
         <div class="skeleton skeleton-spec"></div>
      </template>

      <section class="block-section block-section--characteristics">
         <div class="block-section__container">
            <h2 class="block-section__title">Характеристики</h2>
            <div v-if="car" class="block-section__content block-section__content--columns">
               <p v-for="(value, key) in characteristics" :key="key" class="block-section__text">
                  <span class="block-section__label">{{ key }}: </span>{{ value }}
               </p>
            </div>
            <div v-else class="skeleton skeleton-characteristics"></div>
         </div>
      </section>

      <div class="delimeter"></div>

      <section class="block-section block-section--description">
         <div class="block-section__container">
            <h2 class="block-section__desc">Описание</h2>
            <div v-if="car" class="block-section__content block-section__content--single-column block-section__desc">
               <pre class="block-section__text">{{car.ads_parameter?.ads_description.split('\n').map(line =>
                  line.trim()).join('\n')}}</pre>
            </div>
            <div v-else class="skeleton skeleton-description"></div>
         </div>
      </section>

      <div class="delimeter" v-if="car && car.ads_parameter.ads_description"></div>

      <section v-if="car && equipment.length" class="block-section block-section--equipment">
         <div class="block-section__container">
            <h2 class="block-section__title">Комплектация</h2>
            <div class="block-section__content block-section__content--single-column">
               <ul class="block-section__list">
                  <li v-for="(item, index) in equipment" :key="index" class="block-section__list-item">
                     {{ item }}
                  </li>
               </ul>
            </div>
         </div>
      </section>

      <div class="delimeter" v-if="car && equipment.length"></div>

      <ComplainButton v-if="car && (car.id_user_owner_ads !== userStore.userId)" :userId="car.id_user_owner_ads"
         :adsId="car.id" />
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/store/user';
import CarContactSkeleton from './CarContactSkeleton.vue';

const props = defineProps({
   car: { type: Object }
});

const userStore = useUserStore();

const characteristics = computed(() => {
   const vin = props.car.auto_registration_data[0]?.vin || 'Не указано';
   const mileage = props.car.auto_history_conditions[0]?.mileage;

   return {
      'Год выпуска': props.car.auto_technical_specifications[0]?.year_release?.title || 'Не указано',
      'Пробег': mileage ? `${mileage} км` : 'Не указано',
      'Владельцев по ПТС': props.car.auto_history_conditions[0]?.count_owners?.title || 'Не указано',
      'Состояние': props.car.auto_history_conditions[0]?.state?.title || 'Не указано',
      'Тип двигателя': props.car.auto_technical_specifications[0]?.engine_type?.title || 'Не указано',
      'Коробка передач': props.car.auto_technical_specifications[0]?.transmission?.title || 'Не указано',
      'Привод': props.car.auto_technical_specifications[0]?.drive?.title || 'Не указано',
      'Тип кузова': props.car.auto_technical_specifications[0]?.car_body_type?.title || 'Не указано',
      'Цвет': props.car.auto_appearances[0]?.color?.title?.charAt(0).toUpperCase() + props.car.auto_appearances[0]?.color?.title?.slice(1) || 'Не указано',
      'Руль': props.car.auto_technical_specifications[0]?.handlebar?.title || 'Не указано',
      'VIN или номер кузова': vin.length > 8 ? vin.slice(0, 4) + '****' + vin.slice(-4) : vin,
   };
});

const equipment = computed(() => {
   const options = {
      'Подогрев передних сидений': props.car.auto_additional_options_heating?.[0]?.is_front_seats,
      'Подогрев задних сидений': props.car.auto_additional_options_heating?.[0]?.is_rear_seats,
      'Подогрев зеркал': props.car.auto_additional_options_heating?.[0]?.is_mirrors,
      'Подогрев заднего стекла': props.car.auto_additional_options_heating?.[0]?.is_rear_window,
      'Подогрев руля': props.car.auto_additional_options_heating?.[0]?.is_steering_wheel,
      'Электропривод передних сидений': props.car.auto_additional_options_electric_drive?.[0]?.is_front_seats_drives,
      'Мониторинг слепых зон': props.car.auto_additional_options_driving_assistance?.[0]?.is_blind_spot_monitoring,
      'Автоматическая парковка': props.car.auto_additional_options_driving_assistance?.[0]?.is_automatic_parking,
      'Датчик дождя': props.car.auto_additional_options_driving_assistance?.[0]?.is_rain_sensor,
      'Круиз-контроль': props.car.auto_additional_options_driving_assistance?.[0]?.is_cruise_control,
      'Антиблокировочная система (ABS)': props.car.auto_additional_active_security?.[0]?.is_anti_lock_brakes,
      'Антипробуксовочная система': props.car.auto_additional_active_security?.[0]?.is_anti_slip,
      'Спутниковая система': props.car.auto_additional_options_anticreeping_system?.[0]?.is_satellite,
      'Навигационная система': props.car.auto_additional_multimedia_navigation?.[0]?.is_navigation_system,
      'Bluetooth': props.car.auto_additional_multimedia_navigation?.[0]?.is_Bluetooth,
      'Ксеноновые фары': props.car.auto_additional_headlights?.[0]?.is_xenon_headlights,
      'Светодиодные фары': props.car.auto_additional_headlights?.[0]?.is_led_headlights,
      'Противотуманные фары': props.car.auto_additional_headlights?.[0]?.is_fog_lights,
      'Литые диски': props.car.auto_additional_tires_wheels?.[0]?.is_alloy_wheels,
   };

   return Object.entries(options)
      .filter(([_, value]) => value)
      .map(([key]) => key);
});
</script>

<style lang="scss" scoped>
h2 {
   margin: 0;
}

.car-contact-wrapper {
   display: none;

   @media (max-width: 1280px) {
      display: block;
   }
}

.car-info__wrapper {
   width: 100%;
   margin-bottom: 40px;
   z-index: 2;

   overflow: hidden;

   @media (max-width: 1280px) {
      max-width: calc(100vw - 32px);
   }
}

.car-info__slider {
   height: 480px;

   @media (max-width: 768px) {
      height: 360px;
   }
}

.block-section {
   padding: 40px 0;

   &__title,
   &__desc {
      margin-bottom: 16px;
      font-size: 20px;
      line-height: 24px;
      color: #323232;
   }

   &__label {
      color: #787878;
   }

   &__content {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      &--columns {
         display: grid;
         grid-template-columns: repeat(2, 1fr);
         gap: 16px;

         @media (max-width: 768px) {
            grid-template-columns: 1fr;
         }
      }

      &--single-column {
         flex-direction: column;
      }
   }

   &__text {
      display: flex;
      gap: 8px;
      font-size: 14px;
      line-height: 18px;
      word-break: break-word;
      color: #323232;
   }

   &__list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 100%;
      border-bottom: 1px solid #D6D6D6;
      padding-bottom: 40px;

      @media (max-width: 768px) {
         grid-template-columns: 1fr;
      }
   }

   &__list-item {
      position: relative;
      font-size: 14px;
      line-height: 18px;
      padding-left: 1.5em;

      &::before {
         content: '';
         position: absolute;
         left: 0;
         top: 0.2em;
         width: 1em;
         height: 1em;
         background: url(../assets/images/svg/check-icon.svg) center / contain no-repeat;
      }
   }
}

.delimeter {
   background-color: #D6D6D6;
   height: 1px;
   width: 100%;
   margin: 0 auto;
}

.skeleton {
   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
   background-size: 200% 100%;
   animation: shimmer 1.5s infinite linear;
   border-radius: 6px;

   &-slider {
      height: 480px;

      @media (max-width: 768px) {
         height: 360px;
      }
   }

   &-contact {
      width: 100%;
      height: 120px;
      display: none;
      margin-top: 24px;

      @media (max-width: 1280px) {
         display: block;
      }
   }

   &-spec {
      width: 100%;
      height: 128px;
      margin-top: 24px;
   }

   &-characteristics {
      width: 100%;
      height: 188px;
   }

   &-description {
      width: 100%;
      height: 188px;
   }
}

@keyframes shimmer {
   0% {
      background-position: -200% 0;
   }

   100% {
      background-position: 200% 0;
   }
}
</style>

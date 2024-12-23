<template>
   <div>
      <CarSlider :images="car.photos" :adsId="car.id" :userId="car.id_user_owner_ads" />
      <div class="car-contact-wrapper">
         <CarContact :id_user_owner_ads="car.id_user_owner_ads"
            :brand="car.auto_technical_specifications[0].brand.title"
            :model="car.auto_technical_specifications[0].model.title"
            :year="car.auto_technical_specifications[0].year_release.title" :amount="car.ads_parameter.amount"
            :username="car.ads_parameter?.username || car.ads_parameter?.login || 'Имя не указано'"
            :place="car.ads_parameter.place_inspection || 'Не указано'" :id="car.id"
            :is_in_favorites="car.is_in_favorites" :latitude="car.ads_parameter.latitude"
            :longitude="car.ads_parameter.longitude" :photos="car.photos" />
      </div>

      <section class="block-section block-section--description">
         <div class="block-section__container">
            <h2 class="block-section__desc">Описание</h2>
            <div class="block-section__content block-section__content--single-column block-section__desc">
               <p class="block-section__text">{{ car.ads_parameter.ads_description }}</p>
            </div>
            <Spec />
         </div>
      </section>
      <div class="delimeter"></div>
      <section class="block-section block-section--characteristics">
         <div class="block-section__container">
            <h2 class="block-section__title">Характеристики</h2>
            <div class="block-section__content block-section__content--columns">
               <p v-for="(value, key) in characteristics" :key="key" class="block-section__text">
                  <span class="block-section__label">{{ key }}: </span>{{ value }}
               </p>
            </div>
         </div>
      </section>
      <div class="delimeter" v-if="equipment.length > 0"></div>
      <section v-if="equipment.length > 0" class="block-section block-section--equipment">
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
         <ComplainButton v-if="!car.id_user_owner_ads !== userStore.userId" :userId="car.id_user_owner_ads" :adsId="car.id"/>
      </section>

   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/store/user';

const props = defineProps({
   car: {
      type: Object,
      required: true
   }
});

const userStore = useUserStore();

const characteristics = computed(() => {
   const vin = props.car.auto_registration_data[0].vin || 'Не указано';
   const maskedVin = vin.length > 8 ? vin.slice(0, 4) + '****' + vin.slice(-4) : vin;

   const mileage = props.car.auto_history_conditions[0].mileage;
   const mileageText = mileage ? `${mileage} км` : 'Не указано';

   return {
      'Год выпуска': props.car.auto_technical_specifications[0].year_release.title || 'Не указано',
      'Пробег': mileageText,
      'Владельцев по ПТС': props.car.auto_history_conditions[0].count_owners?.title || 'Не указано',
      'Состояние': props.car.auto_history_conditions[0].state.title || 'Не указано',
      'Тип двигателя': props.car.auto_technical_specifications[0].engine_type.title || 'Не указано',
      'Коробка передач': props.car.auto_technical_specifications[0].transmission.title || 'Не указано',
      'Привод': props.car.auto_technical_specifications[0].drive.title || 'Не указано',
      'Тип кузова': props.car.auto_technical_specifications[0].car_body_type.title || 'Не указано',
      'Цвет': props.car.auto_appearances?.[0]?.color
         ?.map(c => c.title.charAt(0).toUpperCase() + c.title.slice(1))
         .join(', ') || 'Не указано',
      'Руль': props.car.auto_technical_specifications[0].handlebar.title || 'Не указано',
      'VIN или номер кузова': maskedVin,
      'Усилитель руля': props.car.auto_additional_options[0]?.power_steering?.title || 'Не указано',
      'Салон': props.car.auto_additional_options_salon[0]?.salon?.title || 'Не указано',
      'Электростеклоподъемники': props.car.auto_additional_options[0]?.electric_windows?.title || 'Не указано',
      'Аудиосистемы': props.car.auto_additional_audio_system[0]?.audio_system[0]?.title || 'Не указано',
      'Шины и диски': props.car.auto_additional_tires_wheels[0]?.tires_wheels[0]?.title || 'Не указано',
      'Климат-контроль': props.car.auto_additional_options_climate_management[0]?.climate_management?.title || 'Не указано',
      'Фары': props.car.auto_additional_headlights[0]?.headlight[0]?.title || 'Не указано',
   };
});

const equipment = computed(() => {
   const items = [];

   const climateOptions = props.car.auto_additional_options_climate_management?.[0] || {};
   const headlightsOptions = props.car.auto_additional_headlights?.[0] || {};
   const airbagsOptions = props.car.auto_additional_options_airbag?.[0] || {};
   const heatingOptions = props.car.auto_additional_options_heating?.[0] || {};
   const electricDriveOptions = props.car.auto_additional_options_electric_drive?.[0] || {};
   const settingMemoryOptions = props.car.auto_additional_options_setting_memory?.[0] || {};
   const anticreepingSystem = props.car.auto_additional_options_anticreeping_system?.[0] || {};
   const audioSystem = props.car.auto_additional_audio_system?.[0] || {};
   const activeSecurity = props.car.auto_additional_active_security?.[0] || {};
   const drivingAssistanceOptions = props.car.auto_additional_options_driving_assistance?.[0] || {};
   const mediaOptions = props.car.auto_additional_multimedia_navigation?.[0] || {};
   const wheelsOptions = props.car.auto_additional_tires_wheels?.[0] || {};

   // Добавляем опции в список
   if (heatingOptions.is_front_seats) items.push('Подогрев передних сидений');
   if (heatingOptions.is_rear_seats) items.push('Подогрев задних сидений');
   if (heatingOptions.is_mirrors) items.push('Подогрев зеркал');
   if (heatingOptions.is_rear_window) items.push('Подогрев заднего стекла');
   if (heatingOptions.is_steering_wheel) items.push('Подогрев руля');

   if (electricDriveOptions.is_front_seats_drives) items.push('Электропривод передних сидений');
   if (electricDriveOptions.is_rear_seats_drives) items.push('Электропривод задних сидений');
   if (electricDriveOptions.is_mirrors_drives) items.push('Электропривод зеркал');
   if (electricDriveOptions.is_steering_column_drives) items.push('Электропривод рулевой колонки');
   if (electricDriveOptions.is_folding_mirrors_drives) items.push('Электропривод складывания зеркал');

   if (settingMemoryOptions.is_front_seats_setting) items.push('Память передних сидений');
   if (settingMemoryOptions.is_rear_seats_setting) items.push('Память задних сидений');
   if (settingMemoryOptions.is_mirrors_setting) items.push('Память зеркал');
   if (settingMemoryOptions.is_steering_column_setting) items.push('Память рулевой колонки');

   if (drivingAssistanceOptions.is_blind_spot_monitoring) items.push('Мониторинг слепых зон');
   if (drivingAssistanceOptions.is_automatic_parking) items.push('Автоматическая парковка');
   if (drivingAssistanceOptions.is_rain_sensor) items.push('Датчик дождя');
   if (drivingAssistanceOptions.is_light_sensor) items.push('Датчик света');
   if (drivingAssistanceOptions.is_rear_parking_sensor) items.push('Парктроник задний');
   if (drivingAssistanceOptions.is_front_parking_sensor) items.push('Парктроник передний');
   if (drivingAssistanceOptions.is_rear_view_camera) items.push('Камера заднего вида');
   if (drivingAssistanceOptions.is_cruise_control) items.push('Круиз-контроль');
   if (drivingAssistanceOptions.is_onboard_computer) items.push('Бортовой компьютер');

   if (anticreepingSystem.is_alarm_system) items.push('Сигнализация');
   if (anticreepingSystem.is_central_lock) items.push('Центральный замок');
   if (anticreepingSystem.is_immobilizer) items.push('Иммобилайзер');
   if (anticreepingSystem.is_satellite) items.push('Спутниковая система');

   if (airbagsOptions.is_frontal_airbags) items.push('Фронтальные подушки безопасности');
   if (airbagsOptions.is_knee_high_airbags) items.push('Подушки безопасности для коленей');
   if (airbagsOptions.is_curtains_airbags) items.push('Шторки безопасности');
   if (airbagsOptions.is_side_front_airbags) items.push('Боковые передние подушки безопасности');
   if (airbagsOptions.is_side_rear_airbags) items.push('Боковые задние подушки безопасности');

   if (activeSecurity.is_anti_lock_brakes) items.push('Антиблокировочная система (ABS)');
   if (activeSecurity.is_anti_slip) items.push('Антипробуксовочная система');
   if (activeSecurity.is_exchange_rate_stability) items.push('Система курсовой устойчивости');
   if (activeSecurity.is_distrib_braking_forces) items.push('Система распределения тормозных усилий');
   if (activeSecurity.is_emergency_braking) items.push('Система экстренного торможения');
   if (activeSecurity.is_differential_block) items.push('Блокировка дифференциала');
   if (activeSecurity.is_pedestrian_detection) items.push('Система обнаружения пешеходов');

   if (mediaOptions.is_CD_DVD_Bluray) items.push('Система CD/DVD/Bluray');
   if (mediaOptions.is_AUX) items.push('AUX');
   if (mediaOptions.is_MP3) items.push('MP3');
   if (mediaOptions.is_Bluetooth) items.push('Bluetooth');
   if (mediaOptions.is_Radio) items.push('Радио');
   if (mediaOptions.is_TV) items.push('Телевидение');
   if (mediaOptions.is_Video) items.push('Видеосистема');
   if (mediaOptions.is_Hands_Free) items.push('Громкая связь');
   if (mediaOptions.is_USB) items.push('USB');
   if (mediaOptions.is_navigation_system) items.push('Навигационная система');
   if (mediaOptions.is_control_on_steering_wheel) items.push('Управление на руле');

   if (audioSystem.is_premium_audio_system) items.push('Премиальная аудиосистема');
   if (audioSystem.is_subwoofer) items.push('Сабвуфер');

   if (climateOptions.is_climate_control) items.push('Климат-контроль');
   if (climateOptions.is_multizone_climate_control) items.push('Мультизонный климат-контроль');
   if (climateOptions.is_air_conditioner) items.push('Кондиционер');
   if (climateOptions.is_air_quality_control) items.push('Контроль качества воздуха');

   if (headlightsOptions.is_led_headlights) items.push('Светодиодные фары');
   if (headlightsOptions.is_xenon_headlights) items.push('Ксеноновые фары');
   if (headlightsOptions.is_adaptive_headlights) items.push('Адаптивные фары');
   if (headlightsOptions.is_fog_lights) items.push('Противотуманные фары');
   if (headlightsOptions.is_daytime_running_lights) items.push('Дневные ходовые огни');

   if (wheelsOptions.is_alloy_wheels) items.push('Литые диски');
   if (wheelsOptions.is_full_size_spare) items.push('Полноразмерная запаска');
   if (wheelsOptions.is_space_saver_spare) items.push('Запаска-укладка');

   return items;
});
</script>

<style lang="scss" scoped>
.car-contact-wrapper {
   display: none;

   @media (max-width: 1280px) {
      display: block;
   }
}

.block-section {
   padding: 40px 0;
   max-width: 740px;

   &__title {
      margin: 0;
      margin-bottom: 16px;
   }

   &__content {
      &--columns {
         columns: 2;
         column-gap: 27px;

         @media screen and (max-width: 768px) {
            columns: 1;
         }
      }

      &--single-column {
         columns: 1;
      }
   }

   &__text {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 16px;

      word-wrap: break-word;
      overflow-wrap: break-word;

      &:last-child {
         margin-bottom: 0;
      }
   }

   &__label {
      color: #787878;
   }

   &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      columns: 2;
      column-gap: 3em;
      font-size: 14px;
      padding-left: 24px;
      border-bottom: 1px solid #D6D6D6;
      padding-bottom: 40px;

      @media screen and (max-width: 600px) {
         columns: 1;
      }

      &:last-child {
         margin-bottom: 0;
      }
   }

   &__list-item {
      position: relative;
      font-size: 14px;
      line-height: 18px;

      &::before {
         position: absolute;
         left: -1.5em;
         top: 0.2em;
         content: '';
         display: block;
         width: 1em;
         height: 1em;
         background: url(../assets/images/svg/check-icon.svg) center center / contain no-repeat;
      }
   }
}

.delimeter {
   background-color: #D6D6D6;
   height: 1px;
   max-width: 1280px;
   width: 100%;
   padding: 0 16px;
   margin: 0 auto;
}
</style>

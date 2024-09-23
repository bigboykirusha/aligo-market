<template>
   <div class="characteristics">
      <div class="characteristics__content">
         <SelectSkeleton v-if="loading" />
         <SelectOptionsTemplate v-else label="Усилитель руля" :initialSelectedOption="createStore.power_steering"
            :options="PowerSteeringOptions" @updateSort="handlePowerSteeringUpdate" placeholder="Нажмите для выбора" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Управление климатом</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.climate" :options="ClimateOptions"
                  @updateSort="handleClimateUpdate" placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Управление на руле" :checked="createStore.is_wheel_control"
                  @updateChecked="handleWheelControlUpdate" />
               <SimpleCheckboxTemplate label="Атермальное остекление" :checked="createStore.is_athermal_glazing"
                  @updateChecked="handleAthermalGlazingUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Салон</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :activeIndexes="createStore.salon" :options="SalonOptions"
                  @updateSort="handleSalonUpdate" placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Кожаный руль" :checked="createStore.is_leather_wheel"
                  @updateChecked="handleLeatherWheelUpdate" />
               <SimpleCheckboxTemplate label="Люк" :checked="createStore.is_hatch" @updateChecked="handleHatchUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Обогрев</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Передних сидений" :checked="createStore.is_front_seats"
                  @updateChecked="handleFrontSeatsUpdate" />
               <SimpleCheckboxTemplate label="Задних сидений" :checked="createStore.is_rear_seats"
                  @updateChecked="handleRearSeatsUpdate" />
               <SimpleCheckboxTemplate label="Зеркал" :checked="createStore.is_mirrors"
                  @updateChecked="handleMirrorsUpdate" />
               <SimpleCheckboxTemplate label="Заднего стекла" :checked="createStore.is_rear_window"
                  @updateChecked="handleRearWindowUpdate" />
               <SimpleCheckboxTemplate label="Руля" :checked="createStore.is_steering_wheel"
                  @updateChecked="handleSteeringWheelUpdate" />
            </div>
         </div>
         <SelectSkeleton v-if="loading" />
         <SelectOptionsTemplate v-else label="Электростеклоподъемники"
            :initialSelectedOption="createStore.electric_window" :options="ElectricWindowOptions"
            @updateSort="handleElectricWindowUpdate" placeholder="Нажмите для выбора" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Электропривод</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Передних сидений" :checked="createStore.is_front_seats_drives"
                  @updateChecked="handleFrontSeatsDrivesUpdate" />
               <SimpleCheckboxTemplate label="Задних сидений" :checked="createStore.is_rear_seats_drives"
                  @updateChecked="handleRearSeatsDrivesUpdate" />
               <SimpleCheckboxTemplate label="Зеркал" :checked="createStore.is_mirrors_drives"
                  @updateChecked="handleMirrorsDrivesUpdate" />
               <SimpleCheckboxTemplate label="Рулевой колонки" :checked="createStore.is_steering_column_drives"
                  @updateChecked="handleSteeringColumnDrivesUpdate" />
               <SimpleCheckboxTemplate label="Складывающихся зеркал" :checked="createStore.is_folding_mirrors_drives"
                  @updateChecked="handleFoldingMirrorsDrivesUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Память настроек</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Передних сидений" :checked="createStore.is_front_seats_setting"
                  @updateChecked="handleFrontSeatsSettingUpdate" />
               <SimpleCheckboxTemplate label="Задних сидений" :checked="createStore.is_rear_seats_setting"
                  @updateChecked="handleRearSeatsSettingUpdate" />
               <SimpleCheckboxTemplate label="Зеркал" :checked="createStore.is_mirrors_setting"
                  @updateChecked="handleMirrorsSettingUpdate" />
               <SimpleCheckboxTemplate label="Рулевой колонки" :checked="createStore.is_steering_column_setting"
                  @updateChecked="handleSteeringColumnSettingUpdate" />
            </div>
         </div>
      </div>
      <div class="characteristics__content">
         <div class="checkbox-section">
            <div class="checkbox-section__title">Помощь при вождении</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Система контроля слепых зон"
                  :checked="createStore.is_blind_spot_monitoring" @updateChecked="handleBlindSpotMonitoringUpdate" />
               <SimpleCheckboxTemplate label="Автоматический парковщик" :checked="createStore.is_automatic_parking"
                  @updateChecked="handleAutomaticParkingUpdate" />
               <SimpleCheckboxTemplate label="Датчик дождя" :checked="createStore.is_rain_sensor"
                  @updateChecked="handleRainSensorUpdate" />
               <SimpleCheckboxTemplate label="Датчик света" :checked="createStore.is_light_sensor"
                  @updateChecked="handleLightSensorUpdate" />
               <SimpleCheckboxTemplate label="Задний парктроник" :checked="createStore.is_rear_parking_sensor"
                  @updateChecked="handleRearParkingSensorUpdate" />
               <SimpleCheckboxTemplate label="Передний парктроник" :checked="createStore.is_front_parking_sensor"
                  @updateChecked="handleFrontParkingSensorUpdate" />
               <SimpleCheckboxTemplate label="Камера заднего вида" :checked="createStore.is_rear_view_camera"
                  @updateChecked="handleRearViewCameraUpdate" />
               <SimpleCheckboxTemplate label="Круиз-контроль" :checked="createStore.is_cruise_control"
                  @updateChecked="handleCruiseControlUpdate" />
               <SimpleCheckboxTemplate label="Бортовой компьютер" :checked="createStore.is_onboard_computer"
                  @updateChecked="handleOnboardComputerUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Противоугонная система</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Сигнализация" :checked="createStore.is_alarm_system"
                  @updateChecked="handleAlarmSystemUpdate" />
               <SimpleCheckboxTemplate label="Центральный замок" :checked="createStore.is_central_lock"
                  @updateChecked="handleCentralLockUpdate" />
               <SimpleCheckboxTemplate label="Иммобилайзер" :checked="createStore.is_immobilizer"
                  @updateChecked="handleImmobilizerUpdate" />
               <SimpleCheckboxTemplate label="Спутник" :checked="createStore.is_satellite"
                  @updateChecked="handleSatelliteUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Подушки безопасности</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Фронтальные" :checked="createStore.is_frontal_airbags"
                  @updateChecked="handleFrontalAirbagsUpdate" />
               <SimpleCheckboxTemplate label="Коленные" :checked="createStore.is_knee_high_airbags"
                  @updateChecked="handleKneeHighAirbagsUpdate" />
               <SimpleCheckboxTemplate label="Шторки" :checked="createStore.is_curtains_airbags"
                  @updateChecked="handleCurtainsAirbagsUpdate" />
               <SimpleCheckboxTemplate label="Боковые (перед)" :checked="createStore.is_side_front_airbags"
                  @updateChecked="handleSideFrontAirbagsUpdate" />
               <SimpleCheckboxTemplate label="Боковые (зад)" :checked="createStore.is_side_rear_airbags"
                  @updateChecked="handleSideRearAirbagsUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Активная безопасность</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Антиблокировка тормозов" :checked="createStore.is_anti_lock_brakes"
                  @updateChecked="handleAntiLockBrakesUpdate" />
               <SimpleCheckboxTemplate label="Антипробуксовка" :checked="createStore.is_anti_slip"
                  @updateChecked="handleAntiSlipUpdate" />
               <SimpleCheckboxTemplate label="Курсовая устойчивость" :checked="createStore.is_exchange_rate_stability"
                  @updateChecked="handleExchangeRateStabilityUpdate" />
               <SimpleCheckboxTemplate label="Распред. тормозных усилий"
                  :checked="createStore.is_distrib_braking_forces" @updateChecked="handleDistribBrakingForcesUpdate" />
               <SimpleCheckboxTemplate label="Экстренное торможение" :checked="createStore.is_emergency_braking"
                  @updateChecked="handleEmergencyBrakingUpdate" />
               <SimpleCheckboxTemplate label="Блок. дифференциала" :checked="createStore.is_differential_block"
                  @updateChecked="handleDifferentialBlockUpdate" />
               <SimpleCheckboxTemplate label="Обнаружение пешеходов" :checked="createStore.is_pedestrian_detection"
                  @updateChecked="handlePedestrianDetectionUpdate" />
            </div>
         </div>
      </div>
      <div class="characteristics__content">
         <div class="checkbox-section">
            <div class="checkbox-section__title">Мультимедиа и навигация</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="CD/DVD/Bluray" :checked="createStore.is_CD_DVD_Bluray"
                  @updateChecked="handleCDDVDBlurayUpdate" />
               <SimpleCheckboxTemplate label="AUX" :checked="createStore.is_AUX" @updateChecked="handleAUXUpdate" />
               <SimpleCheckboxTemplate label="MP3" :checked="createStore.is_MP3" @updateChecked="handleMP3Update" />
               <SimpleCheckboxTemplate label="Управление на руле" :checked="createStore.is_steering_wheel_control"
                  @updateChecked="handleSteeringWheelControlUpdate" />
               <SimpleCheckboxTemplate label="Bluetooth" :checked="createStore.is_Bluetooth"
                  @updateChecked="handleBluetoothUpdate" />
               <SimpleCheckboxTemplate label="Радио" :checked="createStore.is_Radio"
                  @updateChecked="handleRadioUpdate" />
               <SimpleCheckboxTemplate label="TV" :checked="createStore.is_TV" @updateChecked="handleTVUpdate" />
               <SimpleCheckboxTemplate label="Видео" :checked="createStore.is_Video"
                  @updateChecked="handleVideoUpdate" />
               <SimpleCheckboxTemplate label="USB" :checked="createStore.is_USB" @updateChecked="handleUSBUpdate" />
               <SimpleCheckboxTemplate label="GPS навигатор" :checked="createStore.is_GPS_navigator"
                  @updateChecked="handleGPSNavigatorUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Аудиосистема</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.audio_system"
                  :options="AudioSystemOptions" @updateSort="handleAudioSystemUpdate"
                  placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Сабвуфер" :checked="createStore.is_subwoofer"
                  @updateChecked="handleSubwooferUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Фары</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.headlight" :options="HeadlightOptions"
                  @updateSort="handleHeadlightUpdate" placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Омыватели фар" :checked="createStore.is_washers"
                  @updateChecked="handleWashersUpdate" />
               <SimpleCheckboxTemplate label="Адаптивное освещение" :checked="createStore.is_adaptive_lighting"
                  @updateChecked="handleAdaptiveLightingUpdate" />
               <SimpleCheckboxTemplate label="Противотуманные фары" :checked="createStore.is_antifog"
                  @updateChecked="handleAntifogUpdate" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Шины и диски</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.wheels" :options="WheelsOptions"
                  @updateSort="handleWheelsUpdate" placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Зимний комплект" :checked="createStore.is_winter_included"
                  @updateChecked="handleWinterIncludedUpdate" />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCreateStore } from '../store/create';
import { getCarsPts, getCarsPowerSteering, getCarsSalon, getCarsElectricWindow, getCarsWheels, getCarsAudioSystem, getCarsClimate, getCarsHeadlight } from '../services/apiClient';

const loading = ref(true);
const createStore = useCreateStore();
const PtsOptions = ref([]);
const PowerSteeringOptions = ref([]);
const SalonOptions = ref([]);
const ElectricWindowOptions = ref([]);
const AudioSystemOptions = ref([]);
const WheelsOptions = ref([]);
const HeadlightOptions = ref([]);
const ClimateOptions = ref([]);
const isMobile = ref(false);

const fetchOptions = async () => {
   try {
      await Promise.all([
         fetchPtsOptions(),
         fetchSalonOptions(),
         fetchPowerSteeringOptions(),
         fetchElectricWindowOptions(),
         fetchAudioSystemOptions(),
         fetchWheelsOptions(),
         fetchClimateOptions(),
         fetchHeadlightOptions(),
      ]);
      loading.value = false;
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const fetchPtsOptions = async () => {
   try {
      const cachedPtsOptions = JSON.parse(localStorage.getItem('PtsOptions'));
      if (cachedPtsOptions) {
         PtsOptions.value = cachedPtsOptions;
      } else {
         PtsOptions.value = await getCarsPts();
         localStorage.setItem('PtsOptions', JSON.stringify(PtsOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении ПТС:', error);
   }
};

const fetchSalonOptions = async () => {
   try {
      const cachedSalonOptions = JSON.parse(localStorage.getItem('SalonOptions'));
      if (cachedSalonOptions) {
         SalonOptions.value = cachedSalonOptions;
      } else {
         SalonOptions.value = await getCarsSalon();
         localStorage.setItem('SalonOptions', JSON.stringify(SalonOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении салонов:', error);
   }
};

const fetchPowerSteeringOptions = async () => {
   try {
      const cachedPowerSteeringOptions = JSON.parse(localStorage.getItem('PowerSteeringOptions'));
      if (cachedPowerSteeringOptions) {
         PowerSteeringOptions.value = cachedPowerSteeringOptions;
      } else {
         PowerSteeringOptions.value = await getCarsPowerSteering();
         localStorage.setItem('PowerSteeringOptions', JSON.stringify(PowerSteeringOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении усилителей руля:', error);
   }
};

const fetchElectricWindowOptions = async () => {
   try {
      const cachedElectricWindowOptions = JSON.parse(localStorage.getItem('ElectricWindowOptions'));
      if (cachedElectricWindowOptions) {
         ElectricWindowOptions.value = cachedElectricWindowOptions;
      } else {
         ElectricWindowOptions.value = await getCarsElectricWindow();
         localStorage.setItem('ElectricWindowOptions', JSON.stringify(ElectricWindowOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении окон с электроприводом:', error);
   }
};

const fetchWheelsOptions = async () => {
   try {
      const cachedWheelsOptions = JSON.parse(localStorage.getItem('WheelsOptions'));
      if (cachedWheelsOptions) {
         WheelsOptions.value = cachedWheelsOptions;
      } else {
         WheelsOptions.value = await getCarsWheels();
         localStorage.setItem('WheelsOptions', JSON.stringify(WheelsOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении колес:', error);
   }
};

const fetchAudioSystemOptions = async () => {
   try {
      const cachedAudioSystemOptions = JSON.parse(localStorage.getItem('AudioSystemOptions'));
      if (cachedAudioSystemOptions) {
         AudioSystemOptions.value = cachedAudioSystemOptions;
      } else {
         AudioSystemOptions.value = await getCarsAudioSystem();
         localStorage.setItem('AudioSystemOptions', JSON.stringify(AudioSystemOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении аудиосистем:', error);
   }
};

const fetchClimateOptions = async () => {
   try {
      const cachedClimateOptions = JSON.parse(localStorage.getItem('ClimateOptions'));
      if (cachedClimateOptions) {
         ClimateOptions.value = cachedClimateOptions;
      } else {
         ClimateOptions.value = await getCarsClimate();
         localStorage.setItem('ClimateOptions', JSON.stringify(ClimateOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении климат-контроля:', error);
   }
};

const fetchHeadlightOptions = async () => {
   try {
      const cachedHeadlightOptions = JSON.parse(localStorage.getItem('HeadlightOptions'));
      if (cachedHeadlightOptions) {
         HeadlightOptions.value = cachedHeadlightOptions;
      } else {
         HeadlightOptions.value = await getCarsHeadlight();
         localStorage.setItem('HeadlightOptions', JSON.stringify(HeadlightOptions.value));
      }
   } catch (error) {
      console.error('Ошибка при получении фар:', error);
   }
};

const handleSalonUpdate = (selectedOptions) => createStore.setSalon(selectedOptions);
const handleAudioSystemUpdate = (selectedOptions) => createStore.setAudioSystem(selectedOptions);
const handleClimateUpdate = (selectedOptions) => createStore.setClimate(selectedOptions);
const handleElectricWindowUpdate = (selectedOptions) => createStore.setElectricWindow(selectedOptions);
const handleWheelsUpdate = (selectedOptions) => createStore.setWheels(selectedOptions);
const handlePowerSteeringUpdate = (selectedOptions) => createStore.setPowerSteering(selectedOptions);
const handleHeadlightUpdate = (selectedOptions) => createStore.setHeadlight(selectedOptions);

const handleFrontSeatsUpdate = (value) => createStore.setIsFrontSeats(value);
const handleRearSeatsUpdate = (value) => createStore.setIsRearSeats(value);
const handleMirrorsUpdate = (value) => createStore.setIsMirrors(value);
const handleRearWindowUpdate = (value) => createStore.setIsRearWindow(value);
const handleSteeringWheelUpdate = (value) => createStore.setIsSteeringWheel(value);
const handleFrontSeatsDrivesUpdate = (value) => createStore.setIsFrontSeatsDrives(value);
const handleRearSeatsDrivesUpdate = (value) => createStore.setIsRearSeatsDrives(value);
const handleMirrorsDrivesUpdate = (value) => createStore.setIsMirrorsDrives(value);
const handleSteeringColumnDrivesUpdate = (value) => createStore.setIsSteeringColumnDrives(value);
const handleFoldingMirrorsDrivesUpdate = (value) => createStore.setIsFoldingMirrorsDrives(value);
const handleFrontSeatsSettingUpdate = (value) => createStore.setIsFrontSeatsSetting(value);
const handleRearSeatsSettingUpdate = (value) => createStore.setIsRearSeatsSetting(value);
const handleMirrorsSettingUpdate = (value) => createStore.setIsMirrorsSetting(value);
const handleSteeringColumnSettingUpdate = (value) => createStore.setIsSteeringColumnSetting(value);
const handleBlindSpotMonitoringUpdate = (value) => createStore.setIsBlindSpotMonitoring(value);
const handleAutomaticParkingUpdate = (value) => createStore.setIsAutomaticParking(value);
const handleRainSensorUpdate = (value) => createStore.setIsRainSensor(value);
const handleRearParkingSensorUpdate = (value) => createStore.setIsRearParkingSensor(value);
const handleFrontParkingSensorUpdate = (value) => createStore.setIsFrontParkingSensor(value);
const handleRearViewCameraUpdate = (value) => createStore.setIsRearViewCamera(value);
const handleCruiseControlUpdate = (value) => createStore.setIsCruiseControl(value);
const handleOnboardComputerUpdate = (value) => createStore.setIsOnboardComputer(value);
const handleAlarmSystemUpdate = (value) => createStore.setIsAlarmSystem(value);
const handleCentralLockUpdate = (value) => createStore.setIsCentralLock(value);
const handleImmobilizerUpdate = (value) => createStore.setIsImmobilizer(value);
const handleSatelliteUpdate = (value) => createStore.setIsSatellite(value);
const handleFrontalAirbagsUpdate = (value) => createStore.setIsFrontalAirbags(value);
const handleKneeHighAirbagsUpdate = (value) => createStore.setIsKneeHighAirbags(value);
const handleCurtainsAirbagsUpdate = (value) => createStore.setIsCurtainsAirbags(value);
const handleSideFrontAirbagsUpdate = (value) => createStore.setIsSideFrontAirbags(value);
const handleSideRearAirbagsUpdate = (value) => createStore.setIsSideRearAirbags(value);
const handleAntiLockBrakesUpdate = (value) => createStore.setIsAntiLockBrakes(value);
const handleAntiSlipUpdate = (value) => createStore.setIsAntiSlip(value);
const handleExchangeRateStabilityUpdate = (value) => createStore.setIsExchangeRateStability(value);
const handleDistribBrakingForcesUpdate = (value) => createStore.setIsDistribBrakingForces(value);
const handleEmergencyBrakingUpdate = (value) => createStore.setIsEmergencyBraking(value);
const handleDifferentialBlockUpdate = (value) => createStore.setIsDifferentialBlock(value);
const handlePedestrianDetectionUpdate = (value) => createStore.setIsPedestrianDetection(value);
const handleCDDVDBlurayUpdate = (value) => createStore.setIsCDDVDBluray(value);
const handleAUXUpdate = (value) => createStore.setIsAUX(value);
const handleMP3Update = (value) => createStore.setIsMP3(value);
const handleBluetoothUpdate = (value) => createStore.setIsBluetooth(value);
const handleRadioUpdate = (value) => createStore.setIsRadio(value);
const handleTVUpdate = (value) => createStore.setIsTV(value);
const handleVideoUpdate = (value) => createStore.setIsVideo(value);
const handleUSBUpdate = (value) => createStore.setIsUSB(value);
const handleGPSNavigatorUpdate = (value) => createStore.setIsGPSNavigator(value);
const handleSubwooferUpdate = (value) => createStore.setIsSubwoofer(value);
const handleAntifogUpdate = (value) => createStore.setIsAntifog(value);
const handleWashersUpdate = (value) => createStore.setIsWashers(value);
const handleAdaptiveLightingUpdate = (value) => createStore.setIsAdaptiveLighting(value);
const handleAthermalGlazingUpdate = (value) => createStore.setIsAthermalGlazing(value);
const handleLeatherWheelUpdate = (value) => createStore.setIsLeatherWheel(value);
const handleHatchUpdate = (value) => createStore.setIsHatch(value);
const handleWinterIncludedUpdate = (value) => createStore.setIsWinterIncluded(value);
const handleLightSensorUpdate = (value) => createStore.setIsLightSensor(value);
const handleWheelControlUpdate = (value) => createStore.setIsWheelControl(value);
const handleSteeringWheelControlUpdate = (value) => createStore.setIsSteeringWheelControl(value);


onMounted(() => {
   fetchOptions();

   if (window.innerWidth <= 1250) {
      isMobile.value = true;
   }

   window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 1250;
   });
});

onUnmounted(() => {
   window.removeEventListener('resize', () => { });
});
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: row;
   gap: 40px;

   @media screen and (max-width: 1200px) {
      flex-wrap: wrap;
   }

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 24px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;
   }
}

.checkbox-section {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 8px;

   &__items {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 16px;

      @media screen and (max-width: 768px) {
         width: 100%;
      }
   }

   &__title {
      font-size: 12px;
      color: #323232;
   }
}
</style>
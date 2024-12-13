import { defineStore } from 'pinia';
import { createCarAd, updateCarAd, getCarById } from '../services/apiClient';
import { fetchLocation } from '../services/apiLocation.js'
import { useUserStore } from './user';

export const useCreateStore = defineStore('create', {
   state: () => ({
      id: null,
      is_draft: 0,
      is_published: 0,
      is_in_archive: 0,
      condition_id: null,

      // Характеристики
      photos: [],
      color_id: null,
      video: null,

      // Регистрационные данные 
      country_id: null,
      vin: null,
      state_number: null, // с пробегом

      // Технические характеристики 
      brand_id: null,
      model_id: null,
      year_id: null,
      car_body_type: null,
      count_doors: null,
      transmission_id: null,
      engine_type_id: null,
      drive_id: null,
      handlebar_id: null,

      // История эксплуатации и состояние 
      mileage: null,
      owners: null,
      state_id: null,
      pts: null,

      // TO Data
      is_service_book: 0,
      is_serviced_dealer: 0,
      is_under_warranty: 0,

      // Опции 
      power_steering: null,
      salon: null,
      electric_window: null,
      audio_system: null,
      wheels: null,
      climate: null,
      headlight: null,

      // Опции чекбоксы
      is_front_seats: 0,
      is_rear_seats: 0,
      is_mirrors: 0,
      is_rear_window: 0,
      is_steering_wheel: 0,
      is_steering_wheel_control: 0,
      is_front_seats_drives: 0,
      is_rear_seats_drives: 0,
      is_mirrors_drives: 0,
      is_steering_column_drives: 0,
      is_folding_mirrors_drives: 0,
      is_front_seats_setting: 0,
      is_rear_seats_setting: 0,
      is_mirrors_setting: 0,
      is_steering_column_setting: 0,
      is_blind_spot_monitoring: 0,
      is_automatic_parking: 0,
      is_rain_sensor: 0,
      is_light_sensor: 0,
      is_rear_parking_sensor: 0,
      is_front_parking_sensor: 0,
      is_rear_view_camera: 0,
      is_cruise_control: 0,
      is_onboard_computer: 0,
      is_alarm_system: 0,
      is_central_lock: 0,
      is_immobilizer: 0,
      is_satellite: 0,
      is_frontal_airbags: 0,
      is_knee_high_airbags: 0,
      is_curtains_airbags: 0,
      is_side_front_airbags: 0,
      is_side_rear_airbags: 0,
      is_anti_lock_brakes: 0,
      is_anti_slip: 0,
      is_exchange_rate_stability: 0,
      is_distrib_braking_forces: 0,
      is_emergency_braking: 0,
      is_differential_block: 0,
      is_pedestrian_detection: 0,
      is_CD_DVD_Bluray: 0,
      is_AUX: 0,
      is_MP3: 0,
      is_Bluetooth: 0,
      is_Radio: 0,
      is_TV: 0,
      is_Video: 0,
      is_USB: 0,
      is_GPS_navigator: 0,
      is_subwoofer: 0,
      is_antifog: 0,
      is_washers: 0,
      is_adaptive_lighting: 0,
      is_athermal_glazing: 0,
      is_leather_wheel: 0,
      is_hatch: 0,
      is_winter_included: 0,
      is_wheel_control: 0,

      // Объявление
      ads_description: null,
      place_inspection: null,
      amount: null,
      phone: null,
      email: null,
      city: null,
      latitude: null,
      longitude: null,
      communication_method_id: null,
      username: null,
   }),
   getters: {
      isCharacteristicFieldsFilled: (state) => {
         return [
            state.photos,
            state.color_id,
            state.country_id,
            state.vin,
            ...(state.country_id !== 1 ? [state.state_number] : []),
            ...(state.condition_id == 2 ? [state.state_id] : []),
            state.brand_id,
            state.model_id,
            state.year_id,
            state.count_doors,
            state.car_body_type,
            state.transmission_id,
            state.engine_type_id,
            state.handlebar_id,
            state.condition_id,
            state.drive_id,
            state.pts,
         ].every(field => field !== null && field !== "" && !(Array.isArray(field) && field.length === 0) && !(typeof field === 'object' && Object.keys(field).length === 0));
      },
      isAdFieldsFilled: (state) => {
         return [
            state.username,
            state.email,
            state.phone,
            state.ads_description,
            state.place_inspection,
            state.communication_method_id,
            state.amount
         ].every(field => field !== null);
      },
      isAnyFieldFilled: (state) => {
         return [
            state.photos.length > 0,
            state.color_id !== null,
            state.video !== null,
            state.country_id !== null,
            state.vin !== null,
            state.state_number !== null,
            state.brand_id !== null,
            state.model_id !== null,
            state.year_id !== null,
            state.car_body_type !== null,
            state.count_doors !== null,
            state.transmission_id !== null,
            state.engine_type_id !== null,
            state.drive_id !== null,
            state.handlebar_id !== null,
            state.mileage !== null,
            state.owners !== null,
            state.state_id !== null,
            state.pts !== null,
            state.is_service_book,
            state.is_serviced_dealer,
            state.is_under_warranty
         ].some(Boolean);
      }
   },
   actions: {
      updateStateId() {
         if (this.condition_id === 1) {
            this.state_id = null;
         }
      },
      async initializeUserData() {
         const userStore = useUserStore();
         const { lat, lon } = await fetchLocation();
         this.phone = userStore.phoneNumber ? userStore.phoneNumber : null;
         this.email = userStore.email ? userStore.email : null;
         this.username = userStore.username ? userStore.username : `User #${userStore.uniqueCode}`;
         this.latitude = userStore.latitude ? userStore.latitude : lat;
         this.longitude = userStore.longitude ? userStore.longitude : lon;
         this.place_inspection = userStore.address ? userStore.address : null;
         this.city = userStore.city ? userStore.city : null;
      },
      setConditionId(condition_id) {
         this.condition_id = condition_id;
      },
      setIsDraft(is_draft) {
         this.is_draft = is_draft;
      },
      setIsPublished(is_published) {
         this.is_published = is_published;
      },

      // Характеристики
      setPhotos(photos) {
         this.photos = photos;
      },

      addPhoto(photo) {
         this.photos.push(photo);
      },

      removePhoto(index) {
         this.photos.splice(index, 1);
      },
      setColorId(color_id) {
         this.color_id = color_id;
      },
      setVideo(video) {
         this.video = video;
      },

      // Регистрационные данные
      setCountryId(country_id) {
         this.country_id = country_id;
      },
      setVin(vin) {
         this.vin = vin;
      },
      setStateNumber(state_number) {
         this.state_number = state_number;
      },


      // Технические характеристики
      setBrandId(brand_id) {
         this.brand_id = brand_id;
      },
      setModelId(model_id) {
         this.model_id = model_id;
      },
      setYearId(year_id) {
         this.year_id = year_id;
      },
      setCarBodyType(car_body_type) {
         this.car_body_type = car_body_type;
      },
      setCountDoors(count_doors) {
         this.count_doors = count_doors;
      },
      setTransmissionId(transmission_id) {
         this.transmission_id = transmission_id;
      },
      setEngineTypeId(engine_type_id) {
         this.engine_type_id = engine_type_id;
      },
      setDriveId(drive_id) {
         this.drive_id = drive_id;
      },
      setHandlebarId(handlebar_id) {
         this.handlebar_id = handlebar_id;
      },

      // История эксплуатации и состояние
      setMileage(mileage) {
         this.mileage = mileage;
      },
      setOwners(owners) {
         this.owners = owners;
      },
      setStateId(state_id) {
         this.state_id = state_id;
      },
      setPts(pts) {
         this.pts = pts;
      },

      // TO Data
      setIsServiceBook(is_service_book) {
         this.is_service_book = is_service_book;
      },
      setIsServicedDealer(is_serviced_dealer) {
         this.is_serviced_dealer = is_serviced_dealer;
      },
      setIsUnderWarranty(is_under_warranty) {
         this.is_under_warranty = is_under_warranty;
      },

      // Опции
      setPowerSteering(power_steering) {
         this.power_steering = power_steering;
      },
      setSalon(salon) {
         this.salon = salon;
      },
      setElectricWindow(electric_window) {
         this.electric_window = electric_window;
      },
      setAudioSystem(audio_system) {
         this.audio_system = audio_system;
      },
      setWheels(wheels) {
         this.wheels = wheels;
      },
      setClimate(climate) {
         this.climate = climate;
      },
      setHeadlight(headlight) {
         this.headlight = headlight;
      },

      // Опции чекбоксы
      setIsFrontSeats(value) {
         this.is_front_seats = value;
      },
      setIsRearSeats(value) {
         this.is_rear_seats = value;
      },
      setIsMirrors(value) {
         this.is_mirrors = value;
      },
      setIsRearWindow(value) {
         this.is_rear_window = value;
      },
      setIsSteeringWheel(value) {
         this.is_steering_wheel = value;
      },
      setIsSteeringWheelControl(value) {
         this.is_steering_wheel_control = value;
      },
      setIsFrontSeatsDrives(value) {
         this.is_front_seats_drives = value;
      },
      setIsRearSeatsDrives(value) {
         this.is_rear_seats_drives = value;
      },
      setIsMirrorsDrives(value) {
         this.is_mirrors_drives = value;
      },
      setIsSteeringColumnDrives(value) {
         this.is_steering_column_drives = value;
      },
      setIsFoldingMirrorsDrives(value) {
         this.is_folding_mirrors_drives = value;
      },
      setIsFrontSeatsSetting(value) {
         this.is_front_seats_setting = value;
      },
      setIsRearSeatsSetting(value) {
         this.is_rear_seats_setting = value;
      },
      setIsMirrorsSetting(value) {
         this.is_mirrors_setting = value;
      },
      setIsSteeringColumnSetting(value) {
         this.is_steering_column_setting = value;
      },
      setIsBlindSpotMonitoring(value) {
         this.is_blind_spot_monitoring = value;
      },
      setIsAutomaticParking(value) {
         this.is_automatic_parking = value;
      },
      setIsRainSensor(value) {
         this.is_rain_sensor = value;
      },
      setIsLightSensor(value) {
         this.is_light_sensor = value;
      },
      setIsRearParkingSensor(value) {
         this.is_rear_parking_sensor = value;
      },
      setIsFrontParkingSensor(value) {
         this.is_front_parking_sensor = value;
      },
      setIsRearViewCamera(value) {
         this.is_rear_view_camera = value;
      },
      setIsCruiseControl(value) {
         this.is_cruise_control = value;
      },
      setIsOnboardComputer(value) {
         this.is_onboard_computer = value;
      },
      setIsAlarmSystem(value) {
         this.is_alarm_system = value;
      },
      setIsCentralLock(value) {
         this.is_central_lock = value;
      },
      setIsImmobilizer(value) {
         this.is_immobilizer = value;
      },
      setIsSatellite(value) {
         this.is_satellite = value;
      },
      setIsFrontalAirbags(value) {
         this.is_frontal_airbags = value;
      },
      setIsKneeHighAirbags(value) {
         this.is_knee_high_airbags = value;
      },
      setIsCurtainsAirbags(value) {
         this.is_curtains_airbags = value;
      },
      setIsSideFrontAirbags(value) {
         this.is_side_front_airbags = value;
      },
      setIsSideRearAirbags(value) {
         this.is_side_rear_airbags = value;
      },
      setIsAntiLockBrakes(value) {
         this.is_anti_lock_brakes = value;
      },
      setIsAntiSlip(value) {
         this.is_anti_slip = value;
      },
      setIsExchangeRateStability(value) {
         this.is_exchange_rate_stability = value;
      },
      setIsDistribBrakingForces(value) {
         this.is_distrib_braking_forces = value;
      },
      setIsEmergencyBraking(value) {
         this.is_emergency_braking = value;
      },
      setIsDifferentialBlock(value) {
         this.is_differential_block = value;
      },
      setIsPedestrianDetection(value) {
         this.is_pedestrian_detection = value;
      },
      setIsCDDVDBluray(value) {
         this.is_CD_DVD_Bluray = value;
      },
      setIsAUX(value) {
         this.is_AUX = value;
      },
      setIsMP3(value) {
         this.is_MP3 = value;
      },
      setIsBluetooth(value) {
         this.is_Bluetooth = value;
      },
      setIsRadio(value) {
         this.is_Radio = value;
      },
      setIsTV(value) {
         this.is_TV = value;
      },
      setIsVideo(value) {
         this.is_Video = value;
      },
      setIsUSB(value) {
         this.is_USB = value;
      },
      setIsGPSNavigator(value) {
         this.is_GPS_navigator = value;
      },
      setIsSubwoofer(value) {
         this.is_subwoofer = value;
      },
      setIsAntifog(value) {
         this.is_antifog = value;
      },
      setIsWashers(value) {
         this.is_washers = value;
      },
      setIsAdaptiveLighting(value) {
         this.is_adaptive_lighting = value;
      },
      setIsAthermalGlazing(value) {
         this.is_athermal_glazing = value;
      },
      setIsLeatherWheel(value) {
         this.is_leather_wheel = value;
      },
      setIsHatch(value) {
         this.is_hatch = value;
      },
      setIsWinterIncluded(value) {
         this.is_winter_included = value;
      },
      setIsWheelControl(value) {
         this.is_wheel_control = value;
      },

      // Объявление
      setAdsDescription(description) {
         this.ads_description = description;
      },
      setPlaceInspection(place) {
         this.place_inspection = place;
      },
      setAmount(amount) {
         this.amount = amount;
      },
      setPhone(phone) {
         this.phone = phone;
      },
      setEmail(email) {
         this.email = email;
      },
      setCommunicationMethodId(communication) {
         this.communication_method_id = communication;
      },
      setUsername(username) {
         this.username = username;
      },
      setCity(city) {
         this.city = city;
      },
      setLatitude(latitude) {
         this.latitude = latitude;
      },
      setLongitude(longitude) {
         this.longitude = longitude;
      },
      async sendCarAd() {
         const formData = new FormData();

         formData.append('is_draft', this.is_draft);
         if (this.condition_id !== null) formData.append('condition_id', this.condition_id);

         // Характеристики
         this.photos.forEach((photo, index) => {
            if (photo.file instanceof File) {
               // Добавляем только объекты File
               formData.append(`photos[${index}]`, photo.file);
            }
         });

         if (this.color_id !== null) formData.append('color_id', this.color_id);
         if (this.video !== null) formData.append('video', this.video);

         // Регистрационные данные
         if (this.country_id !== null) formData.append('country_id', this.country_id);
         if (this.vin !== null) formData.append('vin', this.vin);
         if (this.state_number !== null) formData.append('state_number', this.state_number);

         // Технические характеристики
         if (this.brand_id !== null) formData.append('brand_id', this.brand_id);
         if (this.model_id !== null) formData.append('model_id', this.model_id);
         if (this.year_id !== null) formData.append('year_id', this.year_id);
         if (this.car_body_type !== null) formData.append('car_body_type_id', this.car_body_type);
         if (this.count_doors !== null) formData.append('count_doors', this.count_doors);
         if (this.transmission_id !== null) formData.append('transmission_id', this.transmission_id);
         if (this.engine_type_id !== null) formData.append('engine_type_id', this.engine_type_id);
         if (this.drive_id !== null) formData.append('drive_id', this.drive_id);
         if (this.handlebar_id !== null) formData.append('handlebar_id', this.handlebar_id);

         // История эксплуатации и состояние
         if (this.mileage !== null) formData.append('mileage', this.mileage);
         if (this.owners !== null) formData.append('count_owners', this.owners);
         if (this.state_id !== null) formData.append('state_id', this.state_id);
         if (this.pts !== null) formData.append('pts_id', this.pts);
         formData.append('is_service_book', 0);
         if (this.is_serviced_dealer !== null) formData.append('is_serviced_dealer', this.is_serviced_dealer);
         if (this.is_under_warranty !== null) formData.append('is_under_warranty', this.is_under_warranty);

         // Опции
         if (this.power_steering !== null) formData.append('power_steering_id', this.power_steering);
         if (this.salon !== null) formData.append('salon_id', this.salon);
         if (this.electric_window !== null) formData.append('electric_windows_id', this.electric_window);
         if (this.audio_system !== null) formData.append('audio_systems_id', this.audio_system);
         if (this.wheels !== null) formData.append('tires_wheels_id', this.wheels);
         if (this.climate !== null) formData.append('climate_management_id', this.climate);
         if (this.headlight !== null) formData.append('headlight_id', this.headlight);

         // Опции чекбоксы
         formData.append('is_front_seats', this.is_front_seats);
         formData.append('is_rear_seats', this.is_rear_seats);
         formData.append('is_mirrors', this.is_mirrors);
         formData.append('is_rear_window', this.is_rear_window);
         formData.append('is_steering_wheel', this.is_steering_wheel);
         formData.append('is_steering_wheel_control', this.is_steering_wheel_control);
         formData.append('is_front_seats_drives', this.is_front_seats_drives);
         formData.append('is_rear_seats_drives', this.is_rear_seats_drives);
         formData.append('is_mirrors_drives', this.is_mirrors_drives);
         formData.append('is_steering_column_drives', this.is_steering_column_drives);
         formData.append('is_folding_mirrors_drives', this.is_folding_mirrors_drives);
         formData.append('is_front_seats_setting', this.is_front_seats_setting);
         formData.append('is_rear_seats_setting', this.is_rear_seats_setting);
         formData.append('is_mirrors_setting', this.is_mirrors_setting);
         formData.append('is_steering_column_setting', this.is_steering_column_setting);
         formData.append('is_blind_spot_monitoring', this.is_blind_spot_monitoring);
         formData.append('is_automatic_parking', this.is_automatic_parking);
         formData.append('is_rain_sensor', this.is_rain_sensor);
         formData.append('is_light_sensor', this.is_light_sensor);
         formData.append('is_rear_parking_sensor', this.is_rear_parking_sensor);
         formData.append('is_front_parking_sensor', this.is_front_parking_sensor);
         formData.append('is_rear_view_camera', this.is_rear_view_camera);
         formData.append('is_cruise_control', this.is_cruise_control);
         formData.append('is_onboard_computer', this.is_onboard_computer);
         formData.append('is_alarm_system', this.is_alarm_system);
         formData.append('is_central_lock', this.is_central_lock);
         formData.append('is_immobilizer', this.is_immobilizer);
         formData.append('is_satellite', this.is_satellite);
         formData.append('is_frontal_airbags', this.is_frontal_airbags);
         formData.append('is_knee_high_airbags', this.is_knee_high_airbags);
         formData.append('is_curtains_airbags', this.is_curtains_airbags);
         formData.append('is_side_front_airbags', this.is_side_front_airbags);
         formData.append('is_side_rear_airbags', this.is_side_rear_airbags);
         formData.append('is_anti_lock_brakes', this.is_anti_lock_brakes);
         formData.append('is_anti_slip', this.is_anti_slip);
         formData.append('is_exchange_rate_stability', this.is_exchange_rate_stability);
         formData.append('is_distrib_braking_forces', this.is_distrib_braking_forces);
         formData.append('is_emergency_braking', this.is_emergency_braking);
         formData.append('is_differential_block', this.is_differential_block);
         formData.append('is_pedestrian_detection', this.is_pedestrian_detection);
         formData.append('is_CD_DVD_Bluray', this.is_CD_DVD_Bluray);
         formData.append('is_AUX', this.is_AUX);
         formData.append('is_MP3', this.is_MP3);
         formData.append('is_Bluetooth', this.is_Bluetooth);
         formData.append('is_Radio', this.is_Radio);
         formData.append('is_TV', this.is_TV);
         formData.append('is_Video', this.is_Video);
         formData.append('is_USB', this.is_USB);
         formData.append('is_GPS_navigator', this.is_GPS_navigator);
         formData.append('is_subwoofer', this.is_subwoofer);
         formData.append('is_antifog', this.is_antifog);
         formData.append('is_washers', this.is_washers);
         formData.append('is_adaptive_lighting', this.is_adaptive_lighting);
         formData.append('is_athermal_glazing', this.is_athermal_glazing);
         formData.append('is_leather_wheel', this.is_leather_wheel);
         formData.append('is_hatch', this.is_hatch);
         formData.append('is_winter_included', this.is_winter_included);
         formData.append('is_wheel_control', this.is_wheel_control);

         // Объявление
         if (this.ads_description !== null) formData.append('ads_description', this.ads_description);
         if (this.place_inspection !== null) formData.append('place_inspection', this.place_inspection);
         if (this.amount !== null) formData.append('amount', this.amount);
         formData.append('currency_id', 1);
         if (this.city !== null) formData.append('city', this.city);
         if (this.phone !== null) formData.append('phone', this.phone);
         if (this.latitude !== null) formData.append('latitude', this.latitude);
         if (this.longitude !== null) formData.append('longitude', this.longitude);
         if (this.email !== null) formData.append('email', this.email);
         if (this.communication_method_id !== null) formData.append('communication_method_id', this.communication_method_id);
         if (this.username !== null) formData.append('username', this.username);

         try {
            console.log(formData);
            const createdAd = await createCarAd(formData);
            console.log(createdAd);
            return createdAd;
         } catch (error) {
            console.error('Ошибка при создании объявления', error);
         }
      },
      async updateCarAd() {
         const formData = new FormData();

         formData.append('is_draft', this.is_draft);
         if (this.condition_id !== null) formData.append('condition_id', this.condition_id);

         // Характеристики
         this.photos.forEach((photo, index) => {
            if (photo.file instanceof File) {
               // Добавляем только объекты File
               formData.append(`photos[${index}]`, photo.file);
            }
         });

         if (this.color_id !== null) formData.append('color_id', this.color_id);
         if (this.video !== null) formData.append('video', this.video);

         // Регистрационные данные
         if (this.country_id !== null) formData.append('country_id', this.country_id);
         if (this.vin !== null) formData.append('vin', this.vin);
         if (this.state_number !== null) formData.append('state_number', this.state_number);

         // Технические характеристики
         if (this.brand_id !== null) formData.append('brand_id', this.brand_id);
         if (this.model_id !== null) formData.append('model_id', this.model_id);
         if (this.year_id !== null) formData.append('year_id', this.year_id);
         if (this.car_body_type !== null) formData.append('car_body_type_id', this.car_body_type);
         if (this.count_doors !== null) formData.append('count_doors', this.count_doors);
         if (this.transmission_id !== null) formData.append('transmission_id', this.transmission_id);
         if (this.engine_type_id !== null) formData.append('engine_type_id', this.engine_type_id);
         if (this.drive_id !== null) formData.append('drive_id', this.drive_id);
         if (this.handlebar_id !== null) formData.append('handlebar_id', this.handlebar_id);

         // История эксплуатации и состояние
         if (this.mileage !== null) formData.append('mileage', this.mileage);
         if (this.owners !== null) formData.append('count_owners', this.owners);
         if (this.state_id !== null) formData.append('state_id', this.state_id);
         if (this.pts !== null) formData.append('pts_id', this.pts);
         formData.append('is_service_book', 0);
         if (this.is_serviced_dealer !== null) formData.append('is_serviced_dealer', this.is_serviced_dealer);
         if (this.is_under_warranty !== null) formData.append('is_under_warranty', this.is_under_warranty);

         // Опции
         if (this.power_steering !== null) formData.append('power_steering_id', this.power_steering);
         if (this.salon !== null) formData.append('salon_id', this.salon);
         if (this.electric_window !== null) formData.append('electric_windows_id', this.electric_window);
         if (this.audio_system !== null) formData.append('audio_systems_id', this.audio_system);
         if (this.wheels !== null) formData.append('tires_wheels_id', this.wheels);
         if (this.climate !== null) formData.append('climate_management_id', this.climate);
         if (this.headlight !== null) formData.append('headlight_id', this.headlight);

         // Опции чекбоксы
         formData.append('is_front_seats', this.is_front_seats);
         formData.append('is_rear_seats', this.is_rear_seats);
         formData.append('is_mirrors', this.is_mirrors);
         formData.append('is_rear_window', this.is_rear_window);
         formData.append('is_steering_wheel', this.is_steering_wheel);
         formData.append('is_steering_wheel_control', this.is_steering_wheel_control);
         formData.append('is_front_seats_drives', this.is_front_seats_drives);
         formData.append('is_rear_seats_drives', this.is_rear_seats_drives);
         formData.append('is_mirrors_drives', this.is_mirrors_drives);
         formData.append('is_steering_column_drives', this.is_steering_column_drives);
         formData.append('is_folding_mirrors_drives', this.is_folding_mirrors_drives);
         formData.append('is_front_seats_setting', this.is_front_seats_setting);
         formData.append('is_rear_seats_setting', this.is_rear_seats_setting);
         formData.append('is_mirrors_setting', this.is_mirrors_setting);
         formData.append('is_steering_column_setting', this.is_steering_column_setting);
         formData.append('is_blind_spot_monitoring', this.is_blind_spot_monitoring);
         formData.append('is_automatic_parking', this.is_automatic_parking);
         formData.append('is_rain_sensor', this.is_rain_sensor);
         formData.append('is_light_sensor', this.is_light_sensor);
         formData.append('is_rear_parking_sensor', this.is_rear_parking_sensor);
         formData.append('is_front_parking_sensor', this.is_front_parking_sensor);
         formData.append('is_rear_view_camera', this.is_rear_view_camera);
         formData.append('is_cruise_control', this.is_cruise_control);
         formData.append('is_onboard_computer', this.is_onboard_computer);
         formData.append('is_alarm_system', this.is_alarm_system);
         formData.append('is_central_lock', this.is_central_lock);
         formData.append('is_immobilizer', this.is_immobilizer);
         formData.append('is_satellite', this.is_satellite);
         formData.append('is_frontal_airbags', this.is_frontal_airbags);
         formData.append('is_knee_high_airbags', this.is_knee_high_airbags);
         formData.append('is_curtains_airbags', this.is_curtains_airbags);
         formData.append('is_side_front_airbags', this.is_side_front_airbags);
         formData.append('is_side_rear_airbags', this.is_side_rear_airbags);
         formData.append('is_anti_lock_brakes', this.is_anti_lock_brakes);
         formData.append('is_anti_slip', this.is_anti_slip);
         formData.append('is_exchange_rate_stability', this.is_exchange_rate_stability);
         formData.append('is_distrib_braking_forces', this.is_distrib_braking_forces);
         formData.append('is_emergency_braking', this.is_emergency_braking);
         formData.append('is_differential_block', this.is_differential_block);
         formData.append('is_pedestrian_detection', this.is_pedestrian_detection);
         formData.append('is_CD_DVD_Bluray', this.is_CD_DVD_Bluray);
         formData.append('is_AUX', this.is_AUX);
         formData.append('is_MP3', this.is_MP3);
         formData.append('is_Bluetooth', this.is_Bluetooth);
         formData.append('is_Radio', this.is_Radio);
         formData.append('is_TV', this.is_TV);
         formData.append('is_Video', this.is_Video);
         formData.append('is_USB', this.is_USB);
         formData.append('is_GPS_navigator', this.is_GPS_navigator);
         formData.append('is_subwoofer', this.is_subwoofer);
         formData.append('is_antifog', this.is_antifog);
         formData.append('is_washers', this.is_washers);
         formData.append('is_adaptive_lighting', this.is_adaptive_lighting);
         formData.append('is_athermal_glazing', this.is_athermal_glazing);
         formData.append('is_leather_wheel', this.is_leather_wheel);
         formData.append('is_hatch', this.is_hatch);
         formData.append('is_winter_included', this.is_winter_included);
         formData.append('is_wheel_control', this.is_wheel_control);

         // Объявление
         if (this.ads_description !== null) formData.append('ads_description', this.ads_description);
         if (this.place_inspection !== null) formData.append('place_inspection', this.place_inspection);
         if (this.amount !== null) formData.append('amount', this.amount);
         formData.append('currency_id', 1);
         if (this.city !== null) formData.append('city', this.city);
         if (this.phone !== null) formData.append('phone', this.phone);
         if (this.latitude !== null) formData.append('latitude', this.latitude);
         if (this.longitude !== null) formData.append('longitude', this.longitude);
         if (this.email !== null) formData.append('email', this.email);
         if (this.communication_method_id !== null) formData.append('communication_method_id', this.communication_method_id);
         if (this.username !== null) formData.append('username', this.username);

         const id = this.id;

         try {
            const createdAd = await updateCarAd(id, formData);
            console.log(createdAd);
            return createdAd;
         } catch (error) {
            console.error('Ошибка при создании объявления', error);
         }
      },
      async setStoreFromApi(id) {
         try {
            const carData = await getCarById(id);
            this.id = carData.id;
            this.is_draft = carData.is_draft;
            this.is_in_archive = carData.is_in_archive;
            this.is_published = carData.is_published;
            this.condition_id = carData.condition?.id || null;

            // Характеристики
            this.photos = carData.photos || [];
            this.color_id = carData.auto_appearances?.[0]?.color?.id || null;
            this.video = carData.auto_appearances?.[0]?.video || null;

            // Регистрационные данные 
            this.country_id = carData.auto_registration_data?.[0]?.country?.id || null;
            this.vin = carData.auto_registration_data?.[0]?.vin || null;
            this.state_number = carData.auto_registration_data?.[0]?.state_number || null;

            // Технические характеристики 
            this.brand_id = carData.auto_technical_specifications?.[0]?.brand?.id || null;
            this.model_id = carData.auto_technical_specifications?.[0]?.model?.id || null;
            this.year_id = carData.auto_technical_specifications?.[0]?.year_release.id || null;
            this.car_body_type = carData.auto_technical_specifications?.[0]?.car_body_type?.id || null;
            this.count_doors = carData.auto_technical_specifications?.[0]?.count_doors || null;
            this.transmission_id = carData.auto_technical_specifications?.[0]?.transmission?.id || null;
            this.engine_type_id = carData.auto_technical_specifications?.[0]?.engine_type?.id || null;
            this.drive_id = carData.auto_technical_specifications?.[0]?.drive?.id || null;
            this.handlebar_id = carData.auto_technical_specifications?.[0]?.handlebar?.id || null;

            // История эксплуатации и состояние 
            this.mileage = carData.auto_history_conditions[0]?.mileage || null;
            this.owners = carData.auto_history_conditions[0]?.count_owners?.id || null;
            console.log(carData.auto_history_conditions[0]?.state.id);
            this.state_id = carData.auto_history_conditions[0]?.state.id;
            this.pts = carData.auto_history_conditions[0]?.pts?.id || null;

            // TO Data
            const maintenanceData = carData.maintenance_data?.[0];
            this.is_service_book = maintenanceData?.is_service_book;
            this.is_serviced_dealer = maintenanceData?.is_serviced_dealer;
            this.is_under_warranty = maintenanceData?.is_under_warranty;

            // Опции
            const climateOptions = carData.auto_additional_options_climate_management?.[0] || {};
            const salonOptions = carData.auto_additional_options_salon?.[0] || {};
            const headlightsOptions = carData.auto_additional_headlights?.[0] || {};
            const airbagsOptions = carData.auto_additional_options_airbag?.[0] || {};
            const heatingOptions = carData.auto_additional_options_heating?.[0] || {};
            const electricDriveOptions = carData.auto_additional_options_electric_drive?.[0] || {};
            const settingMemoryOptions = carData.auto_additional_options_setting_memory?.[0] || {};
            const anticreepingSystem = carData.auto_additional_options_anticreeping_system?.[0] || {};
            const audioSystem = carData.auto_additional_audio_system?.[0] || {};
            const activeSecurity = carData.auto_additional_active_security?.[0] || {};
            const drivingAssistanceOptions = carData.auto_additional_options_driving_assistance?.[0] || {};
            const mediaOptions = carData.auto_additional_multimedia_navigation?.[0] || {};
            const wheelsOptions = carData.auto_additional_tires_wheels?.[0] || {};

            // Опции
            this.power_steering = carData.auto_additional_options?.[0]?.power_steering?.id || null;
            this.salon = carData.auto_additional_options_salon?.[0]?.salon?.id || null;
            this.electric_window = carData.auto_additional_options?.[0]?.electric_windows?.id || null;
            this.wheels = carData.auto_additional_tires_wheels?.[0]?.tires_wheels?.[0]?.id || null;
            this.climate = carData.auto_additional_options_climate_management?.[0]?.climate_management?.id || null;
            this.headlight = carData.auto_additional_headlights?.[0]?.headlight?.[0]?.id || null;

            // Опции чекбоксы
            this.is_front_seats = heatingOptions.is_front_seats;
            this.is_rear_seats = heatingOptions.is_rear_seats;
            this.is_mirrors = heatingOptions.is_mirrors;
            this.is_rear_window = heatingOptions.is_rear_window;
            this.is_steering_wheel = heatingOptions.is_steering_wheel;

            this.is_front_seats_drives = electricDriveOptions.is_front_seats_drives;
            this.is_rear_seats_drives = electricDriveOptions.is_rear_seats_drives;
            this.is_mirrors_drives = electricDriveOptions.is_mirrors_drives;
            this.is_steering_column_drives = electricDriveOptions.is_steering_column_drives;
            this.is_folding_mirrors_drives = electricDriveOptions.is_folding_mirrors_drives;

            this.is_front_seats_setting = settingMemoryOptions.is_front_seats_setting;
            this.is_rear_seats_setting = settingMemoryOptions.is_rear_seats_setting;
            this.is_mirrors_setting = settingMemoryOptions.is_mirrors_setting;
            this.is_steering_column_setting = settingMemoryOptions.is_steering_column_setting;

            this.is_blind_spot_monitoring = drivingAssistanceOptions.is_blind_spot_monitoring;
            this.is_automatic_parking = drivingAssistanceOptions.is_automatic_parking;
            this.is_rain_sensor = drivingAssistanceOptions.is_rain_sensor;
            this.is_light_sensor = drivingAssistanceOptions.is_light_sensor;
            this.is_rear_parking_sensor = drivingAssistanceOptions.is_rear_parking_sensor;
            this.is_front_parking_sensor = drivingAssistanceOptions.is_front_parking_sensor;
            this.is_rear_view_camera = drivingAssistanceOptions.is_rear_view_camera;
            this.is_cruise_control = drivingAssistanceOptions.is_cruise_control;
            this.is_onboard_computer = drivingAssistanceOptions.is_onboard_computer;

            this.is_alarm_system = anticreepingSystem.is_alarm_system;
            this.is_central_lock = anticreepingSystem.is_central_lock;
            this.is_immobilizer = anticreepingSystem.is_immobilizer;
            this.is_satellite = anticreepingSystem.is_satellite;

            this.is_frontal_airbags = airbagsOptions.is_frontal_airbags;
            this.is_knee_high_airbags = airbagsOptions.is_knee_high_airbags;
            this.is_curtains_airbags = airbagsOptions.is_curtains_airbags;
            this.is_side_front_airbags = airbagsOptions.is_side_front_airbags;
            this.is_side_rear_airbags = airbagsOptions.is_side_rear_airbags;

            this.is_anti_lock_brakes = activeSecurity.is_anti_lock_brakes;
            this.is_anti_slip = activeSecurity.is_anti_slip;
            this.is_exchange_rate_stability = activeSecurity.is_exchange_rate_stability;
            this.is_distrib_braking_forces = activeSecurity.is_distrib_braking_forces;
            this.is_emergency_braking = activeSecurity.is_emergency_braking;
            this.is_differential_block = activeSecurity.is_differential_block;
            this.is_pedestrian_detection = activeSecurity.is_pedestrian_detection;

            this.is_CD_DVD_Bluray = mediaOptions.is_CD_DVD_Bluray;
            this.is_AUX = mediaOptions.is_AUX;
            this.is_MP3 = mediaOptions.is_MP3;
            this.is_steering_wheel_control = mediaOptions.is_steering_wheel_control;
            this.is_Bluetooth = mediaOptions.is_Bluetooth;
            this.is_Radio = mediaOptions.is_Radio;
            this.is_TV = mediaOptions.is_TV;
            this.is_Video = mediaOptions.is_Video;
            this.is_USB = mediaOptions.is_USB;
            this.is_GPS_navigator = mediaOptions.is_GPS_navigator;
            this.is_subwoofer = audioSystem.is_subwoofer;

            this.is_antifog = headlightsOptions.is_antifog;
            this.is_washers = headlightsOptions.is_washers;
            this.is_adaptive_lighting = headlightsOptions.is_adaptive_lighting;

            this.is_athermal_glazing = climateOptions.is_athermal_glazing;
            this.is_leather_wheel = salonOptions.is_leather_wheel;
            this.is_hatch = salonOptions.is_hatch;
            this.is_wheel_control = climateOptions.is_wheel_control;
            this.is_winter_included = wheelsOptions.is_winter_included;

            // Объявление
            this.ads_description = carData.ads_parameter?.ads_description || null;
            this.place_inspection = carData.ads_parameter?.place_inspection || null;
            this.amount = carData.ads_parameter?.amount || null;
            this.phone = carData.ads_parameter?.phone || null;
            this.email = carData.ads_parameter?.email || null;
            this.city = carData.ads_parameter?.city || null;
            this.latitude = carData.ads_parameter?.latitude || null;
            this.longitude = carData.ads_parameter?.longitude || null;
            this.communication_method_id = carData.ads_parameter?.communication_method_id.id || null;
            this.username = carData.ads_parameter?.username || null;

         } catch (error) {
            console.error('Ошибка при заполнении стора данными: ', error);
         }
      },
      resetParams() {
         this.id = null;
         this.is_draft = 0;
         this.is_published = 0;
         this.is_in_archive = 0;
         this.condition_id = null;

         this.photos = [];
         this.color_id = null;
         this.video = null;

         this.country_id = null;
         this.vin = null;
         this.state_number = null;

         this.brand_id = null;
         this.model_id = null;
         this.year_id = null;
         this.car_body_type = null;
         this.count_doors = null;
         this.transmission_id = null;
         this.engine_type_id = null;
         this.drive_id = null;
         this.handlebar_id = null;

         this.mileage = null;
         this.owners = null;
         this.state_id = null;
         this.pts = null;

         this.is_service_book = 0;
         this.is_serviced_dealer = 0;
         this.is_under_warranty = 0;

         this.power_steering = null;
         this.salon = null;
         this.electric_window = null;
         this.audio_system = null;
         this.wheels = null;
         this.climate = null;
         this.headlight = null;

         this.is_front_seats = 0;
         this.is_rear_seats = 0;
         this.is_mirrors = 0;
         this.is_rear_window = 0;
         this.is_steering_wheel = 0;
         this.is_steering_wheel_control = 0;
         this.is_front_seats_drives = 0;
         this.is_rear_seats_drives = 0;
         this.is_mirrors_drives = 0;
         this.is_steering_column_drives = 0;
         this.is_folding_mirrors_drives = 0;
         this.is_front_seats_setting = 0;
         this.is_rear_seats_setting = 0;
         this.is_mirrors_setting = 0;
         this.is_steering_column_setting = 0;
         this.is_blind_spot_monitoring = 0;
         this.is_automatic_parking = 0;
         this.is_rain_sensor = 0;
         this.is_light_sensor = 0;
         this.is_rear_parking_sensor = 0;
         this.is_front_parking_sensor = 0;
         this.is_rear_view_camera = 0;
         this.is_cruise_control = 0;
         this.is_onboard_computer = 0;
         this.is_alarm_system = 0;
         this.is_central_lock = 0;
         this.is_immobilizer = 0;
         this.is_satellite = 0;
         this.is_frontal_airbags = 0;
         this.is_knee_high_airbags = 0;
         this.is_curtains_airbags = 0;
         this.is_side_front_airbags = 0;
         this.is_side_rear_airbags = 0;
         this.is_anti_lock_brakes = 0;
         this.is_anti_slip = 0;
         this.is_exchange_rate_stability = 0;
         this.is_distrib_braking_forces = 0;
         this.is_emergency_braking = 0;
         this.is_differential_block = 0;
         this.is_pedestrian_detection = 0;
         this.is_CD_DVD_Bluray = 0;
         this.is_AUX = 0;
         this.is_MP3 = 0;
         this.is_Bluetooth = 0;
         this.is_Radio = 0;
         this.is_TV = 0;
         this.is_Video = 0;
         this.is_USB = 0;
         this.is_GPS_navigator = 0;
         this.is_subwoofer = 0;
         this.is_antifog = 0;
         this.is_washers = 0;
         this.is_adaptive_lighting = 0;
         this.is_athermal_glazing = 0;
         this.is_leather_wheel = 0;
         this.is_hatch = 0;
         this.is_winter_included = 0;
         this.is_wheel_control = 0;

         this.ads_description = null;
         this.place_inspection = null;
         this.amount = null;
         this.phone = null;
         this.email = null;
         this.city = null;
         this.latitude = null;
         this.longitude = null;
         this.communication_method_id = null;
         this.username = null;
      }
   },
});
import axios from 'axios';
export const fetchLocation = async () => {
   const config = useRuntimeConfig();
   const apiToken = config.public.apiToken;

   try {
      const locResponse = await fetch(`https://ipinfo.io/json?token=${apiToken}`);
      const locData = await locResponse.json();
      const [lat, lon] = locData.loc.split(',');
      return { lat, lon };
   } catch (error) {
      console.error('Ошибка получения местоположения:', error);
      throw error;
   }
};

export const getCityByIp = async (ip) => {
   const config = useRuntimeConfig();
   const apiToken = config.public.apiToken;

   try {
      // Запрос к API для получения данных по IP
      const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${apiToken}`);

      // Деструктурируем данные и возвращаем город и страну
      const { city, country } = response.data;
      return { city: city || 'Неизвестно', country: country || 'Неизвестно' };
   } catch (error) {
      console.error(`Ошибка при получении данных для IP ${ip}:`, error);
      return { city: 'Неизвестно', country: 'Неизвестно' }; 
   }
};

export const fetchCity = async (lat, lon) => {
   const config = useRuntimeConfig();
   const yandexApiKey = config.public.yandexApiKey;
   try {
      const cityResponse = await fetch(`https://geocode-maps.yandex.ru/1.x/?geocode=${lon},${lat}&apikey=${yandexApiKey}&format=json&lang=ru_RU`);
      const cityData = await cityResponse.json();

      const featureMember = cityData?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AdministrativeArea;
      const countryCode = cityData?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.CountryNameCode;

      if (countryCode !== 'RU') {
         return 'Москва';
      }

      const cityName = featureMember?.Locality?.LocalityName || featureMember?.SubAdministrativeArea?.Locality?.LocalityName;

      if (cityName) {
         return cityName;
      } else {
         const adminCenter = featureMember?.AdministrativeCenter?.Locality?.LocalityName;
         if (adminCenter) {
            return adminCenter; 
         }
         return 'Москва';
      }
   } catch (error) {
      console.error('Ошибка получения города:', error);
      return 'Москва';  
   }
};

export const fetchSuggestions = async (query) => {
   const config = useRuntimeConfig();
   const yandexApiKey = config.public.yandexApiKey;

   try {
      const response = await axios.get(`https://geocode-maps.yandex.ru/1.x/`, {
         params: {
            apikey: yandexApiKey,
            format: 'json',
            geocode: query,
            results: 5,
         },
      });

      return response.data.response.GeoObjectCollection.featureMember.map((item) => {
         const name = item.GeoObject.name;
         const description = item.GeoObject.description;
         const fullAddress = `${description}, ${name}`;
         return { fullAddress, geoObject: item.GeoObject };
      });
   } catch (error) {
      console.error(error);
   }
};
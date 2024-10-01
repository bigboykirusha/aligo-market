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

export const fetchCity = async (lat, lon) => {
   const config = useRuntimeConfig();
   const yandexApiKey = config.public.yandexApiKey;
   try {
      const cityResponse = await fetch(`https://geocode-maps.yandex.ru/1.x/?geocode=${lon},${lat}&apikey=${yandexApiKey}&format=json&lang=ru_RU`);
      const cityData = await cityResponse.json();

      const featureMember = cityData?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country?.AdministrativeArea;

      const cityName = featureMember?.Locality?.LocalityName || featureMember?.SubAdministrativeArea?.Locality?.LocalityName || 'Неизвестный город';

      return cityName;
   } catch (error) {
      console.error('Ошибка получения города:', error);
      return 'Ошибка получения города';
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
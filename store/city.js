import { defineStore } from 'pinia';
import { useCookie } from '#app';  // Импортируем useCookie

export const useCityStore = defineStore('city', {
   state: () => ({
      selectedCity: { name: 'Москва', id: 365 },
   }),
   actions: {
      setSelectedCity(city) {
         if (!city || !city.name || !city.id) {
            console.error('Некорректные данные города:', city);
            return;
         }
         console.log('Сюда передан город:', city);
         this.selectedCity = { name: city.name, id: city.id };

         const cityCookie = useCookie('selectedCity', { maxAge: 7 * 24 * 60 * 60 });
         cityCookie.value = JSON.stringify(this.selectedCity);
      },
   },
});
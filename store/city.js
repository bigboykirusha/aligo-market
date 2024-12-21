import { defineStore } from 'pinia'
import { setCookie, getCookie } from '../services/auth'

export const useCityStore = defineStore('city', {
   state: () => ({
      selectedCity: { name: 'Москва', flag: '' },
   }),
   actions: {
      setSelectedCity(city) {
         console.log('Сюда передан город:', city)
         this.selectedCity = { name: city, flag: '' };
         setCookie('selectedCity', JSON.stringify(this.selectedCity), 7);

      },
   },
});
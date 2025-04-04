<template>
   <Transition name="fade">
      <div v-if="payPopupStore.isPopupOpen" class="overlay" @click.self="closePopup">
         <div class="popup">
            <button class="close-button" @click="closePopup">
               <img :src="closeIcon" alt="close icon" />
            </button>
            <img class="logo" src="../assets/icons/logo-report.svg" />
            <div class="separator"></div>
            <h2 class="subtitle">Отчет об истории {{ payPopupStore.label }} года</h2>
            <div class="price-block">
               <span>Стоимость полного отчёта</span>
               <span class="price-block__amount">62 ₽</span>
            </div>

            <div class="card-wrapper">
               <div class="card card-back">
                  <div class="black-bar"></div>
                  <div class="cvv-block">
                     <span class="cvv-label">Код</span>
                     <input v-model="cvv" type="text" class="card-cvv" placeholder="CVC" maxlength="3"
                        autocomplete="cc-csc" inputmode="numeric" :class="{ 'error': !isCvvValid }"
                        @input="validateCVV" />
                  </div>
               </div>

               <div class="card card-front">
                  <div class="input-block">
                     <div class="input-section">
                        <span class="input-label">Номер карты</span>
                        <input v-model="cardNumber" type="text" v-mask="'#### #### #### #### ###'" class="card-number"
                           placeholder="0000 0000 0000 0000" autocomplete="cc-number" inputmode="numeric"
                           :class="{ 'error': !isCardValid }" @input="formatCardNumber" @blur="validateCardNumber" />
                     </div>
                  </div>

                  <div class="input-block">
                     <div class="input-section">
                        <span class="input-label">Срок действия</span>
                        <div class="expiry-date-wrapper">
                           <input v-model="expiryCombined" class="card-expiry-month" placeholder="MM / YY" maxlength="7"
                              autocomplete="cc-exp" inputmode="numeric" :class="{ 'error': !isExpiryValid }"
                              @input="formatExpiryCombined" @blur="validateExpiryCombined" />
                        </div>
                     </div>
                     <div class="cvv-block mobile">
                        <span class="cvv-label">Код</span>
                        <input v-model="cvv" type="text" class="card-cvv" placeholder="CVC" maxlength="3"
                           autocomplete="cc-csc" inputmode="numeric" :class="{ 'error': !isCvvValid }"
                           @input="validateCVV" />
                     </div>
                  </div>
               </div>
            </div>

            <div class="separator"></div>
            <div class="pay__content">
               <button class="pay-button" @click="submitPayment">Оплатить</button>
               <p class="agreement-text">
                  Вы также соглашаетесь с <a class="agreement-link">договором аферты</a> и принимаете
                  <a class="agreement-link">политику конфиденциальности</a>.
               </p>
            </div>
         </div>
      </div>
   </Transition>
</template>

<script setup>
import { ref } from "vue";
import { usePayPopupStore } from "@/store/payPopupStore";
import closeIcon from '@/assets/icons/close.svg';
import { usePopupErrorStore } from "~/store/popupErrorStore";
import cardValidator from 'card-validator';
import { mask as vMask } from 'vue-the-mask'

defineOptions({
   directives: {
      mask: vMask
   }
})

const payPopupStore = usePayPopupStore();
const popupErrorStore = usePopupErrorStore();

const cardNumber = ref("");
const expiryMonth = ref("");
const expiryYear = ref("");
const cvv = ref("");
const isCardValid = ref(true);
const isExpiryValid = ref(true);
const isCvvValid = ref(true);

const formatCardNumber = () => {
   cardNumber.value = cardNumber.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
   isCardValid.value = true;
};

const validateCardNumber = () => {
   const validation = cardValidator.number(cardNumber.value.replace(/\s/g, ""));
   isCardValid.value = validation.isValid;
};

const expiryCombined = ref("");

const formatExpiryCombined = () => {
   let raw = expiryCombined.value.replace(/\D/g, "").slice(0, 4);

   if (raw.length >= 3) {
      expiryCombined.value = raw.slice(0, 2) + ' / ' + raw.slice(2);
   } else if (raw.length >= 1) {
      expiryCombined.value = raw;
   }

   isExpiryValid.value = true;
};

const validateExpiryCombined = () => {
   const raw = expiryCombined.value.replace(/\D/g, "");
   const month = parseInt(raw.slice(0, 2), 10);
   const year = parseInt(`20${raw.slice(2, 4)}`, 10);
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonth = currentDate.getMonth() + 1;

   isExpiryValid.value =
      raw.length === 4 &&
      month >= 1 && month <= 12 &&
      (year > currentYear || (year === currentYear && month >= currentMonth));

   if (isExpiryValid.value) {
      expiryMonth.value = raw.slice(0, 2);
      expiryYear.value = raw.slice(2, 4);
   }
};

const validateExpiryDate = () => {
   const month = parseInt(expiryMonth.value, 10);
   const year = parseInt(`20${expiryYear.value}`, 10);
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonth = currentDate.getMonth() + 1;

   isExpiryValid.value = month >= 1 && month <= 12 && year >= currentYear && (year > currentYear || (year === currentYear && month >= currentMonth));
};

const validateCVV = () => {
   cvv.value = cvv.value.replace(/\D/g, "").slice(0, 3);
   isCvvValid.value = cvv.value.length === 3;
};

const submitPayment = () => {
   validateCardNumber();
   validateExpiryDate();
   validateCVV();

   if (!isCardValid.value || !isExpiryValid.value || !isCvvValid.value) {
      popupErrorStore.showError("Ошибка: Проверьте данные карты");
   } else {
      popupErrorStore.showNotification("Оплата прошла успешно, функционала пока нет");
      closePopup();
   }
};

const closePopup = () => {
   cardNumber.value = "";
   expiryMonth.value = "";
   expiryYear.value = "";
   cvv.value = "";
   isCardValid.value = true;
   isExpiryValid.value = true;
   isCvvValid.value = true;
   payPopupStore.closePopup();
};
</script>

<style lang="scss" scoped>
.error {
   border: 1px solid #FF5959 !important;
}

.overlay {
   position: fixed;
   z-index: 350;
   inset: 0;
   background: rgba(0, 0, 0, 0.5);
   backdrop-filter: blur(3px);
   display: flex;
   align-items: center;
   justify-content: center;

   @media (max-width: 768px) {
      align-items: flex-end;
   }
}

.logo {
   margin-bottom: 24px;
   height: 32px;

   @media (max-width: 768px) {
      height: 22px;
      margin-bottom: 16px;
   }
}

.popup {
   background: #FFFFFF;
   position: relative;
   padding: 32px 40px;
   border-radius: 8px;
   width: 640px;
   animation: fade-in 0.2s ease-out;

   @media (max-width: 768px) {
      width: 100%;
      padding: 24px 16px;
      border-radius: 8px 8px 0 0;
   }
}

.separator {
   border-top: 1px solid #D6D6D6;
}

.subtitle {
   color: #3366FF;
   font-size: 24px;
   font-weight: 700;
   margin-bottom: 16px;
   margin-top: 24px;

   @media (max-width: 768px) {
      margin-top: 16px;
      font-size: 20px;
   }
}

.price-block {
   display: flex;
   background-color: #EEF9FF;
   color: #323232;
   border-radius: 8px;
   padding: 16px 24px;
   justify-content: space-between;
   align-items: center;
   font-size: 14px;
   font-weight: 700;
}

.price-block__amount {
   font-size: 16px;
}

.input-section {
   width: 100%;
}

.card-wrapper {
   position: relative;
   display: flex;
   justify-content: flex-end;
   align-items: flex-end;
   width: 426px;
   height: 204px;
   margin: 40px auto;

   @media (max-width: 768px) {
      width: 382px;
   }

   @media (max-width: 480px) {
      width: 100%;
      margin: 16px auto;
      margin-top: 0;
   }
}

.card {
   width: 292px;
   height: 180px;
   border-radius: 8px;
   padding: 24px;
   display: flex;
   flex-direction: column;
   justify-content: flex-end;
   align-items: center;
   gap: 16px;
   position: absolute;

   @media (max-width: 480px) {
      width: 100%;
   }
}

.card-back {
   background: linear-gradient(135deg, #A0CFFF, #7BB5E5);
   color: white;
   z-index: 1;

   @media (max-width: 480px) {
      transform: none;
   }
}

.black-bar {
   width: 100%;
   height: 40px;
   background: black;
   position: absolute;
   top: 16px;
   left: 0;
}

.cvv-block {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   width: 100%;
   z-index: 50;
   gap: 4px;
   max-width: 48px;
   margin-top: 60px;
   margin-left: auto;

   @media (max-width: 480px) {
      width: 100%;
      max-width: 100%;
   }
}

.cvv-label {
   font-size: 12px;
   max-width: 48px;
   color: #323232;
}

.card-cvv {
   width: 48px;
   padding: 6px 8px;
   font-size: 14px;
   border: none;
   background: #FFFFFF;
   color: #323232;
   border: 1px solid #D6D6D6;
   border-radius: 4px;
   text-align: center;
   letter-spacing: 1px;
   outline: none;

   @media (max-width: 480px) {
      width: 100%;
      max-width: 100%;
   }
}

.card-front {
   background: linear-gradient(135deg, #EEF9FF, #A0CFFF);
   color: white;
   z-index: 2;
   transform: translateY(-24px) translateX(-134px);
   box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);

   @media (max-width: 768px) {
      transform: translateY(-24px) translateX(-90px);
      background: #EEF9FF;
      box-shadow: none;
   }

   @media (max-width: 480px) {
      transform: none;
   }
}

.input-block {
   width: 100%;
   display: flex;
   gap: 24px;
   flex-direction: row;
   justify-content: space-between;
}

.input-label {
   display: block;
   font-size: 12px;
   color: #323232;
   margin-bottom: 4px;
}

.card-number {
   width: 100%;
   padding: 6px 8px;
   font-size: 14px;
   border: none;
   background: #FFFFFF;
   color: #323232;
   border: 1px solid #D6D6D6;
   border-radius: 4px;
   text-align: center;
   letter-spacing: 1px;
   outline: none;
}

.expiry-date-wrapper {
   display: flex;
   align-items: center;
   gap: 8px;
}

.card-expiry-month,
.card-expiry-year {
   width: 96px;
   padding: 6px 8px;
   font-size: 14px;
   border: none;
   background: #FFFFFF;
   color: #323232;
   border: 1px solid #D6D6D6;
   border-radius: 4px;
   text-align: center;
   letter-spacing: 1px;
   outline: none;

   @media (max-width: 480px) {
      width: 100%;
      max-width: 100%;
   }
}

.expiry-separator {
   color: #A8A8A8;
   font-size: 14px;
}

.pay__content {
   display: flex;
   gap: 40px;
   margin-top: 16px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 12px;
   }
}

.pay-button {
   width: fit-content;
   padding: 8px 40px;
   background: #3366FF;
   color: white;
   border: none;
   border-radius: 6px;
   font-size: 14px;
   cursor: pointer;
   transition: $transition-1;

   @media (max-width: 768px) {
      width: 100%;
   }

   &:hover {
      background-color: #144DF8;
   }
}

.agreement-text {
   font-size: 12px;
   color: #787878;
   line-height: 16px;

   @media (max-width: 768px) {
      text-align: center;
   }
}

.agreement-link {
   text-decoration: underline;
   cursor: pointer;
   color: #3366FF;
}

.close-button {
   position: absolute;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: background-color 0.1s ease-in-out;
   width: 16px;
   height: 16px;
   top: 8px;
   right: 8px;
   background: none;
   border: none;
   cursor: pointer;

   @media (max-width: 768px) {
      top: 24px;
      right: 16px;
   }

   img {
      width: 16px;
      height: 16px;
   }
}

.mobile {
   display: none;

   @media (max-width: 480px) {
      display: block;
      margin: 0;
   }
}

@keyframes fade-in {
   from {
      transform: translateY(100%);
   }

   to {
      transform: translateY(0);
   }
}
</style>
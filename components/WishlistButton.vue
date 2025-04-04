<template>
   <div
      :class="['car-details__wishlist', { 'active': isWishlisted, 'small': size === 'small', 'auto-page': isWithBorder }]">
      <button class="car-details__wishlist-button" @click="handleClick">
         <svg width="12" height="15" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg" class="icon-heart"
            :class="{ 'filled': isWishlisted }">
            <path
               d="M12.003 7.47126L7.00555 13.0714L2.00814 7.47126M2.00814 7.47126C1.67852 7.10833 1.41888 6.67211 1.24557 6.19006C1.07226 5.70802 0.989044 5.1906 1.00116 4.67037C1.01327 4.15015 1.12044 3.6384 1.31594 3.16735C1.51143 2.69629 1.79101 2.27614 2.13707 1.93335C2.48312 1.59056 2.88816 1.33255 3.32667 1.17558C3.76518 1.01861 4.22766 0.966067 4.685 1.02127C5.14234 1.07647 5.58462 1.23821 5.984 1.49632C6.38338 1.75443 6.73119 2.1033 7.00555 2.52098C7.2811 2.10633 7.62932 1.76051 8.02842 1.50514C8.42752 1.24977 8.86892 1.09036 9.32497 1.03689C9.78103 0.983412 10.2419 1.03702 10.6788 1.19436C11.1157 1.3517 11.5192 1.60938 11.8641 1.95128C12.2089 2.29318 12.4877 2.71194 12.6829 3.18134C12.8781 3.65074 12.9856 4.16068 12.9987 4.67925C13.0117 5.19782 12.93 5.71385 12.7587 6.19505C12.5873 6.67625 12.3301 7.11226 12.003 7.47578"
               :stroke="isWishlisted ? '#FFFFFF' : '#3366FF'" stroke-width="1" stroke-linecap="round"
               stroke-linejoin="round" fill="none" stroke-dasharray="30" :stroke-dashoffset="0" />
         </svg>
      </button>
      <transition name="fade">
         <span v-if="size === 'big'" @click="handleClick" class="car-details__wishlist-text">
            {{ isWishlisted ? 'В избранном' : 'В избранное' }}
         </span>
      </transition>
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/store/user';
import { useFavoritesStore } from '~/store/favorites';
import { usePopupErrorStore } from '~/store/popupErrorStore';

const props = defineProps({
   id: Number,
   size: {
      type: String,
      default: 'big',
      validator(value) {
         return ['big', 'small'].includes(value);
      }
   },
   isWithBorder: Boolean,
});

const emit = defineEmits(['toggle-login-modal']);

const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const popupErrorStore = usePopupErrorStore();

const isWishlisted = computed(() => favoritesStore.items.includes(props.id));
const isLoggedIn = computed(() => userStore.isLoggedIn);

const handleClick = async () => {

   if (isLoggedIn.value) {
      try {
         const response = await favoritesStore.toggleFavorite(props.id);
         if (response.success) {
            userStore.fetchUserCounts();
         } else {
            popupErrorStore.showError('Не удалось добавить в избранное');
         }
      } catch (error) {
         popupErrorStore.showError('Не удалось добавить в избранное');
      }
   } else {
      emit('toggle-login-modal');
   }
};
</script>

<style lang="scss" scoped>
.car-details__wishlist {
   display: flex;
   align-items: center;
   background-color: #FFFFFF;
   gap: 8px;
   border-radius: 18px;
   transition: background-color 0.2s ease-in-out, transform 0.15s ease;
   cursor: pointer;

   &.auto-page {
      .car-details__wishlist-button {
         border: 1px solid #3366ff;
      }
   }

   &.small {
      gap: 0;
      padding: 0;
      border-radius: 50%;

      .icon-heart {
         padding-top: 1px;
         width: 12px;
         height: 12px;
      }
   }

   &.active {
      .car-details__wishlist-button {
         background-color: #3366ff;
      }
   }

   &-text {
      color: #3366ff;
      font-size: 14px;
      font-weight: 400;
      transition: color 0.3s ease;

      @media (max-width: 768px) {
         display: none;
      }
   }

   &-button {
      background-color: transparent;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      transition: background-color 0.3s ease, transform 0.15s ease;

      &:hover {
         background-color: #D6EFFF;

         @media (max-width: 768px) {
            background-color: #FFFFFF;
         }
      }

      .icon-heart {
         transition: stroke 0.3s ease, stroke-dashoffset 0.4s ease-in-out;

         &.filled {
            animation: pulse 0.4s ease-in-out;
         }
      }
   }

   &.small .car-details__wishlist-button {
      width: 24px;
      height: 24px;
      border-radius: 50%;
   }

   &.small .car-details__wishlist-text {
      display: none;
   }
}

@keyframes pulse {
   0% {
      transform: scale(1);
   }

   50% {
      transform: scale(1.1);
   }

   100% {
      transform: scale(1);
   }
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
   opacity: 1;
}
</style>
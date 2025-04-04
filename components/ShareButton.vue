<template>
   <div class="car-details__wishlist" @mouseenter="isHovered = true" @mouseleave="isHovered = false" ref="wishlist">
      <button class="car-details__wishlist-button" @click.stop="openSharePopup">
         <img :src="shareIcon" alt="Избранное" class="icon-heart" />
      </button>
      <span @click.stop="openSharePopup" class="car-details__wishlist-text">Поделиться</span>
   </div>
</template>

<script setup>
import { useSharePopupStore } from '~/store/sharePopupStore';
import shareIcon from '../assets/icons/share.svg';

const sharePopupStore = useSharePopupStore();

const openSharePopup = () => {
   sharePopupStore.openSharePopup();
};
</script>

<style lang="scss" scoped>
.car-details__wishlist {
   display: flex;
   align-items: center;
   gap: 6px;
   padding: 4px 8px;
   transition: background-color 0.3s ease, border-color 0.3s ease;
   border-radius: 18px;

   &:hover {
      background-color: #D6EFFF;
   }

   &-text {
      color: #3366ff;
      font-size: 14px;
      cursor: pointer;
      line-height: 1;
   }

   &-button {
      width: 20px;
      height: 20px;
      background-color: transparent;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s;

      &.active {
         background-color: #3366ff;
         border-color: #3366ff;
      }

      .icon-heart {
         margin-top: 1px;
         width: 12px;
         height: 12px;
      }
   }
}

@media (max-width: 768px) {
   .car-details__wishlist-text {
      display: none;
   }
}
</style>
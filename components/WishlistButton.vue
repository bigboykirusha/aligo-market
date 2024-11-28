<template>
   <div :class="['car-details__wishlist', { 'car-details__wishlist-mobile': mobile, 'is-fixed': isFixed }]"
      ref="wishlist">
      <button v-if="isLoggedIn" class="car-details__wishlist-button" :class="{ active: isWishlisted }"
         @click="toggleWishList">
         <img :src="isWishlisted ? favActive : fav" alt="Избранное" class="icon-heart" />
      </button>
      <button v-else class="car-details__wishlist-button" @click="emitToggleLoginModal">
         <img :src="fav" alt="Избранное" class="icon-heart" />
      </button>
      <span v-if="isLoggedIn" @click="toggleWishList" class="car-details__wishlist-text">В
         избранное</span>
      <span v-else-if="!isScrolled" @click="emitToggleLoginModal" class="car-details__wishlist-text">В
         избранное</span>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import favActive from '../assets/icons/fav-white.svg';
import fav from '../assets/icons/fav.svg';
import { useUserStore } from '~/store/user';
import { useFavoritesStore } from '~/store/favorites';


const props = defineProps({
   mobile: {
      type: Boolean,
      default: false,
   },
   id: Number,
   is_in_favorites: Number
});

const emit = defineEmits(['toggle-login-modal']);

const isWishlisted = computed(() => favoritesStore.items.includes(props.id))
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

const isScrolled = ref(false);
const isFixed = ref(false);
const wishlist = ref(null);

const toggleWishList = async () => {
   await favoritesStore.toggleFavorite(props.id);
   userStore.fetchUserCounts();
};

const emitToggleLoginModal = () => {
   emit('toggle-login-modal');
};

const handleScroll = () => {
   if (window.scrollY > 100) {
      isScrolled.value = true;
      isFixed.value = true;
   } else {
      isScrolled.value = false;
      isFixed.value = false;
   }
};

onMounted(() => {
   window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.car-details__wishlist {
   display: flex;
   align-items: center;
   gap: 8px;

   @media screen and (max-width: 768px) {
      margin-bottom: 0;
   }

   &-mobile {}

   &-text {
      color: #3366ff;
      font-size: 14px;
      cursor: pointer;
      line-height: 1;
   }

   &-button {
      width: 20px;
      height: 20px;
      background-color: white;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s;

      &:hover {
         background-color: #D6EFFF;
         border-color: #D6EFFF;
      }

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
</style>
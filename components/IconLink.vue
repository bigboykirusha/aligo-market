<template>
   <nuxt-link :to="to" class="header__icon-wrapper" :class="{ 'header__icon-wrapper--active': iconCount > 0 }">
      <img :src="iconSrc" alt="Icon" class="header__icon">
      <span v-if="iconCount > 0" class="header__icon-count">{{ iconCount }}</span>
   </nuxt-link>
</template>

<script setup>
defineProps({
   to: {
      type: String,
      required: true,
   },
   iconSrc: {
      type: String,
      required: true,
   },
   iconCount: {
      type: Number,
      default: 0,
   },
});
</script>

<style scoped>
.header__icon-wrapper {
   display: flex;
   align-items: center;
   gap: 6px;
}

.header__icon-count {
   color: #FFFFFF;
   font-size: 14px;
}

.header__icon {
   height: 12px;
}
</style>
<template>
   <div class="container">
      <Header />
      <NuxtPage />
      <CookiePopup />
      <LoginModal />
      <LocationModal />
      <LocationPopupMobile />
      <FooterAlternative v-show="!showFooter" />
      <Footer v-show="showFooter" />
      <Chat
         v-if="userStore.isLoggedIn && !route.path.startsWith('/profile') && !route.path.startsWith('/auto') && !route.path.startsWith('/create') && !route.path.startsWith('/report')" />
      <PopupError />
      <SharePopup />
      <Complaint />
      <PayPopup />
      <UserMenuBurger />
      <BottomToolbar />
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PayPopup from '~/components/PayPopup.vue';
import PopupError from '~/components/PopupError.vue';
import SharePopup from '~/components/SharePopup.vue';
import { useUserStore } from '~/store/user';

const route = useRoute();
const userStore = useUserStore();

const showFooter = computed(() => {
   return !route.path.startsWith('/create') && !route.path.startsWith('/profile');
});
</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   min-height: 100vh;
   min-height: 100dvh;
}
</style>

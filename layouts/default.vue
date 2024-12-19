<template>
   <div class="container">
      <div>
         <Header />
      </div>
      <NuxtPage />
      <CookiePopup />
      <LoginModal />
      <LocationPopupMobile />
      <Footer v-if="showFooter" />
      <FooterAlternative v-else />
      <Chat
         v-if="userStore.isLoggedIn && !route.path.startsWith('/myself') && !route.path.startsWith('/autos') && !route.path.startsWith('/createAd')" />
      <NotifPopup />
      <UserMenuBurger />
      <BottomToolbar />
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';

const route = useRoute();
const userStore = useUserStore();

const showFooter = computed(() => {
   return !route.path.startsWith('/createAd') && !route.path.startsWith('/myself');
});
</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   min-height: 100vh;
}
</style>

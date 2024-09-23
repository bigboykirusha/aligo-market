<template>
   <div class="wrapper">
      <UserMenu />
      <component :is="currentComponent" />
   </div>
</template>

<script setup>
import { shallowRef, watch } from 'vue';
import Favorites from '~/components/Favorites.vue';
import MyAds from '~/components/MyAds.vue';
import Notifications from '~/components/Notifications.vue';
import EditProfile from '~/components/EditProfile.vue';
import Messages from '~/components/Messages.vue';
import Reviews from '~/components/Reviews.vue';
import { useRoute } from 'vue-router';

const currentComponent = shallowRef(MyAds);
const route = useRoute();

const componentsMap = {
   ads: MyAds,
   favorites: Favorites,
   reviews: Reviews,
   notifications: Notifications,
   editProfile: EditProfile,
   messages: Messages,

};

const updateComponent = () => {
   currentComponent.value = componentsMap[route.params.title] || MyAds;
};

watch(() => route.params.title, updateComponent, { immediate: true });
</script>

<style scoped lang="scss">
.wrapper {
   max-width: 1312px;
   width: 100%;
   padding: 0 16px;
   column-gap: 48px;
   margin: 134px auto;
   max-height: calc(100vh - 208px); 
   display: flex;
   justify-content: space-between;
   overflow-y: auto;
   margin-bottom: auto;

   @media screen and (max-width: 768px) {
      margin-top: 72px;
      margin-bottom: auto;
   }
}
</style>
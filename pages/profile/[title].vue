<template>
   <div class="wrapper">
      <UserMenu />
      <div class="current-component-wrapper">
         <component :is="currentComponent" />
      </div>
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
   edit: EditProfile,
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
   margin: 134px auto auto;
   display: flex;
   flex-direction: column;
   justify-content: flex-start;

   @media (max-width: 768px) {
      margin-top: 66px;
      flex-grow: 1;
   }
}

.current-component-wrapper {
   margin-left: auto;
   width: calc(100% - 270px - 40px);

   @media (max-width: 768px) {
      width: 100%;
      margin: 0 auto;
      margin-bottom: 40px;
   }
}
</style>
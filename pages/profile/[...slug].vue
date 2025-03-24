<template>
   <div class="wrapper">
      <UserMenu />
      <div class="current-component-wrapper">
         <keep-alive>
            <component :is="currentComponent" />
         </keep-alive>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'

import Reviews from '~/components/Reviews.vue';
import Favorites from '~/components/Favorites.vue';
import MyAds from '~/components/MyAds.vue';
import Notifications from '~/components/Notifications.vue';
import EditProfile from '~/components/EditProfile.vue';
import Messages from '~/components/Messages.vue';

const componentsMap = {
   'ads': MyAds,
   'favorites': Favorites,
   'favorites/ads': Favorites,
   'favorites/searches': Favorites,
   'reviews': Reviews,
   'reviews/mine': Reviews,
   'reviews/aboutme': Reviews,
   'notifications': Notifications,
   'edit': EditProfile,
   'messages': Messages,
   'ads/drafts': MyAds,
   'ads/cancelled': MyAds,
   'ads/all': MyAds,
   'ads/archive': MyAds,
};

const route = useRoute();
const slug = computed(() => route.params.slug || []);

const getComponentKey = (slugArray) => {
   if (slugArray.length === 0) return 'ads';
   if (slugArray.length === 1) return slugArray[0];
   if (slugArray.length === 2) return slugArray.join('/');
   if (slugArray.length === 3) return slugArray.join('/');
   return 'ads';
};

const currentComponentKey = computed(() => getComponentKey(slug.value));
const currentComponent = computed(() => componentsMap[currentComponentKey.value] || MyAds);
</script>

<style scoped lang="scss">
.wrapper {
   max-width: 1312px;
   min-height: calc(100vh - 134px);
   overflow-y: auto;
   display: flex;
   height: 100%;
   justify-content: space-between;
   width: 100%;
   padding: 0 16px;
   gap: 40px;
   margin: 0 auto;
   margin-top: 134px;

   @media (max-width: 768px) {
      margin-top: 66px;
      min-height: calc(100vh - 66px);
      flex-grow: 1;
   }
}

.current-component-wrapper {
   width: 100%;

   @media (max-width: 768px) {
      margin-bottom: 40px;
   }
}
</style>
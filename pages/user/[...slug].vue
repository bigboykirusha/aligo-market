<template>
   <div class="container">
      <div class="wrapper">
         <UserInfo :userData="userData" :isLoading="isLoadingUser" />
         <div class="block">
            <CardListUser v-if="userData?.unique_code" :userId="userData.unique_code" title="Объявления пользователя" />
            <ReviewListUser v-if="userData?.grade" :userId="userData.unique_code" />
         </div>
      </div>
      <div class="wrapper wrapper--more">
         <CardList title="Свежие объявления" :ads="ads" :isLoading="isLoadingAds" :XTotalCount="5" />
      </div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCars, getUserOtherInfo } from '~/services/apiClient.js';

const route = useRoute();
const router = useRouter();

const ads = ref([]);
const isLoadingAds = ref(false);
const isLoadingUser = ref(false);
const userData = ref(null);

const fetchUser = async (slug) => {
   isLoadingUser.value = true;

   try {
      const data = await getUserOtherInfo(slug);
      if (data?.unique_code) {
         userData.value = data;
      } else {
         router.replace('/404');
      }
   } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      router.replace('/404');
   } finally {
      setTimeout(() => {
         isLoadingUser.value = false;
      }, 1000)
   }

   if (userData.value && userData.value.unique_code !== slug) {
      router.replace({ params: { slug: userData.value.unique_code } });
   }
};

const fetchAds = async () => {
   isLoadingAds.value = true;
   try {
      const { data } = await getCars({ count: 5 });
      ads.value = data;
   } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
   } finally {
      isLoadingAds.value = false;
   }
};

watch(() => route.params.slug, async (newSlug) => {
   await fetchUser(newSlug);
   fetchAds();
}, { immediate: true });

onMounted(() => {
   fetchAds();
});
</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
}

.wrapper {
   max-width: 1312px;
   width: 100%;
   margin: 134px auto 0;
   padding: 0 16px;
   display: flex;
   flex-direction: row;
   gap: 40px;
   justify-content: space-between;

   @media (max-width: 768px) {
      margin-top: 66px;
      flex-direction: column;
   }

   &--more {
      margin: 40px auto 0;

      @media (max-width: 768px) {
         margin-top: 32px;
      }
   }

}

.block {
   display: flex;
   width: 100%;
   flex-direction: column;
   gap: 40px;
}
</style>
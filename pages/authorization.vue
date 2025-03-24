<template>
   <div></div>
</template>

<script setup>
import { useLoginModalStore } from '~/store/loginModal';
import { onMounted } from 'vue';

const loginModalStore = useLoginModalStore();

onMounted(() => {
   loginModalStore.openLoginModal();
});

onBeforeUnmount(() => {
   loginModalStore.closeLoginModal();
});
</script>

<style scoped></style>
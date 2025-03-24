<template>
   <nav class="breadcrumbs">
      <span @click="goHome" class="home-icon">
         <img src="../assets/icons/house-gray.svg" alt="Главная" />
      </span>
      <template v-for="(segment, index) in breadcrumbs" :key="index">
         <img src="../assets/icons/ar-gray.svg" alt=">" class="separator" />
         <span @click="goToSegment(segment.path)" class="breadcrumb">
            {{ segment.label }}
         </span>
      </template>
   </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFiltersStore } from "@/store/filters.js";

const route = useRoute();
const router = useRouter();
const filtersStore = useFiltersStore();

const breadcrumbs = computed(() => {
   const segments = route.path.split("/").filter(Boolean);
   let path = "";

   return segments.map((segment, index) => {
      path += `/${segment}`;
      const fullPath = { path, query: route.query };

      return {
         path: fullPath,
         label: capitalize(decodeURIComponent(segment).replace(/-/g, " ")),
      };
   });
});

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const goHome = () => {
   filtersStore.resetFilters();
   router.push('/');
};

const goToSegment = (path) => {
   filtersStore.resetFilters();
   router.push(path);
};
</script>

<style scoped>
.breadcrumbs {
   display: flex;
   align-items: center;
   gap: 8px;
}

.home-icon img {
   width: 12px;
   height: 12px;
   outline: none;
   cursor: pointer;
}

.separator {
   height: 7px;
}

.breadcrumb {
   text-decoration: none;
   outline: none;
   color: #A8A8A8;
   font-size: 12px;
   cursor: pointer;
}

.breadcrumb:hover {
   text-decoration: underline;
}
</style>
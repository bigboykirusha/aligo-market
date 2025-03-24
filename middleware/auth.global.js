import { useCookie } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
   const savedUserData = useCookie('userData').value;

   const isUserAuthenticated = savedUserData && savedUserData.token;
   const isProtectedPath = to.path.startsWith('/profile') || to.path.startsWith('/create');

   if (!isUserAuthenticated && isProtectedPath) {
      return navigateTo(`/authorization?redirect=${encodeURIComponent(to.fullPath)}`);
   }
});
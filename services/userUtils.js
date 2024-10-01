import { useUserStore } from '../store/user.js';

const userStore = useUserStore();

export const relevantUser = (message) => {
   const { for_user, from_user } = message;
   return for_user.id !== userStore.userId ? for_user : from_user;
};

export const relevantUserInfo = (message) => {
   const user = relevantUser(message);
   return user.username || user.login;
};
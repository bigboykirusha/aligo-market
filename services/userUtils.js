import { useCookie } from '#app';

const userData = useCookie('userData').value;
const userId = userData ? userData.user_id : null;

export const relevantUser = (message) => {
   const { for_user, from_user } = message;
   return for_user.id !== userId ? for_user : from_user;
};

export const relevantUserInfo = (message) => {
   const user = relevantUser(message);
   return user.username || user.login;
};
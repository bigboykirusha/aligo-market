const baseUrl = 'https://dev.aligo.pro';

export const getImageUrl = (path, defaultAvatar) => {
   if (path) {
      return `${baseUrl}/${path}`;
   }
   return defaultAvatar || '';
};
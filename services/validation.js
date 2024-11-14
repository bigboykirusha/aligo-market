export const validatePhoneNumber = (phone) => {
   const phoneRegex = /^(\+7|7)?(\d{3})(\d{3})(\d{2})(\d{2})$/;
   return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};
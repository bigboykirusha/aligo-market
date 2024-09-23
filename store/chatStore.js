import { defineStore } from 'pinia';

export const useChatStore = defineStore('chatStore', {
   state: () => ({
      currentChat: null,
      isCollapsed: true,
      messages: [],
      usersWithAvatars: [] 
   }),
   actions: {
      setCurrentChat(chat) {
         this.currentChat = chat;
      },
      toggleChat() {
         this.isCollapsed = !this.isCollapsed;
      },
      openChat() {
         this.isCollapsed = false;
      },
      closeChat() {
         this.isCollapsed = true;
      },
      addMessage(message) {
         this.messages.push(message);
      },
      setMessages(messages) {
         this.messages = messages; 
      },
      setUsersWithAvatars(users) {
         this.usersWithAvatars = users;
      },
      addUserWithAvatar(user) {
         this.usersWithAvatars.push(user);
      }
   }
});
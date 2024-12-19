import { defineStore } from 'pinia';

export const useChatStore = defineStore('chatStore', {
   state: () => ({
      currentChat: null,
      isCollapsed: true,
      isChatVisible: true,
      messages: [],
      usersWithAvatars: []
   }),
   getters: {
      displayedUsers(state) {
         const uniqueAvatars = [...new Set(
            state.usersWithAvatars
               .filter(user => user.avatarUrl !== null) // фильтруем пустые аватары
               .map(user => user.avatarUrl)
         )];
         return uniqueAvatars.slice(0, 2);
      },
      remainingCount(state) {
         const uniqueUsers = [...new Set(state.usersWithAvatars)];
         return Math.max(uniqueUsers.length - 2, 0);
      }
   },
   actions: {
      setCurrentChat(chat) {
         this.currentChat = chat;
      },
      toggleChat() {
         this.isCollapsed = !this.isCollapsed;
      },
      openChat() {
         this.isCollapsed = false;
         this.isChatVisible = true;
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
      },
      hideChat() {
         this.isChatVisible = false;
      },
      showChat() {
         this.isChatVisible = true;
      }
   }
});

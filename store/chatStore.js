import { defineStore } from 'pinia';

export const useChatStore = defineStore('chatStore', {
   state: () => ({
      currentChat: null,
      isCollapsed: true,
      isChatVisible: true,
      messages: [],
      usersWithAvatars: [],
      windowWidth: window.innerWidth
   }),
   getters: {
      displayedUsers(state) {
         const uniqueAvatars = [...new Set(
            state.usersWithAvatars
               .filter(user => user.avatarUrl !== null)
               .map(user => user.avatarUrl)
         )];
         return uniqueAvatars.slice(0, 2);
      },
      remainingCount(state) {
         const uniqueUsers = [...new Set(state.usersWithAvatars)];
         return Math.max(uniqueUsers.length - 2, 0);
      },
      shouldDisableScroll(state) {
         const isOnMessagesPage = window.location.pathname === '/myself/messages';
         return state.currentChat !== null && state.windowWidth < 768 && isOnMessagesPage;
      }
   },
   actions: {
      setCurrentChat(chat) {
         this.currentChat = chat;
         this.toggleScroll();
      },
      toggleChat() {
         this.isCollapsed = !this.isCollapsed;
      },
      openChat(router) {
         this.isCollapsed = false;
         this.isChatVisible = true;

         if (this.windowWidth < 768) {
            setTimeout(() => {
               router.push('/myself/messages');
            }, 500);
         }
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
      },
      toggleScroll() {
         if (this.shouldDisableScroll) {
            document.body.classList.add('no-scroll');
         } else {
            document.body.classList.remove('no-scroll');
         }
      },
      setWindowWidth(width) {
         this.windowWidth = width;
         this.toggleScroll();
      }
   }
});

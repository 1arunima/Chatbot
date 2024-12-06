  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import messageSection from "./messageSection.vue";
  import Buttonss from "./Buttonss.vue";
  import { IconBold, IconLogout, IconSend2 } from "@tabler/icons-vue";

  
  const router = useRouter();
  const users = ref([]);
  const loggedInUser = ref({});
  const selectedUser = ref({});
  const newMessage = ref("");
  const chatHistory = ref([]);
  const selectedMessageIndex = ref(null); 
  // Load stored users and logged-in user from localStorage
  const loadUsers = () => {
    const storedUsers = localStorage.getItem("userDataList");
    if (storedUsers) {
      users.value = JSON.parse(storedUsers);
    }

    const storedLoggedInUser = localStorage.getItem("loggedInUser");
    if (storedLoggedInUser) {
      loggedInUser.value = JSON.parse(storedLoggedInUser);
    }
  };

  // Load chat history from localStorage
  const loadChatHistory = () => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    chatHistory.value = storedChatHistory ? JSON.parse(storedChatHistory) : [];
  };

  // Select a user for chat
  const selectUser = (user) => {
    selectedUser.value = user;
  };

  // Send a message
  const sendMessage = () => {
    if (newMessage.value.trim()) {
      const message = {
        code: `${loggedInUser.value.id}-${selectedUser.value.id}`,
        from: loggedInUser.value.id,
        to: selectedUser.value.id,
        message: newMessage.value.trim(),
        time: new Date().toLocaleString(),
      };

      chatHistory.value.push(message);
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value));
      newMessage.value = "";
    } else {
      console.error("Message cannot be empty.");
    }
  };

  // Get chat messages for the selected user
  const getChatMessages = () => {
    const chatCode1 = `${loggedInUser.value.id}-${selectedUser.value.id}`;
    const chatCode2 = `${selectedUser.value.id}-${loggedInUser.value.id}`;

    return chatHistory.value.filter((msg) => {
      if (msg.code === chatCode1 || msg.code === chatCode2) {
        return !msg.deletedFor?.includes(loggedInUser.value.id);
      }
      return false;
    });
  };

  // Handle message selection
  const handleStyleChange = (index) => {
    selectedMessageIndex.value = index; // Update selected message index
  };

  // Filter out the logged-in user from the users list
  const filteredUsers = computed(() => {
    return users.value.filter((user) => user.id !== loggedInUser.value.id);
  });



  // Clear chat history for the selected user
  const clearChat = () => {
    const chatCode1 = `${loggedInUser.value.id}-${selectedUser.value.id}`;
    const chatCode2 = `${selectedUser.value.id}-${loggedInUser.value.id}`;

    const updatedChatHistory = chatHistory.value.map((msg) => {
      if (msg.code === chatCode1 || msg.code === chatCode2) {
        if (msg.from === loggedInUser.value.id || msg.to === loggedInUser.value.id) {
          msg.deletedFor ??= [];
          msg.deletedFor.push(loggedInUser.value.id);
        }
      }
      return msg;
    });

    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
  };

  // Logout function
  const logout = () => {
  const userConfirmed = window.confirm("Are you sure you want to logout?");
  if (userConfirmed) {
    loggedInUser.value = {};
    localStorage.removeItem("loggedInUser");
    router.push({ name: "login" });
  }
};
  onMounted(() => {
    loadUsers();
    loadChatHistory();
  });
  </script>


<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        expand-on-hover
       :rail="$vuetify.display.smAndDown ? true  : false"
        permanent
         color="#BBDEFB"
       
      >
      <v-list>
     <v-list-item>
    <v-list-item-title class="text-h6">WELCOME</v-list-item-title>
    <v-list-item-subtitle class="text-subtitle-1">{{ loggedInUser.name }}</v-list-item-subtitle> 
       </v-list-item>
    </v-list>

        <v-divider></v-divider>


          <v-list class="flex-grow-1 overflow-auto size 20px" density="compact" nav>
            <v-list-item class=""
            prepend-icon="mdi-account" 
              v-for="user in filteredUsers"
              :key="user.id"
              :class="{
                active: selectedUser.id === user.id,
                'bg-primary text-white': selectedUser.id === user.id
              }"
              @click="selectUser(user)"
            >
              <v-list-item-title>{{ user.name }}</v-list-item-title>
            </v-list-item>
          </v-list>

      <template v-slot:append>
        <v-list density="compact" nav>
            <v-list-item
            prepend-icon="mdi-logout" title="logout" @click="logout" >
          
            </v-list-item>
          </v-list>
      </template>
        
      </v-navigation-drawer>

      <v-main >
        <v-sheet
    class="pa-4 ma-2"
    elevation="2"
    height="100vh"
    display="flex"
    flex-direction="column"
  >
    <div v-if="selectedUser.id">
      <v-row align="center" justify="space-between" class="pa-2">
        <h3 class="text-h5">Chat with {{ selectedUser.name }}</h3>
      <v-btn text color="error" small @click="clearChat" class="ma-0">
                Clear Chat
              </v-btn>
      </v-row>
      <!-- Chat Messages -->
      <div class="chat-messages pa-4 flex-grow-1" style="overflow-y: auto; height: calc(100vh - 125px);">
        <messageSection
          v-for="(message, index) in getChatMessages()"
          :key="index"
          :messages="message"
          :loguser="loggedInUser"
          :isSelected="index === selectedMessageIndex"
          :index="index"
          @updateStyle="handleStyleChange"
        />
      </div>

      <!-- Input Box -->
      <v-row
        class="pa-2 d-flex align-center"
        >
        <!-- style="position: fixed; bottom: 0; background-color: white; z-index: 10; " -->
        <v-text-field
          v-model="newMessage"
          dense
          label="Type a message..."
          outlined
          @keyup.enter="sendMessage"
          class="flex-grow-1 w-100 "
          style="max-width: 100%;"
          append-inner-icon="mdi-send cursor-pointer"
          @click="sendMessage"
        />
      </v-row>
    </div>

    <div v-else class="d-flex align-center justify-center" style="height: 100%;">
      <p>Select a user to start chatting.</p>
    </div>
  </v-sheet>
      </v-main>
    </v-layout>
  </v-card>
</template>


<style>
html,
body {
  overflow: hidden;
  height: 100%;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}
</style>




<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import messageSection from "./messageSection.vue";

const router = useRouter();
const users = ref([]);
const loggedInUser = ref({});
const selectedUser = ref({});
const newMessage = ref("");
const chatHistory = ref([]);
const selectedMessageIndex = ref(null); // Store index of the selected message

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
  loggedInUser.value = {};
  localStorage.removeItem("loggedInUser");
  router.push({ name: "login" });
};

onMounted(() => {
  loadUsers();
  loadChatHistory();
});
</script>

<template>
  <div id="app" class="chat-app">
    <button class="logout-btn" @click="logout">Logout</button>
    <div class="sidebar">
      <h3>Users</h3>
      <ul>
        <li
          v-for="user in filteredUsers"
          :key="user.id"
          :class="{ active: selectedUser.id === user.id }"
          @click="selectUser(user)"
        >
          {{ user.name }}
        </li>
      </ul>
    </div>
    <div class="chat-window" v-if="selectedUser.id">
      <h3>Chat with {{ selectedUser.name }}  
        <button class="clear-chat-btn" @click="clearChat">Clear Chat</button>
      </h3>

      <div class="chat-messages">
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

      <div class="chat-input">
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button class="send-btn" @click="sendMessage">Send</button>
      </div>
    </div>

    <div v-else class="no-chat">
      <p>Select a user to start chatting.</p>
    </div>
  </div>
</template>


<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  width: 900px;
}

.logout-btn {
  position: fixed;
  top: 10px;
  right: 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #cc0000;
}

.sidebar {
  width: 25%;
  background: #f4f4f4;
  padding: 20px;
  overflow-y: auto;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.sidebar li.active {
  background: #ddd;
  font-weight: bold;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  border-left: 1px solid #ddd;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
  
}

.message.sent {
  background: #007bff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
}

.message.received {
  background: #e4e6eb;
  color: black;
  align-self: flex-start;
}

.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
}

.send-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.send-btn:hover {
  background-color: #0056b3;
}

.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

.clear-chat-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
}

.clear-chat-btn:hover {
  background-color: #cc0000;
}

h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

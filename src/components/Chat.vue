<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const loggedInUser = ref({});
const selectedUser = ref({});
const newMessage = ref("");
const chatHistory = ref([]);

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
  if (storedChatHistory) {
    chatHistory.value = JSON.parse(storedChatHistory);
  }
};

// Select a user to chat with
const selectUser = (user) => {
  selectedUser.value = user;
  console.log("selecteduser", selectedUser.value);
};

// Send a message
const sendMessage = () => {
  if (newMessage.value.trim()) {
    if (!loggedInUser.value.id || !selectedUser.value.id) {
      console.error("Logged-in user or selected user is missing.");
      return;
    }

    const message = {
      code: `${loggedInUser.value.id}-${selectedUser.value.id}`,
      from: loggedInUser.value.id,
      to: selectedUser.value.id,
      message: newMessage.value.trim(),
      time: new Date().toLocaleString(),
    };
    console.log(loggedInUser.value);
    console.log(newMessage.value);
    console.log(message);

    chatHistory.value.push(message);

    // Save to localStorage
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value));

    newMessage.value = "";
  } else {
    console.error("Message cannot be empty.");
  }
};

const getChatMessages = () => {
  const chatCode1 = `${loggedInUser.value.id}-${selectedUser.value.id}`;
  const chatCode2 = `${selectedUser.value.id}-${loggedInUser.value.id}`;

  console.log("hyy", chatCode1);
  console.log("hlo", chatCode2);

  return chatHistory.value.filter(
    (msg) => msg.code === chatCode1 || msg.code === chatCode2
  );
};
const filteredUsers = computed(() => {
  return users.value.filter((user) => user.id !== loggedInUser.value.id);
});

// Logout the user
const logout = () => {
  loggedInUser.value = {};
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
      <h3>Chat with {{ selectedUser.name }}</h3>
      <div class="chat-messages">
        <div
          v-for="(message, index) in getChatMessages()"
          :key="index"
          :class="{
            sent: message.from === loggedInUser.id,
            received: message.from !== loggedInUser.id,
          }"
          class="message"
        >
          <p>{{ message.message }}</p>
          <small>{{ message.time }}</small>
        </div>
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
.chat-window h3 {
  margin-bottom: 10px;
  margin-top: -34px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
}
.chat-app {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  position: relative;
  height: 600px;
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
  z-index: 10;
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
  width: 700px;
  padding-bottom: 20px;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  width: 100px;
  border-radius: 10px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.sent {
  background: #007bff;
  color: white;
  align-self: flex-end;
  border-radius: 10px 10px 0 10px;
  max-width: 80%;
  margin-left: auto;
}
.message.received {
  background: #e4e6eb;
  color: black;
  align-self: flex-start;
  border-radius: 10px 10px 10px 0;
}

.chat-input {
  display: flex;
  align-items: center;
  margin-top: 10px; /* Adjust this value to move it further down */
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  margin: 0;
}

.send-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-weight: bold;
}

.send-btn:hover {
  background-color: #0056b3; /* Darker shade on hover */
}
</style>

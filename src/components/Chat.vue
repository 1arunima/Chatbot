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


const loadChatHistory = () => {
  const storedChatHistory = localStorage.getItem("chatHistory");
  chatHistory.value = storedChatHistory ? JSON.parse(storedChatHistory) : [];
};

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

const getChatMessages = () => {
  const chatCode1 = `${loggedInUser.value.id}-${selectedUser.value.id}`;
  const chatCode2 = `${selectedUser.value.id}-${loggedInUser.value.id}`;
  return chatHistory.value.filter(
    (msg) => msg.code === chatCode1 || msg.code === chatCode2
  );
};


const clearChat = () => {
  const chatCode1 = `${loggedInUser.value.id}-${selectedUser.value.id}`;
  const updatedChatHistory = chatHistory.value.filter((msg) => msg.code !== chatCode1);

 
  localStorage.setItem(`chatHistory-${loggedInUser.value.id}`, JSON.stringify(updatedChatHistory));
  console.log(loggedInUser.value);
  
  chatHistory.value = updatedChatHistory;
  selectedUser.value = {};
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => user.id !== loggedInUser.value.id);
});


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
      <h3>Chat with {{ selectedUser.name }}  <button class="clear-chat-btn" @click="clearChat">Clear Chat</button></h3>
     
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
.chat-app {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  width : 900px;
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
  width: 108px;

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

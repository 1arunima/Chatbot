
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { errorMessages } from 'vue/compiler-sfc';

const router = useRouter();
const users = ref([]);
const selectedUser = ref({});
const newMessage = ref("");
const chat =ref([])
const sender = ref({});

// Load users from localStorage
const loadUsers = () => {
  const storedUsers = localStorage.getItem('userDataList');
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  }
};

const selectUser = (user) => {
  if (!user.messages) { 
    user.messages = [];
  } 
  selectedUser.value = user;
};

const isCorrectSel =(sender,receiver)=>{
  return sender.username !== receiver.username
}
const sendMessage = () => {
  if (newMessage.value.trim()) {
    if (!selectedUser.value.messages) {
      selectedUser.value.messages = [];
    }

    if(isCorrectSel(sender,selectedUser.value)){
      const message={
        text :newMessage.value,
        sender:sender.username,
        receiver:selectUser.value.username
      }
      chat.value.push(message)
    }

    localStorage.setItem('chatHistory', JSON.stringify(chat.value));
    selectedUser.value.messages.push({ text: newMessage.value, sentBy: 'me' });
    
    newMessage.value = '';

    localStorage.setItem('userDataList', JSON.stringify(users.value));
  }else{
    console.error("sender and receiver cannot be the same ")
  }
};

// Logout the user
const logout = () => {
  
  localStorage.removeItem('loggedInUser');
  router.push({ name: 'login' });
};

onMounted(() => {
  loadUsers();
});
</script>




<template>
  <div id="app" class="chat-app">
    <button class="logout-btn" @click="logout">Logout</button> <!-- Logout Button -->
    <div class="sidebar">
      <h3>Users</h3>
      <ul>
        <li
          v-for="user in users"
          :key="user.username"
          :class="{ active: selectedUser.username === user.username }"
          @click="selectUser(user)"
        >
          {{ user.name }}
        </li>
      </ul>
    </div>
    <div class="chat-window" v-if="selectedUser.username">
      <h3>Chat with {{ selectedUser.name }}</h3>
      <div class="chat-messages">
        <div
          v-for="(message, index) in selectedUser.messages"
          :key="index"
          :class="{
            sent: message.sentBy === 'me',
            received: message.sentBy !== 'me'
          }"
          class="message"
        >
          {{ message.text }}
        </div>
      </div>
      <div class="chat-input">
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
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
  position: relative;
  height: 600px;
}

.logout-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 15px;
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
}

.message.received {
  background: #e4e6eb;
  color: black;
  align-self: flex-start;
  border-radius: 10px 10px 10px 0;
}

.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.no-chat {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}
</style>



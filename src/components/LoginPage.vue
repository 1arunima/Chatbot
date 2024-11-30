<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const userDataList = ref([]);
const errorMessage = ref('');

const router = useRouter();

// Load user data from localStorage
const loadUserData = () => {
  const storedData = localStorage.getItem('userDataList');
  if (storedData) {
    userDataList.value = JSON.parse(storedData);
  }
};

onMounted(() => {
  loadUserData();
});

// Handle user login
const handleLogin = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }

  const user = userDataList.value.find(
    (user) => user.username === email.value && user.password === password.value
  );

  if (user) {
    errorMessage.value = '';
    localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store logged-in user
    router.push('/chat'); // Navigate to chat page
  } else {
    errorMessage.value = 'Invalid email or password.';
  }
};

// Redirect to the signup page
const goToSignup = () => {
  router.push('/signup');
};
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          autocomplete="username"
          />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          autocomplete="current-password"
        />
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Buttons -->
      <div class="button-group">
        <button type="submit">Login</button>
        <button type="button" class="signup-button" @click="goToSignup">Sign Up</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px 40px;
  border-radius: 8px;
  background: #92adac;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #fff;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

button {
  flex: 1;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

button:hover {
  background-color: #45a049;
}

.signup-button {
  background-color: #007bff;
}

.signup-button:hover {
  background-color: #0056b3;
}

@media (max-width: 500px) {
  .login-container {
    padding: 15px;
  }

  h1 {
    font-size: 24px;
  }

  button {
    font-size: 14px;
  }
}
</style>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 

const email = ref('');
const password = ref('');
const userDataList = ref([]); 
const errorMessage = ref('');


const router = useRouter(); 

const loadUserData = () => {
  const storedData = localStorage.getItem('userDataList'); 
  if (storedData) {
    userDataList.value = JSON.parse(storedData);
  }
};


loadUserData();

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
    router.push('/dashboard');  
  } else {
    errorMessage.value = 'Invalid email or password.'; 
  }
};

const goToSignup = () => {
  router.push('/signup');
};
</script>
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" />
      </div>

  
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
      </div>

      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      
      <div class="button-group">
        <button type="submit">Login</button>
        <button type="button" class="signup-button" @click="goToSignup">Sign Up</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
div {
  max-width: 400px;
  margin: 50px auto;
  padding: 1px 70px;
  border-radius: 8px;
  background: #92adac;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
  padding: 10px ;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
</style>

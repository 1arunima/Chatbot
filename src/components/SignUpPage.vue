<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const username = ref('');
const password = ref('');
const userDataList = ref([]);
const errorMessage = ref('');
const router = useRouter();
const isUserExists = ref(false); 

const loadUserData = () => {
  const storedData = localStorage.getItem('userDataList');
  if (storedData) {
    userDataList.value = JSON.parse(storedData);
  }
};
onMounted(()=>{
  loadUserData()
})


console.log(loadUserData);


const handleSignup = () => {

  if (!name.value || !username.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }


  const normalizedUsername = username.value.trim().toLowerCase();

  const isUsernameTaken = userDataList.value.some(
    (user) => user.username.toLowerCase() === normalizedUsername
    
  );

  if (isUsernameTaken) {
    isUserExists.value = true; 
    errorMessage.value = 'Username already exists.';
    return;
  }

  // Create new user data
  const newUserData = {
    name: name.value.trim(),
    username: normalizedUsername,
    password: password.value.trim(),
  };

  userDataList.value.push(newUserData);
  localStorage.setItem('userDataList', JSON.stringify(userDataList.value));


  name.value = '';
  username.value = '';
  password.value = '';
  errorMessage.value = '';

  alert('User registered successfully!');
  router.push('/'); 
};

const handleLoginRedirect = () => {
  router.push('/')  ; 
};
</script>

<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      <!-- Name Field -->
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" placeholder="Enter your full name" />
      </div>

      <!-- Username Field -->
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" placeholder="Enter your username" />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Submit Button or Login Button -->
      <button v-if="!isUserExists" type="submit" class="signup-button">Sign Up</button>
      <button v-else type="button" @click="handleLoginRedirect" class="signup-button">Login</button>
    </form>
  </div>
</template>

<style scoped>
.signup-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px 30px;
  border-radius: 8px;
  background: #92adac;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 290px;
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
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Button styling */
.signup-button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.signup-button:hover {
  background-color: #45a049;
}

/* Responsive design */
@media (max-width: 500px) {
  .signup-container {
    padding: 15px;
  }

  h1 {
    font-size: 24px;
  }

  .signup-button {
    font-size: 14px;
  }
}
</style>

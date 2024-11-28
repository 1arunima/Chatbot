<script setup>
import { reactive } from 'vue';
import router from '../Router';

const formData = reactive({
  email: '',
  password: '',
});

const handleLogin = () => {
  // Check if all fields are filled
  if (!formData.email || !formData.password) {
    alert('Please fill in all fields.');
    return;
  }
  
  // Proceed with login logic
  console.log('Login details:', formData);
  alert('Login successful!');
};

const handleSignup = () => {
  console.log('Navigating to signup...');
  alert('Redirecting to Signup...');
  router.push('/signup'); // Navigate to signup page
};
</script>
<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="form">
      <!-- Username (Email) Field -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          placeholder="Enter your email"
          required
        />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Enter your password"
          required
        />
      </div>

      <!-- Buttons -->
      <div class="buttons">
        <button type="submit" class="btn login-btn">Login</button>
        <button type="button" class="btn signup-btn" @click="handleSignup">Signup</button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  max-width: 400px;
  margin: 50px auto;
  padding: 50px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .btn {
      flex: 1;
      padding: 10px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;

      &:hover {
        background-color: #45a049;
      }
    }

    .signup-btn {
      background-color: #007bff;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>

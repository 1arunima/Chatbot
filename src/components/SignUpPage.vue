<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { defineEmits } from 'vue';

const router = useRouter()
const emit=defineEmits()

const formData = reactive({
  username: '',
  password: '',
});

const handleSignup = () => {
  console.log('User data:', formData);
  emit('signup',formData)

 router.replace('/login')

 
};
</script>





<template>
  <div class="signup-container">
    <h1>Signup</h1>
    <form @submit.prevent="handleSignup">
      <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="enter your name" required/>
        <label for="username">Username</label>
        <input
          type="email"
          id="username"
          v-model="formData.username"
          placeholder="Enter your email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" class="btn" >Signup <LoginPage/></button>
    </form>
  </div>
</template>


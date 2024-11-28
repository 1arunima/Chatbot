<script setup>
 import { RouterLink, RouterView } from 'vue-router';
 import { ref } from 'vue';
import SignUpPage from './components/SignUpPage.vue';

 const userData =ref(null)

 const handleSignup =(data)=>{
   userData.value= data
   console.log('receved', userData);
   
 }
</script>

<template>
  <div>
    <Signup @signup="handleSignup" />  <!-- Listen for 'signup' event -->

    <div v-if="userData">
      <p>Username: {{ userData.username }}</p>
      <p>Password: {{ userData.password }}</p>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const userDataList = ref([]);
const errorMessage = ref('');
const passwordVisible =ref(false)
const router = useRouter();

// Email validation rules
const emailRules = [
  (v) => !!v || 'Email is required.',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid.',
  (v) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v) || 'Only Gmail addresses are allowed.',
];



const togglePasswordVisibility = ()=>{
  passwordVisible.value=!passwordVisible.value
}
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
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    router.push('/chat');
  } else {
    errorMessage.value = 'Invalid email or password.';
  }
};


const goToSignup = () => { 
  router.push('/signup');
};
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height:100vh">
    <v-sheet class="pa-6 fixed-size">
      <v-card class="mx-auto px-4 py-6" max-width="400">
        <v-form v-model="formValid" @submit.prevent="handleLogin">
          
          <!-- Email Field -->
          <v-text-field
            v-model="email"
            label="Email"
            :rules="emailRules"
            class="mb-4"
          ></v-text-field>

          <!-- Password Field -->
          <v-text-field
            v-model="password"
            label="Password"
            :type="passwordVisible ? 'text' : 'password'"
            :rules="[v => !!v || 'Password is required']"
            append-inner-icon = "mdi-eye"
            @click:append="togglePasswordVisibility"
            class="mb-4"
          ></v-text-field>

          <!-- Error message  -->
          <div v-if="errorMessage" class="error-message mt-2">
            <v-alert type="error" dense>{{ errorMessage }}</v-alert>
          </div>

          <!-- Buttons -->
          <v-btn type="submit" color="primary" block class="mt-4">
            Login
          </v-btn>
          <v-btn type="button" color="secondary" block class="mt-2" @click="goToSignup">
            SignUp
          </v-btn>
        </v-form>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.fixed-size {
  width: 400px;
  max-width: 100%;
  height: auto;
  /* border-radius: 0px; */
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); */
}

.error-message {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

/* .v-input_append-inner{
  padding-right: 12px;
}

.v-input__append-inner .mdi-eye {
  font-size: 1.2rem; /* Adjust the icon size */

</style>
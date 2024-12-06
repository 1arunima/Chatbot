<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// Data bindings
const name = ref('');
const email = ref('');
const password = ref('');
const userDataList = ref([]);
const errorMessage = ref('');
const isUserExists = ref(false); 
const passwordVisible = ref(false);
const router = useRouter();

// Email validation rules
const emailRules = [
  (v) => !!v || 'Email is required.',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid.',
  (v) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v) || 'Only Gmail addresses are allowed.',
];

// Load user data from localStorage
const loadUserData = () => {
  const storedData = localStorage.getItem('userDataList');
  if (storedData) {
    userDataList.value = JSON.parse(storedData);
  }
};

const generateUniqueId = () => {
  return Date.now();
};

// Lifecycle hook
onMounted(() => {
  loadUserData();
});

// Signup handler
const handleSignup = () => {
  // Check required fields
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }

  // Validate email using emailRules
  for (const rule of emailRules) {
    const validationResult = rule(email.value);
    if (validationResult !== true) {
      errorMessage.value = validationResult;
      return;
    }
  }

  const normalizedEmail = email.value.trim().toLowerCase();
  const isEmailTaken = userDataList.value.some((user) => user.username.toLowerCase() === normalizedEmail);

  if (isEmailTaken) {
    isUserExists.value = true;
    errorMessage.value = 'Email already exists.';
    return;
  }

  // Create new user data
  const newUserData = {
    id: generateUniqueId(),
    name: name.value.trim(),
    username: normalizedEmail,
    password: password.value.trim(),
  };

  userDataList.value.push(newUserData);
  localStorage.setItem('userDataList', JSON.stringify(userDataList.value));

  name.value = '';
  email.value = '';
  password.value = '';
  errorMessage.value = '';

  alert('User registered successfully!');
  router.push('/');
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// Redirect to login page
const goToSignup = () => {
  router.push('/login');
};
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-sheet class="pa-6" elevation="4" max-width="400px">
      <v-card class="mx-auto px-4 py-6" max-width="400">
        <!-- Signup Form -->
        <form @submit.prevent="handleSignup">

          <!-- Name Field -->
          <v-text-field
            v-model="name"
            label="Full Name"
            :rules="[v => !!v || 'Name is required']"
            class="mb-4"
          ></v-text-field>

          <!-- Email Field -->
          <v-text-field
            v-model="email"
            label="Email (Gmail)"
            class="mb-4"
            :rules="emailRules"
            type="email"
          ></v-text-field>

          <!-- Password Field -->
          <v-text-field 
            v-model="password"
            label="Password"
            :type="passwordVisible ? 'text' : 'password'"
            :rules="[v => !!v || 'Password is required']"
            append-inner-icon="mdi-eye"
            @click:append-inner="togglePasswordVisibility"
            class="mb-4"
          ></v-text-field>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message mt-2">
            <v-alert type="error" dense>{{ errorMessage }}</v-alert>
          </div>

          <!-- Submit Button -->
          <v-btn type="submit" color="primary" block class="mt-4">
            Sign Up
          </v-btn>

          <!-- Redirect to Login -->
          <v-btn type="button" color="secondary" block class="mt-2" @click="goToSignup">
            Already have an account? Login
          </v-btn>
        </form>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>

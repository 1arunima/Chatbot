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
const passwordVisible =ref(false)
const router = useRouter();

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
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailPattern.test(email.value.trim())) {
    errorMessage.value = 'Please enter a valid Gmail address.';
    return;
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
           <!-- Email field -->

           <v-text-field
            v-model="email"
            label="Email (Gmail)"
            :rules="[v => !!v || 'Email is required']"
            class="mb-4"
            type="email"
          ></v-text-field>

            <!-- Password -->

            <v-text-field 
            v-model="password"
            label="password"
           :type="passwordVisible ? 'text' : 'password'"
           :rules="[v => !!v || 'Password is required']"
            append-inner-icon="mdi-eye"
            @click:append-inner="togglePasswordVisibility"
           class="mb-4"
            >  </v-text-field>

        <!-- error message -->

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

<!-- 
<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignup">
      < Name Field -->
      <!-- <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" placeholder="Enter your full name" />
      </div> -->

      <!-- Username Field (Email) -->
      <!-- <div class="form-group">
        <label for="username">Username </label>
        <input type="text" id="username" v-model="username" placeholder="Enter your Gmail address" />
      </div> -->

      <!-- Password Field -->
      <!-- <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" />
      </div> -->

      <!-- Error Message -->
      <!-- <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> -->

      <!-- Submit Button or Login Button -->
      <!-- <button v-if="!isUserExists" type="submit" class="signup-button">Sign Up</button>
      <button v-else type="button" @click="handleLoginRedirect" class="signup-button">Login</button>
    </form>
  </div>
</template>  -->

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

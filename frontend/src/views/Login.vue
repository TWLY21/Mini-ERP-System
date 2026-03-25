<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);

const submit = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    await authStore.login(form);
    router.push({ name: "dashboard" });
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Unable to log in with those credentials.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="login-shell">
    <section class="login-card">
      <p class="login-eyebrow">Mini ERP System</p>
      <h1>Sign in</h1>
      <p class="muted">
        Use your company account to access users, departments, and tasks.
      </p>

      <form class="form-grid" @submit.prevent="submit">
        <label>
          <span>Email</span>
          <input v-model="form.email" class="input" type="email" required />
        </label>

        <label>
          <span>Password</span>
          <input
            v-model="form.password"
            class="input"
            type="password"
            required
          />
        </label>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button class="button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Signing in..." : "Login" }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.login-card {
  width: min(460px, 100%);
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.login-eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: var(--primary);
}

.error-text {
  margin: 0;
  color: var(--danger);
}
</style>

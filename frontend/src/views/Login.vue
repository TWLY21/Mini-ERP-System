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
    if (!error.response) {
      errorMessage.value =
        "Backend unavailable. Make sure the API is running on http://localhost:5000.";
    } else if (error.response.status === 401) {
      errorMessage.value = "Invalid email or password.";
    } else {
      errorMessage.value =
        error.response?.data?.message || "Unable to log in right now.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="login-shell">
    <section class="login-card">
      <div class="login-copy">
        <p class="login-eyebrow">Mini ERP System</p>
        <h1>Sign in</h1>
        <p class="muted">
          Use your company account to access users, departments, and tasks.
        </p>
      </div>

      <form class="form-grid" @submit.prevent="submit">
        <label class="form-field">
          <span class="field-label">Email</span>
          <input v-model="form.email" class="input" type="email" required />
        </label>

        <label class="form-field">
          <span class="field-label">Password</span>
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
  background:
    radial-gradient(circle at top left, rgba(11, 107, 203, 0.12), transparent 30%),
    linear-gradient(180deg, #f4f7fb 0%, #edf2f9 100%);
}

.login-card {
  width: min(460px, 100%);
  padding: 2.1rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(201, 212, 226, 0.82);
  box-shadow: var(--shadow);
}

.login-copy {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
}

.login-copy h1 {
  margin: 0;
  font-size: 2rem;
}

.login-eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: var(--primary);
  font-weight: 700;
}

.error-text {
  margin: 0;
  color: var(--danger);
}

@media (max-width: 640px) {
  .login-card {
    padding: 1.35rem;
    border-radius: 18px;
  }

  .login-copy h1 {
    font-size: 1.65rem;
  }
}
</style>

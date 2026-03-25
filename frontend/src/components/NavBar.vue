<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const router = useRouter();
const authStore = useAuthStore();

const links = computed(() => {
  const role = authStore.user?.role;

  return [
    { label: "Dashboard", name: "dashboard", visible: true },
    { label: "Users", name: "users", visible: role === "admin" },
    {
      label: "Departments",
      name: "departments",
      visible: role === "admin" || role === "manager",
    },
    { label: "Tasks", name: "tasks", visible: true },
  ].filter((link) => link.visible);
});

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <p class="brand-eyebrow">Enterprise Suite</p>
      <h1>Mini ERP</h1>
      <p class="muted">Internal operations dashboard</p>
    </div>

    <nav class="nav-list">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="nav-link"
        active-class="nav-link-active"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="profile">
      <strong>{{ authStore.user?.name }}</strong>
      <span class="tag">{{ authStore.user?.role }}</span>
      <button class="button secondary" @click="logout">Logout</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, #0d223f 0%, #16345e 100%);
  color: #fff;
}

.brand h1 {
  margin: 0.2rem 0;
}

.brand-eyebrow {
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.nav-list {
  display: grid;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.8rem 0.9rem;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.06);
}

.nav-link-active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.profile {
  display: grid;
  gap: 0.7rem;
}

@media (max-width: 900px) {
  .sidebar {
    padding: 1rem;
  }
}
</style>

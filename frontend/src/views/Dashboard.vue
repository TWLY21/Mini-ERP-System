<script setup>
import { computed, onMounted, ref } from "vue";

import { fetchDepartments } from "../api/departments";
import { fetchTasks } from "../api/tasks";
import { fetchUsers } from "../api/users";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();

const users = ref([]);
const departments = ref([]);
const tasks = ref([]);
const loading = ref(true);

const stats = computed(() => [
  { label: "Users", value: users.value.length },
  { label: "Departments", value: departments.value.length },
  { label: "Tasks", value: tasks.value.length },
]);

const loadDashboard = async () => {
  loading.value = true;

  try {
    const requests = [fetchDepartments(), fetchTasks()];

    if (authStore.user?.role === "admin") {
      requests.unshift(fetchUsers());
    }

    const results = await Promise.all(requests);
    users.value = authStore.user?.role === "admin" ? results[0] : [];
    departments.value = results[authStore.user?.role === "admin" ? 1 : 0];
    tasks.value = results[authStore.user?.role === "admin" ? 2 : 1];
  } finally {
    loading.value = false;
  }
};

onMounted(loadDashboard);
</script>

<template>
  <div class="page">
    <section class="card">
      <h2 class="section-title">Welcome back, {{ authStore.user?.name }}</h2>
      <p class="muted">
        You are signed in as <strong>{{ authStore.user?.role }}</strong>. This dashboard
        is intentionally lightweight and ready for feature growth.
      </p>
    </section>

    <section class="grid-cards">
      <article v-for="stat in stats" :key="stat.label" class="card">
        <div class="muted">{{ stat.label }}</div>
        <div class="stat-value">{{ loading ? "..." : stat.value }}</div>
      </article>
    </section>

    <section class="card">
      <h2 class="section-title">Next Steps</h2>
      <p class="muted">
        Add validation, pagination, reporting, audit logs, and richer dashboard charts once
        the base workflow is stable.
      </p>
    </section>
  </div>
</template>

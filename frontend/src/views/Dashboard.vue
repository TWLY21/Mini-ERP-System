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
      <div class="page-header">
        <div class="page-title-block">
          <h2 class="page-title">Welcome back, {{ authStore.user?.name }}</h2>
          <p class="page-subtitle">
            You are signed in as <strong>{{ authStore.user?.role }}</strong>. This dashboard
            keeps the most important activity visible without adding clutter.
          </p>
        </div>
        <span class="tag">{{ authStore.user?.role }}</span>
      </div>
    </section>

    <section class="grid-cards">
      <article v-for="stat in stats" :key="stat.label" class="card stat-card">
        <div class="muted">{{ stat.label }}</div>
        <div class="stat-value">{{ loading ? "..." : stat.value }}</div>
      </article>
    </section>

    <section class="info-grid">
      <article class="card">
        <div class="section-head">
          <div class="section-copy">
            <h2 class="section-title">Workspace Snapshot</h2>
            <p class="section-caption">A quick summary of how the core modules are shaping up.</p>
          </div>
        </div>

        <div class="metric-row">
          <span class="muted">Visible users</span>
          <strong>{{ loading ? "..." : users.length }}</strong>
        </div>
        <div class="metric-row">
          <span class="muted">Active departments</span>
          <strong>{{ loading ? "..." : departments.length }}</strong>
        </div>
        <div class="metric-row">
          <span class="muted">Tracked tasks</span>
          <strong>{{ loading ? "..." : tasks.length }}</strong>
        </div>
      </article>

      <article class="card">
        <div class="section-head">
          <div class="section-copy">
            <h2 class="section-title">Suggested Next Steps</h2>
            <p class="section-caption">Good additions once the base workflow is stable.</p>
          </div>
        </div>

        <ul class="info-list">
          <li>Add validation and better error handling for every form.</li>
          <li>Introduce pagination and filters for larger user and task datasets.</li>
          <li>Layer in audit logs and simple analytics for internal reporting.</li>
        </ul>
      </article>
    </section>
  </div>
</template>

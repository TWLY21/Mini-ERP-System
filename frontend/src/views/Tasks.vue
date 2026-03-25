<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import { fetchEmployees } from "../api/users";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  updateTaskStatus,
} from "../api/tasks";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();
const tasks = ref([]);
const employees = ref([]);
const editingId = ref(null);
const errorMessage = ref("");

const form = reactive({
  title: "",
  description: "",
  assignedTo: "",
  status: "pending",
});

const canManageTasks = computed(() =>
  ["admin", "manager"].includes(authStore.user?.role)
);

const resetForm = () => {
  editingId.value = null;
  form.title = "";
  form.description = "";
  form.assignedTo = "";
  form.status = "pending";
};

const loadData = async () => {
  tasks.value = await fetchTasks();

  if (canManageTasks.value) {
    employees.value = await fetchEmployees();
  } else {
    employees.value = [];
  }
};

const submit = async () => {
  errorMessage.value = "";

  try {
    const payload = {
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo ? Number(form.assignedTo) : null,
      status: form.status,
    };

    if (editingId.value) {
      await updateTask(editingId.value, payload);
    } else {
      await createTask(payload);
    }

    resetForm();
    await loadData();
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Unable to save the task.";
  }
};

const startEdit = (task) => {
  editingId.value = task.id;
  form.title = task.title;
  form.description = task.description;
  form.assignedTo = task.assigned_to || "";
  form.status = task.status;
};

const remove = async (id) => {
  await deleteTask(id);
  await loadData();
};

const handleStatusUpdate = async (task, status) => {
  await updateTaskStatus(task.id, { status });
  await loadData();
};

onMounted(loadData);
</script>

<template>
  <div class="page">
    <section v-if="canManageTasks" class="card">
      <h2 class="section-title">Task Management</h2>
      <form class="form-grid" @submit.prevent="submit">
        <label>
          <span>Title</span>
          <input v-model="form.title" class="input" required />
        </label>
        <label>
          <span>Assign to employee</span>
          <select v-model="form.assignedTo" class="select">
            <option value="">Unassigned</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.name }}
            </option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select v-model="form.status" class="select">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label style="grid-column: 1 / -1">
          <span>Description</span>
          <textarea v-model="form.description" class="textarea" />
        </label>

        <div class="form-actions">
          <button class="button" type="submit">
            {{ editingId ? "Update Task" : "Create Task" }}
          </button>
          <button class="button secondary" type="button" @click="resetForm">
            Clear
          </button>
        </div>

        <p v-if="errorMessage" class="muted">{{ errorMessage }}</p>
      </form>
    </section>

    <section class="card">
      <h2 class="section-title">Tasks</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.title }}</td>
              <td>{{ task.assigned_to_name || "Unassigned" }}</td>
              <td><span class="tag">{{ task.status }}</span></td>
              <td>{{ task.description || "-" }}</td>
              <td>
                <div class="row-actions" v-if="canManageTasks">
                  <button class="button secondary" @click="startEdit(task)">Edit</button>
                  <button class="button danger" @click="remove(task.id)">Delete</button>
                </div>
                <div class="row-actions" v-else>
                  <button
                    class="button success"
                    @click="handleStatusUpdate(task, 'in_progress')"
                  >
                    Start
                  </button>
                  <button
                    class="button secondary"
                    @click="handleStatusUpdate(task, 'completed')"
                  >
                    Complete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

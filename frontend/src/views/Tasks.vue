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
      <div class="section-head">
        <div class="section-copy">
          <h2 class="section-title">Task Management</h2>
          <p class="section-caption">
            Create and assign work with a form layout that stays tidy on every screen size.
          </p>
        </div>
      </div>

      <form class="form-grid" @submit.prevent="submit">
        <label class="form-field">
          <span class="field-label">Title</span>
          <input v-model="form.title" class="input" required />
        </label>
        <label class="form-field">
          <span class="field-label">Assign to employee</span>
          <select v-model="form.assignedTo" class="select">
            <option value="">Unassigned</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.name }}
            </option>
          </select>
        </label>
        <label class="form-field">
          <span class="field-label">Status</span>
          <select v-model="form.status" class="select">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label class="form-field" style="grid-column: 1 / -1">
          <span class="field-label">Description</span>
          <textarea v-model="form.description" class="textarea" />
        </label>

        <div class="form-actions equal-actions">
          <button class="button" type="submit">
            {{ editingId ? "Update Task" : "Create Task" }}
          </button>
          <button class="button ghost" type="button" @click="resetForm">
            Clear
          </button>
        </div>

        <p v-if="errorMessage" class="section-caption">{{ errorMessage }}</p>
      </form>
    </section>

    <section class="card">
      <div class="section-head">
        <div class="section-copy">
          <h2 class="section-title">Tasks</h2>
          <p class="section-caption">
            Review ownership, status, and descriptions in a cleaner table that also works on mobile.
          </p>
        </div>
      </div>

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
              <td data-label="Title">{{ task.title }}</td>
              <td data-label="Assigned To">{{ task.assigned_to_name || "Unassigned" }}</td>
              <td data-label="Status"><span class="tag">{{ task.status }}</span></td>
              <td data-label="Description">{{ task.description || "-" }}</td>
              <td data-label="Actions">
                <div class="row-actions" v-if="canManageTasks">
                  <button class="button secondary small" @click="startEdit(task)">Edit</button>
                  <button class="button danger small" @click="remove(task.id)">Delete</button>
                </div>
                <div class="row-actions" v-else>
                  <button
                    class="button success small"
                    @click="handleStatusUpdate(task, 'in_progress')"
                  >
                    Start
                  </button>
                  <button
                    class="button secondary small"
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

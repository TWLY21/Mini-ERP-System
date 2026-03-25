<script setup>
import { onMounted, reactive, ref } from "vue";

import { fetchDepartments } from "../api/departments";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../api/users";

const users = ref([]);
const departments = ref([]);
const errorMessage = ref("");
const editingId = ref(null);

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "employee",
  departmentId: "",
});

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.password = "";
  form.role = "employee";
  form.departmentId = "";
  editingId.value = null;
};

const loadData = async () => {
  const [userData, departmentData] = await Promise.all([
    fetchUsers(),
    fetchDepartments(),
  ]);

  users.value = userData;
  departments.value = departmentData;
};

const submit = async () => {
  errorMessage.value = "";

  const payload = {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
    departmentId: form.departmentId ? Number(form.departmentId) : null,
  };

  try {
    if (editingId.value) {
      await updateUser(editingId.value, payload);
    } else {
      await createUser(payload);
    }

    resetForm();
    await loadData();
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Unable to save the user.";
  }
};

const startEdit = (user) => {
  editingId.value = user.id;
  form.name = user.name;
  form.email = user.email;
  form.password = "";
  form.role = user.role;
  form.departmentId = user.department_id || "";
};

const remove = async (id) => {
  await deleteUser(id);
  await loadData();
};

onMounted(loadData);
</script>

<template>
  <div class="page">
    <section class="card">
      <h2 class="section-title">User Management</h2>
      <form class="form-grid" @submit.prevent="submit">
        <label>
          <span>Name</span>
          <input v-model="form.name" class="input" required />
        </label>
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
            :required="!editingId"
            placeholder="Only fill to set or change password"
          />
        </label>
        <label>
          <span>Role</span>
          <select v-model="form.role" class="select">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </label>
        <label>
          <span>Department</span>
          <select v-model="form.departmentId" class="select">
            <option value="">Unassigned</option>
            <option
              v-for="department in departments"
              :key="department.id"
              :value="department.id"
            >
              {{ department.name }}
            </option>
          </select>
        </label>

        <div class="form-actions">
          <button class="button" type="submit">
            {{ editingId ? "Update User" : "Create User" }}
          </button>
          <button class="button secondary" type="button" @click="resetForm">
            Clear
          </button>
        </div>

        <p v-if="errorMessage" class="muted">{{ errorMessage }}</p>
      </form>
    </section>

    <section class="card">
      <h2 class="section-title">Users</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span class="tag">{{ user.role }}</span></td>
              <td>{{ user.department_name || "Unassigned" }}</td>
              <td>
                <div class="row-actions">
                  <button class="button secondary" @click="startEdit(user)">Edit</button>
                  <button class="button danger" @click="remove(user.id)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

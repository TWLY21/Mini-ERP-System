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
      <div class="section-head">
        <div class="section-copy">
          <h2 class="section-title">User Management</h2>
          <p class="section-caption">
            Create employee accounts, assign roles, and keep department placement clear.
          </p>
        </div>
      </div>

      <form class="form-grid" @submit.prevent="submit">
        <label class="form-field">
          <span class="field-label">Name</span>
          <input v-model="form.name" class="input" required />
        </label>
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
            :required="!editingId"
            :placeholder="editingId ? 'Enter a new password' : 'Enter password'"
          />
          <p class="field-hint">
            {{
              editingId
                ? "Leave this blank to keep the current password unchanged."
                : "Set an initial password for the new user account."
            }}
          </p>
        </label>
        <label class="form-field">
          <span class="field-label">Role</span>
          <select v-model="form.role" class="select">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </label>
        <label class="form-field">
          <span class="field-label">Department</span>
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

        <div class="form-actions equal-actions">
          <button class="button" type="submit">
            {{ editingId ? "Update User" : "Create User" }}
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
          <h2 class="section-title">Users</h2>
          <p class="section-caption">
            A clean view of team members, role assignments, and current department ownership.
          </p>
        </div>
      </div>

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
              <td data-label="Name">{{ user.name }}</td>
              <td data-label="Email">{{ user.email }}</td>
              <td data-label="Role"><span class="tag">{{ user.role }}</span></td>
              <td data-label="Department">{{ user.department_name || "Unassigned" }}</td>
              <td data-label="Actions">
                <div class="row-actions">
                  <button class="button secondary small" @click="startEdit(user)">Edit</button>
                  <button class="button danger small" @click="remove(user.id)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

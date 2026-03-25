<script setup>
import { onMounted, reactive, ref } from "vue";

import {
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  updateDepartment,
} from "../api/departments";

const departments = ref([]);
const editingId = ref(null);
const form = reactive({ name: "" });

const loadDepartments = async () => {
  departments.value = await fetchDepartments();
};

const resetForm = () => {
  editingId.value = null;
  form.name = "";
};

const submit = async () => {
  if (editingId.value) {
    await updateDepartment(editingId.value, { name: form.name });
  } else {
    await createDepartment({ name: form.name });
  }

  resetForm();
  await loadDepartments();
};

const startEdit = (department) => {
  editingId.value = department.id;
  form.name = department.name;
};

const remove = async (id) => {
  await deleteDepartment(id);
  await loadDepartments();
};

onMounted(loadDepartments);
</script>

<template>
  <div class="page">
    <section class="card">
      <div class="section-head">
        <div class="section-copy">
          <h2 class="section-title">Department Management</h2>
          <p class="section-caption">
            Keep organizational units consistent and easy to browse across the system.
          </p>
        </div>
      </div>

      <form class="form-grid" @submit.prevent="submit">
        <label class="form-field">
          <span class="field-label">Department name</span>
          <input v-model="form.name" class="input" required />
        </label>

        <div class="form-actions equal-actions">
          <button class="button" type="submit">
            {{ editingId ? "Update Department" : "Create Department" }}
          </button>
          <button class="button ghost" type="button" @click="resetForm">
            Clear
          </button>
        </div>
      </form>
    </section>

    <section class="card">
      <div class="section-head">
        <div class="section-copy">
          <h2 class="section-title">Departments</h2>
          <p class="section-caption">
            Review the current structure and update team naming without losing alignment.
          </p>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.id">
              <td data-label="Name">{{ department.name }}</td>
              <td data-label="Created At">
                {{ new Date(department.created_at).toLocaleString() }}
              </td>
              <td data-label="Actions">
                <div class="row-actions">
                  <button class="button secondary small" @click="startEdit(department)">
                    Edit
                  </button>
                  <button class="button danger small" @click="remove(department.id)">
                    Delete
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

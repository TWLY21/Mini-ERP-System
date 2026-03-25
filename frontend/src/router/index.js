import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../store/auth";
import DashboardView from "../views/Dashboard.vue";
import DepartmentsView from "../views/Departments.vue";
import LoginView from "../views/Login.vue";
import TasksView from "../views/Tasks.vue";
import UsersView from "../views/Users.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { public: true },
  },
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
    meta: { roles: ["admin", "manager", "employee"] },
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
    meta: { roles: ["admin"] },
  },
  {
    path: "/departments",
    name: "departments",
    component: DepartmentsView,
    meta: { roles: ["admin", "manager"] },
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TasksView,
    meta: { roles: ["admin", "manager", "employee"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  authStore.bootstrap();

  if (to.meta.public) {
    return authStore.isAuthenticated ? { name: "dashboard" } : true;
  }

  if (!authStore.isAuthenticated) {
    return { name: "login" };
  }

  const allowedRoles = to.meta.roles || [];
  if (allowedRoles.length && !allowedRoles.includes(authStore.user?.role)) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;

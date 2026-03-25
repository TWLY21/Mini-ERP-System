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
    meta: { public: true, title: "Sign in" },
  },
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
    meta: {
      roles: ["admin", "manager", "employee"],
      title: "Dashboard",
      description: "Review your current activity, team structure, and task progress at a glance.",
    },
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
    meta: {
      roles: ["admin"],
      title: "Users",
      description: "Create accounts, assign roles, and keep employee access organized.",
    },
  },
  {
    path: "/departments",
    name: "departments",
    component: DepartmentsView,
    meta: {
      roles: ["admin", "manager"],
      title: "Departments",
      description: "Manage company departments and keep your team structure consistent.",
    },
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TasksView,
    meta: {
      roles: ["admin", "manager", "employee"],
      title: "Tasks",
      description: "Assign work, review delivery status, and keep daily execution moving.",
    },
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

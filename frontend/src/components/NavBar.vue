<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const roleTitles = {
  admin: "System Admin",
  manager: "Manager Account",
  employee: "Employee Account",
};

const icons = {
  dashboard: {
    viewBox: "0 0 24 24",
    paths: [
      "M4 5.75C4 4.78 4.78 4 5.75 4H10v7H4V5.75Z",
      "M14 4h4.25C19.22 4 20 4.78 20 5.75V9.5h-6V4Z",
      "M4 14h6v6H5.75A1.75 1.75 0 0 1 4 18.25V14Z",
      "M14 12.5h6v5.75c0 .97-.78 1.75-1.75 1.75H14v-7.5Z",
    ],
  },
  users: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z",
      "M5 18.25c0-2.9 3.13-5.25 7-5.25s7 2.35 7 5.25V20H5v-1.75Z",
    ],
  },
  departments: {
    viewBox: "0 0 24 24",
    paths: [
      "M4.75 5h14.5c.41 0 .75.34.75.75v12.5a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.75-.75V5.75c0-.41.34-.75.75-.75Z",
      "M8 9h2v2H8V9Zm6 0h2v2h-2V9Zm-6 4h2v2H8v-2Zm6 0h2v2h-2v-2Z",
    ],
  },
  tasks: {
    viewBox: "0 0 24 24",
    paths: [
      "M7.75 4h8.5c.41 0 .75.34.75.75V6h1.75c.97 0 1.75.78 1.75 1.75v10.5c0 .97-.78 1.75-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V7.75C3.5 6.78 4.28 6 5.25 6H7V4.75c0-.41.34-.75.75-.75Zm.75 2h7V5.5h-7V6Z",
      "m9.53 9.47-4.03 4.03-2-2 .94-.94 1.06 1.06 3.09-3.09.94.94Z",
    ],
  },
  workspace: {
    viewBox: "0 0 24 24",
    paths: [
      "M4.75 4h14.5c.41 0 .75.34.75.75V11H4V4.75c0-.41.34-.75.75-.75Z",
      "M4 13h16v5.25c0 .97-.78 1.75-1.75 1.75H5.75A1.75 1.75 0 0 1 4 18.25V13Z",
    ],
  },
  logout: {
    viewBox: "0 0 24 24",
    paths: [
      "M10 4.75A1.75 1.75 0 0 1 11.75 3h5.5A1.75 1.75 0 0 1 19 4.75v14.5A1.75 1.75 0 0 1 17.25 21h-5.5A1.75 1.75 0 0 1 10 19.25V16h1.5v3.5h6V4.5h-6V8H10V4.75Z",
      "m8.78 8.22 1.06 1.06-1.97 1.97H15v1.5H7.87l1.97 1.97-1.06 1.06L5 12l3.78-3.78Z",
    ],
  },
};

const navGroups = computed(() => {
  const role = authStore.user?.role;

  return [
    {
      heading: "Overview",
      links: [
        {
          label: "Dashboard",
          name: "dashboard",
          hint: "Snapshot of your workspace",
          icon: icons.dashboard,
          visible: true,
        },
      ],
    },
    {
      heading: "Management",
      links: [
        {
          label: "Users",
          name: "users",
          hint: "Create and manage accounts",
          icon: icons.users,
          visible: role === "admin",
        },
        {
          label: "Departments",
          name: "departments",
          hint: "Organize company teams",
          icon: icons.departments,
          visible: role === "admin" || role === "manager",
        },
        {
          label: "Tasks",
          name: "tasks",
          hint: "Track assigned work",
          icon: icons.tasks,
          visible: true,
        },
      ].filter((link) => link.visible),
    },
  ].filter((group) => group.links.length);
});

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};

const closeMenu = () => emit("close");

const activeSection = computed(() => route.meta.title || "Workspace");
const accountTitle = computed(
  () => roleTitles[authStore.user?.role] || "User Account"
);
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': props.isOpen }">
    <div class="brand-panel">
      <div class="brand-top">
        <div class="brand-lockup">
          <div class="brand-mark">
            <svg class="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                v-for="path in icons.workspace.paths"
                :key="path"
                :d="path"
                fill="currentColor"
              />
            </svg>
          </div>

          <div class="brand-copy">
            <p class="brand-eyebrow">Enterprise Suite</p>
            <h1>Mini ERP</h1>
            <p class="brand-description">Internal operations dashboard</p>
          </div>
        </div>

        <button class="close-button" type="button" @click="closeMenu">
          Close
        </button>
      </div>

      <div class="active-badge">
        <span class="active-dot" />
        <span class="active-label">Current area</span>
        <strong>{{ activeSection }}</strong>
      </div>
    </div>

    <nav class="nav-shell" aria-label="Main navigation">
      <section v-for="group in navGroups" :key="group.heading" class="nav-group">
        <p class="nav-heading">{{ group.heading }}</p>
        <div class="nav-list">
          <RouterLink
            v-for="link in group.links"
            :key="link.name"
            :to="{ name: link.name }"
            class="nav-link"
            active-class="nav-link-active"
            @click="closeMenu"
          >
            <span class="nav-icon-wrap">
              <svg class="nav-icon" :viewBox="link.icon.viewBox" aria-hidden="true">
                <path
                  v-for="path in link.icon.paths"
                  :key="path"
                  :d="path"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span class="nav-link-copy">
              <strong>{{ link.label }}</strong>
              <small>{{ link.hint }}</small>
            </span>

            <span class="nav-link-arrow" aria-hidden="true">></span>
          </RouterLink>
        </div>
      </section>
    </nav>

    <div class="profile-card">
      <p class="profile-label">{{ accountTitle }}</p>

      <div class="profile-top">
        <div class="profile-avatar">
          {{ authStore.user?.name?.slice(0, 1) || "U" }}
        </div>

        <div class="profile-copy">
          <strong>{{ authStore.user?.name }}</strong>
          <p>{{ authStore.user?.email }}</p>
        </div>
      </div>

      <div class="profile-actions">
        <span class="tag">{{ authStore.user?.role }}</span>

        <button class="button secondary small logout-button" @click="logout">
          <svg class="logout-icon" :viewBox="icons.logout.viewBox" aria-hidden="true">
            <path
              v-for="path in icons.logout.paths"
              :key="path"
              :d="path"
              fill="currentColor"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.9rem;
  height: 100vh;
  padding: 1rem;
  background: var(--nav-bg);
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.brand-panel {
  display: grid;
  gap: 0.7rem;
  padding: 0.85rem;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.brand-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(127, 209, 255, 0.28), rgba(255, 255, 255, 0.12));
  color: #fff;
}

.brand-icon {
  width: 18px;
  height: 18px;
}

.brand-copy {
  min-width: 0;
}

.brand-copy h1 {
  margin: 0.1rem 0 0.15rem;
  font-size: 1.08rem;
  line-height: 1.15;
}

.brand-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.82rem;
}

.brand-eyebrow {
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.7);
}

.active-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  width: fit-content;
  max-width: 100%;
  padding: 0.5rem 0.68rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.active-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 999px;
  background: #7fd1ff;
  box-shadow: 0 0 0 5px rgba(127, 209, 255, 0.1);
}

.active-label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav-shell {
  display: grid;
  gap: 0.85rem;
  align-content: start;
  overflow-y: auto;
  padding-right: 0.15rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(127, 209, 255, 0.26) rgba(255, 255, 255, 0.05);
}

.nav-shell::-webkit-scrollbar {
  width: 6px;
}

.nav-shell::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
}

.nav-shell::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(127, 209, 255, 0.34), rgba(255, 255, 255, 0.16));
  border-radius: 999px;
}

.nav-shell::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(127, 209, 255, 0.5), rgba(255, 255, 255, 0.2));
}

.nav-group {
  display: grid;
  gap: 0.5rem;
}

.nav-heading {
  margin: 0;
  padding-left: 0.2rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav-list {
  display: grid;
  gap: 0.5rem;
}

.nav-link {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 14px;
  align-items: center;
  column-gap: 0.78rem;
  min-height: 68px;
  padding: 0.82rem 0.88rem;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.82);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03));
  border: 1px solid transparent;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.nav-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 11px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.04));
  color: rgba(255, 255, 255, 0.9);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.nav-icon {
  width: 17px;
  height: 17px;
}

.nav-link-copy {
  display: grid;
  gap: 0.12rem;
  min-width: 0;
}

.nav-link-copy strong {
  font-size: 0.92rem;
  line-height: 1.15;
}

.nav-link-copy small {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.76rem;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 1rem;
  line-height: 1;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.nav-link-active {
  background:
    linear-gradient(180deg, rgba(127, 209, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  box-shadow: 0 10px 20px rgba(6, 17, 34, 0.18);
}

.nav-link-active .nav-icon-wrap {
  background: rgba(127, 209, 255, 0.18);
  color: #fff;
}

.nav-link:hover .nav-icon-wrap,
.nav-link-active .nav-icon-wrap {
  transform: translateY(-1px);
}

.nav-link:hover .nav-link-arrow,
.nav-link-active .nav-link-arrow {
  color: rgba(255, 255, 255, 0.82);
  transform: translateX(2px);
}

.profile-card {
  display: grid;
  gap: 0.65rem;
  padding: 0.8rem 0.85rem;
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.profile-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-top {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.profile-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(127, 209, 255, 0.22), rgba(255, 255, 255, 0.08));
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.profile-copy {
  display: grid;
  gap: 0.1rem;
  min-width: 0;
}

.profile-copy strong {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.2;
}

.profile-copy p {
  margin: 0;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.78rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.profile-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
}

.logout-button {
  gap: 0.42rem;
  min-width: 104px;
}

.logout-icon {
  width: 15px;
  height: 15px;
}

.close-button {
  display: none;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 12px;
  padding: 0.48rem 0.72rem;
}

@media (max-width: 1080px) {
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(320px, 88vw);
    transform: translateX(-100%);
    transition: transform 0.28s ease;
    z-index: 20;
    box-shadow: 0 24px 50px rgba(12, 33, 66, 0.32);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .close-button {
    display: inline-flex;
  }
}

@media (max-width: 640px) {
  .sidebar {
    padding: 0.9rem;
  }

  .brand-top {
    align-items: flex-start;
  }

  .nav-link {
    padding: 0.82rem 0.84rem;
  }

  .profile-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .logout-button {
    width: 100%;
  }
}
</style>

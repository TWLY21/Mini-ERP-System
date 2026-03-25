<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import NavBar from "./NavBar.vue";

const route = useRoute();
const isNavOpen = ref(false);

const pageTitle = computed(() => route.meta.title || "Workspace");
const pageDescription = computed(
  () =>
    route.meta.description ||
    "Manage day-to-day operations from one clean, connected workspace."
);

watch(
  () => route.fullPath,
  () => {
    isNavOpen.value = false;
  }
);
</script>

<template>
  <div class="layout-shell">
    <div
      class="layout-overlay"
      :class="{ 'layout-overlay-visible': isNavOpen }"
      @click="isNavOpen = false"
    />

    <NavBar :is-open="isNavOpen" @close="isNavOpen = false" />

    <main class="layout-main">
      <header class="topbar">
        <button class="menu-button" type="button" @click="isNavOpen = true">
          <span class="menu-button-lines" />
          <span class="menu-button-lines" />
          <span class="menu-button-lines" />
          <span class="sr-only">Open navigation</span>
        </button>

        <div class="topbar-copy">
          <p class="topbar-kicker">Workspace</p>
          <h1>{{ pageTitle }}</h1>
          <p>{{ pageDescription }}</p>
        </div>
      </header>

      <div class="content-frame">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
}

.layout-main {
  position: relative;
  padding: 1.5rem;
}

.content-frame {
  max-width: 1320px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  max-width: 1320px;
  margin: 0 auto 1.5rem;
  padding: 0.25rem 0;
}

.topbar-copy {
  display: grid;
  gap: 0.3rem;
}

.topbar-copy h1 {
  margin: 0;
  font-size: clamp(1.6rem, 2vw, 2.15rem);
}

.topbar-copy p {
  margin: 0;
  color: var(--text-muted);
  max-width: 780px;
}

.topbar-kicker {
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  font-weight: 700;
}

.menu-button {
  display: none;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.28rem;
  border: 1px solid rgba(201, 212, 226, 0.8);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-soft);
}

.menu-button-lines {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: #17345e;
}

.layout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 18, 35, 0.42);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  z-index: 19;
}

.layout-overlay-visible {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 1080px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-main {
    padding: 1rem;
  }

  .topbar {
    margin-bottom: 1rem;
  }

  .menu-button {
    display: inline-flex;
  }
}

@media (max-width: 640px) {
  .topbar {
    gap: 0.85rem;
  }

  .topbar-copy h1 {
    font-size: 1.45rem;
  }

  .topbar-copy p {
    font-size: 0.95rem;
  }
}
</style>

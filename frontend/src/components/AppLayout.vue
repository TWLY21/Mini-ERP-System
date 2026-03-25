<script setup>
import NavBar from "./NavBar.vue";
</script>

<template>
  <div class="layout-shell">
    <NavBar />
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
}

.layout-main {
  padding: 2rem;
}

@media (max-width: 900px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-main {
    padding: 1rem;
  }
}
</style>

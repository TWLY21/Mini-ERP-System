<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

import AppLayout from "./components/AppLayout.vue";

const route = useRoute();
const isPublicRoute = computed(() => route.meta.public);
</script>

<template>
  <AppLayout v-if="!isPublicRoute">
    <RouterView />
  </AppLayout>
  <RouterView v-else />
</template>

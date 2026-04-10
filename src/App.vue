<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import ToastHub  from './components/ToastHub.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-deep">
    <TheHeader />
    <RouterView />
    <TheFooter />
    <ToastHub />
  </div>
</template>

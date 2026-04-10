<script setup lang="ts">
withDefaults(defineProps<{
  hot?:     boolean
  padding?: string
}>(), {
  hot:     false,
  padding: 'p-6',
})
</script>

<template>
  <div
    class="relative bg-bg-card border transition-all duration-300"
    :class="[
      hot ? 'border-orange bg-bg-card2' : 'border-orange/18 hover:border-orange/38',
      padding,
    ]"
  >
    <div
      class="absolute top-0 right-0 w-0 h-0 pointer-events-none"
      style="border-top: 12px solid var(--color-orange); border-left: 12px solid transparent"
    />
    <slot />
  </div>
</template>

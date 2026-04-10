<script setup lang="ts">
defineProps<{
  id:     string
  code:   string
  copied: string
}>()

defineEmits<{
  copy: [id: string, code: string]
}>()
</script>

<template>
  <div class="relative">
    <pre
      class="bg-bg-deep border border-white/10 p-4 overflow-x-auto
             font-mono-tech text-[11px] text-cream-dim leading-[1.75] rounded-none"
    >{{ code }}</pre>
    <button
      class="absolute top-2.5 right-2.5 font-mono-tech text-[8px] tracking-[.15em] uppercase
             px-2.5 py-1 border cursor-pointer bg-transparent transition-all"
      :class="copied === id
        ? 'border-health text-health'
        : 'border-white/15 text-tan hover:border-orange/40 hover:text-cream'"
      @click="$emit('copy', id, code)"
    >{{ copied === id ? '✓ Copied' : 'Copy' }}</button>
  </div>
</template>

<style scoped>
pre { tab-size: 2; }
</style>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  score: number
  size?: number
}>(), { size: 120 })

const r    = computed(() => props.size / 2 - 8)
const circ = computed(() => 2 * Math.PI * r.value)
const dash = computed(() => (props.score / 100) * circ.value)
const gap  = computed(() => circ.value - dash.value)

const color = computed((): string => {
  if (props.score >= 80) return '#4ADE80'
  if (props.score >= 55) return '#F0A050'
  return '#FF2222'
})
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      style="transform: rotate(-90deg)"
    >
      <circle
        :cx="size / 2" :cy="size / 2" :r="r"
        fill="none"
        stroke="rgba(255,255,255,.08)"
        :stroke-width="size < 80 ? 5 : 7"
      />
      <circle
        :cx="size / 2" :cy="size / 2" :r="r"
        fill="none"
        :stroke="color"
        :stroke-width="size < 80 ? 5 : 7"
        stroke-linecap="round"
        :stroke-dasharray="`${dash} ${gap}`"
        style="transition: stroke-dasharray .8s ease"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span
        class="font-rye leading-none"
        :style="{ fontSize: size * 0.28 + 'px', color }"
      >{{ score }}</span>
      <span
        class="font-mono-tech uppercase tracking-[.1em] text-tan"
        :style="{ fontSize: size * 0.075 + 'px' }"
      >score</span>
    </div>
  </div>
</template>

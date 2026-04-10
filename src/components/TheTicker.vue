<script setup lang="ts">
const items = [
  '✦ AI Inspection',
  '◈ Rust Detection',
  '✦ Damage Analysis',
  '◈ Price Intelligence',
  '✦ VIN History',
  '◈ Fleet Management',
  '✦ Body Scan',
  '◈ Defect Mapping',
]
// Duplicate for seamless loop
const doubled = [...items, ...items]
</script>

<template>
  <div
    class="mt-[62px] overflow-hidden
           bg-orange
           border-t border-orange-dim border-b border-orange-dim"
  >
    <div class="flex whitespace-nowrap animate-ticker py-2">
      <span
        v-for="(item, i) in doubled"
        :key="i"
        class="font-mono-tech text-[10px] tracking-[.2em] uppercase
               text-bg-deep px-7 select-none"
      >{{ item }}</span>
    </div>
  </div>
</template>

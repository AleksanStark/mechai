<script setup>
defineProps({
  variant: { type: String, default: 'info' }, // info | warn | crit | ok | neutral
  small:   { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="font-mono-tech uppercase tracking-[.14em] inline-flex items-center gap-1.5"
    :class="[
      small ? 'text-[8px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1',
      {
        'text-cyan   border border-cyan/30'    : variant === 'info',
        'text-amber-w border border-amber-w/30': variant === 'warn',
        'text-hot-red border border-hot-red/30': variant === 'crit',
        'text-health  border border-health/30' : variant === 'ok',
        'text-tan     border border-tan/30'    : variant === 'neutral',
      }
    ]"
  >
    <slot />
  </span>
</template>

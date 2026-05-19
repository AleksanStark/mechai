<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "outline";

const props = defineProps<{
  variant?: Variant;
  type?: "button" | "submit";
  fullWidth?: boolean;
}>();

const classes = computed(() => {
  return [
    "btn",
    "inline-flex items-center justify-center",
    "text-center",

    "whitespace-normal break-words",

    "px-5 py-3 min-h-[44px] text-base leading-snug",

    // variants
    props.variant === "primary" ? "btn-primary" : "btn-outline",

    // width
    props.fullWidth ? "w-full" : "",
  ];
});
</script>

<template>
  <button :type="type ?? 'button'" :class="classes">
    <slot />
  </button>
</template>

<style>
.btn {
  font-family: "Share Tech Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 12px 28px;
  cursor: pointer;
  border: none;

  /* clip-path FIXED (Tailwind-safe still works) */
  clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);

  transition:
    background 0.2s,
    color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
}

.btn-primary {
  background: var(--orange);
  color: var(--bg-deep);
  font-weight: 700;
}

.btn-primary:hover {
  background: var(--amber);
}

.btn-outline {
  background: transparent;
  color: var(--cyan);
  border: 1px solid var(--cyan-dim);
}

.btn-outline:hover {
  background: rgba(0, 217, 255, 0.606);
}
</style>

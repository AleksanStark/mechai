<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "outline";
type Size = "md" | "lg";

const props = defineProps<{
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
  fullWidth?: boolean;
}>();

const classes = computed(() => {
  return [
    "btn",
    props.variant === "primary" ? "btn-primary" : "btn-outline",
    props.size === "lg" ? "btn-lg" : "",
    props.fullWidth ? "w-full justify-center" : "",
  ];
});
</script>

<template>
  <button :type="type ?? 'button'" :class="classes">
    <slot />
  </button>
</template>

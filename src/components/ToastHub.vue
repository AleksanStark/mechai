<script setup lang="ts">
import { useNotifStore } from '../stores/notif'
import type { ToastType } from '../types'

const notif = useNotifStore()

const icons: Record<ToastType, string>  = { ok:'✓', warn:'⚠', error:'✕', info:'◈' }
const colors: Record<ToastType, { border: string; icon: string; bg: string }> = {
  ok:    { border:'border-health',  icon:'text-health',  bg:'bg-health/10'  },
  warn:  { border:'border-amber-w', icon:'text-amber-w', bg:'bg-amber-w/10' },
  error: { border:'border-hot-red', icon:'text-hot-red', bg:'bg-hot-red/10' },
  info:  { border:'border-cyan',    icon:'text-cyan',    bg:'bg-cyan/10'    },
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      style="max-width:360px; width:calc(100vw - 48px)"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in notif.toasts"
          :key="t.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3.5 bg-bg-card border backdrop-blur-sm transition-all duration-300"
          :class="[colors[t.type].border, colors[t.type].bg, t.visible ? 'opacity-100' : 'opacity-0']"
        >
          <div class="flex-shrink-0 w-0.5 self-stretch rounded-full"
               :class="colors[t.type].border.replace('border-', 'bg-')" />
          <span class="flex-shrink-0 font-mono-tech text-sm mt-px" :class="colors[t.type].icon">
            {{ icons[t.type] }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-barlow-cond font-semibold text-cream text-[14px] leading-tight">{{ t.title }}</p>
            <p v-if="t.message" class="font-barlow-body text-xs text-cream-dim mt-0.5 leading-snug">{{ t.message }}</p>
          </div>
          <button
            class="flex-shrink-0 font-mono-tech text-tan hover:text-cream text-xs cursor-pointer bg-transparent border-0 mt-0.5"
            @click="notif.dismiss(t.id)"
          >✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all .3s cubic-bezier(.25,.8,.25,1); }
.toast-leave-active { transition: all .25s ease; }
.toast-enter-from,
.toast-leave-to     { transform: translateX(110%); opacity: 0; }
.toast-move         { transition: transform .3s ease; }
</style>

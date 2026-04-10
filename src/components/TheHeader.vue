<script setup lang="ts">
import { ref }           from 'vue'
import { useRoute }      from 'vue-router'
import { useNotifStore } from '../stores/notif'

interface NavLink { label: string; to: string }

const menuOpen = ref(false)
const userMenu = ref(false)
const route    = useRoute()
const notif    = useNotifStore()

const navLinks: NavLink[] = [
  { label: '// Scan',      to: '/scan'      },
  { label: '// Compare',   to: '/compare'   },
  { label: '// Dashboard', to: '/dashboard' },
  { label: '// Docs',      to: '/docs'      },
]
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 h-[62px] px-6 lg:px-[60px]
           flex items-center justify-between
           border-b border-orange/20 bg-bg-deep/88 backdrop-blur-[16px]"
  >
    <!-- Logo -->
    <RouterLink to="/" class="flex items-center gap-2.5 no-underline flex-shrink-0">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect x="5"  y="18" width="24" height="4"  rx="1" fill="#E8792A"/>
        <rect x="9"  y="11" width="16" height="9"  rx="1" fill="#B87840"/>
        <rect x="9"  y="15" width="16" height="2"       fill="#C46030" opacity=".8"/>
        <rect x="13" y="13" width="6"  height="5"  rx="1" fill="#3D5F7A"/>
        <circle cx="16" cy="15.5" r="2.5" fill="#FF2222"/>
        <circle cx="16" cy="15.5" r="1.2" fill="#FF6666"/>
        <rect x="19" y="15" width="10" height="1.5" rx=".5" fill="#FF3333" opacity=".8"/>
        <circle cx="29" cy="15.75" r="1" fill="#FF5555" opacity=".6"/>
      </svg>
      <span class="font-rye text-xl tracking-wide text-cream">
        Mech<span class="text-orange">AI</span>
      </span>
    </RouterLink>

    <!-- Desktop Nav -->
    <nav class="hidden lg:flex items-center gap-9">
      <RouterLink
        v-for="link in navLinks" :key="link.label" :to="link.to"
        class="font-mono-tech text-[11px] tracking-[.18em] uppercase transition-colors duration-200 no-underline"
        :class="route.path === link.to ? 'text-cyan' : 'text-cream-dim hover:text-cyan'"
      >{{ link.label }}</RouterLink>
    </nav>

    <!-- Right CTAs -->
    <div class="hidden lg:flex items-center gap-2.5">
      <RouterLink
        to="/scan"
        class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
               px-5 py-[10px] clip-btn no-underline
               bg-orange text-bg-deep hover:bg-amber-w transition-colors"
      >⬡ New Scan</RouterLink>
      <RouterLink
        to="/settings"
        class="font-mono-tech text-[11px] tracking-[.15em] uppercase
               px-5 py-[10px] clip-btn no-underline
               bg-transparent border border-cyan-dim text-cyan hover:bg-cyan/10 transition-colors"
      >Settings</RouterLink>
    </div>

    <!-- Mobile burger -->
    <button
      class="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-0"
      aria-label="Toggle menu"
      @click="menuOpen = !menuOpen"
    >
      <span class="w-6 h-px bg-cream transition-transform duration-300"
            :class="menuOpen ? 'translate-y-[7px] rotate-45' : ''" />
      <span class="w-6 h-px bg-cream transition-opacity duration-300"
            :class="menuOpen ? 'opacity-0' : ''" />
      <span class="w-6 h-px bg-cream transition-transform duration-300"
            :class="menuOpen ? '-translate-y-[7px] -rotate-45' : ''" />
    </button>
  </header>

  <!-- Mobile menu -->
  <Transition name="slide">
    <div
      v-if="menuOpen"
      class="fixed top-[62px] left-0 right-0 z-40
             bg-bg-dark/95 backdrop-blur-md border-b border-orange/20 flex flex-col lg:hidden"
    >
      <RouterLink
        v-for="link in navLinks" :key="link.label" :to="link.to"
        class="font-mono-tech text-[12px] tracking-[.2em] uppercase
               text-cream-dim hover:text-cyan hover:bg-orange/5
               px-6 py-4 border-b border-white/5 no-underline transition-colors"
        @click="menuOpen = false"
      >{{ link.label }}</RouterLink>
      <div class="flex gap-3 p-4">
        <RouterLink
          to="/settings"
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase px-5 py-3 flex-1
                 clip-btn bg-transparent border border-cyan-dim text-cyan no-underline text-center"
          @click="menuOpen = false"
        >Settings</RouterLink>
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold px-5 py-3 flex-1
                 clip-btn bg-orange text-bg-deep text-center no-underline"
          @click="menuOpen = false"
        >Scan Now</RouterLink>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform .25s ease, opacity .25s ease; }
.slide-enter-from,  .slide-leave-to      { transform: translateY(-8px); opacity: 0; }
</style>

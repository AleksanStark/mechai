<script setup>
import { ref }           from 'vue'
import { useRoute }      from 'vue-router'
import { useAuthStore }  from '../stores/auth.js'
import { useNotifStore } from '../stores/notif.js'

const menuOpen   = ref(false)
const userMenu   = ref(false)
const route      = useRoute()
const auth       = useAuthStore()
const notif      = useNotifStore()

const navLinks = [
  { label: '// Scan',     to: '/scan'      },
  { label: '// Compare',  to: '/compare'   },
  { label: '// Dashboard',to: '/dashboard' },
  { label: '// Docs',     to: '/docs'      },
]

function handleLogout() {
  auth.logout()
  userMenu.value = false
  notif.ok('Signed out', 'See you next time, Sheriff')
}
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
        <rect x="5" y="18" width="24" height="4" rx="1" fill="#E8792A"/>
        <rect x="9" y="11" width="16" height="9" rx="1" fill="#B87840"/>
        <rect x="9" y="15" width="16" height="2" fill="#C46030" opacity=".8"/>
        <rect x="13" y="13" width="6" height="5" rx="1" fill="#3D5F7A"/>
        <circle cx="16" cy="15.5" r="2.5" fill="#FF2222"/>
        <circle cx="16" cy="15.5" r="1.2" fill="#FF6666"/>
        <rect x="19" y="15" width="10" height="1.5" fill="#FF3333" opacity=".8" rx=".5"/>
        <circle cx="29" cy="15.75" r="1" fill="#FF5555" opacity=".6"/>
      </svg>
      <span class="font-rye text-xl tracking-wide text-cream">
        Mech<span class="text-orange">AI</span>
      </span>
    </RouterLink>

    <!-- Desktop Nav -->
    <nav class="hidden lg:flex items-center gap-9">
      <RouterLink
        v-for="link in navLinks"
        :key="link.label"
        :to="link.to"
        class="font-mono-tech text-[11px] tracking-[.18em] uppercase transition-colors duration-200 no-underline"
        :class="route.path === link.to ? 'text-cyan' : 'text-cream-dim hover:text-cyan'"
      >{{ link.label }}</RouterLink>
    </nav>

    <!-- Right: Auth / User -->
    <div class="hidden lg:flex items-center gap-2.5">

      <!-- Logged out -->
      <template v-if="!auth.isLoggedIn">
        <RouterLink
          to="/auth"
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase px-5 py-[10px] clip-btn
                 no-underline bg-transparent border border-cyan-dim text-cyan hover:bg-cyan/10 transition-colors"
        >Sign In</RouterLink>
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold px-5 py-[10px]
                 clip-btn no-underline bg-orange text-bg-deep hover:bg-amber-w transition-colors"
        >Start Free</RouterLink>
      </template>

      <!-- Logged in -->
      <template v-else>
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[11px] tracking-[.14em] uppercase font-bold px-5 py-[9px]
                 clip-btn no-underline bg-orange text-bg-deep hover:bg-amber-w transition-colors
                 flex items-center gap-1.5"
        >⬡ New Scan</RouterLink>

        <!-- User menu trigger -->
        <div class="relative">
          <button
            class="flex items-center gap-2.5 px-3 py-1.5 border border-white/12
                   hover:border-orange/40 transition-colors cursor-pointer bg-transparent"
            @click="userMenu = !userMenu"
          >
            <div class="w-7 h-7 rounded-full border border-orange/40 bg-bg-card2
                        flex items-center justify-center font-mono-tech text-[11px] text-orange">
              {{ auth.initials }}
            </div>
            <span class="font-mono-tech text-[10px] tracking-[.1em] text-cream-dim max-w-[90px] truncate">
              {{ auth.displayName }}
            </span>
            <span class="text-tan text-[8px]">▾</span>
          </button>

          <!-- Dropdown -->
          <Transition name="drop">
            <div
              v-if="userMenu"
              v-click-outside="() => userMenu = false"
              class="absolute right-0 top-full mt-1.5 w-48 bg-bg-card border border-orange/22
                     flex flex-col z-50"
            >
              <RouterLink
                v-for="item in [
                  { label:'// Dashboard', to:'/dashboard' },
                  { label:'// Scan',      to:'/scan'      },
                  { label:'// Settings',  to:'/settings'  },
                ]"
                :key="item.label"
                :to="item.to"
                class="font-mono-tech text-[10px] tracking-[.14em] uppercase text-tan
                       hover:text-cream hover:bg-orange/8 px-4 py-3 no-underline
                       border-b border-white/6 transition-colors"
                @click="userMenu = false"
              >{{ item.label }}</RouterLink>
              <button
                class="font-mono-tech text-[10px] tracking-[.14em] uppercase text-hot-red/70
                       hover:text-hot-red hover:bg-hot-red/8 px-4 py-3 text-left
                       cursor-pointer bg-transparent border-0 transition-colors"
                @click="handleLogout"
              >// Sign Out</button>
            </div>
          </Transition>
        </div>
      </template>
    </div>

    <!-- Mobile Hamburger -->
    <button
      class="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer bg-transparent border-0"
      @click="menuOpen = !menuOpen"
      aria-label="Toggle menu"
    >
      <span class="w-6 h-px bg-cream transition-transform duration-300"
            :class="menuOpen ? 'translate-y-[7px] rotate-45' : ''" />
      <span class="w-6 h-px bg-cream transition-opacity duration-300"
            :class="menuOpen ? 'opacity-0' : ''" />
      <span class="w-6 h-px bg-cream transition-transform duration-300"
            :class="menuOpen ? '-translate-y-[7px] -rotate-45' : ''" />
    </button>
  </header>

  <!-- Mobile Menu -->
  <Transition name="slide">
    <div v-if="menuOpen"
         class="fixed top-[62px] left-0 right-0 z-40 bg-bg-dark/95 backdrop-blur-md
                border-b border-orange/20 flex flex-col lg:hidden">
      <RouterLink
        v-for="link in navLinks" :key="link.label" :to="link.to"
        class="font-mono-tech text-[12px] tracking-[.2em] uppercase text-cream-dim
               hover:text-cyan hover:bg-orange/5 px-6 py-4 border-b border-white/5
               no-underline transition-colors"
        @click="menuOpen = false"
      >{{ link.label }}</RouterLink>
      <div class="flex gap-3 p-4">
        <RouterLink
          v-if="!auth.isLoggedIn"
          to="/auth"
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase px-5 py-3 flex-1
                 clip-btn bg-transparent border border-cyan-dim text-cyan no-underline text-center"
          @click="menuOpen = false"
        >Sign In</RouterLink>
        <button
          v-else
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase px-5 py-3 flex-1
                 clip-btn bg-transparent border border-hot-red/40 text-hot-red cursor-pointer"
          @click="handleLogout; menuOpen = false"
        >Sign Out</button>
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
.slide-enter-from, .slide-leave-to { transform: translateY(-8px); opacity: 0; }
.drop-enter-active, .drop-leave-active { transition: all .18s ease; }
.drop-enter-from, .drop-leave-to { transform: translateY(-6px); opacity: 0; }
</style>


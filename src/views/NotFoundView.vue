<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const glitch = ref(false)

let interval
onMounted(() => {
  interval = setInterval(() => {
    glitch.value = true
    setTimeout(() => { glitch.value = false }, 180)
  }, 2800)
})
onUnmounted(() => clearInterval(interval))
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep flex items-center justify-center px-6 relative overflow-hidden">
    <div class="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 50%, rgba(255,34,34,.06), transparent 65%)" />

    <!-- Floating crosses -->
    <span v-for="(c,i) in [{t:'15%',l:'8%'},{t:'70%',l:'5%'},{t:'20%',r:'10%'},{t:'75%',r:'7%'},{t:'45%',l:'45%',op:.15}]"
          :key="i"
          class="absolute font-mono-tech text-orange animate-px-pulse pointer-events-none select-none"
          :style="{ top: c.t, left: c.l, right: c.r, opacity: c.op || .3, fontSize:'18px' }">+</span>

    <div class="relative z-10 text-center max-w-[600px]">

      <!-- Wanted poster frame -->
      <div class="inline-block border-[3px] border-double border-hot-red/50 p-1.5 mb-8">
        <div class="border border-hot-red/30 px-10 py-8">
          <div class="font-mono-tech text-[10px] tracking-[.3em] uppercase text-hot-red mb-4">
            // Error · System Breach
          </div>

          <!-- 404 with glitch -->
          <div
            class="font-rye text-cream relative select-none"
            style="font-size: clamp(80px, 18vw, 160px); line-height: 1"
            :class="glitch ? 'glitch-active' : ''"
          >
            <span class="relative z-10">404</span>
            <span v-if="glitch" class="absolute inset-0 text-cyan" style="clip-path: inset(30% 0 40% 0); transform: translateX(-4px)">404</span>
            <span v-if="glitch" class="absolute inset-0 text-hot-red" style="clip-path: inset(60% 0 10% 0); transform: translateX(4px)">404</span>
          </div>

          <h1 class="font-rye text-orange mt-2" style="font-size: clamp(20px, 4vw, 34px)">
            Vehicle Not Found
          </h1>
        </div>
      </div>

      <p class="font-barlow-body text-cream-dim text-[16px] leading-[1.7] mb-10 max-w-[420px] mx-auto">
        The road you're looking for has gone dark. This page doesn't exist, or it rode off into the sunset.
      </p>

      <!-- HUD readout -->
      <div class="inline-block bg-bg-card border border-hot-red/25 px-6 py-4 mb-10 text-left">
        <div class="font-mono-tech text-[9px] leading-[1.9] text-hot-red/70">
          SYSTEM: MECHAI_v3.2.0<br/>
          STATUS: 404_NOT_FOUND<br/>
          ROUTE: {{ $route?.fullPath || '/unknown' }}<br/>
          TIMESTAMP: {{ new Date().toISOString().slice(0,19).replace('T',' ') }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3 justify-center">
        <RouterLink
          to="/"
          class="font-mono-tech text-[12px] tracking-[.18em] uppercase font-bold
                 px-8 py-3.5 clip-btn no-underline
                 bg-orange text-bg-deep hover:bg-amber-w transition-colors
                 flex items-center gap-2"
        >⬡ Return Home</RouterLink>
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[12px] tracking-[.18em] uppercase
                 px-8 py-3.5 clip-btn no-underline
                 bg-transparent border border-cyan-dim text-cyan
                 hover:bg-cyan/10 transition-colors
                 flex items-center gap-2"
        >◈ Start a Scan</RouterLink>
        <button
          class="font-mono-tech text-[12px] tracking-[.18em] uppercase
                 px-8 py-3.5 clip-btn
                 bg-transparent border border-white/15 text-tan
                 hover:border-orange/40 hover:text-cream-dim transition-colors
                 cursor-pointer"
          @click="router.back()"
        >← Go Back</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.glitch-active {
  animation: glitch-shake .18s linear;
}
@keyframes glitch-shake {
  0%, 100% { transform: translateX(0);    }
  25%       { transform: translateX(-3px); }
  75%       { transform: translateX(3px);  }
}
</style>

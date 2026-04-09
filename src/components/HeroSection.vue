<script setup>
const stats = [
  { n: '98.4%', l: 'Detection Accuracy' },
  { n: '3.2s',  l: 'Avg. Scan Time'     },
  { n: '200+',  l: 'Defect Categories'  },
  { n: '1.2M',  l: 'Vehicles Inspected' },
]

const crosses = [
  { top: '22%', left: '42%', delay: '0s'    },
  { top: '55%', left: '62%', delay: '1.1s'  },
  { bottom: '18%', left: '48%', delay: '2s' },
  { top: '35%', right: '28%', delay: '.6s'  },
]
</script>

<template>
  <section class="relative min-h-screen flex items-center px-6 lg:px-[60px] pt-16 pb-20 overflow-hidden">

    <!-- Grid Overlay -->
    <div class="absolute inset-0 grid-overlay pointer-events-none" />

    <!-- Desert gradient glow -->
    <div
      class="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 110%, rgba(210,80,20,.14) 0%, rgba(180,55,10,.07) 45%, transparent 70%)"
    />

    <!-- Horizontal scan lines -->
    <div class="absolute inset-x-0 h-px animate-scan-v scan-line" />
    <div class="absolute inset-x-0 h-px animate-scan-v scan-line" style="animation-delay: -2.5s;" />

    <!-- Pixel crosses -->
    <span
      v-for="(c, i) in crosses"
      :key="i"
      class="absolute font-mono-tech text-sm text-orange animate-px-pulse pointer-events-none"
      :style="{ ...c, animationDelay: c.delay }"
    >+</span>

    <!-- Left: Main content -->
    <div class="relative z-10 max-w-[660px]">

      <!-- Eyebrow -->
      <div class="flex items-center gap-3 font-mono-tech text-[10px] tracking-[.3em] uppercase text-cyan mb-6">
        <span class="w-7 h-px bg-cyan flex-shrink-0" />
        MechVision AI · System v3.1 · Active
      </div>

      <!-- Headline -->
      <h1 class="font-rye leading-[.95] text-cream"
          style="font-size: clamp(52px, 7.5vw, 94px)">
        No Car
        <span class="block text-orange">Hides Its</span>
        Secrets
      </h1>

      <!-- Body -->
      <p class="font-barlow-body text-[17px] leading-[1.7] text-cream-dim mt-6 mb-10 max-w-[500px]">
        Upload a photo — our laser-eyed AI performs a full technical inspection in seconds.
        Rust, cracks, wear, and hidden damage don't stand a chance.
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-3.5 items-center">
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[13px] tracking-[.15em] uppercase font-bold
                 px-9 py-[15px] clip-btn-lg no-underline
                 bg-orange text-bg-deep hover:bg-amber-w transition-colors
                 flex items-center gap-2"
        >
          <span>⬡</span> Scan A Vehicle
        </RouterLink>
        <button
          class="font-mono-tech text-[13px] tracking-[.15em] uppercase
                 px-9 py-[15px] clip-btn-lg
                 bg-transparent border border-cyan-dim text-cyan
                 hover:bg-cyan/10 transition-colors cursor-pointer
                 flex items-center gap-2"
        >
          <span>◈</span> Watch Demo
        </button>
      </div>
    </div>

    <!-- Right: Stats -->
    <div
      class="absolute right-6 lg:right-[60px] top-1/2 -translate-y-1/2
             z-10 flex flex-col gap-3
             hidden lg:flex"
    >
      <div
        v-for="stat in stats"
        :key="stat.n"
        class="bg-bg-card border border-orange/22 clip-card relative px-6 py-4"
      >
        <!-- Corner accent -->
        <div
          class="absolute top-0 right-0 w-0 h-0"
          style="border-top: 14px solid var(--color-orange); border-left: 14px solid transparent"
        />
        <div class="font-rye text-[38px] text-orange leading-none">{{ stat.n }}</div>
        <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-tan mt-1">{{ stat.l }}</div>
      </div>
    </div>

    <!-- Mobile stats row -->
    <div class="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-2 lg:hidden z-10">
      <div
        v-for="stat in stats"
        :key="stat.n"
        class="bg-bg-card border border-orange/22 px-4 py-3 clip-card relative"
      >
        <div
          class="absolute top-0 right-0 w-0 h-0"
          style="border-top: 12px solid var(--color-orange); border-left: 12px solid transparent"
        />
        <div class="font-rye text-2xl text-orange leading-none">{{ stat.n }}</div>
        <div class="font-mono-tech text-[8px] tracking-[.15em] uppercase text-tan mt-0.5">{{ stat.l }}</div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.scan-line {
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-cyan) 30%,
    rgba(0,216,255,.9) 50%,
    var(--color-cyan) 70%,
    transparent 100%
  );
  opacity: 0;
}
</style>

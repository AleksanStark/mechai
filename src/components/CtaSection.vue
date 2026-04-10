<script setup lang="ts">
const trustItems = [
  'SOC 2 Compliant',
  'GDPR Ready',
  'No Card Required',
  'Cancel Anytime',
]
</script>

<template>
  <section
    class="relative py-28 px-6 lg:px-[60px] text-center overflow-hidden"
  >
    <!-- Desert glow -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 110%, rgba(200,80,20,.12), transparent 65%)"
    />

    <div class="relative z-10">
      <!-- Label -->
      <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-7">
        // Ready, Sheriff?
      </div>

      <!-- Wanted Poster Frame -->
      <div class="inline-block border-[3px] border-double border-orange-dim p-1.5 mb-10">
        <div class="border border-orange-dim px-12 lg:px-20 py-11">
          <h2
            class="text-cream"
            style="font-size: clamp(34px, 5.5vw, 66px); line-height: 1.05"
          >
            Dead or Alive —<br/>Every Defect
          </h2>
        </div>
      </div>

      <!-- Sub -->
      <p class="font-barlow-body text-[17px] leading-[1.65] text-cream-dim max-w-[480px] mx-auto mb-10">
        Stop paying for hidden problems. Every vehicle inspection starts with the full truth.
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap items-center justify-center gap-3.5">
        <button
          class="font-mono-tech text-[13px] tracking-[.15em] uppercase font-bold
                 px-10 py-4 clip-btn-lg
                 bg-orange text-bg-deep hover:bg-amber-w transition-colors cursor-pointer
                 flex items-center gap-2"
        >
          <span>⬡</span> Scan Your First Car Free
        </button>
        <button
          class="font-mono-tech text-[13px] tracking-[.15em] uppercase
                 px-10 py-4 clip-btn-lg
                 bg-transparent border border-cyan-dim text-cyan
                 hover:bg-cyan/10 transition-colors cursor-pointer
                 flex items-center gap-2"
        >
          <span>◈</span> Book a Demo
        </button>
      </div>

      <!-- Trust row -->
      <div class="flex flex-wrap items-center justify-center gap-7 mt-11">
        <div
          v-for="item in trustItems"
          :key="item"
          class="flex items-center gap-2 font-mono-tech text-[9.5px] tracking-[.15em] uppercase text-tan"
        >
          <span class="w-1.5 h-1.5 bg-cyan flex-shrink-0" />
          {{ item }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    n: '01',
    title: 'Upload Photos',
    desc: 'Snap or upload photos from any angle — your phone camera works fine. No special equipment required.',
  },
  {
    n: '02',
    title: 'AI Scans',
    desc: 'MechVision runs each image through 12 neural network layers trained on 5M+ real-world inspections.',
  },
  {
    n: '03',
    title: 'Defects Mapped',
    desc: 'Every issue pinpointed with location, severity score, and repair cost benchmarks from 1,200+ shops.',
  },
  {
    n: '04',
    title: 'Report Ready',
    desc: 'Download your PDF instantly or share a link. Negotiate with data, not gut feelings.',
  },
]
</script>

<template>
  <section class="relative bg-bg-dark py-24 px-6 lg:px-[60px] overflow-hidden">
    <div class="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

    <!-- Section header -->
    <div class="text-center relative z-10">
      <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-3">
        // Process Flow
      </div>
      <h2 class="text-cream" style="font-size: clamp(28px, 4vw, 52px)">
        Four Shots. Full Picture.
      </h2>
    </div>

    <!-- Steps -->
    <div class="relative mt-16 max-w-[1100px] mx-auto z-10">

      <!-- Dashed Connector (desktop) -->
      <div
        class="absolute hidden lg:block top-[27px] left-[60px] right-[60px] h-px pointer-events-none"
        style="background: repeating-linear-gradient(
          90deg,
          var(--color-orange) 0, var(--color-orange) 6px,
          transparent 6px, transparent 14px
        )"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
        <div
          v-for="step in steps"
          :key="step.n"
          class="px-0 lg:px-[18px] text-center flex flex-col items-center"
        >
          <!-- Number Badge -->
          <div
            class="relative z-10 w-[54px] h-[54px] mb-6 flex items-center justify-center
                   font-rye text-xl text-orange bg-bg-dark
                   border border-orange clip-step"
          >{{ step.n }}</div>

          <h3 class="font-barlow-cond text-[17px] font-bold tracking-[.06em] uppercase text-cream mb-3">
            {{ step.title }}
          </h3>

          <p class="font-barlow-body text-[13px] leading-[1.6] text-cream-dim">
            {{ step.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

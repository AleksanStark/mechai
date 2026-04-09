<script setup>
const features = [
  {
    tag: '// Computer Vision',
    title: 'Vision Scan',
    desc: 'Upload any photo or video. MechVision processes every pixel across 200+ damage categories with neural networks trained on 5M+ real vehicles.',
    icon: `<svg viewBox="0 0 44 44" fill="none">
      <rect x="4" y="20" width="36" height="1.5" fill="#00D8FF" opacity=".3"/>
      <rect x="4" y="22" width="36" height="2" fill="#00D8FF" opacity=".6"/>
      <rect x="4" y="25" width="36" height="1.5" fill="#00D8FF" opacity=".3"/>
      <rect x="14" y="6" width="16" height="32" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <circle cx="22" cy="22" r="5" fill="#00D8FF"/>
      <circle cx="22" cy="22" r="2.5" fill="#080C0F"/>
      <rect x="6" y="6" width="6" height="1" fill="#00D8FF" opacity=".4"/>
      <rect x="6" y="6" width="1" height="6" fill="#00D8FF" opacity=".4"/>
      <rect x="32" y="6" width="6" height="1" fill="#00D8FF" opacity=".4"/>
      <rect x="37" y="6" width="1" height="6" fill="#00D8FF" opacity=".4"/>
    </svg>`,
  },
  {
    tag: '// Market Data',
    title: 'Price Intelligence',
    desc: 'Real-time market valuation based on detected condition, mileage estimates, and historical data from 2M+ verified auction transactions across all regions.',
    icon: `<svg viewBox="0 0 44 44" fill="none">
      <path d="M6 36 L6 10 L38 10" stroke="#E8792A" stroke-width="1.5" fill="none"/>
      <rect x="10" y="20" width="5" height="16" fill="#E8792A" opacity=".5"/>
      <rect x="19" y="14" width="5" height="22" fill="#E8792A" opacity=".75"/>
      <rect x="28" y="24" width="5" height="12" fill="#E8792A" opacity=".5"/>
      <circle cx="12.5" cy="18" r="2" fill="#E8792A"/>
      <circle cx="21.5" cy="12" r="2" fill="#E8792A"/>
      <circle cx="30.5" cy="22" r="2" fill="#E8792A"/>
      <path d="M12.5 18 L21.5 12 L30.5 22" stroke="#E8792A" stroke-width="1" fill="none"/>
    </svg>`,
  },
  {
    tag: '// History Check',
    title: 'VIN Decoder',
    desc: 'Cross-reference scan results with full vehicle history — accidents, mileage rollback, flood damage, salvage titles, and 10-year service records.',
    icon: `<svg viewBox="0 0 44 44" fill="none">
      <rect x="6" y="6" width="32" height="32" rx="2" fill="none" stroke="#5A7F9E" stroke-width="1"/>
      <rect x="10" y="10" width="10" height="10" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <rect x="24" y="10" width="10" height="10" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <rect x="10" y="24" width="10" height="10" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <rect x="24" y="24" width="10" height="10" fill="#E8792A" opacity=".25" stroke="#E8792A" stroke-width="1"/>
      <line x1="6" y1="22" x2="38" y2="22" stroke="#5A7F9E" stroke-width=".5" stroke-dasharray="3 2"/>
      <line x1="22" y1="6" x2="22" y2="38" stroke="#5A7F9E" stroke-width=".5" stroke-dasharray="3 2"/>
    </svg>`,
  },
  {
    tag: '// Enterprise',
    title: 'Fleet Manager',
    desc: 'Track condition scores, maintenance cycles, and depreciation curves across your entire inventory. Built for dealers, rental agencies, and logistics operators.',
    icon: `<svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="14" fill="none" stroke="#E8792A" stroke-width="1" stroke-dasharray="4 2"/>
      <circle cx="22" cy="22" r="7"  fill="none" stroke="#E8792A" stroke-width="1"/>
      <circle cx="22" cy="22" r="2.5" fill="#E8792A"/>
      <line x1="22" y1="6"  x2="22" y2="15" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="22" y1="29" x2="22" y2="38" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="6"  y1="22" x2="15" y2="22" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="29" y1="22" x2="38" y2="22" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    tag: '// Auto Report',
    title: 'Instant Report',
    desc: 'Branded PDF with annotated photos, defect pinpoints, severity ratings, and repair cost breakdowns — auto-generated in under 10 seconds and ready to send.',
    icon: `<svg viewBox="0 0 44 44" fill="none">
      <rect x="6" y="8" width="32" height="28" rx="2" fill="none" stroke="#5A7F9E" stroke-width="1"/>
      <rect x="6" y="8" width="32" height="8" fill="#5A7F9E" opacity=".15"/>
      <line x1="16" y1="22" x2="28" y2="22" stroke="#5A7F9E" stroke-width="1"/>
      <line x1="16" y1="27" x2="24" y2="27" stroke="#5A7F9E" stroke-width="1"/>
      <circle cx="12" cy="22" r="2" fill="#E8792A"/>
      <circle cx="12" cy="27" r="2" fill="#4ADE80"/>
      <rect x="14" y="36" width="16" height="4" rx="1" fill="#3D5F7A" opacity=".5"/>
      <rect x="20" y="36" width="4"  height="4" fill="#3D5F7A" opacity=".8"/>
    </svg>`,
  },
  {
    tag: '// REST API',
    title: 'Developer API',
    desc: 'RESTful API with webhooks, batch processing, and white-label options. Integrate MechAI inspection into your own marketplace or dealership platform.',
    icon: `<svg viewBox="0 0 44 44" fill="none">
      <rect x="8" y="8" width="28" height="28" rx="2" fill="none" stroke="#5A7F9E" stroke-width="1"/>
      <rect x="12" y="14" width="8" height="2" fill="#00D8FF" opacity=".6"/>
      <rect x="12" y="19" width="20" height="1.5" fill="#5A7F9E" opacity=".5"/>
      <rect x="12" y="23" width="16" height="1.5" fill="#5A7F9E" opacity=".5"/>
      <rect x="12" y="27" width="18" height="1.5" fill="#5A7F9E" opacity=".5"/>
      <rect x="28" y="10" width="10" height="10" rx="5" fill="#E8792A"/>
      <rect x="32" y="14" width="2" height="2" fill="#fff"/>
      <rect x="32" y="12" width="2" height="1" fill="#fff"/>
    </svg>`,
  },
]
</script>

<template>
  <section id="features" class="py-24 px-6 lg:px-[60px]">

    <!-- Header -->
    <div class="text-center">
      <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-3">
        // Core Capabilities
      </div>
      <div class="flex items-center justify-center gap-3.5 max-w-[340px] mx-auto mb-4">
        <div class="flex-1 h-px bg-orange/22" />
        <span class="text-orange text-xs">✦</span>
        <div class="flex-1 h-px bg-orange/22" />
      </div>
      <h2 class="text-cream" style="font-size: clamp(28px, 4vw, 52px)">What MechAI Sees</h2>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px mt-16">
      <div
        v-for="f in features"
        :key="f.title"
        class="group relative bg-bg-card px-8 py-10 border border-transparent
               hover:border-orange/22 transition-all duration-300 overflow-hidden"
      >
        <!-- Background glow on hover -->
        <div class="absolute bottom-0 right-0 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    bg-radial from-orange/8 to-transparent" />

        <!-- Icon -->
        <div class="w-11 h-11 mb-6" v-html="f.icon" />

        <!-- Title -->
        <h3 class="font-rye text-xl text-cream mb-3.5">{{ f.title }}</h3>

        <!-- Description -->
        <p class="font-barlow-body text-sm leading-[1.65] text-cream-dim">{{ f.desc }}</p>

        <!-- Tag -->
        <span
          class="inline-block mt-5 font-mono-tech text-[9px] tracking-[.16em] uppercase
                 text-cyan border border-cyan/28 px-2.5 py-1"
        >{{ f.tag }}</span>
      </div>
    </div>
  </section>
</template>

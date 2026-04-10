<script setup lang="ts">
import { ref, computed } from 'vue'

const scanning = ref(true)
const scanComplete = ref(false)
const scanProgress = ref(0)

const vehicles = [
  {
    label: '2019 Toyota Camry XLE',
    vin: '····8274',
    score: 72,
    scoreColor: '#F0A050',
    metrics: [
      { key: 'EXTERIOR_BODY', value: 'MODERATE', cls: 'warn',  pct: 45 },
      { key: 'GLASS / SEALS', value: 'CRITICAL',  cls: 'crit',  pct: 12 },
      { key: 'WHEELS / TIRES', value: 'GOOD',     cls: 'good',  pct: 89 },
      { key: 'LIGHTING',       value: 'GOOD',     cls: 'good',  pct: 78 },
    ],
    details: [
      { key: 'RUST_ZONES',    value: '3 DETECTED',    cls: 'crit' },
      { key: 'DEFECTS_TOTAL', value: '7 ITEMS',       cls: 'warn' },
      { key: 'EST_REPAIR',    value: '$1,200 – $1,800', cls: 'warn' },
      { key: 'SCAN_TIME',     value: '2.8 SEC',        cls: 'good' },
    ],
  },
  {
    label: '2021 Ford F-150 XLT',
    vin: '····5519',
    score: 91,
    scoreColor: '#4ADE80',
    metrics: [
      { key: 'EXTERIOR_BODY', value: 'GOOD',      cls: 'good', pct: 92 },
      { key: 'GLASS / SEALS', value: 'GOOD',      cls: 'good', pct: 88 },
      { key: 'WHEELS / TIRES', value: 'GOOD',     cls: 'good', pct: 94 },
      { key: 'LIGHTING',       value: 'MODERATE', cls: 'warn', pct: 60 },
    ],
    details: [
      { key: 'RUST_ZONES',    value: '0 DETECTED',  cls: 'good' },
      { key: 'DEFECTS_TOTAL', value: '2 ITEMS',     cls: 'good' },
      { key: 'EST_REPAIR',    value: '$200 – $400', cls: 'good' },
      { key: 'SCAN_TIME',     value: '3.1 SEC',     cls: 'good' },
    ],
  },
  {
    label: '2017 BMW 3 Series',
    vin: '····3301',
    score: 48,
    scoreColor: '#FF2222',
    metrics: [
      { key: 'EXTERIOR_BODY', value: 'CRITICAL',  cls: 'crit', pct: 18 },
      { key: 'GLASS / SEALS', value: 'MODERATE',  cls: 'warn', pct: 40 },
      { key: 'WHEELS / TIRES', value: 'MODERATE', cls: 'warn', pct: 55 },
      { key: 'LIGHTING',       value: 'GOOD',     cls: 'good', pct: 80 },
    ],
    details: [
      { key: 'RUST_ZONES',    value: '8 DETECTED',     cls: 'crit' },
      { key: 'DEFECTS_TOTAL', value: '14 ITEMS',       cls: 'crit' },
      { key: 'EST_REPAIR',    value: '$4,500 – $6,200', cls: 'crit' },
      { key: 'SCAN_TIME',     value: '4.2 SEC',         cls: 'warn' },
    ],
  },
]

const activeIdx = ref(0)
const active = computed(() => vehicles[activeIdx.value])

function selectVehicle(i) {
  activeIdx.value = i
  scanComplete.value = false
  scanning.value = true
  scanProgress.value = 0
  const interval = setInterval(() => {
    scanProgress.value += 4
    if (scanProgress.value >= 100) {
      scanProgress.value = 100
      scanning.value = false
      scanComplete.value = true
      clearInterval(interval)
    }
  }, 60)
}

const detectionBoxes = computed(() => {
  const maps = [
    [
      { top:'38%', left:'44%', w:'70px', h:'26px', label:'RUST — CRITICAL', cls:'crit', cx:true },
      { top:'16%', left:'26%', w:'88px', h:'52px', label:'WINDSHIELD — CRACK', cls:'warn', cx:false },
      { top:'50%', left:'3%',  w:'60px', h:'38px', label:'HEADLIGHT — OK', cls:'ok', cx:false },
      { top:'52%', right:'7%', w:'58px', h:'36px', label:'TAILLIGHT — WORN', cls:'warn', cx:false },
    ],
    [
      { top:'18%', left:'28%', w:'80px', h:'48px', label:'GLASS — OK', cls:'ok', cx:false },
      { top:'50%', left:'4%',  w:'60px', h:'38px', label:'HEADLIGHT — OK', cls:'ok', cx:false },
      { top:'52%', right:'5%', w:'58px', h:'36px', label:'TAILLIGHT — WORN', cls:'warn', cx:false },
    ],
    [
      { top:'36%', left:'20%', w:'90px', h:'34px', label:'RUST — CRITICAL', cls:'crit', cx:true },
      { top:'44%', left:'38%', w:'88px', h:'28px', label:'DENT — CRITICAL',  cls:'crit', cx:true },
      { top:'16%', left:'25%', w:'88px', h:'52px', label:'WINDSHIELD — CRACK', cls:'warn', cx:false },
      { top:'50%', left:'4%',  w:'60px', h:'38px', label:'HEADLIGHT — OK', cls:'ok', cx:false },
    ],
  ]
  return maps[activeIdx.value]
})
</script>

<template>
  <section id="scan" class="relative bg-bg-dark py-24 px-6 lg:px-[60px] overflow-hidden">
    <div class="absolute inset-0 grid-overlay opacity-35 pointer-events-none" />

    <!-- Section header -->
    <div class="text-center relative z-10">
      <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-3">
        // Live Interface Preview
      </div>
      <h2 class="text-cream" style="font-size: clamp(28px, 4vw, 52px)">
        The Eye That Never Misses
      </h2>
    </div>

    <!-- Vehicle Selector Tabs -->
    <div class="flex flex-wrap justify-center gap-2 mt-10 mb-0 relative z-10">
      <button
        v-for="(v, i) in vehicles"
        :key="i"
        class="font-mono-tech text-[10px] tracking-[.14em] uppercase px-4 py-2 clip-btn
               border transition-all cursor-pointer"
        :class="activeIdx === i
          ? 'bg-orange text-bg-deep border-orange font-bold'
          : 'bg-transparent border-orange/30 text-cream-dim hover:border-orange/60 hover:text-cream'"
        @click="selectVehicle(i)"
      >{{ v.label }}</button>
    </div>

    <!-- Scan UI Grid -->
    <div class="hud-frame mt-10 max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px border border-orange/22 relative z-10">
      <div class="hc-bl" /><div class="hc-br" />

      <!-- ── SCAN VIEW ── -->
      <div class="relative bg-[#080C0F] overflow-hidden" style="aspect-ratio: 4/3">
        <div class="absolute inset-0 grid-overlay-dense" />

        <!-- Car SVG -->
        <svg class="absolute inset-0 w-[82%] m-auto" style="top:50%;left:50%;transform:translate(-50%,-50%)" viewBox="0 0 420 230" fill="none">
          <ellipse cx="210" cy="218" rx="150" ry="6" fill="#000" opacity=".5"/>
          <rect x="18" y="128" width="384" height="72" rx="3" fill="#1A2840" stroke="#3D5F7A" stroke-width="1.2"/>
          <path d="M78 128 L108 58 L312 58 L342 128Z" fill="#1C2E44" stroke="#3D5F7A" stroke-width="1.2"/>
          <path d="M114 122 L128 68 L292 68 L306 122Z" fill="#0C1E30" stroke="#4A7A9B" stroke-width=".8" opacity=".8"/>
          <line x1="188" y1="128" x2="188" y2="200" stroke="#3D5F7A" stroke-width=".6"/>
          <rect x="20" y="133" width="34" height="18" rx="1" fill="#E8792A" opacity=".85"/>
          <rect x="22" y="135" width="30" height="14" rx="1" fill="#FFA050" opacity=".6"/>
          <rect x="366" y="133" width="34" height="18" rx="1" fill="#CC2020" opacity=".85"/>
          <circle cx="108" cy="196" r="30" fill="#0A0F18" stroke="#3D5F7A" stroke-width="1.8"/>
          <circle cx="108" cy="196" r="16" fill="#141C28" stroke="#4A6B8A" stroke-width="1.2"/>
          <circle cx="108" cy="196" r="5"  fill="#3D5F7A"/>
          <circle cx="312" cy="196" r="30" fill="#0A0F18" stroke="#3D5F7A" stroke-width="1.8"/>
          <circle cx="312" cy="196" r="16" fill="#141C28" stroke="#4A6B8A" stroke-width="1.2"/>
          <circle cx="312" cy="196" r="5"  fill="#3D5F7A"/>
          <rect x="80" y="118" width="14" height="8" rx="1" fill="#1C2E44" stroke="#3D5F7A" stroke-width=".5"/>
          <!-- Rust spots -->
          <circle cx="240" cy="155" r="5" fill="#6B3010" opacity=".6"/>
          <circle cx="248" cy="158" r="3" fill="#6B3010" opacity=".5"/>
          <circle cx="235" cy="160" r="4" fill="#6B3010" opacity=".4"/>
        </svg>

        <!-- Detection Boxes (shown when scan complete) -->
        <Transition name="fade">
          <div v-if="scanComplete" class="absolute inset-0">
            <div
              v-for="(box, i) in detectionBoxes"
              :key="i"
              class="absolute animate-d-pulse"
              :class="{
                'border border-cyan': box.cls === 'ok',
                'border border-orange': box.cls === 'warn',
                'border border-hot-red': box.cls === 'crit',
              }"
              :style="{
                top: box.top,
                left: box.left,
                right: box.right,
                width: box.w,
                height: box.h,
              }"
            >
              <span
                class="absolute -top-[18px] left-0 font-mono-tech text-[8px] tracking-[.1em] px-1 py-0.5 whitespace-nowrap"
                :class="{
                  'bg-[#080C0F]/75 text-cyan':    box.cls === 'ok',
                  'bg-[#080C0F]/75 text-orange':  box.cls === 'warn',
                  'bg-[#080C0F]/75 text-hot-red': box.cls === 'crit',
                }"
              >{{ box.label }}</span>
            </div>
          </div>
        </Transition>

        <!-- Laser line -->
        <div
          v-if="scanning"
          class="absolute inset-x-0 h-0.5 animate-laser laser-line"
        />

        <!-- Scan progress bar -->
        <div
          v-if="scanning"
          class="absolute bottom-0 left-0 h-0.5 bg-cyan transition-all duration-100"
          :style="{ width: scanProgress + '%' }"
        />

        <!-- HUD Overlays -->
        <div class="absolute top-2.5 left-3 font-mono-tech text-[8.5px] leading-[1.7] text-cyan/65">
          SCAN_MODE: FULL<br/>RES: 4096×2160<br/>MODEL: MECHVISION_v3
        </div>
        <div class="absolute top-2.5 right-3 text-right font-mono-tech text-[8.5px] leading-[1.7] text-cyan/65">
          FRAME: 1024<br/>FPS: 60<br/>
          <span :class="scanning ? 'text-orange' : 'text-health'">
            {{ scanning ? 'SCANNING' : 'COMPLETE' }}
          </span>
        </div>

        <!-- Reticle -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-cyan/30" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan/50" />
      </div>

      <!-- ── DATA PANEL ── -->
      <div class="bg-bg-card p-8 flex flex-col gap-5">

        <!-- Header -->
        <div class="font-mono-tech text-[10px] tracking-[.18em] text-cyan pb-3.5 border-b border-cyan/28">
          // INSPECTION — {{ active.label }} · VIN {{ active.vin }}
        </div>

        <!-- Score -->
        <div class="bg-bg-card2 border border-orange/22 p-5 text-center clip-card">
          <div
            class="font-rye text-[52px] leading-none transition-all duration-500"
            :style="{ color: active.scoreColor }"
          >{{ active.score }}</div>
          <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-tan mt-1">
            Overall Health Score
          </div>
        </div>

        <!-- Metrics -->
        <div class="flex flex-col gap-3">
          <div v-for="m in active.metrics" :key="m.key">
            <div class="flex justify-between items-center">
              <span class="font-mono-tech text-[10px] text-tan tracking-[.1em]">{{ m.key }}</span>
              <span
                class="font-barlow-cond text-sm font-bold"
                :class="{
                  'text-health':  m.cls === 'good',
                  'text-amber-w': m.cls === 'warn',
                  'text-hot-red': m.cls === 'crit',
                }"
              >{{ m.value }}</span>
            </div>
            <div class="mt-1.5 h-[3px] bg-white/8 relative">
              <div
                class="absolute top-0 left-0 h-full transition-all duration-700 animate-glow-bar"
                :class="{
                  'bg-health':  m.cls === 'good',
                  'bg-amber-w': m.cls === 'warn',
                  'bg-hot-red': m.cls === 'crit',
                }"
                :style="{ width: m.pct + '%' }"
              />
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="border-t border-orange/22 pt-4 flex flex-col gap-2.5">
          <div v-for="d in active.details" :key="d.key" class="flex justify-between items-center">
            <span class="font-mono-tech text-[10px] text-tan tracking-[.1em]">{{ d.key }}</span>
            <span
              class="font-barlow-cond text-sm font-bold"
              :class="{
                'text-health':  d.cls === 'good',
                'text-amber-w': d.cls === 'warn',
                'text-hot-red': d.cls === 'crit',
              }"
            >{{ d.value }}</span>
          </div>
        </div>

        <!-- Download CTA -->
        <button
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                 w-full py-3.5 clip-btn flex items-center justify-center gap-2
                 bg-orange text-bg-deep hover:bg-amber-w transition-colors cursor-pointer"
        >
          ⬡ Download Full Report PDF
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.laser-line {
  background: linear-gradient(90deg, transparent, var(--color-cyan), transparent);
  box-shadow: 0 0 12px var(--color-cyan), 0 0 4px rgba(0,216,255,.6);
}
.fade-enter-active { transition: opacity .6s ease; }
.fade-enter-from   { opacity: 0; }
</style>

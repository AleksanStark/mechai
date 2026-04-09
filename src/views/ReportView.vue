<script setup>
import { ref, computed } from 'vue'
import { useRoute }      from 'vue-router'
import ScoreRing         from '../components/ui/ScoreRing.vue'
import MechCard          from '../components/ui/MechCard.vue'
import MechBadge         from '../components/ui/MechBadge.vue'

const route = useRoute()
const reportId = computed(() => route.params.id || 'RPT-DEMO42')

// ── Mock report data ────────────────────────────────────────────
const report = {
  vehicle: {
    year: 2019, make: 'Toyota', model: 'Camry XLE',
    vin: '4T1B11HKXKU500284',
    mileage: '68,400 mi',
    color: 'Midnight Blue Metallic',
    body: 'Sedan',
  },
  scanDate: 'April 8, 2025 — 14:32 UTC',
  photos: 6,
  score: 72,
  marketValue: { low: 14800, mid: 16200, high: 17600 },
  repairEstimate: { low: 1200, high: 1800 },

  sections: [
    {
      id: 'body',
      label: 'Exterior Body',
      score: 45,
      severity: 'warn',
      defects: [
        { title: 'Rust — Left Rear Wheel Arch',    sev: 'crit', cost: '$340–$520',  loc: 'Left rear' },
        { title: 'Dent — Driver Door Panel',        sev: 'warn', cost: '$180–$280',  loc: 'Driver door' },
        { title: 'Scratch — Front Bumper',           sev: 'ok',   cost: '$60–$120',   loc: 'Front bumper' },
      ],
    },
    {
      id: 'glass',
      label: 'Glass & Seals',
      score: 12,
      severity: 'crit',
      defects: [
        { title: 'Windshield Crack — Impact Point', sev: 'crit', cost: '$350–$600',  loc: 'Windshield center' },
        { title: 'Rear Seal Deterioration',          sev: 'warn', cost: '$80–$140',   loc: 'Rear window' },
      ],
    },
    {
      id: 'wheels',
      label: 'Wheels & Tires',
      score: 89,
      severity: 'ok',
      defects: [
        { title: 'Minor Curb Rash — Front Left Rim', sev: 'ok', cost: '$40–$80', loc: 'Front left wheel' },
      ],
    },
    {
      id: 'lights',
      label: 'Lighting',
      score: 78,
      severity: 'ok',
      defects: [
        { title: 'Taillight Lens — Clouding',        sev: 'warn', cost: '$90–$160',  loc: 'Rear right' },
      ],
    },
  ],
}

const sevLabel = { crit: 'Critical', warn: 'Moderate', ok: 'Minor' }
const sevVariant = { crit: 'crit', warn: 'warn', ok: 'ok' }

const activeSection = ref(report.sections[0].id)
const currentSection = computed(() =>
  report.sections.find(s => s.id === activeSection.value)
)

const allDefects = computed(() =>
  report.sections.flatMap(s => s.defects.map(d => ({ ...d, section: s.label })))
)

function scoreColor(s) {
  if (s >= 80) return '#4ADE80'
  if (s >= 50) return '#F0A050'
  return '#FF2222'
}
function scoreVariant(s) {
  if (s >= 80) return 'ok'
  if (s >= 50) return 'warn'
  return 'crit'
}

const printing = ref(false)
function downloadPDF() {
  printing.value = true
  setTimeout(() => { printing.value = false }, 1800)
}
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep">

    <!-- Report Header -->
    <div class="relative bg-bg-dark border-b border-orange/18 px-6 lg:px-[60px] py-8 overflow-hidden">
      <div class="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="font-mono-tech text-[10px] tracking-[.25em] uppercase text-cyan">
              // Inspection Report
            </div>
            <MechBadge variant="neutral" small>{{ reportId }}</MechBadge>
          </div>
          <h1 class="font-rye text-cream" style="font-size: clamp(24px, 3.5vw, 42px)">
            {{ report.vehicle.year }} {{ report.vehicle.make }}
            <span class="text-orange">{{ report.vehicle.model }}</span>
          </h1>
          <p class="font-mono-tech text-[10px] text-tan tracking-[.12em] mt-1">
            {{ report.scanDate }} · {{ report.photos }} PHOTOS ANALYZED
          </p>
        </div>

        <div class="flex items-center gap-4">
          <ScoreRing :score="report.score" :size="110" />

          <button
            class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                   px-6 py-3.5 clip-btn flex items-center gap-2 cursor-pointer border-0
                   transition-all duration-200"
            :class="printing ? 'bg-health/20 text-health' : 'bg-orange text-bg-deep hover:bg-amber-w'"
            @click="downloadPDF"
          >
            <span>{{ printing ? '◈ Generating…' : '⬡ Download PDF' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 lg:px-[60px] py-10 max-w-[1300px] mx-auto">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">

        <!-- SIDEBAR -->
        <div class="xl:col-span-1 flex flex-col gap-4">

          <!-- Vehicle Info -->
          <MechCard padding="p-5">
            <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
              // Vehicle Data
            </div>
            <div class="flex flex-col gap-2.5">
              <div v-for="row in [
                { k: 'VIN',     v: report.vehicle.vin      },
                { k: 'BODY',    v: report.vehicle.body     },
                { k: 'COLOR',   v: report.vehicle.color    },
                { k: 'MILEAGE', v: report.vehicle.mileage  },
              ]" :key="row.k" class="flex flex-col gap-0.5">
                <span class="font-mono-tech text-[8px] text-tan tracking-[.12em]">{{ row.k }}</span>
                <span class="font-barlow-cond text-[13px] text-cream font-medium">{{ row.v }}</span>
              </div>
            </div>
          </MechCard>

          <!-- Market Value -->
          <MechCard padding="p-5" :hot="true">
            <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-3">
              // Market Value
            </div>
            <div class="font-rye text-3xl text-orange leading-none mb-1">
              ${{ report.marketValue.mid.toLocaleString() }}
            </div>
            <div class="font-barlow-body text-xs text-cream-dim mb-4">estimated fair price</div>
            <div class="h-px bg-orange/20 mb-3" />
            <div class="flex justify-between font-mono-tech text-[9px] text-tan tracking-[.08em]">
              <span>LOW ${{ report.marketValue.low.toLocaleString() }}</span>
              <span>HIGH ${{ report.marketValue.high.toLocaleString() }}</span>
            </div>
          </MechCard>

          <!-- Repair Estimate -->
          <MechCard padding="p-5">
            <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-3">
              // Repair Estimate
            </div>
            <div class="font-rye text-2xl text-amber-w leading-none">
              ${{ report.repairEstimate.low.toLocaleString() }}
              <span class="text-tan text-base">–</span>
              ${{ report.repairEstimate.high.toLocaleString() }}
            </div>
            <p class="font-barlow-body text-xs text-cream-dim mt-2">
              Based on 1,200+ shop benchmarks in your region
            </p>
          </MechCard>

          <!-- Section Nav -->
          <div class="flex flex-col gap-1">
            <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan mb-2">
              // Jump to Section
            </div>
            <button
              v-for="s in report.sections"
              :key="s.id"
              class="flex items-center justify-between px-4 py-2.5 border transition-all
                     cursor-pointer font-mono-tech text-[10px] tracking-[.1em] uppercase text-left"
              :class="activeSection === s.id
                ? 'bg-orange/15 border-orange text-cream'
                : 'bg-transparent border-white/8 text-tan hover:border-orange/40 hover:text-cream-dim'"
              @click="activeSection = s.id"
            >
              <span>{{ s.label }}</span>
              <MechBadge :variant="scoreVariant(s.score)" small>
                {{ s.score }}
              </MechBadge>
            </button>
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="xl:col-span-3 flex flex-col gap-6">

          <!-- Section Detail -->
          <MechCard padding="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan mb-1">
                  // Section Analysis
                </div>
                <h2 class="font-rye text-cream text-2xl">{{ currentSection.label }}</h2>
              </div>
              <ScoreRing :score="currentSection.score" :size="80" />
            </div>

            <!-- Defect list -->
            <div class="flex flex-col gap-3">
              <div
                v-for="(d, i) in currentSection.defects"
                :key="i"
                class="border border-white/8 p-4 flex items-start justify-between gap-4
                       hover:border-orange/30 transition-colors"
              >
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    class="flex-shrink-0 w-1.5 h-full mt-1.5 self-stretch rounded-full"
                    :class="{
                      'bg-hot-red': d.sev === 'crit',
                      'bg-amber-w': d.sev === 'warn',
                      'bg-health':  d.sev === 'ok',
                    }"
                  />
                  <div>
                    <p class="font-barlow-cond text-cream font-semibold text-[15px] mb-0.5">
                      {{ d.title }}
                    </p>
                    <p class="font-mono-tech text-[9px] text-tan tracking-[.1em]">
                      LOC: {{ d.loc }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <MechBadge :variant="sevVariant[d.sev]" small>
                    {{ sevLabel[d.sev] }}
                  </MechBadge>
                  <span class="font-rye text-sm text-orange">{{ d.cost }}</span>
                </div>
              </div>
            </div>

            <!-- Section nav buttons -->
            <div class="flex gap-2 mt-5 flex-wrap">
              <button
                v-for="s in report.sections"
                :key="s.id"
                class="font-mono-tech text-[9px] tracking-[.12em] uppercase px-3 py-1.5
                       border transition-all cursor-pointer"
                :class="activeSection === s.id
                  ? 'border-orange bg-orange/15 text-cream'
                  : 'border-white/10 text-tan hover:border-orange/40'"
                @click="activeSection = s.id"
              >{{ s.label }}</button>
            </div>
          </MechCard>

          <!-- Full Defect Table -->
          <MechCard padding="p-6">
            <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-5">
              // All Defects — {{ allDefects.length }} Items Found
            </div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-orange/18">
                    <th class="font-mono-tech text-[9px] tracking-[.14em] text-tan text-left pb-3 pr-4">#</th>
                    <th class="font-mono-tech text-[9px] tracking-[.14em] text-tan text-left pb-3 pr-4">DEFECT</th>
                    <th class="font-mono-tech text-[9px] tracking-[.14em] text-tan text-left pb-3 pr-4">SECTION</th>
                    <th class="font-mono-tech text-[9px] tracking-[.14em] text-tan text-left pb-3 pr-4">SEVERITY</th>
                    <th class="font-mono-tech text-[9px] tracking-[.14em] text-tan text-right pb-3">EST. REPAIR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(d, i) in allDefects"
                    :key="i"
                    class="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td class="font-mono-tech text-[10px] text-tan py-3 pr-4">
                      {{ String(i + 1).padStart(2, '0') }}
                    </td>
                    <td class="font-barlow-cond text-cream text-sm font-medium py-3 pr-4">
                      {{ d.title }}
                    </td>
                    <td class="font-mono-tech text-[9px] text-tan tracking-[.08em] py-3 pr-4">
                      {{ d.section.toUpperCase() }}
                    </td>
                    <td class="py-3 pr-4">
                      <MechBadge :variant="sevVariant[d.sev]" small>
                        {{ sevLabel[d.sev] }}
                      </MechBadge>
                    </td>
                    <td class="font-rye text-sm text-orange py-3 text-right whitespace-nowrap">
                      {{ d.cost }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </MechCard>

          <!-- AI Recommendation -->
          <MechCard padding="p-6">
            <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
              // AI Recommendation
            </div>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 border border-amber-w/40 flex items-center
                          justify-center font-mono-tech text-amber-w text-lg">⚠</div>
              <div>
                <p class="font-barlow-cond text-cream font-semibold text-lg mb-2">
                  Negotiate Before Buying
                </p>
                <p class="font-barlow-body text-[14px] text-cream-dim leading-[1.65]">
                  This vehicle scores <span class="text-amber-w font-semibold">72/100</span> —
                  in fair condition. The windshield crack is a <span class="text-hot-red">safety-critical</span>
                  issue requiring immediate replacement. Factor $1,200–$1,800 in repairs into your
                  offer. Fair purchase price after deductions: <span class="text-orange font-semibold">$14,400–$15,000</span>.
                </p>
              </div>
            </div>
          </MechCard>

        </div>
      </div>
    </div>
  </main>
</template>

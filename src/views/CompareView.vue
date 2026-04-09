<script setup>
import { ref, computed } from 'vue'
import { useNotifStore } from '../stores/notif.js'
import ScoreRing  from '../components/ui/ScoreRing.vue'
import MechCard   from '../components/ui/MechCard.vue'
import MechBadge  from '../components/ui/MechBadge.vue'

const notif = useNotifStore()

// ── Mock vehicles the user has scanned ──────────────────
const allVehicles = [
  { id:'F-001', label:'2021 Ford F-150 XLT',       score:91, price:28900, mileage:34200, year:2021, repairCost:200,  status:'ok'   },
  { id:'F-002', label:'2019 Toyota Camry XLE',      score:72, price:16200, mileage:68400, year:2019, repairCost:1500, status:'warn' },
  { id:'F-003', label:'2018 Honda CR-V EX',         score:84, price:19800, mileage:52100, year:2018, repairCost:320,  status:'ok'   },
  { id:'F-004', label:'2017 BMW 3 Series 330i',     score:48, price:14500, mileage:91700, year:2017, repairCost:4800, status:'crit' },
  { id:'F-005', label:'2022 Tesla Model 3 LR',      score:96, price:34200, mileage:18500, year:2022, repairCost:80,   status:'ok'   },
  { id:'F-006', label:'2020 Chevrolet Silverado',   score:67, price:22400, mileage:74300, year:2020, repairCost:950,  status:'warn' },
]

const leftId  = ref('F-002')
const rightId = ref('F-005')

const left  = computed(() => allVehicles.find(v => v.id === leftId.value))
const right = computed(() => allVehicles.find(v => v.id === rightId.value))

// Which side wins each metric
function winner(metricFn, higherIsBetter = true) {
  const lv = metricFn(left.value)
  const rv = metricFn(right.value)
  if (lv === rv) return 'tie'
  return (higherIsBetter ? lv > rv : lv < rv) ? 'left' : 'right'
}

const metrics = computed(() => [
  {
    label:        'AI Health Score',
    leftVal:      left.value.score,
    rightVal:     right.value.score,
    win:          winner(v => v.score),
    format:       v => v + ' / 100',
    higherBetter: true,
  },
  {
    label:        'Market Price',
    leftVal:      left.value.price,
    rightVal:     right.value.price,
    win:          winner(v => v.price, false),
    format:       v => '$' + v.toLocaleString(),
    higherBetter: false,
  },
  {
    label:        'Mileage',
    leftVal:      left.value.mileage,
    rightVal:     right.value.mileage,
    win:          winner(v => v.mileage, false),
    format:       v => v.toLocaleString() + ' mi',
    higherBetter: false,
  },
  {
    label:        'Est. Repair Cost',
    leftVal:      left.value.repairCost,
    rightVal:     right.value.repairCost,
    win:          winner(v => v.repairCost, false),
    format:       v => '$' + v.toLocaleString(),
    higherBetter: false,
  },
  {
    label:        'Vehicle Age',
    leftVal:      2025 - left.value.year,
    rightVal:     2025 - right.value.year,
    win:          winner(v => 2025 - v.year, false),
    format:       v => (2025 - v.year) + ' yrs old',
    higherBetter: false,
  },
  {
    label:        'Value After Repair',
    leftVal:      left.value.price - left.value.repairCost,
    rightVal:     right.value.price - right.value.repairCost,
    win:          winner(v => v.price - v.repairCost),
    format:       v => '$' + (v.price - v.repairCost).toLocaleString(),
    higherBetter: true,
  },
])

const verdict = computed(() => {
  const lWins = metrics.value.filter(m => m.win === 'left').length
  const rWins = metrics.value.filter(m => m.win === 'right').length
  if (lWins === rWins) return { side: 'tie', label: 'Too Close to Call' }
  return lWins > rWins
    ? { side: 'left',  label: left.value.label  }
    : { side: 'right', label: right.value.label }
})

const statusVariant = { ok:'ok', warn:'warn', crit:'crit' }
const statusLabel   = { ok:'Good', warn:'Moderate', crit:'Critical' }

function winClass(side, metricWin) {
  if (metricWin === 'tie') return 'text-cream'
  return metricWin === side ? 'text-health font-bold' : 'text-cream-dim'
}
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep">

    <!-- Header -->
    <div class="relative bg-bg-dark border-b border-orange/18 px-6 lg:px-[60px] py-8 overflow-hidden">
      <div class="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
      <div class="relative z-10">
        <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-1">
          // MechAI · Side-by-Side Analysis
        </div>
        <h1 class="font-rye text-cream" style="font-size: clamp(26px, 4vw, 46px)">
          Vehicle <span class="text-orange">Comparison</span>
        </h1>
        <p class="font-barlow-body text-cream-dim text-[14px] mt-1.5">
          Compare two scanned vehicles across all metrics to find your best deal.
        </p>
      </div>
    </div>

    <div class="px-6 lg:px-[60px] py-10 max-w-[1200px] mx-auto">

      <!-- Vehicle Selectors -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div v-for="side in ['left','right']" :key="side">
          <label class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan block mb-2">
            {{ side === 'left' ? '// Vehicle A' : '// Vehicle B' }}
          </label>
          <select
            :value="side === 'left' ? leftId : rightId"
            class="w-full bg-bg-card border border-orange/28 px-4 py-3
                   font-barlow-cond text-[15px] font-semibold text-cream
                   focus:outline-none focus:border-orange transition-colors cursor-pointer"
            @change="e => side === 'left' ? leftId = e.target.value : rightId = e.target.value"
          >
            <option
              v-for="v in allVehicles"
              :key="v.id"
              :value="v.id"
              :disabled="v.id === (side === 'left' ? rightId : leftId)"
            >{{ v.label }}</option>
          </select>
        </div>
      </div>

      <!-- Score Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <MechCard
          v-for="(vehicle, side) in [left, right]"
          :key="side"
          padding="p-6"
          :hot="verdict.side === (side === 0 ? 'left' : 'right')"
        >
          <!-- Verdict ribbon -->
          <div
            v-if="verdict.side !== 'tie' && verdict.side === (side === 0 ? 'left' : 'right')"
            class="absolute -top-px left-1/2 -translate-x-1/2 font-mono-tech text-[8px]
                   tracking-[.2em] uppercase bg-health text-bg-deep px-4 py-0.5"
          >✓ Recommended</div>

          <div class="flex items-center gap-5">
            <ScoreRing :score="vehicle.score" :size="90" />
            <div>
              <h2 class="font-rye text-cream text-xl leading-tight">{{ vehicle.label }}</h2>
              <div class="flex items-center gap-2 mt-2">
                <MechBadge :variant="statusVariant[vehicle.status]" small>
                  {{ statusLabel[vehicle.status] }}
                </MechBadge>
                <span class="font-rye text-orange text-lg">${{ vehicle.price.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </MechCard>
      </div>

      <!-- Metrics Table -->
      <MechCard padding="p-0" class="mb-8 overflow-hidden">
        <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan p-5 pb-0">
          // Head-to-Head Metrics
        </div>

        <!-- Header row -->
        <div class="grid grid-cols-3 gap-0 px-5 py-3 border-b border-orange/18 mt-4">
          <div class="font-mono-tech text-[9px] tracking-[.14em] uppercase text-tan text-left truncate pr-2">
            {{ left.label.split(' ').slice(0,3).join(' ') }}
          </div>
          <div class="font-mono-tech text-[9px] tracking-[.14em] uppercase text-tan text-center">METRIC</div>
          <div class="font-mono-tech text-[9px] tracking-[.14em] uppercase text-tan text-right truncate pl-2">
            {{ right.label.split(' ').slice(0,3).join(' ') }}
          </div>
        </div>

        <!-- Metric rows -->
        <div
          v-for="m in metrics"
          :key="m.label"
          class="grid grid-cols-3 gap-0 px-5 py-4 border-b border-white/5
                 hover:bg-white/2 transition-colors"
        >
          <!-- Left value -->
          <div class="flex items-center gap-2">
            <span
              v-if="m.win === 'left'"
              class="w-1.5 h-1.5 bg-health rounded-full flex-shrink-0"
            />
            <span
              class="font-barlow-cond text-[15px]"
              :class="winClass('left', m.win)"
            >{{ m.format(left) }}</span>
          </div>

          <!-- Metric label (center) -->
          <div class="font-mono-tech text-[9px] tracking-[.1em] uppercase text-tan text-center self-center px-2">
            {{ m.label }}
          </div>

          <!-- Right value -->
          <div class="flex items-center justify-end gap-2">
            <span
              class="font-barlow-cond text-[15px]"
              :class="winClass('right', m.win)"
            >{{ m.format(right) }}</span>
            <span
              v-if="m.win === 'right'"
              class="w-1.5 h-1.5 bg-health rounded-full flex-shrink-0"
            />
          </div>
        </div>

        <!-- Win tally -->
        <div class="grid grid-cols-3 gap-0 px-5 py-4 bg-bg-card2">
          <div class="font-rye text-2xl" :class="verdict.side === 'left' ? 'text-health' : 'text-tan'">
            {{ metrics.filter(m => m.win === 'left').length }} wins
          </div>
          <div class="font-mono-tech text-[9px] uppercase tracking-[.14em] text-tan text-center self-center">
            TOTAL
          </div>
          <div class="font-rye text-2xl text-right" :class="verdict.side === 'right' ? 'text-health' : 'text-tan'">
            {{ metrics.filter(m => m.win === 'right').length }} wins
          </div>
        </div>
      </MechCard>

      <!-- Verdict Banner -->
      <div
        class="border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        :class="verdict.side === 'tie' ? 'border-amber-w/40 bg-amber-w/8' : 'border-health/40 bg-health/8'"
      >
        <div>
          <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase mb-1"
               :class="verdict.side === 'tie' ? 'text-amber-w' : 'text-health'">
            // AI Verdict
          </div>
          <p class="font-rye text-cream text-xl">
            <span v-if="verdict.side === 'tie'">Both vehicles are equally matched</span>
            <span v-else>
              <span :class="verdict.side === 'tie' ? 'text-amber-w' : 'text-health'">{{ verdict.label }}</span>
              is the better deal
            </span>
          </p>
          <p class="font-barlow-body text-sm text-cream-dim mt-1">
            <template v-if="verdict.side !== 'tie'">
              Wins {{ metrics.filter(m => m.win === verdict.side).length }} of {{ metrics.length }} categories.
              After estimated repairs, it offers better overall value.
            </template>
            <template v-else>
              Consider your priorities — one has lower price, the other has lower repair costs.
            </template>
          </p>
        </div>
        <div class="flex gap-3 flex-shrink-0">
          <RouterLink
            :to="{ name: 'report', params: { id: verdict.side === 'left' ? leftId : rightId } }"
            class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                   px-6 py-3 clip-btn no-underline
                   bg-orange text-bg-deep hover:bg-amber-w transition-colors"
          >View Full Report →</RouterLink>
        </div>
      </div>

      <!-- Add to compare CTA -->
      <div class="text-center mt-10">
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[10px] tracking-[.18em] uppercase
                 text-cyan hover:text-cream transition-colors no-underline"
        >⬡ Scan another vehicle to add to comparison →</RouterLink>
      </div>
    </div>
  </main>
</template>

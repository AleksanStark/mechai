<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFleetStore } from '../stores/fleet'
import { useNotifStore } from '../stores/notif'
import MechCard  from '../components/ui/MechCard.vue'
import MechBadge from '../components/ui/MechBadge.vue'
import ScoreRing from '../components/ui/ScoreRing.vue'

const fleetStore = useFleetStore()
const notif      = useNotifStore()

const filter  = ref('all')
const sortKey = ref('score')
const sortAsc = ref(false)
const searchQ = ref('')

const filtered = computed(() => {
  let arr = fleetStore.vehicles
  if (filter.value !== 'all') arr = arr.filter(v => v.status === filter.value)
  if (searchQ.value) {
    const q = searchQ.value.toLowerCase()
    arr = arr.filter(v => `${v.make} ${v.model}`.toLowerCase().includes(q))
  }
  return [...arr].sort((a, b) => {
    const va = a[sortKey.value], vb = b[sortKey.value]
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
    return sortAsc.value ? cmp : -cmp
  })
})

function toggleSort(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = false }
}

function removeVehicle(id) {
  fleetStore.removeVehicle(id)
  notif.warn('Vehicle removed', 'Entry deleted from fleet registry')
}

const statusVariant = { ok: 'ok', warn: 'warn', crit: 'crit' }
const statusLabel   = { ok: 'Good', warn: 'Moderate', crit: 'Critical' }
function scoreColor(s) {
  if (s >= 80) return 'text-health'
  if (s >= 55) return 'text-amber-w'
  return 'text-hot-red'
}

const months     = ['OCT','NOV','DEC','JAN','FEB','MAR','APR']
const scanCounts = [12,19,14,28,22,31,38]
const maxCount   = Math.max(...scanCounts)
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep">

    <!-- Header -->
    <div class="relative bg-bg-dark border-b border-orange/18 px-6 lg:px-[60px] py-8 overflow-hidden">
      <div class="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-1">
            // AtlasDev Fleet Control
          </div>
          <h1 class="font-rye text-cream" style="font-size: clamp(24px, 3.5vw, 42px)">
            Fleet <span class="text-orange">Dashboard</span>
          </h1>
        </div>
        <RouterLink
          to="/scan"
          class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                 px-6 py-3 clip-btn bg-orange text-bg-deep hover:bg-amber-w
                 transition-colors no-underline flex items-center gap-2 self-start"
        >⬡ New Scan</RouterLink>
      </div>
    </div>

    <div class="px-6 lg:px-[60px] py-10 max-w-[1400px] mx-auto">

      <!-- KPI Row -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
        <MechCard padding="p-5" class="text-center">
          <div class="font-mono-tech text-[8px] tracking-[.2em] uppercase text-tan mb-2">FLEET SIZE</div>
          <div class="font-rye text-4xl text-orange">{{ fleetStore.vehicles.length }}</div>
        </MechCard>
        <MechCard padding="p-5" class="text-center">
          <div class="font-mono-tech text-[8px] tracking-[.2em] uppercase text-tan mb-2">AVG SCORE</div>
          <div class="font-rye text-4xl" :class="scoreColor(fleetStore.avgScore)">{{ fleetStore.avgScore }}</div>
        </MechCard>
        <MechCard padding="p-5" class="text-center">
          <div class="font-mono-tech text-[8px] tracking-[.2em] uppercase text-tan mb-2">GOOD</div>
          <div class="font-rye text-4xl text-health">{{ fleetStore.byStatus.ok }}</div>
        </MechCard>
        <MechCard padding="p-5" class="text-center">
          <div class="font-mono-tech text-[8px] tracking-[.2em] uppercase text-tan mb-2">MODERATE</div>
          <div class="font-rye text-4xl text-amber-w">{{ fleetStore.byStatus.warn }}</div>
        </MechCard>
        <MechCard padding="p-5" class="text-center" :hot="fleetStore.byStatus.crit > 0">
          <div class="font-mono-tech text-[8px] tracking-[.2em] uppercase text-tan mb-2">CRITICAL</div>
          <div class="font-rye text-4xl text-hot-red">{{ fleetStore.byStatus.crit }}</div>
        </MechCard>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">

        <!-- Fleet Table — spans 3 cols -->
        <div class="xl:col-span-3">
          <MechCard padding="p-6">

            <!-- Table toolbar -->
            <div class="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center justify-between">
              <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan">
                // Vehicle Registry — {{ filtered.length }} records
              </div>

              <div class="flex gap-2 flex-wrap">
                <!-- Search -->
                <input
                  v-model="searchQ"
                  placeholder="Search make / model…"
                  class="bg-bg-card border border-orange/25 px-3 py-1.5
                         font-mono-tech text-[10px] text-cream placeholder-tan/50
                         focus:outline-none focus:border-orange/60 w-48"
                />

                <!-- Filter buttons -->
                <div class="flex gap-1">
                  <button
                    v-for="f in ['all','ok','warn','crit']"
                    :key="f"
                    class="font-mono-tech text-[9px] tracking-[.12em] uppercase px-3 py-1.5
                           border transition-all cursor-pointer"
                    :class="filter === f
                      ? 'bg-orange border-orange text-bg-deep font-bold'
                      : 'border-white/12 text-tan hover:border-orange/40'"
                    @click="filter = f"
                  >{{ f }}</button>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-sm">
                <thead>
                  <tr class="border-b border-orange/18">
                    <th
                      v-for="col in [
                        { key:'id',      label:'ID'      },
                        { key:'make',    label:'VEHICLE' },
                        { key:'score',   label:'SCORE'   },
                        { key:'status',  label:'STATUS'  },
                        { key:'mileage', label:'MILEAGE' },
                        { key:'cost',    label:'REPAIR'  },
                        { key:'lastScan',label:'LAST SCAN'},
                      ]"
                      :key="col.key"
                      class="font-mono-tech text-[8px] tracking-[.14em] text-tan text-left
                             pb-3 pr-4 cursor-pointer hover:text-cream transition-colors select-none"
                      @click="toggleSort(col.key)"
                    >
                      {{ col.label }}
                      <span v-if="sortKey === col.key" class="text-orange ml-0.5">
                        {{ sortAsc ? '↑' : '↓' }}
                      </span>
                    </th>
                    <th class="pb-3 text-left font-mono-tech text-[8px] tracking-[.14em] text-tan">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="v in filtered"
                    :key="v.id"
                    class="border-b border-white/5 hover:bg-white/3 transition-colors group"
                  >
                    <td class="font-mono-tech text-[9px] text-tan py-3.5 pr-4">{{ v.id }}</td>
                    <td class="py-3.5 pr-4">
                      <div class="font-barlow-cond text-cream font-semibold text-[14px]">
                        {{ v.make }} {{ v.model }}
                      </div>
                      <div class="font-mono-tech text-[8px] text-tan">{{ v.year }}</div>
                    </td>
                    <td class="py-3.5 pr-4">
                      <span class="font-rye text-lg" :class="scoreColor(v.score)">{{ v.score }}</span>
                    </td>
                    <td class="py-3.5 pr-4">
                      <MechBadge :variant="statusVariant[v.status]" small>
                        {{ statusLabel[v.status] }}
                      </MechBadge>
                    </td>
                    <td class="font-barlow-cond text-[13px] text-cream-dim py-3.5 pr-4">{{ v.mileage }}</td>
                    <td class="font-rye text-sm text-orange py-3.5 pr-4">${{ v.repairCost.toLocaleString() }}</td>
                    <td class="font-mono-tech text-[9px] text-tan py-3.5 pr-4">{{ v.lastScan }}</td>
                    <td class="py-3.5">
                      <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <RouterLink
                          :to="{ name: 'report', params: { id: v.id } }"
                          class="font-mono-tech text-[9px] tracking-[.1em] uppercase text-cyan
                                 hover:text-cream transition-colors no-underline"
                        >View</RouterLink>
                        <RouterLink
                          to="/compare"
                          class="font-mono-tech text-[9px] tracking-[.1em] uppercase text-tan
                                 hover:text-cream transition-colors no-underline"
                        >Compare</RouterLink>
                        <button
                          class="font-mono-tech text-[9px] tracking-[.1em] uppercase text-hot-red/60
                                 hover:text-hot-red transition-colors cursor-pointer bg-transparent border-0"
                          @click="removeVehicle(v.id)"
                        >✕</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="filtered.length === 0"
                class="text-center py-12 font-mono-tech text-[10px] text-tan tracking-[.15em] uppercase"
              >
                // No vehicles match filter
              </div>
            </div>
          </MechCard>
        </div>

        <!-- RIGHT SIDEBAR -->
        <div class="flex flex-col gap-5">

          <!-- Fleet Health Ring -->
          <MechCard padding="p-6" class="text-center">
            <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan mb-4">
              // Fleet Health
            </div>
            <div class="flex justify-center">
              <ScoreRing :score="stats.avgScore" :size="130" />
            </div>
            <p class="font-barlow-body text-xs text-cream-dim mt-4">
              Average across {{ stats.total }} vehicles
            </p>
          </MechCard>

          <!-- Scan Activity Chart -->
          <MechCard padding="p-5">
            <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan mb-4">
              // Scan Activity
            </div>
            <!-- Bar chart -->
            <div class="flex items-end gap-1.5 h-24">
              <div
                v-for="(count, i) in scanCounts"
                :key="i"
                class="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  class="w-full transition-all duration-700 animate-glow-bar"
                  :class="i === scanCounts.length - 1 ? 'bg-orange' : 'bg-steel'"
                  :style="{ height: (count / maxCount * 100) + '%' }"
                />
                <span class="font-mono-tech text-[7px] text-tan">{{ months[i] }}</span>
              </div>
            </div>
            <div class="flex justify-between mt-3">
              <span class="font-mono-tech text-[8px] text-tan">{{ scanCounts.reduce((a,b)=>a+b) }} total</span>
              <span class="font-mono-tech text-[8px] text-health">+23% MoM</span>
            </div>
          </MechCard>

          <!-- Critical Alerts -->
          <MechCard padding="p-5" :hot="true">
            <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-hot-red mb-4
                        flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-hot-red rounded-full animate-pulse" />
              // Critical Alerts
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-for="v in fleetStore.vehicles.filter(x => x.status === 'crit')"
                :key="v.id"
                class="flex items-start justify-between gap-2"
              >
                <div>
                  <p class="font-barlow-cond text-cream text-sm font-semibold">{{ v.make }} {{ v.model }}</p>
                  <p class="font-mono-tech text-[8px] text-tan">{{ v.id }} · Score {{ v.score }}</p>
                </div>
                <RouterLink
                  :to="{ name: 'report', params: { id: v.id } }"
                  class="font-mono-tech text-[8px] text-hot-red hover:text-cream-dim
                         transition-colors no-underline flex-shrink-0 mt-0.5"
                >Inspect →</RouterLink>
              </div>
              <div
                v-if="fleetStore.criticalCount === 0"
                class="font-mono-tech text-[9px] text-tan text-center py-2"
              >// No critical issues</div>
            </div>
          </MechCard>

          <!-- Compare shortcut -->
          <RouterLink
            to="/compare"
            class="block border border-cyan/25 p-4 hover:border-cyan/50 transition-colors no-underline group"
          >
            <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-1">
              // Compare Vehicles
            </div>
            <p class="font-barlow-body text-sm text-cream-dim group-hover:text-cream transition-colors">
              Side-by-side AI analysis to find your best deal →
            </p>
          </RouterLink>

        </div>
      </div>
    </div>
  </main>
</template>

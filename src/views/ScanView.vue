<script setup>
import { ref }      from 'vue'
import { useRouter } from 'vue-router'
import { useScan }  from '../composables/useScan.js'
import MechCard     from '../components/ui/MechCard.vue'
import MechBadge    from '../components/ui/MechBadge.vue'

const router = useRouter()
const {
  stage, progress, previews, currentPhase,
  canScan, addFiles, removeFile, startScan, reset, reportId,
} = useScan()

const dragging  = ref(false)
const fileInput = ref(null)

function onDrop(e) {
  dragging.value = false
  addFiles(e.dataTransfer.files)
}

function onFileInput(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

async function handleScan() {
  await startScan()
}

function goReport() {
  router.push({ name: 'report', params: { id: reportId.value } })
}
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep">

    <!-- Page Header -->
    <div class="relative bg-bg-dark border-b border-orange/18 px-6 lg:px-[60px] py-10 overflow-hidden">
      <div class="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div class="relative z-10">
        <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-2">
          // MechVision AI · New Inspection
        </div>
        <h1 class="font-rye text-cream" style="font-size: clamp(28px, 4vw, 48px)">
          Upload Vehicle Photos
        </h1>
        <p class="font-barlow-body text-cream-dim text-[15px] mt-2 max-w-[540px]">
          Upload up to 8 photos from different angles. Our AI scans all of them simultaneously
          and produces a complete technical inspection report in seconds.
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="px-6 lg:px-[60px] py-12 max-w-[1200px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT — Drop Zone + Preview Grid -->
        <div class="lg:col-span-2 flex flex-col gap-6">

          <!-- Drop Zone -->
          <div
            v-if="stage === 'idle'"
            class="relative border-2 border-dashed transition-all duration-300 cursor-pointer
                   flex flex-col items-center justify-center text-center py-14 px-8"
            :class="dragging
              ? 'border-cyan bg-cyan/5'
              : 'border-orange/35 hover:border-orange/65 hover:bg-orange/4'"
            @dragenter.prevent="dragging = true"
            @dragover.prevent
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
          >
            <!-- HUD corners -->
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
                 :class="dragging ? 'border-cyan' : 'border-orange'" />
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
                 :class="dragging ? 'border-cyan' : 'border-orange'" />
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
                 :class="dragging ? 'border-cyan' : 'border-orange'" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
                 :class="dragging ? 'border-cyan' : 'border-orange'" />

            <svg class="mb-5 opacity-60" width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect x="4" y="12" width="48" height="36" rx="2"
                    :stroke="dragging ? '#00D8FF' : '#E8792A'" stroke-width="1.5" fill="none"/>
              <circle cx="20" cy="26" r="5" :stroke="dragging ? '#00D8FF' : '#E8792A'" stroke-width="1.5" fill="none"/>
              <path d="M4 38 L16 28 L26 36 L36 24 L52 38"
                    :stroke="dragging ? '#00D8FF' : '#E8792A'" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
              <path d="M28 6 L28 12 M24 9 L28 5 L32 9"
                    :stroke="dragging ? '#00D8FF' : '#E8792A'" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </svg>

            <p class="font-barlow-cond text-lg font-semibold text-cream mb-1">
              {{ dragging ? 'Drop photos here' : 'Drag & drop vehicle photos' }}
            </p>
            <p class="font-barlow-body text-sm text-cream-dim">
              or click to browse — JPG, PNG, WEBP · Max 8 photos · 20MB each
            </p>

            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="onFileInput"
            />
          </div>

          <!-- Photo Preview Grid -->
          <div v-if="previews.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="(p, i) in previews"
              :key="p.src"
              class="relative group aspect-square border border-orange/22 overflow-hidden bg-bg-card"
            >
              <img :src="p.src" :alt="p.name" class="w-full h-full object-cover" />

              <!-- Scan overlay when scanning -->
              <div
                v-if="stage === 'scanning'"
                class="absolute inset-0 pointer-events-none"
                style="background: linear-gradient(rgba(0,216,255,.08), rgba(0,216,255,.04))"
              >
                <div class="absolute inset-x-0 h-0.5 animate-laser"
                     style="background: linear-gradient(90deg, transparent, #00D8FF, transparent);
                            box-shadow: 0 0 8px #00D8FF" />
              </div>

              <!-- Remove button (idle only) -->
              <button
                v-if="stage === 'idle'"
                class="absolute top-1.5 right-1.5 w-6 h-6 bg-bg-deep/80 text-hot-red
                       font-mono-tech text-xs flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
                @click.stop="removeFile(i)"
              >✕</button>

              <!-- Photo index tag -->
              <div class="absolute bottom-1.5 left-1.5 font-mono-tech text-[8px] tracking-[.1em]
                          bg-bg-deep/75 text-cyan px-1.5 py-0.5">
                {{ String(i + 1).padStart(2, '0') }}
              </div>

              <!-- Done checkmark -->
              <div
                v-if="stage === 'done'"
                class="absolute inset-0 flex items-center justify-center
                       bg-health/15 border border-health/40"
              >
                <span class="font-mono-tech text-health text-xl">✓</span>
              </div>
            </div>

            <!-- Add more slot -->
            <div
              v-if="stage === 'idle' && previews.length < 8"
              class="aspect-square border border-dashed border-orange/28 flex items-center
                     justify-center cursor-pointer hover:border-orange/55 transition-colors"
              @click="fileInput?.click()"
            >
              <span class="text-orange/50 text-3xl font-thin">+</span>
            </div>
          </div>

          <!-- Scan Progress -->
          <div v-if="stage === 'scanning'" class="bg-bg-card border border-orange/22 p-6">
            <!-- Phase label -->
            <div class="flex justify-between items-center mb-3">
              <span class="font-mono-tech text-[10px] tracking-[.14em] text-cyan">
                {{ currentPhase }}
              </span>
              <span class="font-mono-tech text-[11px] text-orange font-bold">
                {{ Math.round(progress) }}%
              </span>
            </div>

            <!-- Progress bar -->
            <div class="h-1.5 bg-white/8 relative overflow-hidden">
              <div
                class="absolute top-0 left-0 h-full bg-orange transition-all duration-300"
                :style="{ width: progress + '%' }"
                style="box-shadow: 0 0 12px var(--color-orange)"
              />
              <!-- Shimmer -->
              <div class="absolute top-0 left-0 h-full w-16 scan-shimmer"
                   :style="{ left: (progress - 5) + '%' }" />
            </div>

            <!-- Sub-bars for each photo -->
            <div class="mt-4 grid grid-cols-4 gap-1.5">
              <div
                v-for="(p, i) in previews"
                :key="i"
                class="h-0.5 rounded-full transition-all duration-500"
                :class="progress > (i / previews.length) * 100
                  ? 'bg-cyan'
                  : 'bg-white/10'"
              />
            </div>
          </div>

          <!-- Done state -->
          <div v-if="stage === 'done'"
               class="bg-health/8 border border-health/38 p-5 flex items-center justify-between">
            <div>
              <div class="font-mono-tech text-[10px] tracking-[.18em] text-health mb-1">
                // SCAN COMPLETE · {{ reportId }}
              </div>
              <p class="font-barlow-body text-sm text-cream-dim">
                7 defects detected across {{ previews.length }} photos. Full report ready.
              </p>
            </div>
            <button
              class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                     px-6 py-3 clip-btn bg-orange text-bg-deep hover:bg-amber-w
                     transition-colors cursor-pointer flex-shrink-0"
              @click="goReport"
            >View Report →</button>
          </div>
        </div>

        <!-- RIGHT — Info Panel -->
        <div class="flex flex-col gap-5">

          <!-- Scan Button -->
          <MechCard padding="p-0">
            <button
              class="w-full font-mono-tech text-[13px] tracking-[.18em] uppercase font-bold
                     py-5 flex items-center justify-center gap-2.5 transition-all duration-200
                     cursor-pointer border-0"
              :class="canScan
                ? 'bg-orange text-bg-deep hover:bg-amber-w'
                : 'bg-orange/25 text-cream/30 cursor-not-allowed'"
              :disabled="!canScan"
              @click="handleScan"
            >
              <span class="text-lg">⬡</span>
              {{ stage === 'scanning' ? 'Scanning…' : 'Run AI Scan' }}
            </button>
          </MechCard>

          <!-- Tips -->
          <MechCard padding="p-5">
            <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan mb-4">
              // Best Results
            </div>
            <ul class="flex flex-col gap-3">
              <li
                v-for="tip in [
                  'Shoot in daylight — direct sunlight is ideal',
                  'Capture all 4 sides + front & rear',
                  'Include close-ups of any visible damage',
                  'Clean the car first for accurate rust reads',
                  'Avoid reflective angles on glass panels',
                ]"
                :key="tip"
                class="flex items-start gap-2.5 font-barlow-body text-[13px] text-cream-dim"
              >
                <span class="text-orange mt-0.5 flex-shrink-0">›</span>
                {{ tip }}
              </li>
            </ul>
          </MechCard>

          <!-- Supported formats -->
          <MechCard padding="p-5">
            <div class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-cyan mb-3">
              // Input Specs
            </div>
            <div class="flex flex-col gap-2">
              <div v-for="row in [
                { k: 'FORMATS',   v: 'JPG · PNG · WEBP · HEIC' },
                { k: 'MAX SIZE',  v: '20 MB per photo'          },
                { k: 'MAX COUNT', v: '8 photos per scan'         },
                { k: 'MIN RES',   v: '640 × 480 px'             },
                { k: 'SCAN TIME', v: '2 – 6 seconds'            },
              ]" :key="row.k" class="flex justify-between">
                <span class="font-mono-tech text-[9px] text-tan tracking-[.1em]">{{ row.k }}</span>
                <span class="font-barlow-cond text-[12px] text-cream-dim font-medium">{{ row.v }}</span>
              </div>
            </div>
          </MechCard>

          <!-- Reset -->
          <button
            v-if="previews.length || stage !== 'idle'"
            class="font-mono-tech text-[10px] tracking-[.15em] uppercase text-tan
                   hover:text-cream-dim transition-colors cursor-pointer bg-transparent border-0
                   text-left"
            @click="reset"
          >◂ Reset &amp; start over</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.scan-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
  width: 60px;
}
</style>

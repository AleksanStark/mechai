<script setup lang="ts">
interface DetectionBox {
  label: string
  variant: 'default' | 'warn' | 'danger'
  style: Record<string, string>
}

interface InspectionRow {
  key: string
  value: string
  valueClass: 'ok' | 'warn' | 'danger'
  fillClass: 'fill-g' | 'fill-m' | 'fill-b' | 'fill-gg'
}

interface SummaryRow {
  key: string
  value: string
  valueClass?: 'ok' | 'warn' | 'danger' | ''
}

const detectionBoxes: DetectionBox[] = [
  {
    label: 'RUST — CRITICAL',
    variant: 'default',
    style: { top: '38%', left: '44%', width: '70px', height: '26px' },
  },
  {
    label: 'WINDSHIELD — CRACK',
    variant: 'warn',
    style: { top: '16%', left: '26%', width: '88px', height: '52px' },
  },
  {
    label: 'HEADLIGHT — OK',
    variant: 'default',
    style: { top: '50%', left: '3%', width: '60px', height: '38px' },
  },
  {
    label: 'TAILLIGHT — WORN',
    variant: 'warn',
    style: { top: '52%', right: '7%', width: '58px', height: '36px' },
  },
]

const inspectionRows: InspectionRow[] = [
  { key: 'EXTERIOR_BODY', value: 'MODERATE', valueClass: 'warn',   fillClass: 'fill-m' },
  { key: 'GLASS / SEALS', value: 'CRITICAL', valueClass: 'danger', fillClass: 'fill-b' },
  { key: 'WHEELS / TIRES', value: 'GOOD',    valueClass: 'ok',     fillClass: 'fill-g' },
  { key: 'LIGHTING',       value: 'GOOD',    valueClass: 'ok',     fillClass: 'fill-gg' },
]

const summaryRows: SummaryRow[] = [
  { key: 'RUST_ZONES',    value: '3 DETECTED',       valueClass: 'danger' },
  { key: 'DEFECTS_TOTAL', value: '7 ITEMS',           valueClass: '' },
  { key: 'EST_REPAIR',    value: '$1,200 – $1,800',   valueClass: 'warn' },
  { key: 'SCAN_TIME',     value: '2.8 SEC',           valueClass: 'ok' },
]
</script>

<template>
  <section class="scan-demo">
    <div class="g-grid" style="opacity: 0.35"></div>

    <div class="section-head">
      <div class="s-label">// Live Interface Preview</div>
      <h2 class="s-heading">The Eye That Never Misses</h2>
    </div>

    <!-- Scan UI -->
    <div class="scan-ui hud-frame">
      <!-- HUD bottom corners -->
      <div class="hc-bl"></div>
      <div class="hc-br"></div>

      <!-- LEFT: Scan View -->
      <div class="scan-view">
        <div class="grid-inner"></div>

        <!-- Car SVG -->
        <svg style="width: 82%; z-index: 1; position: relative" viewBox="0 0 420 230" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="210" cy="218" rx="150" ry="6" fill="#000" opacity=".5" />
          <rect x="18" y="128" width="384" height="72" rx="3" fill="#1A2840" stroke="#3D5F7A" stroke-width="1.2" />
          <path d="M78 128 L108 58 L312 58 L342 128Z" fill="#1C2E44" stroke="#3D5F7A" stroke-width="1.2" />
          <path d="M114 122 L128 68 L292 68 L306 122Z" fill="#0C1E30" stroke="#4A7A9B" stroke-width=".8" opacity=".8" />
          <path d="M186 122 L195 68 L292 68 L306 122Z" fill="#0A1828" opacity=".6" />
          <line x1="188" y1="128" x2="188" y2="200" stroke="#3D5F7A" stroke-width=".6" />
          <line x1="18" y1="148" x2="108" y2="148" stroke="#2A4060" stroke-width=".5" />
          <line x1="312" y1="148" x2="402" y2="148" stroke="#2A4060" stroke-width=".5" />
          <rect x="20" y="133" width="34" height="18" rx="1" fill="#E8792A" opacity=".85" />
          <rect x="22" y="135" width="30" height="14" rx="1" fill="#FFA050" opacity=".6" />
          <rect x="366" y="133" width="34" height="18" rx="1" fill="#CC2020" opacity=".85" />
          <circle cx="108" cy="196" r="30" fill="#0A0F18" stroke="#3D5F7A" stroke-width="1.8" />
          <circle cx="108" cy="196" r="16" fill="#141C28" stroke="#4A6B8A" stroke-width="1.2" />
          <circle cx="108" cy="196" r="5" fill="#3D5F7A" />
          <circle cx="312" cy="196" r="30" fill="#0A0F18" stroke="#3D5F7A" stroke-width="1.8" />
          <circle cx="312" cy="196" r="16" fill="#141C28" stroke="#4A6B8A" stroke-width="1.2" />
          <circle cx="312" cy="196" r="5" fill="#3D5F7A" />
          <rect x="80" y="118" width="14" height="8" rx="1" fill="#1C2E44" stroke="#3D5F7A" stroke-width=".5" />
          <rect x="20" y="153" width="34" height="1.5" fill="#3D5F7A" opacity=".7" />
          <circle cx="240" cy="155" r="5" fill="#6B3010" opacity=".6" />
          <circle cx="248" cy="158" r="3" fill="#6B3010" opacity=".5" />
          <circle cx="235" cy="160" r="4" fill="#6B3010" opacity=".4" />
        </svg>

        <!-- Detection Boxes -->
        <div
          v-for="(box, i) in detectionBoxes"
          :key="i"
          class="dbox"
          :class="[`dbox--${box.variant}`]"
          :style="box.style"
        >
          <span class="dlabel">{{ box.label }}</span>
        </div>

        <!-- Laser scan beam -->
        <div class="laser"></div>

        <!-- HUD overlays -->
        <div class="hud-overlay hud-overlay--tl">
          SCAN_MODE: FULL<br />
          RES: 4096×2160<br />
          MODEL: MECHVISION_v3
        </div>
        <div class="hud-overlay hud-overlay--tr">
          FRAME: 1024<br />
          FPS: 60<br />
          STATUS: SCANNING
        </div>

        <!-- Reticle -->
        <div class="reticle-outer"></div>
        <div class="reticle-dot"></div>
      </div>

      <!-- RIGHT: Data Panel -->
      <div class="data-panel">
        <div class="dp-head">// INSPECTION — 2019 Toyota Camry XLE · VIN ····8274</div>

        <!-- Score -->
        <div class="score-box">
          <div class="score-n">72</div>
          <div class="score-l">Overall Health Score</div>
        </div>

        <!-- Inspection rows -->
        <div v-for="row in inspectionRows" :key="row.key" class="inspect-row-wrap">
          <div class="data-row">
            <span class="dk">{{ row.key }}</span>
            <span class="dv" :class="[`dv--${row.valueClass}`]">{{ row.value }}</span>
          </div>
          <div class="htrack">
            <div class="hfill" :class="row.fillClass"></div>
          </div>
        </div>

        <!-- Summary rows -->
        <div class="summary-section">
          <div
            v-for="row in summaryRows"
            :key="row.key"
            class="data-row"
          >
            <span class="dk">{{ row.key }}</span>
            <span class="dv" :class="row.valueClass ? `dv--${row.valueClass}` : ''">{{ row.value }}</span>
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 11px; padding: 13px">
          ⬡ Download Full Report PDF
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scan-demo {
  padding: 100px 60px;
  background: var(--bg-dark);
  position: relative;
  overflow: hidden;
}

.section-head {
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Scan UI Grid */
.scan-ui {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  max-width: 1120px;
  margin: 64px auto 0;
  border: 1px solid var(--b-warm);
}

/* HUD bottom corners (the ::before/::after handles top) */
.hc-bl,
.hc-br {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 3;
}

.hc-bl {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid var(--cyan);
  border-left: 2px solid var(--cyan);
}

.hc-br {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid var(--cyan);
  border-right: 2px solid var(--cyan);
}

/* Scan View (left panel) */
.scan-view {
  background: #080c0f;
  aspect-ratio: 4 / 3;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-inner {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 216, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 216, 255, 0.05) 1px, transparent 1px);
  background-size: 22px 22px;
}

/* Laser beam */
.laser {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  box-shadow: 0 0 12px var(--cyan), 0 0 4px rgba(0, 216, 255, 0.6);
  animation: lscan 3.5s ease-in-out infinite;
}

@keyframes lscan {
  0%, 100% { top: 8%; }
  50%       { top: 88%; }
}

/* Detection boxes */
.dbox {
  position: absolute;
  border: 1px solid var(--cyan);
  animation: dpulse 2.2s ease-in-out infinite;
}

.dbox--warn {
  border-color: var(--orange);
  animation-name: dpulse-w;
}

.dbox--danger {
  border-color: var(--red);
  animation-name: dpulse-d;
}

@keyframes dpulse   { 0%, 100% { border-color: var(--cyan);   opacity: 0.65; } 50% { opacity: 1; } }
@keyframes dpulse-w { 0%, 100% { border-color: var(--orange); opacity: 0.65; } 50% { opacity: 1; } }
@keyframes dpulse-d { 0%, 100% { border-color: var(--red);    opacity: 0.65; } 50% { opacity: 1; } }

.dlabel {
  position: absolute;
  top: -18px;
  left: 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.1em;
  padding: 2px 5px;
  white-space: nowrap;
  background: rgba(8, 12, 15, 0.75);
  color: var(--cyan);
}

.dbox--warn .dlabel  { color: var(--orange); }
.dbox--danger .dlabel { color: var(--red); }

/* HUD text overlays */
.hud-overlay {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 8.5px;
  line-height: 1.7;
  color: rgba(0, 216, 255, 0.65);
}

.hud-overlay--tl { top: 9px; left: 12px; }
.hud-overlay--tr { top: 9px; right: 12px; text-align: right; }

/* Reticle */
.reticle-outer {
  position: absolute;
  width: 24px; height: 24px;
  border: 1px solid rgba(0, 216, 255, 0.3);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.reticle-dot {
  position: absolute;
  width: 4px; height: 4px;
  background: rgba(0, 216, 255, 0.5);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

/* Data Panel (right side) */
.data-panel {
  background: var(--bg-card);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dp-head {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--cyan);
  padding-bottom: 14px;
  border-bottom: 1px solid var(--b-cyan);
}

/* Score */
.score-box {
  background: var(--bg-card2);
  border: 1px solid var(--b-warm);
  padding: 18px;
  text-align: center;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}

.score-n {
  font-family: 'Rye', serif;
  font-size: 52px;
  color: #4ade80;
  line-height: 1;
}

.score-l {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--tan);
  margin-top: 4px;
}

/* Data rows */
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dk {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: var(--tan);
  letter-spacing: 0.1em;
}

.dv {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--cream);
}

.dv--ok     { color: #4ade80; }
.dv--warn   { color: var(--amber); }
.dv--danger { color: var(--red); }

/* Health tracks */
.htrack {
  margin-top: 7px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  position: relative;
}

.hfill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
}

.fill-g  { background: #4ade80; width: 78%; box-shadow: 0 0 6px rgba(74, 222, 128, 0.5); }
.fill-m  { background: var(--amber); width: 45%; box-shadow: 0 0 6px rgba(240, 160, 80, 0.5); }
.fill-b  { background: var(--red); width: 12%; box-shadow: 0 0 6px rgba(255, 34, 34, 0.5); }
.fill-gg { background: #4ade80; width: 89%; box-shadow: 0 0 6px rgba(74, 222, 128, 0.5); }

/* Summary section */
.summary-section {
  border-top: 1px solid var(--b-warm);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

@media (max-width: 900px) {
  .scan-demo { padding: 60px 20px; }
  .scan-ui   { grid-template-columns: 1fr; }
}
</style>

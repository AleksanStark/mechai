<script setup lang="ts">
import type { CSSProperties } from "vue";
import AppButton from "../../../shared/ui/AppButton.vue";

interface HeroStat {
  value: string;
  label: string;
}

const stats: HeroStat[] = [
  { value: "98.4%", label: "Detection Accuracy" },
  { value: "3.2s", label: "Avg. Scan Time" },
  { value: "200+", label: "Defect Categories" },
  { value: "1.2M", label: "Vehicles Inspected" },
];

type PixelCross = CSSProperties;

const pixelCrosses: PixelCross[] = [
  { top: "22%", left: "42%" },
  { top: "55%", left: "62%" },
  { bottom: "18%", left: "48%" },
  { top: "35%", right: "28%" },
];
</script>

<template>
  <section class="hero">
    <!-- Grid overlay -->
    <div class="g-grid"></div>

    <!-- Desert glow -->
    <div class="hero-desert"></div>

    <!-- Scan lines -->
    <div class="scan-h"></div>
    <div class="scan-h scan-h--delay"></div>

    <!-- Pixel crosses -->
    <span
      v-for="(cross, i) in pixelCrosses"
      :key="i"
      class="px-cross"
      :style="cross"
      >+</span
    >

    <!-- Hero Content -->
    <div class="hero-left">
      <div class="eyebrow">MechVision AI · System v3.1 · Active</div>

      <h1>
        No Car
        <span class="accent">Hides Its</span>
        Secrets
      </h1>

      <p class="hero-body">
        Upload a photo — our laser-eyed AI performs a full technical inspection
        in seconds. Rust, cracks, wear, and hidden damage don't stand a chance.
      </p>

      <div class="hero-actions">
        <AppButton variant="primary" size="lg"> ⬡ Scan A Vehicle </AppButton>

        <AppButton variant="outline" size="lg"> ◈ Watch Demo </AppButton>
      </div>
    </div>

    <!-- Stats Column -->
    <div class="hero-stats">
      <div v-for="stat in stats" :key="stat.label" class="stat-box">
        <div class="stat-corner"></div>
        <div class="stat-n">{{ stat.value }}</div>
        <div class="stat-l">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 110px 60px 80px;
  overflow: hidden;
}

.hero-desert {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: radial-gradient(
    ellipse at 50% 110%,
    rgba(210, 80, 20, 0.14) 0%,
    rgba(180, 55, 10, 0.07) 45%,
    transparent 70%
  );
  pointer-events: none;
}

/* Scan lines */
.scan-h {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--cyan) 30%,
    rgba(0, 216, 255, 0.9) 50%,
    var(--cyan) 70%,
    transparent 100%
  );
  animation: scanV 5s linear infinite;
  opacity: 0;
  pointer-events: none;
}

.scan-h--delay {
  animation-delay: -2.5s;
}

@keyframes scanV {
  0% {
    top: 0%;
    opacity: 0;
  }
  8% {
    opacity: 0.35;
  }
  92% {
    opacity: 0.35;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* Pixel crosses */
.px-cross {
  position: absolute;
  font-family: "Share Tech Mono", monospace;
  font-size: 14px;
  color: var(--orange);
  opacity: 0.4;
  animation: pxpulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pxpulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.6;
  }
}

/* Hero left */
.hero-left {
  position: relative;
  z-index: 2;
  max-width: 660px;
}

.eyebrow {
  font-family: "Share Tech Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.eyebrow::before {
  content: "";
  width: 28px;
  height: 1px;
  background: var(--cyan);
  flex-shrink: 0;
}

h1 {
  font-family: "Rye", serif;
  font-size: clamp(50px, 7.5vw, 94px);
  line-height: 0.95;
  color: var(--cream);
}

.accent {
  color: var(--orange);
  display: block;
}

.hero-body {
  font-family: "Barlow", sans-serif;
  font-size: 17px;
  line-height: 1.7;
  color: var(--cream-dim);
  margin: 26px 0 40px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  align-items: center;
}

/* Stats */
.hero-stats {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-box {
  background: var(--bg-card);
  border: 1px solid var(--b-warm);
  padding: 18px 26px;
  clip-path: polygon(
    0 0,
    calc(100% - 14px) 0,
    100% 14px,
    100% 100%,
    14px 100%,
    0 calc(100% - 14px)
  );
  position: relative;
}

.stat-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-top: 14px solid var(--orange);
  border-left: 14px solid transparent;
}

.stat-n {
  font-family: "Rye", serif;
  font-size: 38px;
  color: var(--orange);
  line-height: 1;
}

.stat-l {
  font-family: "Share Tech Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--tan);
  margin-top: 4px;
}

@media (max-width: 900px) {
  .hero {
    padding: 100px 20px 60px;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-stats {
    position: static;
    transform: none;
    margin-top: 40px;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  .stat-box {
    flex: 1 1 calc(50% - 6px);
    min-width: 140px;
  }
}
</style>

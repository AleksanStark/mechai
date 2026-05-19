<script setup lang="ts">
import { useRouter } from "vue-router";
import AppButton from "../../../shared/ui/AppButton.vue";

const router = useRouter();

const goRecommendation = () => {
  router.push("/chat/recommendation");
};

const goAnalyze = () => {
  router.push("/chat/analyze");
};
</script>

<template>
  <section class="scan-page">
    <div class="scan-grid"></div>

    <div class="scan-window hud-frame">
      <div class="scan-label">SYSTEM INTERFACE</div>

      <h1 class="scan-title">Choose Operation</h1>

      <p class="scan-subtitle">
        Select analysis mode for neural scan processing
      </p>

      <div class="scan-actions">
        <AppButton variant="outline" size="lg" @click="goRecommendation">
          Recommendation
        </AppButton>

        <AppButton variant="primary" size="lg" @click="goAnalyze">
          Analyze
        </AppButton>
      </div>

      <button class="back-btn" @click="router.back">← Back</button>
    </div>
  </section>
</template>

<style scoped>
/* ── PAGE ── */
.scan-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
  position: relative;
  overflow: hidden;
}

/* ── GRID ── */
.scan-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(0, 216, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 216, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.6;
}

/* ── WINDOW ── */
.scan-window {
  width: min(520px, 90vw);
  padding: 42px 36px;
  background: linear-gradient(145deg, var(--bg-dark), var(--bg-card));
  border: 1px solid rgba(0, 216, 255, 0.25);
  box-shadow:
    0 0 40px rgba(0, 216, 255, 0.08),
    inset 0 0 30px rgba(0, 0, 0, 0.6);
  position: relative;
  backdrop-filter: blur(6px);
}

/* ── HUD FRAME (from your system) ── */
.hud-frame {
  position: relative;
}

.hud-frame::before,
.hud-frame::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 3;
}

.hud-frame::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid var(--cyan);
  border-left: 2px solid var(--cyan);
}

.hud-frame::after {
  top: -1px;
  right: -1px;
  border-top: 2px solid var(--cyan);
  border-right: 2px solid var(--cyan);
}

/* ── TEXT ── */
.scan-label {
  font-family: "Share Tech Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--cyan);
  margin-bottom: 16px;
}

.scan-title {
  font-family: "Rye", serif;
  font-size: 38px;
  color: var(--cream);
  margin-bottom: 10px;
}

.scan-subtitle {
  font-family: "Barlow Condensed", sans-serif;
  color: var(--cream-dim);
  font-size: 14px;
  margin-bottom: 28px;
}

/* ── ACTIONS ── */
.scan-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── BUTTON HOVER FX ── */
.scan-actions :deep(button) {
  width: 100%;
  justify-content: center;
  letter-spacing: 0.18em;
  transition: all 0.25s ease;
}

.scan-actions :deep(button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 0 18px rgba(0, 216, 255, 0.25);
}

/* ── BACK BUTTON ── */
.back-btn {
  margin-top: 26px;
  background: transparent;
  border: none;
  color: var(--cream-dim);
  font-family: "Share Tech Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--cyan);
}
</style>

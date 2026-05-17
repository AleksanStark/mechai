<script setup lang="ts">
import AppButton from "../../../shared/ui/AppButton.vue";

interface TrustBadge {
  label: string;
}

const trustBadges: TrustBadge[] = [
  { label: "SOC 2 Compliant" },
  { label: "GDPR Ready" },
  { label: "No Card Required" },
  { label: "Cancel Anytime" },
];
</script>

<template>
  <section class="cta">
    <div class="cta-glow"></div>

    <div class="cta-inner">
      <div class="s-label">// Ready, Sheriff?</div>

      <div class="wanted-frame">
        <div class="wanted-in">
          <h2 class="s-heading" style="font-size: clamp(34px, 5.5vw, 66px)">
            Dead or Alive —<br />Every Defect
          </h2>
        </div>
      </div>

      <p class="cta-sub">
        Stop paying for hidden problems. Every vehicle inspection starts with
        the full truth.
      </p>

      <div class="cta-actions">
        <AppButton variant="primary" size="lg">
          ⬡ Scan Your First Car Free
        </AppButton>

        <AppButton variant="outline" size="lg"> ◈ Book a Demo </AppButton>
      </div>

      <div class="trust-row">
        <span v-for="badge in trustBadges" :key="badge.label" class="trust">
          {{ badge.label }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 120px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 110%,
    rgba(200, 80, 20, 0.12),
    transparent 65%
  );
  pointer-events: none;
}

.cta-inner {
  position: relative;
  z-index: 2;
}

.wanted-frame {
  border: 3px double var(--orange-dim);
  padding: 5px;
  display: inline-block;
  margin: 28px auto;
}

.wanted-in {
  border: 1px solid var(--orange-dim);
  padding: 44px 80px;
}

.cta-sub {
  font-family: "Barlow", sans-serif;
  font-size: 17px;
  color: var(--cream-dim);
  max-width: 480px;
  margin: 0 auto 40px;
  line-height: 1.65;
}

.cta-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.trust-row {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 44px;
  flex-wrap: wrap;
}

.trust {
  font-family: "Share Tech Mono", monospace;
  font-size: 9.5px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--tan);
  display: flex;
  align-items: center;
  gap: 8px;
}

.trust::before {
  content: "";
  width: 5px;
  height: 5px;
  background: var(--cyan);
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .cta {
    padding: 60px 20px;
  }
  .wanted-in {
    padding: 28px 20px;
  }
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>

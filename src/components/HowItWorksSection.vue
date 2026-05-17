<script setup lang="ts">
interface Step {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Upload Photos',
    description:
      'Snap or upload photos from any angle — phone camera works fine. No special equipment required.',
  },
  {
    number: '02',
    title: 'AI Scans',
    description:
      'MechVision runs each image through 12 neural network layers trained on 5M+ real inspections.',
  },
  {
    number: '03',
    title: 'Defects Mapped',
    description:
      'Every issue pinpointed with location, severity score, and repair cost benchmarks from 1,200+ shops.',
  },
  {
    number: '04',
    title: 'Report Ready',
    description:
      'Download your PDF instantly or share a link. Negotiate with data, not gut feelings.',
  },
]
</script>

<template>
  <section class="how">
    <div class="g-grid" style="opacity: 0.3"></div>

    <div class="section-head">
      <div class="s-label">// Process Flow</div>
      <h2 class="s-heading">Four Shots. Full Picture.</h2>
    </div>

    <div class="steps">
      <div
        v-for="step in steps"
        :key="step.number"
        class="step"
      >
        <div class="step-n">{{ step.number }}</div>
        <div class="step-t">{{ step.title }}</div>
        <p class="step-d">{{ step.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  padding: 100px 60px;
  background: var(--bg-dark);
  position: relative;
}

.section-head {
  text-align: center;
  position: relative;
  z-index: 1;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-top: 64px;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 27px;
  left: 60px;
  right: 60px;
  height: 1px;
  background: repeating-linear-gradient(
    90deg,
    var(--orange) 0,
    var(--orange) 6px,
    transparent 6px,
    transparent 14px
  );
}

.step {
  padding: 0 18px;
  text-align: center;
}

.step-n {
  width: 54px;
  height: 54px;
  margin: 0 auto 22px;
  border: 1px solid var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Rye', serif;
  font-size: 20px;
  color: var(--orange);
  background: var(--bg-dark);
  position: relative;
  z-index: 2;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}

.step-t {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: 12px;
}

.step-d {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: var(--cream-dim);
}

@media (max-width: 900px) {
  .how    { padding: 60px 20px; }
  .steps  { grid-template-columns: 1fr; gap: 32px; }
  .steps::before { display: none; }
}
</style>

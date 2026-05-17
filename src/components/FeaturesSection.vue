<script setup lang="ts">
interface Feature {
  title: string
  description: string
  tag: string
  iconHtml: string
}

const features: Feature[] = [
  {
    title: 'Vision Scan',
    description:
      'Upload any photo or video. MechVision processes every pixel across 200+ damage categories with military-precision neural networks trained on 5M+ vehicles.',
    tag: '// Computer Vision',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="20" width="36" height="1.5" fill="#00D8FF" opacity=".3"/>
      <rect x="4" y="22" width="36" height="2" fill="#00D8FF" opacity=".6"/>
      <rect x="4" y="25" width="36" height="1.5" fill="#00D8FF" opacity=".3"/>
      <rect x="14" y="6" width="16" height="32" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <circle cx="22" cy="22" r="5" fill="#00D8FF"/>
      <circle cx="22" cy="22" r="2.5" fill="#080C0F"/>
      <rect x="6" y="6" width="6" height="1" fill="#00D8FF" opacity=".4"/>
      <rect x="6" y="6" width="1" height="6" fill="#00D8FF" opacity=".4"/>
      <rect x="32" y="6" width="6" height="1" fill="#00D8FF" opacity=".4"/>
      <rect x="37" y="6" width="1" height="6" fill="#00D8FF" opacity=".4"/>
    </svg>`,
  },
  {
    title: 'Rust & Corrosion AI',
    description:
      'Spectral analysis detects oxidation at sub-millimeter level. Catch early-stage rust before it becomes a $3,000 problem. Severity scored 0–100 per zone.',
    tag: '// Spectral Analysis',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 36 L6 10 L38 10" stroke="#E8792A" stroke-width="1.5" fill="none"/>
      <rect x="10" y="20" width="5" height="16" fill="#E8792A" opacity=".5"/>
      <rect x="19" y="14" width="5" height="22" fill="#E8792A" opacity=".75"/>
      <rect x="28" y="24" width="5" height="12" fill="#E8792A" opacity=".5"/>
      <circle cx="12.5" cy="18" r="2" fill="#E8792A"/>
      <circle cx="21.5" cy="12" r="2" fill="#E8792A"/>
      <circle cx="30.5" cy="22" r="2" fill="#E8792A"/>
      <path d="M12.5 18 L21.5 12 L30.5 22" stroke="#E8792A" stroke-width="1" fill="none"/>
    </svg>`,
  },
  {
    title: 'Price Intelligence',
    description:
      'Real-time market valuation based on detected condition, mileage estimates, and historical auction data from 2M+ verified transactions across all regions.',
    tag: '// Market Data',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 36 L6 10 L38 10" stroke="#E8792A" stroke-width="1.5" fill="none"/>
      <rect x="10" y="24" width="5" height="12" fill="#E8792A" opacity=".5"/>
      <rect x="19" y="18" width="5" height="18" fill="#E8792A" opacity=".75"/>
      <rect x="28" y="14" width="5" height="22" fill="#E8792A" opacity=".5"/>
      <circle cx="12.5" cy="22" r="2" fill="#E8792A"/>
      <circle cx="21.5" cy="16" r="2" fill="#E8792A"/>
      <circle cx="30.5" cy="12" r="2" fill="#E8792A"/>
      <path d="M12.5 22 L21.5 16 L30.5 12" stroke="#E8792A" stroke-width="1" fill="none"/>
    </svg>`,
  },
  {
    title: 'VIN Decoder',
    description:
      'Cross-reference scan results with full vehicle history — accidents, mileage rollback, flood damage, salvage titles, and 10-year service records.',
    tag: '// History Check',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="32" height="32" rx="2" fill="none" stroke="#5A7F9E" stroke-width="1"/>
      <rect x="10" y="10" width="10" height="10" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <rect x="24" y="10" width="10" height="10" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <rect x="10" y="24" width="10" height="10" fill="none" stroke="#00D8FF" stroke-width="1"/>
      <rect x="24" y="24" width="10" height="10" fill="#E8792A" opacity=".25" stroke="#E8792A" stroke-width="1"/>
      <line x1="6" y1="22" x2="38" y2="22" stroke="#5A7F9E" stroke-width=".5" stroke-dasharray="3 2"/>
      <line x1="22" y1="6" x2="22" y2="38" stroke="#5A7F9E" stroke-width=".5" stroke-dasharray="3 2"/>
    </svg>`,
  },
  {
    title: 'Fleet Manager',
    description:
      'Track condition scores, maintenance cycles, and depreciation curves across your entire inventory. Built for dealers, rental agencies, and logistics operators.',
    tag: '// Enterprise',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="14" fill="none" stroke="#E8792A" stroke-width="1" stroke-dasharray="4 2"/>
      <circle cx="22" cy="22" r="7" fill="none" stroke="#E8792A" stroke-width="1"/>
      <circle cx="22" cy="22" r="2.5" fill="#E8792A"/>
      <line x1="22" y1="6" x2="22" y2="15" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="22" y1="29" x2="22" y2="38" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="6" y1="22" x2="15" y2="22" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="29" y1="22" x2="38" y2="22" stroke="#E8792A" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    title: 'Instant Report',
    description:
      'Branded PDF with annotated photos, defect pinpoints, severity ratings, and repair cost breakdowns — auto-generated in under 10 seconds and ready to send.',
    tag: '// Auto Report',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="32" height="28" rx="2" fill="none" stroke="#5A7F9E" stroke-width="1"/>
      <rect x="6" y="8" width="32" height="8" fill="#5A7F9E" opacity=".15"/>
      <line x1="16" y1="22" x2="28" y2="22" stroke="#5A7F9E" stroke-width="1"/>
      <line x1="16" y1="27" x2="24" y2="27" stroke="#5A7F9E" stroke-width="1"/>
      <circle cx="12" cy="22" r="2" fill="#E8792A"/>
      <circle cx="12" cy="27" r="2" fill="#4ADE80"/>
      <rect x="14" y="36" width="16" height="4" rx="1" fill="#3D5F7A" opacity=".5"/>
      <rect x="20" y="36" width="4" height="4" fill="#3D5F7A" opacity=".8"/>
    </svg>`,
  },
  {
    title: 'Developer API',
    description:
      'RESTful API with webhooks, batch processing, and white-label options. Integrate MechAI inspection into your own marketplace or dealership platform.',
    tag: '// REST API',
    iconHtml: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="28" height="28" rx="2" fill="none" stroke="#5A7F9E" stroke-width="1"/>
      <rect x="12" y="14" width="8" height="2" fill="#00D8FF" opacity=".6"/>
      <rect x="12" y="19" width="20" height="1.5" fill="#5A7F9E" opacity=".5"/>
      <rect x="12" y="23" width="16" height="1.5" fill="#5A7F9E" opacity=".5"/>
      <rect x="12" y="27" width="18" height="1.5" fill="#5A7F9E" opacity=".5"/>
      <rect x="28" y="10" width="10" height="10" rx="5" fill="#E8792A"/>
      <rect x="32" y="14" width="2" height="2" fill="#fff"/>
      <rect x="32" y="12" width="2" height="1" fill="#fff"/>
    </svg>`,
  },
]
</script>

<template>
  <section class="features">
    <div class="section-head">
      <div class="s-label">// Core Capabilities</div>
      <div class="divider">
        <div class="d-line"></div>
        <span class="d-ico">✦</span>
        <div class="d-line"></div>
      </div>
      <h2 class="s-heading">What MechAI Sees</h2>
    </div>

    <div class="feat-grid">
      <div
        v-for="feat in features"
        :key="feat.title"
        class="feat"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="feat-ico" v-html="feat.iconHtml"></div>
        <div class="feat-title">{{ feat.title }}</div>
        <p class="feat-desc">{{ feat.description }}</p>
        <span class="feat-tag">{{ feat.tag }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 100px 60px;
  position: relative;
}

.section-head {
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 340px;
  margin: 18px auto;
}

.d-line {
  flex: 1;
  height: 1px;
  background: var(--b-warm);
}

.d-ico {
  color: var(--orange);
  font-size: 12px;
}

/* Feature Grid */
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 64px;
}

.feat {
  background: var(--bg-card);
  padding: 38px 30px;
  border: 1px solid transparent;
  transition: border-color 0.25s;
  position: relative;
  overflow: hidden;
}

.feat:hover {
  border-color: var(--b-warm);
}

.feat::before {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  width: 60px; height: 60px;
  background: radial-gradient(
    circle at 100% 100%,
    rgba(232, 121, 42, 0.06),
    transparent 70%
  );
}

.feat-ico {
  width: 44px;
  height: 44px;
  margin-bottom: 22px;
}

:deep(.feat-ico svg) {
  width: 100%;
  height: 100%;
}

.feat-title {
  font-family: 'Rye', serif;
  font-size: 20px;
  color: var(--cream);
  margin-bottom: 14px;
}

.feat-desc {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  line-height: 1.65;
  color: var(--cream-dim);
}

.feat-tag {
  display: inline-block;
  margin-top: 20px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cyan);
  border: 1px solid var(--b-cyan);
  padding: 4px 10px;
}

@media (max-width: 900px) {
  .features   { padding: 60px 20px; }
  .feat-grid  { grid-template-columns: 1fr; }
}
</style>

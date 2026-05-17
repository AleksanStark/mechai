<script setup lang="ts">
type ButtonVariant = 'primary' | 'outline'

interface PricingPlan {
  tier: string
  price: number
  period: string
  features: string[]
  isPopular: boolean
  buttonText: string
  buttonVariant: ButtonVariant
}

const plans: PricingPlan[] = [
  {
    tier: '// Scout',
    price: 29,
    period: 'per month · billed monthly',
    features: [
      '50 scans / month',
      'Basic defect detection',
      'PDF reports',
      'Email support',
    ],
    isPopular: false,
    buttonText: 'Start Free Trial',
    buttonVariant: 'outline',
  },
  {
    tier: '// Marshal',
    price: 99,
    period: 'per month · billed monthly',
    features: [
      '500 scans / month',
      'Full defect + rust detection',
      'VIN + history check',
      'Price intelligence',
      'API access (10k calls)',
      'Priority support',
    ],
    isPopular: true,
    buttonText: 'Get Marshal Plan',
    buttonVariant: 'primary',
  },
  {
    tier: '// Sheriff',
    price: 349,
    period: 'per month · billed monthly',
    features: [
      'Unlimited scans',
      'Fleet management',
      'White-label reports',
      'Full API access',
      'Custom AI fine-tuning',
      'Dedicated support',
    ],
    isPopular: false,
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
  },
]
</script>

<template>
  <section class="pricing">
    <div class="section-head">
      <div class="s-label">// Choose Your Badge</div>
      <h2 class="s-heading">Name Your Bounty</h2>
    </div>

    <div class="price-grid">
      <div
        v-for="plan in plans"
        :key="plan.tier"
        class="p-card"
        :class="{ hot: plan.isPopular }"
      >
        <div v-if="plan.isPopular" class="p-badge">Most Popular</div>

        <div class="p-tier">{{ plan.tier }}</div>

        <div class="p-price">
          <sup>$</sup>{{ plan.price }}
        </div>

        <div class="p-period">{{ plan.period }}</div>

        <ul class="p-list">
          <li v-for="feature in plan.features" :key="feature">
            {{ feature }}
          </li>
        </ul>

        <button
          class="btn"
          :class="plan.buttonVariant === 'primary' ? 'btn-primary' : 'btn-outline'"
          style="width: 100%; justify-content: center"
        >
          {{ plan.buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  padding: 100px 60px;
}

.section-head {
  text-align: center;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  max-width: 980px;
  margin: 64px auto 0;
}

.p-card {
  background: var(--bg-card);
  padding: 38px 30px;
  border: 1px solid transparent;
  position: relative;
}

.p-card.hot {
  background: var(--bg-card2);
  border: 1px solid var(--orange);
}

.p-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: var(--orange);
  color: var(--bg-deep);
  padding: 4px 18px;
  white-space: nowrap;
}

.p-tier {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--tan);
  margin-bottom: 14px;
}

.p-price {
  font-family: 'Rye', serif;
  font-size: 52px;
  color: var(--cream);
  line-height: 1;
}

.p-price sup {
  font-size: 22px;
  font-family: 'Barlow Condensed', sans-serif;
  vertical-align: super;
}

.p-period {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  color: var(--tan);
  margin-bottom: 28px;
  margin-top: 4px;
}

.p-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.p-list li {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  color: var(--cream-dim);
  display: flex;
  align-items: center;
  gap: 9px;
}

.p-list li::before {
  content: '›';
  color: var(--orange);
  font-size: 18px;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .pricing    { padding: 60px 20px; }
  .price-grid { grid-template-columns: 1fr; }
}
</style>

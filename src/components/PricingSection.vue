<script setup lang="ts">
const plans = [
  {
    tier: '// Scout',
    price: '29',
    period: 'per month · billed monthly',
    hot: false,
    features: [
      '50 scans / month',
      'Basic defect detection',
      'PDF reports',
      'Email support',
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'outline',
  },
  {
    tier: '// Marshal',
    price: '99',
    period: 'per month · billed monthly',
    hot: true,
    badge: 'Most Popular',
    features: [
      '500 scans / month',
      'Full defect + rust detection',
      'VIN + history check',
      'Price intelligence',
      'API access (10k calls)',
      'Priority support',
    ],
    cta: 'Get Marshal Plan',
    ctaStyle: 'solid',
  },
  {
    tier: '// Sheriff',
    price: '349',
    period: 'per month · billed monthly',
    hot: false,
    features: [
      'Unlimited scans',
      'Fleet management dashboard',
      'White-label reports',
      'Full API + webhooks',
      'Custom AI fine-tuning',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'outline',
  },
]
</script>

<template>
  <section id="pricing" class="py-24 px-6 lg:px-[60px]">

    <!-- Header -->
    <div class="text-center">
      <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-3">
        // Choose Your Badge
      </div>
      <h2 class="text-cream" style="font-size: clamp(28px, 4vw, 52px)">Name Your Bounty</h2>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-px max-w-[980px] mx-auto mt-16">
      <div
        v-for="plan in plans"
        :key="plan.tier"
        class="relative flex flex-col p-9"
        :class="plan.hot
          ? 'bg-bg-card2 border border-orange'
          : 'bg-bg-card border border-transparent'"
      >
        <!-- Popular Badge -->
        <div
          v-if="plan.badge"
          class="absolute -top-px left-1/2 -translate-x-1/2
                 font-mono-tech text-[9px] tracking-[.15em] uppercase
                 bg-orange text-bg-deep px-5 py-1"
        >{{ plan.badge }}</div>

        <!-- Tier label -->
        <div class="font-mono-tech text-[10px] tracking-[.22em] uppercase text-tan mb-3.5">
          {{ plan.tier }}
        </div>

        <!-- Price -->
        <div class="font-rye text-[52px] text-cream leading-none">
          <sup class="font-barlow-cond text-[22px] align-super">$</sup>{{ plan.price }}
        </div>
        <div class="font-barlow-body text-[13px] text-tan mt-1 mb-7">{{ plan.period }}</div>

        <!-- Features -->
        <ul class="flex flex-col gap-2.5 mb-7 flex-1">
          <li
            v-for="f in plan.features"
            :key="f"
            class="font-barlow-body text-sm text-cream-dim flex items-center gap-2.5"
          >
            <span class="text-orange text-lg leading-none">›</span>
            {{ f }}
          </li>
        </ul>

        <!-- CTA -->
        <button
          v-if="plan.ctaStyle === 'solid'"
          class="font-mono-tech text-[12px] tracking-[.15em] uppercase font-bold
                 w-full py-3.5 clip-btn text-bg-deep bg-orange
                 hover:bg-amber-w transition-colors cursor-pointer"
        >{{ plan.cta }}</button>
        <button
          v-else
          class="font-mono-tech text-[12px] tracking-[.15em] uppercase
                 w-full py-3.5 clip-btn text-cyan
                 bg-transparent border border-cyan-dim
                 hover:bg-cyan/10 transition-colors cursor-pointer"
        >{{ plan.cta }}</button>
      </div>
    </div>

    <!-- Fine print -->
    <p class="text-center font-mono-tech text-[9px] tracking-[.14em] text-tan mt-8">
      ALL PLANS INCLUDE 14-DAY FREE TRIAL · NO CREDIT CARD REQUIRED · CANCEL ANYTIME
    </p>
  </section>
</template>

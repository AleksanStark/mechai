<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import TickerBar from './components/TickerBar.vue'
import HeroSection from './components/HeroSection.vue'
import ScanDemoSection from './components/ScanDemoSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import PricingSection from './components/PricingSection.vue'
import CtaSection from './components/CtaSection.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <main>
    <div class="ticker-wrapper">
      <TickerBar />
    </div>
    <HeroSection />
    <ScanDemoSection />
    <FeaturesSection />
    <HowItWorksSection />
    <PricingSection />
    <CtaSection />
  </main>
  <AppFooter />
</template>

<style>
.ticker-wrapper {
  margin-top: 62px;
}
</style>

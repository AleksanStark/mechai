<script setup lang="ts">
import { CtaSection } from "../../../features/cta";
import { FeaturesSection } from "../../../widgets/features-section";
import { AppFooter } from "../../../widgets/footer";
import { AppHeader } from "../../../widgets/header";
import { HeroSection } from "../../../widgets/hero";
import { HowItWorksSection } from "../../../widgets/how-it-works";
import { PricingSection } from "../../../widgets/pricing";
import { ScanDemoSection } from "../../../widgets/scan-demo";
import { TickerBar } from "../../../widgets/ticker-bar";
</script>

<template>
  <AppHeader />

  <HeroSection />
  <FeaturesSection />
  <HowItWorksSection />
  <PricingSection />
  <ScanDemoSection />

  <CtaSection />

  <TickerBar />
  <AppFooter />
</template>

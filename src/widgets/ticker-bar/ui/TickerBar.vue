<script setup lang="ts">
interface TickerItem {
  icon: string
  text: string
}

const tickerItems: TickerItem[] = [
  { icon: '✦', text: 'AI Inspection' },
  { icon: '◈', text: 'Rust Detection' },
  { icon: '✦', text: 'Damage Analysis' },
  { icon: '◈', text: 'Price Intelligence' },
  { icon: '✦', text: 'VIN History' },
  { icon: '◈', text: 'Fleet Management' },
]

// Duplicate for seamless loop
const allItems: TickerItem[] = [...tickerItems, ...tickerItems]
</script>

<template>
  <div class="ticker">
    <div class="ticker-inner">
      <span
        v-for="(item, index) in allItems"
        :key="index"
        class="tick-item"
      >
        {{ item.icon }} {{ item.text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  background: var(--orange);
  padding: 8px 0;
  overflow: hidden;
  border-top: 1px solid var(--orange-dim);
  border-bottom: 1px solid var(--orange-dim);
}

.ticker-inner {
  display: flex;
  white-space: nowrap;
  animation: tick 22s linear infinite;
}

.tick-item {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bg-deep);
  padding: 0 28px;
}

@keyframes tick {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>

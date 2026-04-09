<script setup>
const links = [
  { label: 'Privacy',  to: '#'         },
  { label: 'Terms',    to: '#'         },
  { label: 'API Docs', to: '#'         },
  { label: 'Status',   to: '#'         },
  { label: 'Settings', to: '/settings' },
]
</script>

<template>
  <footer class="px-6 lg:px-[60px] py-12 border-t border-orange/20 flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
        <rect x="5" y="18" width="24" height="4" rx="1" fill="#E8792A"/>
        <rect x="9" y="11" width="16" height="9" rx="1" fill="#B87840"/>
        <rect x="9" y="15" width="16" height="2" fill="#C46030" opacity=".8"/>
        <rect x="13" y="13" width="6" height="5" rx="1" fill="#3D5F7A"/>
        <circle cx="16" cy="15.5" r="2.5" fill="#FF2222"/>
        <rect x="19" y="15" width="10" height="1.5" fill="#FF3333" opacity=".8" rx=".5"/>
      </svg>
      <span class="font-rye text-lg text-cream">Mech<span class="text-orange">AI</span></span>
      <span class="font-mono-tech text-[9px] text-tan ml-2">v3.2.0</span>
    </div>
    <p class="font-mono-tech text-[10px] text-tan tracking-[.1em]">
      © 2025 MechAI · Cyber Texas · All defects detected
    </p>
    <nav class="flex gap-5 flex-wrap justify-center">
      <RouterLink
        v-for="link in links" :key="link.label" :to="link.to"
        class="font-mono-tech text-[10px] tracking-[.1em] uppercase text-tan hover:text-cyan transition-colors no-underline"
      >{{ link.label }}</RouterLink>
    </nav>
  </footer>
</template>

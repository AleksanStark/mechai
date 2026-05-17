<script setup lang="ts">
interface FooterLink {
  label: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "API Docs", href: "#" },
  { label: "Status", href: "#" },
];

const currentYear: number = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="logo-wrap">
      <span class="logo-txt">Mech<span>AI</span></span>
      <span class="version">v3.1.0</span>
    </div>

    <div class="f-copy">
      © {{ currentYear }} MechAI · Cyber Texas · All defects detected
    </div>

    <div class="f-links">
      <a
        v-for="link in footerLinks"
        :key="link.label"
        :href="link.href"
        class="f-link"
      >
        {{ link.label.toUpperCase() }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 52px 60px;
  border-top: 1px solid var(--b-warm);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-txt {
  font-family: "Rye", serif;
  font-size: 18px;
  letter-spacing: 0.05em;
  color: var(--cream);
}

.logo-txt span {
  color: var(--orange);
}

.version {
  font-family: "Share Tech Mono", monospace;
  font-size: 9px;
  color: #4a6b4a;
}

.f-copy {
  font-family: "Share Tech Mono", monospace;
  font-size: 10px;
  color: var(--tan);
  letter-spacing: 0.1em;
}

.f-links {
  display: flex;
  gap: 22px;
}

.f-link {
  font-family: "Share Tech Mono", monospace;
  font-size: 10px;
  color: var(--tan);
  text-decoration: none;
  letter-spacing: 0.1em;
  transition: color 0.2s;
}

.f-link:hover {
  color: var(--cyan);
}

@media (max-width: 900px) {
  .site-footer {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 40px 20px;
  }
}
</style>

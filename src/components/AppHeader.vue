<script setup lang="ts">
interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: '// Scan', href: '#' },
  { label: '// Features', href: '#' },
  { label: '// Pricing', href: '#' },
  { label: '// API', href: '#' },
  { label: '// Docs', href: '#' },
]
</script>

<template>
  <header class="site-header">
    <!-- Logo -->
    <div class="logo-wrap">
      <svg class="logo-mark" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="18" width="24" height="4" rx="1" fill="#E8792A" />
        <rect x="9" y="11" width="16" height="9" rx="1" fill="#B87840" />
        <rect x="9" y="15" width="16" height="2" fill="#C46030" opacity=".8" />
        <rect x="13" y="13" width="6" height="5" rx="1" fill="#3D5F7A" />
        <circle cx="16" cy="15.5" r="2.5" fill="#FF2222" />
        <circle cx="16" cy="15.5" r="1.2" fill="#FF6666" />
        <rect x="19" y="15" width="10" height="1.5" fill="#FF3333" opacity=".8" rx=".5" />
        <circle cx="29" cy="15.75" r="1" fill="#FF5555" opacity=".6" />
      </svg>
      <span class="logo-txt">Mech<span>AI</span></span>
    </div>

    <!-- Navigation -->
    <nav class="main-nav">
      <a
        v-for="link in navLinks"
        :key="link.label"
        :href="link.href"
        class="nav-link"
      >
        {{ link.label }}
      </a>
    </nav>

    <!-- CTA Buttons -->
    <div class="header-actions">
      <button class="btn btn-outline">Sign In</button>
      <button class="btn btn-primary">Start Free</button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 62px;
  padding: 0 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--b-warm);
  background: rgba(13, 11, 8, 0.88);
  backdrop-filter: blur(16px);
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.logo-txt {
  font-family: 'Rye', serif;
  font-size: 20px;
  letter-spacing: 0.05em;
  color: var(--cream);
}

.logo-txt span {
  color: var(--orange);
}

.main-nav {
  display: flex;
  gap: 36px;
  align-items: center;
}

.nav-link {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cream-dim);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--cyan);
}

.header-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 900px) {
  .site-header {
    padding: 0 20px;
  }

  .main-nav {
    display: none;
  }
}
</style>

<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M3 3v18h18"/>
            <path d="M18 9l-5 5-4-4-3 3"/>
          </svg>
        </div>
        <span class="logo-text">Fundamental<span class="logo-accent">Research</span></span>
      </router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.app-header {
  background: var(--color-gray-900);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 17px;
  font-weight: 600;
  color: white;
}

.logo-accent {
  color: var(--color-primary-400);
  margin-left: 4px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--color-gray-400);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
}
</style>

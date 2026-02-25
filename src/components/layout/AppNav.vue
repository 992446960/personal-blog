<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/i18n'
import { navConfig } from '@/config/nav'

const route = useRoute()
const { t } = useI18n()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

const langLabel = computed(() => (localeStore.locale === 'zh' ? '中文' : 'EN'))

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="nav">
    <router-link to="/" class="nav-logo">dev<span>.</span>hub</router-link>
    <div class="nav-links">
      <router-link
        v-for="item in navConfig"
        :key="item.path"
        :to="item.path"
        class="nav-btn"
        :class="{ active: isActive(item.path) }"
      >
        {{ t(item.nameKey) }}
      </router-link>
    </div>
    <div class="nav-right">
      <button
        class="lang-badge"
        type="button"
        :aria-label="langLabel"
        @click="localeStore.toggle()"
      >
        {{ langLabel }}
      </button>
      <button
        class="icon-btn"
        type="button"
        :aria-label="themeStore.theme === 'dark' ? 'Switch to light' : 'Switch to dark'"
        @click="themeStore.toggle()"
      >
        <svg
          v-if="themeStore.theme === 'dark'"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          />
        </svg>
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: 58px;
  background: var(--nav);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 40px;
  gap: 28px;
  transition: background 0.3s;
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.03em;
  color: var(--text);
  flex-shrink: 0;
}

.nav-logo span {
  color: var(--accent);
}

.nav-links {
  display: flex;
  gap: 2px;
  flex: 1;
}

.nav-btn {
  font-size: 13px;
  font-weight: 500;
  color: var(--text2);
  padding: 6px 13px;
  border-radius: 7px;
  border: none;
  background: transparent;
  transition: all 0.15s;
  position: relative;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 14px;
  height: 2px;
  border-radius: 1px;
  background: var(--accent);
  transition: transform 0.2s var(--ease-spring);
}

.nav-btn:hover {
  color: var(--text);
  background: var(--surface);
}

.nav-btn.active {
  color: var(--accent);
}

.nav-btn.active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.icon-btn {
  width: 33px;
  height: 33px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 14px;
}

.icon-btn:hover {
  color: var(--text);
  border-color: var(--border2);
  background: var(--surface2);
}

.lang-badge {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.15s;
}

.lang-badge:hover {
  color: var(--text);
}

@media (max-width: 900px) {
  .nav {
    padding: 0 16px;
    gap: 16px;
  }
}
</style>

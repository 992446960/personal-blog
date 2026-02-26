<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/i18n'
import { navConfig } from '@/config/nav'

const route = useRoute()
const { t } = useI18n()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

const drawerOpen = ref(false)
const langLabel = computed(() => (localeStore.locale === 'zh' ? '中文' : 'EN'))

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function closeDrawer() {
  drawerOpen.value = false
}

watch(route, () => {
  closeDrawer()
})

watch(drawerOpen, (open) => {
  document.body.classList.toggle('nav-drawer-open', open)
})

onUnmounted(() => {
  document.body.classList.remove('nav-drawer-open')
})
</script>

<template>
  <nav class="nav" aria-label="主导航">
    <router-link to="/" class="nav-logo" @click="closeDrawer">dev<span>.</span>hub</router-link>
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
    <button
      type="button"
      class="nav-hamburger"
      :aria-expanded="drawerOpen"
      aria-label="打开菜单"
      @click="toggleDrawer"
    >
      <span class="hamburger-bar" />
      <span class="hamburger-bar" />
      <span class="hamburger-bar" />
    </button>
    <div
      v-if="drawerOpen"
      class="nav-drawer-backdrop"
      aria-hidden="true"
      @click="closeDrawer"
    />
    <aside
      class="nav-drawer"
      :class="{ open: drawerOpen }"
      aria-label="导航菜单"
      role="dialog"
      aria-modal="true"
    >
      <div class="nav-drawer-inner">
        <button
          type="button"
          class="nav-drawer-close"
          aria-label="关闭菜单"
          @click="closeDrawer"
        >
          ×
        </button>
        <div class="nav-drawer-links">
          <router-link
            v-for="item in navConfig"
            :key="item.path"
            :to="item.path"
            class="nav-btn drawer-btn"
            :class="{ active: isActive(item.path) }"
            @click="closeDrawer"
          >
            <span class="drawer-btn-text">{{ t(item.nameKey) }}</span>
          </router-link>
        </div>
        <div class="nav-drawer-actions">
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
      </div>
    </aside>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  min-height: 58px;
  padding-top: env(safe-area-inset-top, 0px);
  box-sizing: border-box;
  background: var(--nav);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0;
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

.nav-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}

.nav-hamburger:hover {
  background: var(--surface2);
  border-color: var(--border2);
}

.hamburger-bar {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
  margin: 0 auto;
}

.nav-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 201;
  background: rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.2s ease;
}

.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 202;
  width: min(320px, 85vw);
  height: 100vh;
  height: 100dvh;
  padding-top: calc(58px + env(safe-area-inset-top, 0px));
  background: var(--nav);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-left: 1px solid var(--border);
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.25s var(--ease-out);
  overflow-y: auto;
}

.nav-drawer.open {
  transform: translateX(0);
}

.nav-drawer-inner {
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom, 0px));
}

.nav-drawer-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1;
  color: var(--text2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.nav-drawer-close:hover {
  color: var(--text);
  background: var(--surface2);
}

.nav-drawer-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-drawer .drawer-btn {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  text-align: left;
  border-radius: 8px;
  min-height: 44px;
}

.nav-drawer .drawer-btn::after {
  display: none;
}

.nav-drawer .drawer-btn .drawer-btn-text {
  position: relative;
  display: inline-block;
}

.nav-drawer .drawer-btn.active .drawer-btn-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 2px;
  border-radius: 1px;
  background: var(--accent);
  transition: transform 0.2s var(--ease-spring);
}

.nav-drawer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .nav-links,
  .nav-right {
    display: none !important;
  }

  .nav-hamburger {
    display: flex;
    margin-left: auto;
  }

  .nav {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 900px) {
  .nav {
    padding-left: 16px;
    padding-right: 16px;
    gap: 16px;
  }
}

@media (min-width: 601px) {
  .nav-drawer-backdrop,
  .nav-drawer {
    display: none !important;
  }
}
</style>

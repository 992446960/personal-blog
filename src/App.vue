<script setup lang="ts">
import { ref, provide } from 'vue'
import AppNav from '@/components/layout/AppNav.vue'
import { TOAST_KEY } from '@/composables/useToast'

const toastVisible = ref(false)
const toastMsg = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const toastApi = {
  show(msg: string, duration = 2000) {
    toastMsg.value = msg
    toastVisible.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastVisible.value = false
      toastTimer = null
    }, duration)
  },
}

provide(TOAST_KEY, toastApi)
</script>

<template>
  <div id="app-wrap">
    <AppNav />
    <main class="main-wrap">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <div
      id="toast"
      class="toast-el"
      :class="{ show: toastVisible }"
      role="status"
      aria-live="polite"
    >
      {{ toastMsg }}
    </div>
  </div>
</template>

<style>
#app-wrap {
  min-height: 100vh;
}

.main-wrap {
  padding-top: calc(58px + env(safe-area-inset-top, 0px));
  min-height: 100vh;
}

body.nav-drawer-open {
  overflow: hidden;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.toast-el {
  position: fixed;
  bottom: max(28px, env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background: var(--surface3);
  border: 1px solid var(--border2);
  color: var(--text);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 30px;
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s var(--ease-out);
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.toast-el.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ph_theme'

function loadTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (v === 'dark' || v === 'light') return v
  } catch (_) {
    /* ignore */
  }
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(loadTheme())

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
    document.documentElement.setAttribute('data-theme', t)
  }

  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // 初始化时应用
  document.documentElement.setAttribute('data-theme', theme.value)

  watch(theme, (t) => document.documentElement.setAttribute('data-theme', t), { immediate: true })

  return { theme, setTheme, toggle }
})

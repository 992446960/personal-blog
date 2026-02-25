import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Locale = 'zh' | 'en'

const STORAGE_KEY = 'ph_locale'

function loadLocale(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (v === 'zh' || v === 'en') return v
  } catch (_) {
    /* ignore */
  }
  return 'zh'
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(loadLocale())

  function setLocale(l: Locale) {
    locale.value = l
    localStorage.setItem(STORAGE_KEY, l)
  }

  function toggle() {
    setLocale(locale.value === 'zh' ? 'en' : 'zh')
  }

  return { locale, setLocale, toggle }
})

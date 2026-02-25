import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import '@/assets/styles/global.css'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)

// Sync i18n locale with store (after pinia is installed)
import { useLocaleStore } from '@/stores/i18n'
const localeStore = useLocaleStore()
i18n.global.locale.value = localeStore.locale
localeStore.$subscribe(() => {
  i18n.global.locale.value = localeStore.locale
})

app.mount('#app')

import { inject } from 'vue'

export const TOAST_KEY = Symbol('toast') as symbol

export interface ToastApi {
  show: (msg: string, duration?: number) => void
}

export function useToast(): ToastApi {
  const api = inject<ToastApi>(TOAST_KEY)
  if (!api) {
    return {
      show: (msg: string) => {
        if (typeof document !== 'undefined') {
          const el = document.getElementById('toast')
          if (el) {
            el.textContent = msg
            el.classList.add('show')
            setTimeout(() => el.classList.remove('show'), 2000)
          }
        }
      },
    }
  }
  return api
}

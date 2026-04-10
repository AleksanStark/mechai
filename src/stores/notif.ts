import { defineStore }  from 'pinia'
import { ref }          from 'vue'
import type { Toast, ToastType } from '../types'

interface PushOptions {
  type?:     ToastType
  title:     string
  message?:  string
  duration?: number
}

export const useNotifStore = defineStore('notif', () => {
  const toasts = ref<Toast[]>([])

  function push({ type = 'info', title, message, duration = 4000 }: PushOptions): number {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, title, message, visible: true })
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id: number): void {
    const t = toasts.value.find(t => t.id === id)
    if (t) t.visible = false
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 350)
  }

  const ok    = (title: string, message?: string) => push({ type: 'ok',    title, message })
  const warn  = (title: string, message?: string) => push({ type: 'warn',  title, message })
  const error = (title: string, message?: string) => push({ type: 'error', title, message, duration: 6000 })
  const info  = (title: string, message?: string) => push({ type: 'info',  title, message })

  return { toasts, push, dismiss, ok, warn, error, info }
})

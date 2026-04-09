import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotifStore = defineStore('notif', () => {
  const toasts = ref([])

  function push({ type = 'info', title, message, duration = 4000 }) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, title, message, visible: true })
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id) {
    const t = toasts.value.find(t => t.id === id)
    if (t) t.visible = false
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 350)
  }

  // Shortcuts
  const ok    = (title, message) => push({ type: 'ok',    title, message })
  const warn  = (title, message) => push({ type: 'warn',  title, message })
  const error = (title, message) => push({ type: 'error', title, message, duration: 6000 })
  const info  = (title, message) => push({ type: 'info',  title, message })

  return { toasts, push, dismiss, ok, warn, error, info }
})

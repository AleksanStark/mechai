import type { App, DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: (e: MouseEvent) => void
}

export default {
  install(app: App) {
    app.directive('click-outside', {
      beforeMount(el: ClickOutsideElement, binding: DirectiveBinding<() => void>) {
        el._clickOutside = (e: MouseEvent) => {
          if (!el.contains(e.target as Node)) binding.value()
        }
        document.addEventListener('mousedown', el._clickOutside)
      },
      unmounted(el: ClickOutsideElement) {
        if (el._clickOutside) {
          document.removeEventListener('mousedown', el._clickOutside)
        }
      },
    })
  },
}

import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import App             from './App.vue'
import router          from './router/index'
import clickOutside    from './plugins/clickOutside'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(clickOutside)
app.mount('#app')

import './assets/main.css'
import { useAppStore } from './stores'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'

const pinia = createPinia()

const app = createApp(App)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  const errorObject = {
    error: err,
    instance: instance,
    info: info
  }
  const store = useAppStore()
  store.handleGlobalErrors(errorObject)
}

app.use(router).use(vuetify).use(pinia).mount('#app')

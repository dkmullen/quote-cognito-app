import './assets/main.css'
import { useAppStore } from './stores'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'us-east-2',
      userPoolId: 'us-east-2_eXF69Q23M',
      userPoolClientId: '70snluik5pf9jenb07lumlbtd9',
      loginWith: { // This prevents the error
        username: true,
        email: false,
      },
    },
  }
});

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

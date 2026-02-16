import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const lightTheme = {
  dark: false,
  colors: {
    primary: '#1c4d9c',
    secondary: '#848484',
    error: '#B00020',
    info: '#2196F3',
    success: '#33804d',
    warning: '#FB8C00'
  }
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#1c4d9c',
    secondary: '#848484',
    error: '#B00020',
    info: '#2196F3',
    success: '#33804d',
    warning: '#FB8C00'
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme,
      lightTheme
    }
  }
})

export default vuetify

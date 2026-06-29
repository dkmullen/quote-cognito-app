import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const lightTheme = {
  dark: false,
  colors: {
    primary: '#304575',
    secondary: '#848484',
    error: '#B00020',
    info: '#2196F3',
    success: '#33804d',
    warning: '#FB8C00',
    background: '#c2bcb8',
    surface: '#E9E3DF'
  }
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#304575',
    secondary: '#848484',
    error: '#B00020',
    info: '#2196F3',
    success: '#33804d',
    warning: '#FB8C00',
    background: '#0f172a',
    surface: '#1e293b'
  }
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme,
      lightTheme
    }
  }
})

export default vuetify

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { h } from 'vue'
import { icons } from '@/icons'

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
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi: {
        component: (props) => {
          const icon = icons[props.icon]
          if (!icon) return null
          return h(
            'svg',
            {
              ...props,
              viewBox: '0 0 24 24',
              fill: 'currentColor',
              xmlns: 'http://www.w3.org/2000/svg'
            },
            [h('path', { d: icon })]
          )
        }
      }
    }
  },
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme,
      lightTheme
    }
  }
})

export default vuetify

// src/icons.js
// Import only the icons you need from @mdi/js for tree-shaking
import {
  mdiMenuDown,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBox,
  mdiRadioboxMarked,
  mdiRadioboxBlank,
  /* the icons above are at least some of the ones needed by Vuetify for checkboxes, 
  radios, dropdowns, etc. */
  mdiContentSave,
  mdiStopCircle,
  mdiPencil,
  mdiEye,
  mdiEyeOff,
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiDelete,
  mdiPlus,
  mdiClose,
  mdiAccountOutline,
  mdiMagnify,
  mdiFootball,
  mdiLink,
  mdiGithub,
  mdiPaletteSwatchOutline,
  mdiMenu,
  mdiEmailOutline,
  mdiFileDocumentEdit,
  mdiAws
} from '@mdi/js'

// Map icon names to their imported SVG paths
export const icons = {
  'mdi-menu-down': mdiMenuDown,
  'mdi-checkbox-marked': mdiCheckboxMarked,
  'mdi-checkbox-blank-outline': mdiCheckboxBlankOutline,
  'mdi-minus-box': mdiMinusBox,
  'mdi-content-save': mdiContentSave,
  'mdi-radiobox-marked': mdiRadioboxMarked,
  'mdi-radiobox-blank': mdiRadioboxBlank,
  'mdi-stop-circle': mdiStopCircle,
  'mdi-pencil': mdiPencil,
  'mdi-eye': mdiEye,
  'mdi-eye-off': mdiEyeOff,
  'mdi-weather-sunny': mdiWeatherSunny,
  'mdi-weather-night': mdiWeatherNight,
  'mdi-delete': mdiDelete,
  'mdi-plus': mdiPlus,
  'mdi-close': mdiClose,
  'mdi-account-outline': mdiAccountOutline,
  'mdi-magnify': mdiMagnify,
  'mdi-football': mdiFootball,
  'mdi-link': mdiLink,
  'mdi-github': mdiGithub,
  'mdi-palette-swatch-outline': mdiPaletteSwatchOutline,
  'mdi-menu': mdiMenu,
  'mdi-email-outline': mdiEmailOutline,
  'mdi-file-document-edit': mdiFileDocumentEdit,
  'mdi-aws': mdiAws
  // Add more icons here as needed
}

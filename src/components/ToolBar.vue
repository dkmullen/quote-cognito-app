<template>
  <v-toolbar density="compact" color="primary">
    <v-btn icon="mdi-open-in-new">
      <v-icon icon="mdi-menu"></v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <v-list-item-title @click="doMenuAction(item)">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
    <v-toolbar-title>{{ currentRoute }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleTheme">
      <v-icon v-if="!themeIsDark">mdi-weather-night</v-icon>
      <v-icon v-if="themeIsDark">mdi-weather-sunny</v-icon>
    </v-btn>
    Signed in as: {{ username }}
    <v-btn icon @click="setDialog(true)">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-toolbar>
  <ConfirmDialog :message="confirmMessage" @doAction="doSignOut" ref="confirmDialog" />
</template>

<script setup>
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import { signOutUser, getUser } from '@/services/authAmplify'
import { useTheme } from 'vuetify'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const confirmDialog = ref()
const router = useRouter()
const currentRoute = ref('Home')
let username = ref('Unknown User')

const items = [
  { title: 'Home', icon: 'mdi-file-document-edit', route: 'home' },
  { title: 'Cars', icon: 'mdi-car', route: 'cars' },
  { title: 'Quotes', icon: 'mdi-file-document', route: 'quotes' },
  { title: 'Messages', icon: 'mdi-email', route: 'messages' },
  { title: 'Sign Out', icon: 'mdi-logout', action: 'logout' }
]

const theme = useTheme()
let themeIsDark = theme.global.current.value.dark

onMounted(async () => {
  const savedTheme = localStorage.getItem('dkm-dashboard-theme')
  if (savedTheme) {
    theme.change(savedTheme)
    themeIsDark = savedTheme === 'darkTheme'
  }
  const user = await getUser()
  if (user) {
    username.value = user.username || 'Unknown User'
  }
})

function toggleTheme() {
  const nextTheme = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
  theme.change(nextTheme)
  localStorage.setItem('dkm-dashboard-theme', nextTheme)
  themeIsDark = nextTheme === 'darkTheme'
}

const confirmMessage = 'Are you sure you want to sign out?'
function doSignOut() {
  signOutUser()
}
function setDialog(bool) {
  confirmDialog.value.setDialog(bool)
}
function doMenuAction(item) {
  if (item.route) {
    currentRoute.value = item.title
    router.push({ name: item.route })
  } else if (item.action === 'logout') {
    setDialog(true)
  }
}
</script>

<style scoped></style>

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
    <v-toolbar-title>Dashboard</v-toolbar-title>
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
import { signOut } from '@/services/authService'
import { useTheme } from 'vuetify'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const confirmDialog = ref()
const router = useRouter()

const items = [
  { title: 'Home', icon: 'mdi-file-document-edit', route: 'home' },
  { title: 'Cars', icon: 'mdi-car', route: 'cars' },
  { title: 'Quotes', icon: 'mdi-file-document', route: 'quotes' },
  { title: 'Sign Out', icon: 'mdi-logout', action: 'logout' }
]

const theme = useTheme()
let themeIsDark = theme.global.current.value.dark

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
  themeIsDark = !themeIsDark
}

let username = localStorage.getItem('currentUser')

const confirmMessage = 'Are you sure you want to sign out?'
function doSignOut() {
  signOut()
}
function setDialog(bool) {
  confirmDialog.value.setDialog(bool)
}
function doMenuAction(item) {
  if (item.route) {
    router.push({ name: item.route })
  } else if (item.action === 'logout') {
    setDialog(true)
  }
}
</script>

<style scoped></style>

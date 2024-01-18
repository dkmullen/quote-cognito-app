<template>
  <v-toolbar density="compact" color="primary">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleTheme">
      <v-icon v-if="!themeIsDark">mdi-weather-night</v-icon>
      <v-icon v-if="themeIsDark">mdi-weather-sunny</v-icon>
    </v-btn>
    <v-btn icon> </v-btn>
    Signed in as: {{ username }}
    <ConfirmDialog :message="confirmMessage" @doAction="doSignOut" />
  </v-toolbar>
</template>

<script setup>
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import { signOut } from '@/services/authService'
import { useTheme } from 'vuetify'

const theme = useTheme()
let themeIsDark = theme.global.current.value.dark
console.log(themeIsDark)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
  themeIsDark = !themeIsDark
}

let username = localStorage.getItem('currentUser')

const confirmMessage = 'Are you sure you want to sign out?'
function doSignOut() {
  signOut()
}
</script>

<style scoped></style>

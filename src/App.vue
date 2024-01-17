<script setup>
import { useAppStore } from '@/stores/index'

const store = useAppStore()
let overlay = store.loading
</script>

<template>
  <header>
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </header>

  <main></main>
  <div v-if="overlay">
    <v-overlay v-model="overlay"></v-overlay>
    <v-progress-circular
      class="centered"
      indeterminate="true"
      size="70"
      color="primary"
      large
    ></v-progress-circular>
  </div>
</template>

<style scoped></style>

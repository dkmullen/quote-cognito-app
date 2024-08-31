<script setup>
import { useAppStore } from '@/stores/index'
import { watch, ref } from 'vue'
import ToolBar from './components/ToolBar.vue'

const store = useAppStore()
let overlay = ref(false)

watch(
  store,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
    overlay.value = state.loading
  },
  { deep: true }
)
</script>

<template>
  <header>
    <div class="wrapper">
      <ToolBar />
    </div>
  </header>

  <router-view></router-view>
  <main></main>
  <div v-if="overlay">
    <v-overlay v-model="overlay" :persistent="true"></v-overlay>
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

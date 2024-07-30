<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { useRouter } from 'vue-router'
import { retrieve } from '@/services/apiService'

const randomQuote = ref(null)
const router = useRouter()
let errorMessage = ref('')

onMounted(() => {
  getQuote(0)
  if (router.currentRoute.value.params.id) {
    getQuote(router.currentRoute.value.params.id)
  }
})
const store = useAppStore()

async function getQuote(id) {
  store.setLoading(true)
  try {
    const res = await retrieve(id)
    if (res && res.type === 'error') {
      errorMessage.value = res.text
    } else if (id === 0) {
      randomQuote.value = res.Item
    }
    // else {
    //   for (let item in formData) {
    //     formData[item].value = res.Item[item]
    //   }
    // }
  } catch (error) {
    errorMessage.value = error.message
    store.setLoading(false)
  } finally {
    store.setLoading(false)
  }
}
</script>

<template>
  <div class="centered-text mt-6" v-if="randomQuote" id="quote-box" color="secondary">
    <p>{{ randomQuote.quote }}</p>
    <p>
      <b>{{ randomQuote.speaker }} {{ randomQuote.source ? `- ${randomQuote.source}` : '' }}</b>
    </p>
  </div>
</template>

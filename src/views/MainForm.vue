<script setup>
import { ref, onMounted } from 'vue'
import { post, retrieve } from '@/services/apiService'
import ToolBar from '@/components/ToolBar.vue'
import { useAppStore } from '@/stores/index'
import { useRouter } from 'vue-router'

// import { checkIdToken } from '@/services/authService'

const store = useAppStore()
const router = useRouter()

onMounted(() => {
  getQuote(0)
  if (router.currentRoute.value.params.id) {
    getQuote(router.currentRoute.value.params.id)
  }
})

let formData = {
  id: ref(null),
  quote: ref(null),
  speaker: ref(null),
  source: ref(null)
}

const randomQuote = ref(null)

let errorMessage = ref('')

function clearForm() {
  for (let item in formData) {
    formData[item].value = null
  }
  errorMessage.value = ''
  // checkIdToken()
}

async function getQuote(id) {
  store.setLoading(true)
  try {
    const res = await retrieve(id)
    if (res && res.type === 'error') {
      errorMessage.value = res.text
    } else if (id === 0) {
      randomQuote.value = res.Item
      console.log(randomQuote.value)
    } else {
      for (let item in formData) {
        formData[item].value = res.Item[item]
      }
    }
  } catch (error) {
    errorMessage.value = error.message
    store.setLoading(false)
  } finally {
    store.setLoading(false)
  }
}

async function sendForm() {
  if (formData.quote.value) {
    store.setLoading(true)
    let payload = {}
    for (let item in formData) {
      payload[item] = formData[item].value
    }
    payload.id = parseInt(payload.id)
    try {
      const res = await post(payload)
      if (res && res.type === 'error') {
        errorMessage.value = res.text
        store.setLoading(false)
      } else {
        store.setLoading(false)
        clearForm()
      }
    } catch (error) {
      errorMessage.value = error.message
      store.setLoading(false)
    }
  } else {
    errorMessage.value = 'You forgot the quote'
  }
}
</script>

<template>
  <ToolBar />
  <form @submit.prevent="sendForm">
    <h1>Submit a Quotation</h1>
    <div>
      <v-textarea
        name="quote"
        id="quote"
        rows="9"
        v-model="formData.quote.value"
        @input="errorMessage = ''"
        label="Quote"
        class="required"
      ></v-textarea>
    </div>
    <div>
      <v-text-field type="text" id="speaker" v-model="formData.speaker.value" label="Speaker" />
      <v-text-field type="text" id="source" v-model="formData.source.value" label="Source" />
      <v-text-field type="text" id="id" v-model="formData.id.value" label="Id" />
    </div>
    <div class="error-message">{{ errorMessage }}</div>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-btn variant="outlined" block type="button" class="btn" @click="clearForm">Clear</v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn variant="flat" block color="primary" type="submit" class="btn">Submit</v-btn>
      </v-col>
    </v-row>
    <v-row class="centered-text">
      <v-col>
        <v-chip variant="flat" color="success">Success</v-chip>
        <v-chip variant="flat" color="secondary">Secondary</v-chip>
        <v-chip variant="flat" color="warning">warning</v-chip>
        <v-chip variant="flat" color="info">info</v-chip>
        <v-chip variant="flat" color="error">error</v-chip>
      </v-col>
    </v-row>
  </form>
  <div class="centered-text mt-6" v-if="randomQuote" id="quote-box" color="secondary">
    <p>{{ randomQuote.quote }}</p>
    <p>
      <b>{{ randomQuote.speaker }} {{ randomQuote.source ? `- ${randomQuote.source}` : '' }}</b>
    </p>
  </div>
</template>

<style>
form {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
#quote-box {
  max-width: 700px;
  margin: auto;
  background: var(--primary);
  padding: 8px;
  border-radius: 8px;
  color: white;
}
</style>

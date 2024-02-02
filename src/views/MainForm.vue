<script setup>
import { ref, onMounted } from 'vue'
import { post, retrieve, getImg } from '@/services/apiService'
import ToolBar from '@/components/ToolBar.vue'
import { useAppStore } from '@/stores/index'
import { useRouter } from 'vue-router'

// import { checkIdToken } from '@/services/authService'

const store = useAppStore()
const router = useRouter()

onMounted(() => {
  if (router.currentRoute.value.params.id) {
    getQuote(router.currentRoute.value.params.id)
  }
})

let formData = {
  quote: ref(''),
  source: ref(''),
  link: ref('')
}

let errorMessage = ref('')

function clearForm() {
  for (let item in formData) {
    formData[item].value = ''
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
      store.setLoading(false)
    } else {
      for (let item in formData) {
        formData[item].value = res.Item[item]
      }
      store.setLoading(false)
    }
  } catch (error) {
    errorMessage.value = error.message
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
        rows="10"
        v-model="formData.quote.value"
        @input="errorMessage = ''"
        label="Quote"
        class="required"
      ></v-textarea>
    </div>
    <div>
      <v-text-field type="text" id="source" v-model="formData.source.value" label="Source" />
    </div>
    <div>
      <v-text-field type="text" id="link" v-model="formData.link.value" label="Link" />
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
        <v-chip variant="flat" color="error" @click="getImg">error</v-chip>
      </v-col>
    </v-row>
  </form>
  <img />
</template>

<style>
form {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
</style>

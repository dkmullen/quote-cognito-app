<script setup>
import { ref } from 'vue'
import { post } from '@/services/apiService'
import { useAppStore } from '@/stores/index'
import QuoteDisplay from '@/components/QuoteDisplay.vue'
// import { checkIdToken } from '@/services/authService'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const store = useAppStore()

let formData = {
  id: ref(null),
  quote: ref(null),
  speaker: ref(null),
  source: ref(null)
}

let errorMessage = ref('')

function clearForm() {
  for (let item in formData) {
    formData[item].value = null
  }
  errorMessage.value = ''
  // checkIdToken()
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
function doQb(qb) {
  top.value = `${getOffset(qb).top}px`
  console.log(top.value)
  confirmD.value.setDialog(true)
}
function getOffset(id) {
  const el = document.getElementById(id)
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  }
}
const top = ref('100px')
const confirmD = ref(null)
</script>

<template>
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
  <v-checkbox id="qb1" @click="doQb('qb1')" label="Checkbox"></v-checkbox>
  <v-checkbox id="qb2" @click="doQb('qb2')" label="Checkbox"></v-checkbox>
  <v-checkbox id="qb3" @click="doQb('qb3')" label="Checkbox"></v-checkbox>
  <v-checkbox id="qb4" @click="doQb('qb4')" label="Checkbox"></v-checkbox>

  <QuoteDisplay />
  <ConfirmDialog ref="confirmD" :top="top" />
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

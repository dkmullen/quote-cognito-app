<script setup>
import { ref, onMounted } from 'vue'
import { post, getArticle, retrieve } from '@/services/apiService'
import { useAppStore } from '@/stores/index'
import QuoteDisplay from '@/components/QuoteDisplay.vue'
// import { checkIdToken } from '@/services/authService'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'

const store = useAppStore()
const props = defineProps({
  quote: Object, 
  totalItems: Number
})

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

const emit = defineEmits(['close'])

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
  // console.log(top.value)
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

async function fetchArticle() {
  store.setLoading(true)
  try {
  const res = await getArticle()
  } catch (err) {
    console.log(err)
  } finally {
    store.setLoading(false)
  }
}

async function fetchQuote(id) {
  try {
    const res = await retrieve(id)
    const body = res.Item
    for (let i in formData) {
      formData[i].value = body[i]
    }
  } catch (err) {
    console.error(err)
  } 
}

async function deleteQuote(id) {
  try {
    const res = await deleteItem(id)
    console.log(res)
    console.log(formData)
    
  } catch (err) {
    console.error(err)
  } 
}

onMounted(() => {
  if (props.quote) {
    fetchQuote(props.quote.id)
  } else {
    formData.id.value = props.totalItems + 1
  }
})
</script>

<template>
  <form @submit.prevent="sendForm">
    <h1>{{ props.quote ? 'Edit' : 'Submit a' }} Quotation</h1>
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
      <v-text-field type="text" id="id" v-model="formData.id.value" label="Id" readonly />
    </div>
    <div class="error-message">{{ errorMessage }}</div>

    <v-row dense>
      <v-col cols="12" md="4">
        <v-btn variant="outlined" block type="button" class="btn" @click="clearForm">Clear</v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn variant="flat" block type="button" class="btn" color="info" @click="emit('close')">Close</v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn variant="flat" block color="success" type="submit" class="btn">Submit</v-btn>
      </v-col>
    </v-row>
      <v-row>
    <v-col><QuoteDisplay /></v-col>
  </v-row>
  <ConfirmDialog ref="confirmD" :top="top" />

</form>

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

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { postCarItem, retrieve } from '@/services/apiService'
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

let formData = reactive({
  name: '',
  comments: '',
  date: '',
  item: '',
  mileage: ''
})

const randomQuote = ref(null)

let errorMessage = ref('')

function clearForm() {
  for (let item in formData) {
    formData[item] = ''
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
  if (formData.name) {
    store.setLoading(true)
    let payload = {}
    for (let item in formData) {
      payload[item] = formData[item]
    }
    try {
      const res = await postCarItem(payload)
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
    errorMessage.value = 'You forgot the name'
  }
}
</script>

<template>
  <ToolBar />
  <form @submit.prevent="sendForm">
    <h1>Submit a Maintenance Item</h1>
    <v-text-field type="text" id="date" v-model="formData.date" label="Date" />
    <v-text-field type="text" id="name" v-model="formData.name" label="Car" />
    <div>
      <v-textarea
        name="item"
        id="item"
        rows="4"
        v-model="formData.item"
        @input="errorMessage = ''"
        label="Item"
        class="required"
      ></v-textarea>
    </div>
    <div>
      <v-textarea
        name="comments"
        id="comments"
        rows="6"
        v-model="formData.comments"
        @input="errorMessage = ''"
        label="Comments"
      ></v-textarea>
    </div>
    <div>
      <v-text-field type="text" id="mileage" v-model="formData.mileage" label="Mileage" />
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

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { postCarItem, retrieve } from '@/services/apiService'
import { useAppStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseComponents/BaseInput.vue'
import QuoteDisplay from '@/components/QuoteDisplay.vue'

// import { checkIdToken } from '@/services/authService'

const store = useAppStore()
const router = useRouter()

onMounted(() => {
  getQuote(0)
  if (router.currentRoute.value.params.id) {
    getQuote(router.currentRoute.value.params.id)
  }
})

const formData = reactive({
  name: null,
  comments: null,
  date: null,
  item: null,
  mileage: null
})

const formObj = [
  { name: 'name', label: 'Car', model: 'name', inputType: 'select', items: ['Civic', 'Element'] },
  { name: 'date', label: 'Date', model: 'date', type: 'date' },
  { name: 'mileage', label: 'Mileage', model: 'mileage' },
  { name: 'item', label: 'Maintenance work', model: 'item', inputType: 'textarea' },
  { name: 'comments', label: 'Comments', model: 'comments', inputType: 'textarea', rows: 4 }
]

const randomQuote = ref(null)
let errorMessage = ref(null)

function clearForm() {
  for (let item in formData) {
    formData[item] = null
  }
  errorMessage.value = null
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
  <form @submit.prevent="sendForm">
    <h1>Submit a Maintenance Item</h1>
    <div v-for="item in formObj" :key="item.name">
      <BaseInput
        :type="item.type"
        :inputType="item.inputType"
        :id="item.name"
        :label="item.label"
        :items="item.items"
        :rows="item.rows"
        v-model="formData[item.model]"
      />
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
  <QuoteDisplay />
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

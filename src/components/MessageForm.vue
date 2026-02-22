<script setup>
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/BaseComponents/BaseInput.vue'

// import { checkIdToken } from '@/services/authService'

const props = defineProps({
  message: Object
})

onMounted(() => {
  if (props.message) {
    for (let i in formData) {
      formData[i].value = props.message[i]
    }
  }
})
const emit = defineEmits(['close'])
const formData = {
  name: ref(null),
  date: ref(null),
  email: ref(null),
  message: ref(null)
}

const formObj = [
  { name: 'date', label: 'Date', model: 'date' },
  { name: 'name', label: 'Name', model: 'name' },
  { name: 'email', label: 'Email', model: 'email' },
  { name: 'message', label: 'Message', model: 'message', inputType: 'textarea', rows: 4 }
]

let errorMessage = ref(null)

function clearForm() {
  for (let item in formData) {
    formData[item].value = null
  }
  errorMessage.value = ''
  // checkIdToken()
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
        v-model="formData[item.model].value"
        readonly
      />
    </div>
    <div class="error-message">{{ errorMessage }}</div>

    <v-row dense>
      <v-row dense>
        <v-col cols="12">
          <v-btn variant="flat" block type="button" class="btn" color="info" @click="emit('close')"
            >Close</v-btn
          >
        </v-col>
      </v-row>
    </v-row>
  </form>
</template>

<style>
form {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
</style>

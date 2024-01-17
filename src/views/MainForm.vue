<script setup>
import { ref } from 'vue'
import { post } from '@/services/apiService'
import { getCurrentUser } from '@/services/authService'

let formData = {
  quote: ref(''),
  source: ref(''),
  link: ref('')
}
let errorMessage = ref('')
function sendForm() {
  if (formData.quote.value) {
    let payload = {}
    for (let item in formData) {
      payload[item] = formData[item].value
    }
    post(payload)
  } else {
    errorMessage.value = 'You forgot the quote'
  }
}
function clearForm() {
  for (let item in formData) {
    formData[item].value = ''
  }
  errorMessage.value = ''
  getCurrentUser()
}
</script>

<template>
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
  </form>
</template>

<style>
form {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
</style>

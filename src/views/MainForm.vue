<script setup>
import { ref } from 'vue'
import { post } from '@/services/apiService'
import { signIn } from '@/services/authService'

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
}
function login() {
  signIn()
}
</script>

<template>
  <form @submit.prevent="sendForm">
    <h1>Form</h1>
    <div>
      <label for="quote" class="required">Quote</label><br />
      <textarea
        class="form-input"
        name="quote"
        id="quote"
        rows="10"
        v-model="formData.quote.value"
        @input="errorMessage = ''"
      ></textarea>
    </div>
    <div>
      <label for="source">Source</label><br />
      <input class="form-input" type="text" id="source" v-model="formData.source.value" />
    </div>
    <div>
      <label for="source">Link</label><br />
      <input class="form-input" type="text" id="link" v-model="formData.link.value" />
    </div>
    <div class="error-message">{{ errorMessage }}</div>
    <v-btn variant="flat" color="primary" type="submit" class="btn">Submit</v-btn>
    <v-btn variant="outlined" type="button" class="btn" @click="clearForm">Clear</v-btn>
    <v-btn variant="flat" type="button" class="btn" @click="login">Sign In</v-btn>
  </form>
</template>

<style>
form {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
.error-message {
  height: 10px;
  color: red;
  margin-bottom: 1rem;
  margin-top: -5px;
  text-align: center;
}
.required::after {
  content: '*';
  color: red;
}
</style>

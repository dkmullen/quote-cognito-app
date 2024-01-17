<template>
  <v-form v-model="valid" class="creds-form" ref="form" @submit.prevent="login">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.username.value"
            label="Username"
            required
            prepend-inner-icon="mdi-account-outline"
            :rules="usernameRules"
            class="required"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.password.value"
            label="Password"
            required
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append-inner="show = !show"
            prepend-inner-icon="mdi-lock-outline"
            :rules="passwordRules"
            class="required"
          ></v-text-field>
        </v-col>
      </v-row>
      <div class="error-message">{{ errorMessage }}</div>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" variant="flat" block type="submit">Login</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { signIn } from '@/services/authService'
import { useAppStore } from '@/stores/index'

const store = useAppStore()
let errorMessage = ref('')

watch(store, (state) => {
  errorMessage.value = state.loginErrorMessage
})
const usernameRules = [(v) => !!v || 'Username is required']
const passwordRules = [(v) => !!v || 'Password is required']

let valid = ref(false)
let show = ref(false)
const form = ref(null)

let formData = {
  username: ref(''),
  password: ref('')
}

async function login() {
  store.setLoginErrorMessage('')
  let v = await form.value.validate()
  valid.value = v.valid
  if (valid.value) {
    let payload = {}
    for (let item in formData) {
      payload[item] = formData[item].value
    }
    signIn(payload)
  }
}
</script>

<style scoped></style>

import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    loginErrorMessage: ''
  }),
  actions: {
    setLoading(bool) {
      this.loading = bool
    },
    setLoginErrorMessage(message) {
      this.loginErrorMessage = message
    }
  }
})

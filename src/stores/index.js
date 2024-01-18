import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    loginErrorMessage: '',
    currentUser: null
  }),
  actions: {
    setLoading(bool) {
      this.loading = bool
    },
    setLoginErrorMessage(message) {
      this.loginErrorMessage = message
    },
    setCurrentUser(user) {
      this.currentUser = user
    }
  }
})

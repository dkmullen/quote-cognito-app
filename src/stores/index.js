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
    },
    handleGlobalErrors(errorObject) {
      console.error('Error object:', errorObject)
      // Add code for UI notifications, reporting or other error handling logic
    }
  }
})

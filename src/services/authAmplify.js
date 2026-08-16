import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { useAppStore } from '../stores/index.js'
import router from '../router/index.js'

export async function doLogIn(payload) {
  const { username, password } = payload
  const appStore = useAppStore()
  appStore.setLoading(true)
  try {
    const res = await signIn({ username, password })
    if (res.isSignedIn) {
      getCurrentUser().then(user => {
        appStore.setCurrentUser(user)
      })
    }
    appStore.setLoading(false)
    router.push({ name: 'home' })
  } catch (err) {
    appStore.setLoading(false)
    appStore.setLoginErrorMessage(err.message || JSON.stringify(err))
  }
}

export async function getUser() {
  try {
    const user = await getCurrentUser()
    return user
  } catch {
    return null
  }
}

export async function signOutUser() {
  await signOut()
  const appStore = useAppStore()
  appStore.setCurrentUser(null)
  router.push({ name: 'login' })
}

export async function getIdToken() {
  try {
    const { tokens } = await fetchAuthSession()
    return tokens?.idToken?.toString()
  } catch (err) {
    console.error('Error retrieving ID token:', err)
    return null
  }
}

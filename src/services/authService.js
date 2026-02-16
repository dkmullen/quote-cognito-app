import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import { useAppStore } from '../stores/index.js'
import router from '../router/index.js'

function getUserPool() {
  var poolData = {
    UserPoolId: import.meta.env.VITE_APP_USERPOOL_ID,
    ClientId: import.meta.env.VITE_APP_CLIENT_ID
  }
  var userPool = new CognitoUserPool(poolData)
  return userPool
}

export function getUser() {
  var userPool = getUserPool()
  var cognitoUser = userPool.getCurrentUser()
  return cognitoUser
}

export function signIn(payload) {
  const appStore = useAppStore()
  appStore.setLoading(true)
  const Username = payload.username
  var authenticationData = {
    Username,
    Password: payload.password
  }
  var authenticationDetails = new AuthenticationDetails(authenticationData)
  var userPool = getUserPool()
  var userData = {
    Username,
    Pool: userPool
  }
  var cognitoUser = new CognitoUser(userData)

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      localStorage.setItem('currentUser', cognitoUser.username)
      var idToken = result.getIdToken().getJwtToken()
      localStorage.setItem('cognitoIdToken', idToken)
      appStore.setLoading(false)
      router.push({ name: 'home' })
    },

    onFailure: function (err) {
      appStore.setLoading(false)
      appStore.setLoginErrorMessage(err.message || JSON.stringify(err))
    }
  })
}

export function signOut() {
  var cognitoUser = getUser()
  if (cognitoUser) {
    cognitoUser.signOut()
  }
  localStorage.removeItem('cognitoIdToken')
  localStorage.removeItem('currentUser')
  router.push({ name: 'login' })
}

/**
 * Retrieves the ID token from the user's session.
 * @returns {Promise<string>} The ID token as a string.
 */
let refreshAttempts = 0

export async function getIdToken() {
  const cognitoUser = getUser()
  if (cognitoUser != null) {
    return cognitoUser.getSession(function (err, session) {
      if (err) {
        console.error('Error here', err)
        if (refreshAttempts < 1) {
          refreshAttempts++
          tryAgain()
        } else {
          return err.message || JSON.stringify(err)
        }
      }
      /* Refresh token if less than 4 minutes remains. Cognito will
         refresh automatically, but only (apparently) after the token expires
      */
      if (session.idToken.payload.exp - Date.now() / 1000 < 240) {
        cognitoUser.refreshSession(session.getRefreshToken(), (err, session) => {
          if (err) {
            refreshAttempts++
            return JSON.stringify(err)
          } else {
            console.info(session)
          }
        })
      }
      return session.getIdToken().getJwtToken()
    })
  }
}

function tryAgain() {
  setTimeout(() => {
    return getIdToken()
  }, 1000)
}

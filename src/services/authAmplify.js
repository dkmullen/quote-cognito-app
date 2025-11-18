import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth'

export async function doLogIn(payload) {
    const { username, password } = payload
  try {
    const user = await signIn({ username, password })
    console.log('Logged in:', user)
  } catch (err) {
    console.error('Login failed:', err)
  }
}

// export function signIn(payload) {
//   const appStore = useAppStore()
//   appStore.setLoading(true)
//   const Username = payload.username
//   var authenticationData = {
//     Username,
//     Password: payload.password
//   }
//   var authenticationDetails = new AuthenticationDetails(authenticationData)
//   var userPool = getUserPool()
//   var userData = {
//     Username,
//     Pool: userPool
//   }
//   var cognitoUser = new CognitoUser(userData)

//   cognitoUser.authenticateUser(authenticationDetails, {
//     onSuccess: function (result) {
//       localStorage.setItem('currentUser', cognitoUser.username)
//       var idToken = result.getIdToken().getJwtToken()
//       localStorage.setItem('cognitoIdToken', idToken)
//       appStore.setLoading(false)
//       router.push({ name: 'home' })
//     },

//     onFailure: function (err) {
//       appStore.setLoading(false)
//       appStore.setLoginErrorMessage(err.message || JSON.stringify(err))
//     }
//   })
// }
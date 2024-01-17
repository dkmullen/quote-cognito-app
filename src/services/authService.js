import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import { useAppStore } from '../stores/index.js'

function getUserPool() {
  var poolData = {
    UserPoolId: import.meta.env.VITE_APP_USERPOOL_ID,
    ClientId: import.meta.env.VITE_APP_CLIENT_ID
  }
  var userPool = new CognitoUserPool(poolData)
  return userPool
}

export function signIn(payload) {
  const appStore = useAppStore()
  appStore.setLoading(true)
  var authenticationData = {
    Username: payload.username,
    Password: payload.password
  }
  var authenticationDetails = new AuthenticationDetails(authenticationData)
  var userPool = getUserPool()
  var userData = {
    Username: import.meta.env.VITE_APP_USERNAME,
    Pool: userPool
  }
  var cognitoUser = new CognitoUser(userData)

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken()
      var idToken = result.getIdToken().getJwtToken()
      localStorage.setItem('cognitoIdToken', idToken)
      console.log(accessToken)
      // id token is the one needed by API Gateway
      console.log(idToken)
      appStore.setLoading(false)
    },

    onFailure: function (err) {
      appStore.setLoading(false)
      appStore.setLoginErrorMessage(err.message || JSON.stringify(err))
    }

    // mfaSetup: function(challengeName, challengeParameters) {
    // 	cognitoUser.associateSoftwareToken(this);
    // },

    // associateSecretCode: function(secretCode) {
    // 	var challengeAnswer = prompt('Please input the TOTP code.', '');
    // 	cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this);
    // },

    // selectMFAType: function(challengeName, challengeParameters) {
    // 	var mfaType = prompt('Please select the MFA method.', ''); // valid values for mfaType is "SMS_MFA", "SOFTWARE_TOKEN_MFA"
    // 	cognitoUser.sendMFASelectionAnswer(mfaType, this);
    // },

    // totpRequired: function(secretCode) {
    // 	var challengeAnswer = prompt('Please input the TOTP code.', '');
    // 	cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
    // },

    // mfaRequired: function(codeDeliveryDetails) {
    // 	var verificationCode = prompt('Please input verification code', '');
    // 	cognitoUser.sendMFACode(verificationCode, this);
    // },
  })
}

export function getCurrentUser() {
  var userPool = getUserPool()
  var cognitoUser = userPool.getCurrentUser()
  console.log(cognitoUser)
  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err.message || JSON.stringify(err))
        return
      }
      console.log('session validity: ' + session.isValid())

      // NOTE: getSession must be called to authenticate user before calling getUserAttributes
      cognitoUser.getUserAttributes(function (err, attributes) {
        if (err) {
          console.error(err)
        } else {
          console.log(attributes)
        }
      })
    })
  }
}

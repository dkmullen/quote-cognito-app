import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'

var authenticationData = {
  Username: import.meta.env.VITE_APP_USERNAME,
  Password: import.meta.env.VITE_APP_PW
}
var authenticationDetails = new AuthenticationDetails(authenticationData)

var poolData = {
  UserPoolId: import.meta.env.VITE_APP_USERPOOL_ID,
  ClientId: import.meta.env.VITE_APP_CLIENT_ID
}
var userPool = new CognitoUserPool(poolData)
var userData = {
  Username: import.meta.env.VITE_APP_USERNAME,
  Pool: userPool
}
var cognitoUser = new CognitoUser(userData)

export function signIn() {
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken()
      var idToken = result.getIdToken().getJwtToken()
      console.log(accessToken)
      // id token is the one needed by API Gateway
      console.log(idToken)
    },

    onFailure: function (err) {
      alert(err.message || JSON.stringify(err))
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

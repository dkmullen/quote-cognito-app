const url = 'https://h5uwr12hmi.execute-api.us-east-2.amazonaws.com/dev'

export function post(payload) {
  console.log(payload)
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('cognitoIdToken')
    }
  })
}

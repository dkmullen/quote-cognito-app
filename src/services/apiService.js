const url = import.meta.env.VITE_APP_API_URL

export async function post(payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('cognitoIdToken')
      }
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    const message = {
      type: 'error',
      text: 'Unable to post data'
    }
    return message
  }
}

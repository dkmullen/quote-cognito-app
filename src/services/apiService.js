const apiUrl = import.meta.env.VITE_APP_API_URL
import { getIdToken } from './authService'

export async function post(payload) {
  const token = await getIdToken()
  try {
    const response = await fetch(`${apiUrl}/admin`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    console.log('response', response)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  } catch (error) {
    console.error('Error:', error)
    const message = {
      type: 'error',
      text: 'Unable to post data'
    }
    return message
  }
}

export async function retrieve(id = null) {
  const path = id || id === 0 ? `/admin?id=${id}` : '/admin'
  try {
    const response = await fetch(apiUrl + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
      text: 'Unable to retrieve data'
    }
    return message
  }
}

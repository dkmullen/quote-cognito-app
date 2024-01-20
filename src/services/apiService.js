const postUrl = import.meta.env.VITE_APP_API_POST_URL
const retrieveUrl = import.meta.env.VITE_APP_API_RETRIEVE_URL
import { getIdToken } from './authService'

export async function post(payload) {
  const token = await getIdToken()
  try {
    const response = await fetch(postUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
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

export async function retrieveAll() {
  try {
    const response = await fetch(retrieveUrl, {
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

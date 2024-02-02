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

export async function retrieve(postId = 'GETALL') {
  try {
    const response = await fetch(`${retrieveUrl}?id=${postId}`, {
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

export async function getImg() {
  const url = retrieveUrl
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/octet-stream' // Set the Accept header for the expected response type
    }
  })
  console.log(response.body)
  if (!response.ok) {
    console.error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    return
  }

  const bodyStream = response.body
  const newResponse = new Response(bodyStream)
  const blob = await newResponse.blob()
  console.log(blob)
  const resultUrl = URL.createObjectURL(blob)
  window.open(resultUrl, '_blank')
  document.querySelector('img').src = resultUrl
}

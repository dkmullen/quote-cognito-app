import { useAppStore } from '@/stores'
const apiUrl = import.meta.env.VITE_APP_API_URL
const carsUrl = import.meta.env.VITE_APP_CARS_URL

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
  const store = useAppStore()
  const path = id || id === 0 ? `/admin?id=${id}` : '/admin'
  store.setLoading(true)
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
  } finally {
    store.setLoading(false)
  }
}

export async function deleteItem(id) {
  const store = useAppStore()
  store.setLoading(true)
  const token = await getIdToken()
  try {
    const response = await fetch(`${apiUrl}/admin?id=${id}`, {
      method: 'DELETE',
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
      text: 'Unable to retrieve data'
    }
    return message
  } finally {
    store.setLoading(false)
  }
}

export async function postCarItem(payload) {
  const token = await getIdToken()
  try {
    const response = await fetch(`${carsUrl}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'x-api-key': import.meta.env.VITE_APP_CARS_API_KEY
      }
    })
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

export async function getArticle() {
  const path = `https://39wdm3yvlb.execute-api.us-east-1.amazonaws.com/dev/articles?id=1`
  try {
    const response = await fetch(path, {
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
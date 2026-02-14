import { useAppStore } from '@/stores'
const apiUrl = import.meta.env.VITE_APP_API_URL

import { getIdToken } from './authService'

export async function post(params) {
  console.log(params)
  const { path, payload } = params
  const token = await getIdToken()
  const store = useAppStore()
  store.setLoading(true)
  try {
    const response = await fetch(`${apiUrl}${path}`, {
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
  } finally {
    store.setLoading(false)
  }
}

export async function retrieve(params) {
  let pathName
  const { path, id, name } = params
  switch (path) {
    case '/quotes':
      pathName = id || id === 0 ? `${path}?id=${id}` : path
      break
    case '/cars':
      pathName = id || id === 0 ? `${path}?id=${id}&name=${name}` : path
      break
  }
  const store = useAppStore()
  store.setLoading(true)
  try {
    const response = await fetch(apiUrl + pathName, {
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

export async function deleteItem(params) { 
  const { path, id, name } = params
  const store = useAppStore()
  store.setLoading(true)
  const token = await getIdToken()
  let deleteUrl = `${apiUrl}${path}?id=${id}`
  if (path.includes('cars')) deleteUrl += `&name=${name}`
  try {
    const response = await fetch(deleteUrl, {
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
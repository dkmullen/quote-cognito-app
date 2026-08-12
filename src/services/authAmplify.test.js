import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import * as authModule from './authAmplify.js'

vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  fetchAuthSession: vi.fn()
}))

vi.mock('@/router/index.js', () => ({
  default: {
    push: vi.fn()
  }
}))

const {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession
} = await import('aws-amplify/auth')
const router = (await import('@/router/index.js')).default

describe('authAmplify', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('doLogIn', () => {
    it('succeeds when signIn resolves', async () => {
      signIn.mockResolvedValueOnce({ userId: '123' })

      await authModule.doLogIn({ username: 'user', password: 'pass' })

      expect(signIn).toHaveBeenCalledWith({
        username: 'user',
        password: 'pass'
      })
      expect(router.push).toHaveBeenCalledWith({ name: 'home' })
    })

    it('fails with Error when signIn rejects', async () => {
      const error = new Error('Invalid credentials')
      signIn.mockRejectedValueOnce(error)

      await authModule.doLogIn({ username: 'user', password: 'wrong' })

      expect(signIn).toHaveBeenCalledWith({
        username: 'user',
        password: 'wrong'
      })
      expect(router.push).not.toHaveBeenCalled()
    })

    it('fails with non-Error object when signIn rejects', async () => {
      const errorObj = { code: 'AUTH_ERROR', details: 'custom error' }
      signIn.mockRejectedValueOnce(errorObj)

      await authModule.doLogIn({ username: 'user', password: 'pass' })

      expect(router.push).not.toHaveBeenCalled()
    })
  })

  describe('getUser', () => {
    it('returns user when getCurrentUser resolves', async () => {
      const mockUser = { userId: '123', username: 'testuser' }
      getCurrentUser.mockResolvedValueOnce(mockUser)

      const result = await authModule.getUser()

      expect(result).toEqual(mockUser)
    })

    it('returns null when getCurrentUser rejects', async () => {
      getCurrentUser.mockRejectedValueOnce(new Error('No user'))

      const result = await authModule.getUser()

      expect(result).toBeNull()
    })
  })

  describe('signOutUser', () => {
    it('calls signOut and navigates to login', async () => {
      signOut.mockResolvedValueOnce(undefined)

      await authModule.signOutUser()

      expect(signOut).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith({ name: 'login' })
    })
  })

  describe('getIdToken', () => {
    it('returns idToken when fetchAuthSession resolves', async () => {
      const mockToken = 'token123'
      fetchAuthSession.mockResolvedValueOnce({
        tokens: {
          idToken: {
            toString: () => mockToken
          }
        }
      })

      const result = await authModule.getIdToken()

      expect(result).toBe(mockToken)
    })

    it('returns null when fetchAuthSession rejects', async () => {
      fetchAuthSession.mockRejectedValueOnce(new Error('Auth failed'))

      const result = await authModule.getIdToken()

      expect(result).toBeNull()
    })

    it('returns undefined when tokens.idToken is missing', async () => {
      fetchAuthSession.mockResolvedValueOnce({
        tokens: {}
      })

      const result = await authModule.getIdToken()

      expect(result).toBeUndefined()
    })

    it('returns undefined when tokens is missing', async () => {
      fetchAuthSession.mockResolvedValueOnce({})

      const result = await authModule.getIdToken()

      expect(result).toBeUndefined()
    })
  })
})

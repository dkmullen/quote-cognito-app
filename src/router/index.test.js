import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

const mockGetUser = vi.fn()

vi.mock('@/services/authAmplify.js', () => ({
  getUser: mockGetUser
}))

vi.mock('@/views/HomeView.vue', () => ({
  default: { name: 'HomeView' }
}))

vi.mock('@/views/LoginView.vue', () => ({
  default: { name: 'LoginView' }
}))

vi.mock('@/views/QuotesList.vue', () => ({
  default: { name: 'QuotesList' }
}))

vi.mock('@/views/CarsList.vue', () => ({
  default: { name: 'CarsList' }
}))

vi.mock('@/views/MessageList.vue', () => ({
  default: { name: 'MessageList' }
}))

describe('router beforeEach guard', () => {
  let router

  beforeEach(async () => {
    vi.resetModules()
    mockGetUser.mockReset()
    const routerModule = await import('./index.js')
    router = routerModule.default
  })

  it('redirects authenticated user navigating to login to home', async () => {
    mockGetUser.mockResolvedValue({ userId: '123', username: 'testuser' })

    await router.push({ name: 'login' })

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('redirects unauthenticated user navigating to / to login', async () => {
    mockGetUser.mockResolvedValue(null)

    await router.push({ name: 'home' })

    expect(router.currentRoute.value.name).toBe('login')
  })

  it('keeps unauthenticated user on login route', async () => {
    mockGetUser.mockResolvedValue(null)

    await router.push({ name: 'login' })

    expect(router.currentRoute.value.name).toBe('login')
  })

  it('keeps authenticated user on protected route', async () => {
    mockGetUser.mockResolvedValue({ userId: '123', username: 'testuser' })

    await router.push({ name: 'quotes' })

    expect(router.currentRoute.value.name).toBe('quotes')
  })

  it('redirects unauthenticated user navigating to protected route to login', async () => {
    mockGetUser.mockResolvedValue(null)

    await router.push({ name: 'cars' })

    expect(router.currentRoute.value.name).toBe('login')
  })
})

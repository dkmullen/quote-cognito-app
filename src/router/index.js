import { createRouter, createWebHistory } from 'vue-router'
import { getUser } from '@/services/authService.js'
const MainForm = () => import('@/views/MainForm.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: MainForm },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') }
  ]
})

router.beforeEach(async (to) => {
  let validUser = getUser()
  if (!validUser && to.name !== 'login') {
    return { name: 'login' }
  } else if (validUser && to.name === 'login') {
    return { name: 'home' }
  }
})

export default router

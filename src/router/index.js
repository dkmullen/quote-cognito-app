import { createRouter, createWebHistory } from 'vue-router'
import { getUser } from '@/services/authService.js'
const MainForm = () => import('@/views/MainForm.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: MainForm },
    { path: '/:id', name: 'edit', component: MainForm },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/table', name: 'table', component: () => import('@/views/TableView.vue') },
    { path: '/cars', name: 'cars', component: () => import('@/views/CarForm.vue') }
  ]
})

router.beforeEach(async (to) => {
  let validUser = getUser()
  console.log(validUser)
  if (!validUser && to.name !== 'login') {
    return { name: 'login' }
  } else if (validUser && to.name === 'login') {
    return { name: 'home' }
  }
})

export default router

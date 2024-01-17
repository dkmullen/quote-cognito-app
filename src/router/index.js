import { createRouter, createWebHistory } from 'vue-router'
const MainForm = () => import('@/views/MainForm.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: MainForm },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') }
  ]
})

router.beforeEach(async (to) => {
  let isAuthenticated = false
  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router

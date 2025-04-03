import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Home from '@/pages/Home.vue'
import BooksPage from '@/pages/BooksPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'books', name: 'Books', component: BooksPage }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
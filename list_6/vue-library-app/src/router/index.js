import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Home from '@/pages/Home.vue'
import BooksPage from '@/pages/BooksPage.vue'
import AuthorsPage from '@/pages/AuthorsPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'books', name: 'Books', component: BooksPage },
      { path: 'authors', name: 'Authors', component: AuthorsPage }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'exact-active-link'
})
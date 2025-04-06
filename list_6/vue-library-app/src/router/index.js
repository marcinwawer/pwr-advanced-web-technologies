import { createRouter, createWebHistory } from "vue-router";
import UserHome from "../pages/userPanel/UserHome.vue";
import UserLayout from "../layouts/UserLayout.vue";
import UserBooks from "../pages/userPanel/UserBooks.vue";
import UserBorrows from "../pages/userPanel/UserBorrows.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import Home from "../pages/AdminPanel/Home.vue";
import BooksPage from "../pages/AdminPanel/BooksPage.vue";
import AuthorsPage from "../pages/AdminPanel/AuthorsPage.vue";
import ReadersPage from "../pages/AdminPanel/ReadersPage.vue";

const routes = [
  {
    path: "/",
    component: AdminLayout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "books", name: "Books", component: BooksPage },
      { path: "authors", name: "Authors", component: AuthorsPage },
      { path: "readers", name: "Readers", component: ReadersPage },
    ],
  },
  {
    path: "/user",
    component: UserLayout,
    children: [
      { path: "", name: "UserHome", component: UserHome },
      { path: "books", name: "UserBooks", component: UserBooks },
      { path: "borrows", name: "UserBorrows", component: UserBorrows },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: "exact-active-link",
});

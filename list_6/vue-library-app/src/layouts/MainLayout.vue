<template>
    <div>
      <header>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/books">Books</router-link>
        </nav>
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </template>
  
  <style scoped>
  nav {
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: #f2f2f2;
  }
  </style>
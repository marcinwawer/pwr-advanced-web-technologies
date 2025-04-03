<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="branding">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big-icon lucide-library-big"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>
        </div>
        <h1>Wrocław City Library </h1>
        <p>Admin Panel</p>
      </div>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active-link">
          🏠 Home
        </router-link>
        <router-link to="/books" exact-active-class="active-link">
          📚 Books
        </router-link>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>
  
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  .layout {
    display: flex;
    font-family: 'Roboto', sans-serif;
    background-color: #f9f9fb;
    min-height: 100vh;
    padding-left: 300px;
  }

  .sidebar {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 250px;
    height: calc(100vh - 40px);
    background-color: #E6E6FA;
    border-radius: 30px;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .branding {
    text-align: center;
    margin-bottom: 40px;
    color: #5e466f;
  }

  .branding .icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .branding h1 {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
  }

  .branding p {
    font-size: 0.85rem;
    margin: 0;
    opacity: 0.7;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }

  .nav-links a {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 12px;
    color: #7e7e7e;
    text-decoration: none;
    font-weight: 500;
    transition: 0.2s ease;
  }

  .nav-links a:hover {
    background-color: #d9cce0;
    color: #483248;
  }

  .nav-links a.active-link {
    background-color: #7b5e8b;
    color: white;
  }

  .content {
    flex: 1;
    padding: 40px;
  }
</style>
<template>
  <div class="home">
    <div class="hero">
      <h1>📖 Welcome to the Library Management System</h1>
      <p>Manage books, authors, members, and borrow records for your library. All in one place.</p>
    </div>

    <div class="actions">
      <router-link to="/books" class="action-card">
        <h2>📚 Books</h2>
        <p>Browse, edit, and add books to the system.</p>
      </router-link>

      <router-link to="/authors" class="action-card">
        <h2>👥 Authors</h2>
        <p>View author list and manage them.</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 40px;
}

.hero {
  margin-bottom: 40px;
  text-align: center;
}

.hero h1 {
  font-size: 1.8rem;
  color: #483248;
  margin-bottom: 10px;
}

.hero p {
  font-size: 1rem;
  color: #7e7e7e;
}

.actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-card {
  background-color: #f3eff5;
  padding: 20px;
  width: 240px;
  border-radius: 20px;
  text-decoration: none;
  color: #483248;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.action-card h2 {
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.action-card p {
  font-size: 0.95rem;
  opacity: 0.8;
}
</style>
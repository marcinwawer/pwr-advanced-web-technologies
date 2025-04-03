<template>
  <div class="book-list">
    <h2>📖 Book List</h2>

    <table class="book-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Authors</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.authors?.map(a => a.name + ' ' + a.surname).join(', ') }}</td>
          <td class="actions">
            <button class="edit-btn" @click="$emit('edit-book', book)">Edit</button>
            <button class="delete-btn" @click="$emit('delete-book', book.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="$emit('prev-page')" :disabled="currentPage === 0">← Prev</button>
      <span>Page {{ currentPage + 1 }}</span>
      <button @click="$emit('next-page')" :disabled="currentPage + 1 >= totalPages">Next →</button>
    </div>
  </div>
</template>

<style scoped>
  .book-list {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  h2 {
    margin-bottom: 20px;
    color: #483248;
  }

  .book-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .book-table th,
  .book-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .book-table tr:nth-child(even) {
    background-color: #faf7fc;
  }

  .actions {
    display: flex;
    gap: 10px;
  }

  button {
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .edit-btn {
    background-color: #7b5e8b;
    color: white;
  }
  .edit-btn:hover {
    background-color: #6a4b7a;
  }

  .delete-btn {
    background-color: #e57373;
    color: white;
  }
  .delete-btn:hover {
    background-color: #d64b4b;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  .pagination button {
    background-color: #ddd;
    color: #333;
  }
  .pagination button:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: not-allowed;
  }
</style>

<script setup>
  defineProps({
    books: Array,
    currentPage: Number,
    totalPages: Number
  })
  defineEmits(['edit-book', 'delete-book', 'next-page', 'prev-page'])
</script>
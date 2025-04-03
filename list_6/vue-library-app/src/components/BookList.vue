<template>
    <div>
      <h2>Book List</h2>
  
      <table>
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
            <td>{{ book.authors?.map(a => a.name).join(', ') }}</td>
            <td>
              <button @click="$emit('edit-book', book)">Edit</button>
              <button @click="$emit('delete-book', book.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="pagination">
        <button @click="$emit('prev-page')" :disabled="currentPage === 0">Prev</button>
        <span>Page {{ currentPage + 1 }}</span>
        <button @click="$emit('next-page')">Next</button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    books: Array,
    currentPage: Number
  })
  defineEmits(['edit-book', 'delete-book', 'next-page', 'prev-page'])
  </script>
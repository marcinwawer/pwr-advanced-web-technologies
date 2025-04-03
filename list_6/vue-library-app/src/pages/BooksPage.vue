<template>
    <div>
      <h1>Books</h1>
      <button @click="startCreating">Add Book</button>
  
      <BookForm
        v-if="showForm"
        :book="editingBook"
        @book-saved="onBookSaved"
      />
  
      <BookList
        :books="books"
        :currentPage="page"
        @edit-book="startEditing"
        @delete-book="deleteBookById"
        @next-page="nextPage"
        @prev-page="prevPage"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import BookList from '@/components/BookList.vue'
  import BookForm from '@/components/BookForm.vue'
  import { getBooks, deleteBook } from '@/services/api'
  
  const books = ref([])
  const page = ref(0)
  const editingBook = ref(null)
  const showForm = ref(false)
  
    const loadBooks = async () => {
        const result = await getBooks(page.value)
        console.log('Books from API:', result)
        books.value = result
    }
  
  const startEditing = (book) => {
    editingBook.value = book
    showForm.value = true
  }
  
  const startCreating = () => {
    editingBook.value = null
    showForm.value = true
  }
  
  const onBookSaved = async () => {
    showForm.value = false
    await loadBooks()
  }
  
  const deleteBookById = async (id) => {
    await deleteBook(id)
    await loadBooks()
  }
  
  const nextPage = () => {
    page.value++
    loadBooks()
  }
  
  const prevPage = () => {
    if (page.value > 0) {
      page.value--
      loadBooks()
    }
  }
  
  onMounted(loadBooks)
  </script>
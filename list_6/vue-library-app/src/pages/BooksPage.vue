<template>
  <div class="books-page">
    <div class="header">
      <h1>📚 Books</h1>
      <button class="add-btn" @click="startCreating">+ Add Book</button>
    </div>

    <BookForm
      v-if="showForm"
      :book="editingBook"
      @book-saved="onBookSaved"
    />

    <BookList
      :books="books"
      :currentPage="page"
      :totalPages="totalPages"
      @edit-book="startEditing"
      @delete-book="deleteBookById"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>

<style scoped>
  .books-page {
    padding: 20px 40px;
    background-color: #f9f9fb;
    min-height: 100vh;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 1.8rem;
    color: #483248;
    margin: 0;
  }

  .add-btn {
    background-color: #7b5e8b;
    color: white;
    font-weight: 500;
    font-size: 0.95rem;
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .add-btn:hover {
    background-color: #6a4b7a;
  }
</style>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import BookList from '@/components/BookList.vue'
  import BookForm from '@/components/BookForm.vue'
  import { getBooks, deleteBook } from '@/services/api'
  
  const books = ref([])
  const page = ref(0)
  const editingBook = ref(null)
  const showForm = ref(false)
  const totalPages = ref(1)

  const loadBooks = async () => {
    const result = await getBooks(page.value)
    console.log('Books from API:', result)
    books.value = result.books
    totalPages.value = result.totalPages
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
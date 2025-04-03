<template>
  <div class="books-page">
    <div class="header">
      <h1>📚 Books</h1>
      <button class="add-btn" @click="startCreating">+ Add Book</button>
    </div>

    <p v-if="feedbackMessage" :class="['feedback', feedbackType]">
      {{ feedbackMessage }}
    </p>

    <div class="form-row" v-if="showForm">
      <div class="form-wrapper">
        <button class="close-btn" @click="closeForm">×</button>
        <BookForm
          :book="editingBook"
          @book-saved="onBookSaved"
        />
      </div>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search books by title..."
        class="search-input"
      />
    </div>

    <BookList
      :books="filteredBooks"
      :currentPage="page"
      :totalPages="totalPages"
      @edit-book="startEditing"
      @delete-book="deleteBookById"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BookList from '@/components/BookList.vue'
import BookForm from '@/components/BookForm.vue'
import { getBooks, deleteBook } from '@/services/api'

const books = ref([])
const page = ref(0)
const editingBook = ref(null)
const showForm = ref(false)
const totalPages = ref(1)

const searchQuery = ref('')
const feedbackMessage = ref('')
const feedbackType = ref('')

const filteredBooks = computed(() =>
  books.value.filter(book =>
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const loadBooks = async () => {
  const result = await getBooks(page.value)
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

const closeForm = () => {
  showForm.value = false
  editingBook.value = null
}

const onBookSaved = async (feedback) => {
  feedbackMessage.value = feedback.message
  feedbackType.value = feedback.success ? 'success' : 'error'

  if (feedback.success) {
    showForm.value = false
    await loadBooks()

    setTimeout(() => {
      feedbackMessage.value = ''
      feedbackType.value = ''
    }, 3000)
  }
}

const deleteBookById = async (id) => {
  try {
    await deleteBook(id)
    await loadBooks()
    feedbackMessage.value = 'Book deleted successfully.'
    feedbackType.value = 'success'
  } catch (err) {
    let message = 'Failed to delete the book.'
    if (err.response?.data?.message) {
      message = err.response.data.message
    }
    feedbackMessage.value = message
    feedbackType.value = 'error'
  }

  setTimeout(() => {
    feedbackMessage.value = ''
    feedbackType.value = ''
  }, 3000)
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
  margin-bottom: 20px;
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

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;
}

.search-input:focus {
  border-color: #7b5e8b;
}

.feedback {
  margin-bottom: 20px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 500px;
}

.feedback.success {
  background-color: #e0f7e9;
  color: #2e7d32;
}

.feedback.error {
  background-color: #fbeaea;
  color: #d32f2f;
}

.form-row {
  display: flex;
  justify-content: left;
  margin-bottom: 20px;
}

.form-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background-color: #b71c1c;
}
</style>
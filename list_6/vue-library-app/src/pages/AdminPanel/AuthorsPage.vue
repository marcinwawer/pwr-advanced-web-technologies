<template>
  <div class="authors-page">
    <div class="header">
      <h1>🧑‍💼 Authors</h1>
      <button class="add-btn" @click="startCreating">+ Add Author</button>
    </div>

    <p v-if="feedbackMessage" :class="['feedback', feedbackType]">
      {{ feedbackMessage }}
    </p>

    <div class="form-row" v-if="showForm">
      <div class="form-wrapper">
        <button class="close-btn" @click="closeForm">×</button>
        <AuthorForm :author="editingAuthor" @author-saved="onAuthorSaved" />
      </div>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search authors..."
        class="search-input"
      />
    </div>

    <AuthorList
      :authors="authors"
      :currentPage="page"
      :totalPages="totalPages"
      @edit-author="startEditing"
      @delete-author="deleteAuthorById"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import AuthorForm from '@/components/AuthorForm.vue'
  import AuthorList from '@/components/AuthorList.vue'
  import { getAuthorsPage, deleteAuthor } from '@/services/api'

  const authors = ref([])
  const page = ref(0)
  const totalPages = ref(1)
  const editingAuthor = ref(null)
  const showForm = ref(false)

  const feedbackMessage = ref('')
  const feedbackType = ref('')
  const searchQuery = ref('')

  const loadAuthors = async () => {
    const res = await getAuthorsPage(page.value, 10, searchQuery.value)
    authors.value = res.authors
    totalPages.value = res.totalPages
  }

  watch(searchQuery, () => {
    page.value = 0 
    loadAuthors()
  })

  const startCreating = () => {
    editingAuthor.value = null
    showForm.value = true
  }

  const startEditing = (author) => {
    editingAuthor.value = author
    showForm.value = true
  }

  const closeForm = () => {
    editingAuthor.value = null
    showForm.value = false
  }

  const onAuthorSaved = async (feedback) => {
    feedbackMessage.value = feedback.message
    feedbackType.value = feedback.success ? 'success' : 'error'
    if (feedback.success) {
      closeForm()
      await loadAuthors()
    }
    setTimeout(() => {
      feedbackMessage.value = ''
      feedbackType.value = ''
    }, 3000)
  }

  const deleteAuthorById = async (id) => {
    try {
      await deleteAuthor(id)
      await loadAuthors()
      feedbackMessage.value = 'Author deleted successfully.'
      feedbackType.value = 'success'
    } catch (err) {
      let message = 'Failed to delete author.'
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
    loadAuthors()
  }

  const prevPage = () => {
    if (page.value > 0) {
      page.value--
      loadAuthors()
    }
  }

  onMounted(loadAuthors)
</script>

<style scoped>
  .authors-page {
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
    max-width: 500px;
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
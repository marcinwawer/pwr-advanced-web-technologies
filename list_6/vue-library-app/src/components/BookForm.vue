<template>
  <form class="book-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">Title</label>
      <input id="title" v-model="form.title" required />
    </div>

    <div class="form-group">
      <label>Authors</label>

      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search authors..."
        class="search-input"
      />

      <div class="checkbox-group">
        <label
          v-for="author in authors"
          :key="author.id"
          class="checkbox-item"
        >
          <input
            type="checkbox"
            :value="author.id"
            v-model="form.authors"
          />
          <span class="custom-checkbox"></span>
          {{ author.name }} {{ author.surname }}
        </label>
      </div>
    </div>

    <div class="pagination">
      <button type="button" @click="prevPage" :disabled="page === 0">←</button>
      <span>Page {{ page + 1 }}</span>
      <button type="button" @click="nextPage" :disabled="page + 1 >= totalPages">→</button>
    </div>

    <button type="submit" class="submit-btn">
      {{ isEdit ? 'Update Book' : 'Create Book' }}
    </button>
  </form>
</template>

<script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import { getAuthorsPage, createBook, updateBook, updateBookAuthors } from '@/services/api'

  const props = defineProps({ book: Object })
  const emit = defineEmits(['book-saved'])

  const form = ref({
    title: '',
    authors: []
  })

  const isEdit = computed(() => !!props.book?.id)
  const searchQuery = ref('')

  const authors = ref([])
  const page = ref(0)
  const totalPages = ref(1)
  const pageSize = 5

  const loadAuthors = async () => {
    const res = await getAuthorsPage(page.value, pageSize, searchQuery.value)
    authors.value = res.authors
    totalPages.value = res.totalPages
  }

  const fillForm = () => {
    if (props.book) {
      form.value.title = props.book.title
      form.value.authors = props.book.authors?.map(a => a.id) || []
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEdit.value) {
        await updateBook(props.book.id, { title: form.value.title })
        await updateBookAuthors(props.book.id, form.value.authors)

        emit('book-saved', {
          success: true,
          message: 'Book updated successfully.'
        })
      } else {
        await createBook({
          title: form.value.title,
          authors: form.value.authors
        })

        emit('book-saved', {
          success: true,
          message: 'Book created successfully.'
        })
      }
    } catch (err) {
      let message = 'Something went wrong. Please try again.'
      if (err.response?.data?.message) {
        message = err.response.data.message
      }

      emit('book-saved', {
        success: false,
        message
      })

      console.error(err)
    }
  }

  const nextPage = () => {
    if (page.value + 1 < totalPages.value) {
      page.value++
      loadAuthors()
    }
  }

  const prevPage = () => {
    if (page.value > 0) {
      page.value--
      loadAuthors()
    }
  }

  onMounted(() => {
    loadAuthors()
    fillForm()
  })

  watch(searchQuery, () => {
    page.value = 0
    loadAuthors()
  })

  watch(() => props.book, fillForm)
</script>

<style scoped>
  .book-form {
    background-color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    max-width: 100%;
    margin-bottom: 30px;
    font-family: 'Roboto', sans-serif;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #483248;
  }

  input {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    outline: none;
    transition: border 0.2s ease;
  }

  input:focus {
    border-color: #7b5e8b;
  }

  .search-input {
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-bottom: 12px;
    font-size: 0.9rem;
    outline: none;
  }

  .search-input:focus {
    border-color: #7b5e8b;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    background-color: #f5f0f8;
    border: 1px solid #ccc;
    border-radius: 10px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #483248;
    gap: 10px;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-item input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    left: 0;
    height: 0;
    width: 0;
  }

  .custom-checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid #7b5e8b;
    border-radius: 6px;
    display: inline-block;
    position: relative;
    transition: 0.2s ease;
  }

  .checkbox-item input[type="checkbox"]:checked + .custom-checkbox::before {
    content: '✔';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
  }

  .checkbox-item input[type="checkbox"]:checked + .custom-checkbox {
    background-color: #7b5e8b;
    border-color: #7b5e8b;
  }

  .submit-btn {
    background-color: #7b5e8b;
    color: white;
    border: none;
    padding: 10px 18px;
    font-size: 0.95rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 15px;
  }

  .submit-btn:hover {
    background-color: #6a4b7a;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
  }

  .pagination button {
    background-color: #e0d7ec;
    color: #483248;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .pagination button:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: not-allowed;
  }

  .pagination button:hover:not(:disabled) {
    background-color: #cbb9dc;
    transform: translateY(-1px);
  }

  .pagination span {
    font-size: 0.95rem;
    font-weight: 500;
    color: #5e466f;
  }
</style>
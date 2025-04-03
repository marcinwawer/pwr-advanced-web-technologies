<template>
  <form class="author-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="name">First Name</label>
      <input id="name" v-model="form.name" required />
    </div>

    <div class="form-group">
      <label for="surname">Last Name</label>
      <input id="surname" v-model="form.surname" required />
    </div>

    <div v-if="books.length" class="books-info">
      <h4>Books by this author:</h4>
      <ul>
        <li v-for="book in books" :key="book.id">{{ book.title }}</li>
      </ul>
    </div>

    <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <button type="submit" class="submit-btn">
      {{ isEdit ? 'Update Author' : 'Create Author' }}
    </button>
  </form>
</template>

<script setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import { createAuthor, updateAuthor, getBooksByAuthor } from '@/services/api'

  const props = defineProps({ author: Object })
  const emit = defineEmits(['author-saved'])

  const form = ref({ name: '', surname: '' })
  const successMessage = ref('')
  const errorMessage = ref('')
  const books = ref([])

  const isEdit = computed(() => !!props.author?.id)

  const fillForm = () => {
    if (props.author) {
      form.value.name = props.author.name
      form.value.surname = props.author.surname
    }
  }

  const loadBooks = async () => {
    if (props.author?.id) {
      try {
        books.value = await getBooksByAuthor(props.author.id)
      } catch (e) {
        books.value = []
      }
    }
  }

  const handleSubmit = async () => {
    successMessage.value = ''
    errorMessage.value = ''

    try {
      if (isEdit.value) {
        await updateAuthor(props.author.id, form.value)
        successMessage.value = 'Author updated successfully.'
      } else {
        await createAuthor(form.value)
        successMessage.value = 'Author created successfully.'
      }

      emit('author-saved', { success: true, message: successMessage.value })
    } catch (err) {
      let message = 'An error occurred.'
      if (err.response?.data?.message) {
        message = err.response.data.message
      }
      errorMessage.value = message
      emit('author-saved', { success: false, message })
    }
  }

  watch(() => props.author, () => {
    fillForm()
    loadBooks()
  })

  onMounted(() => {
    fillForm()
    loadBooks()
  })
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  .author-form {
    background-color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    max-width: 100%;
    width: 100%;
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

  .books-info {
    margin-bottom: 16px;
  }

  .success-msg {
    color: #2e7d32;
    margin-top: 15px;
    font-weight: 500;
  }

  .error-msg {
    color: #d32f2f;
    margin-top: 15px;
    font-weight: 500;
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
  }

  .submit-btn:hover {
    background-color: #6a4b7a;
  }
</style>

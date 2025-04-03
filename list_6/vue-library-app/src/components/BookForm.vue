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
          v-for="author in filteredAuthors"
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

    <button type="submit" class="submit-btn">
      {{ isEdit ? 'Update Book' : 'Create Book' }}
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getAuthors, createBook, updateBook, updateBookAuthors } from '@/services/api'

const props = defineProps({ book: Object })
const emit = defineEmits(['book-saved'])

const form = ref({
  title: '',
  authors: []
})

const isEdit = computed(() => !!props.book?.id)
const allAuthors = ref([])
const searchQuery = ref('')

const loadAuthors = async () => {
  const res = await getAuthors(0, 100)
  allAuthors.value = res.content
}

const fillForm = () => {
  if (props.book) {
    form.value.title = props.book.title
    form.value.authors = props.book.authors?.map(a => a.id) || []
  }
}

const filteredAuthors = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return allAuthors.value.filter(author =>
    `${author.name} ${author.surname}`.toLowerCase().includes(query)
  )
})

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

onMounted(() => {
  loadAuthors()
  fillForm()
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
</style>
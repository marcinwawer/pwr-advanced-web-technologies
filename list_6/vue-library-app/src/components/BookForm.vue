<template>
  <form class="book-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">Title</label>
      <input id="title" v-model="form.title" required />
    </div>

    <div class="form-group">
      <label>Authors</label>
      <select v-model="form.authors" multiple>
        <option v-for="author in allAuthors" :key="author.id" :value="author.id">
          {{ author.name }}
        </option>
      </select>
    </div>

    <button type="submit" class="submit-btn">
      {{ isEdit ? 'Update Book' : 'Create Book' }}
    </button>
  </form>
</template>

<style scoped>
  .book-form {
    background-color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    max-width: 500px;
    margin-bottom: 30px;
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

  input,
  select {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    outline: none;
    transition: border 0.2s ease;
  }

  input:focus,
  select:focus {
    border-color: #7b5e8b;
  }

  select[multiple] {
    min-height: 100px;
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
  
  const handleSubmit = async () => {
    if (isEdit.value) {
      await updateBook(props.book.id, { title: form.value.title })
      await updateBookAuthors(props.book.id, form.value.authors)
    } else {
      await createBook({
        title: form.value.title,
        authors: form.value.authors
      })
    }
  
    emit('book-saved')
  }
  
  onMounted(() => {
    loadAuthors()
    fillForm()
  })
  
  watch(() => props.book, fillForm)
</script>
<template>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="title">Title</label>
        <input id="title" v-model="form.title" required />
      </div>
  
      <div>
        <label>Authors</label>
        <select v-model="form.authors" multiple>
          <option v-for="author in allAuthors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>
  
      <button type="submit">{{ isEdit ? 'Update' : 'Create' }} Book</button>
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
<template>
  <div class="readers-page">
    <div class="header">
      <h1>🤓 Readers</h1>
      <div style="display: flex; gap: 10px">
        <button class="default-btn" @click="startCreating">+ Add Reader</button>
      </div>
    </div>

    <p v-if="feedbackMessage" :class="['feedback', feedbackType]">
      {{ feedbackMessage }}
    </p>

    <div class="form-row" v-if="showForm">
      <div class="form-wrapper">
        <button class="close-btn" @click="closeForm">×</button>
        <ReaderForm :reader="editingReader" @reader-saved="onReaderSaved" />
      </div>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search readers..."
        class="search-input"
      />
    </div>

    <ReaderList
      :readers="readers"
      :currentPage="page"
      :totalPages="totalPages"
      @edit-reader="startEditing"
      @delete-reader="deleteReaderById"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import ReaderForm from "@/components/ReaderForm.vue";
import ReaderList from "@/components/ReaderList.vue";
import { getReadersPage, deleteReader } from "@/services/api";

const readers = ref([]);
const page = ref(0);
const totalPages = ref(1);
const editingReader = ref(null);
const showForm = ref(false);

const feedbackMessage = ref("");
const feedbackType = ref("");
const searchQuery = ref("");

const loadReaders = async () => {
  const res = await getReadersPage(page.value, 10, searchQuery.value);
  readers.value = res.readers;
  totalPages.value = res.totalPages;
};

watch(searchQuery, () => {
  page.value = 0;
  loadReaders();
});

const startCreating = () => {
  editingReader.value = null;
  showForm.value = true;
};

const startEditing = (reader) => {
  editingReader.value = reader;
  showForm.value = true;
};

const closeForm = () => {
  editingReader.value = null;
  showForm.value = false;
};

const onReaderSaved = async (feedback) => {
  feedbackMessage.value = feedback.message;
  feedbackType.value = feedback.success ? "success" : "error";
  if (feedback.success) {
    closeForm();
    await loadReaders();
  }
  setTimeout(() => {
    feedbackMessage.value = "";
    feedbackType.value = "";
  }, 3000);
};

const deleteReaderById = async (id) => {
  try {
    await deleteReader(id);
    await loadReaders();
    feedbackMessage.value = "Reader deleted successfully.";
    feedbackType.value = "success";
  } catch (err) {
    let message = "Failed to delete reader.";
    if (err.response?.data?.message) {
      message = err.response.data.message;
    }
    feedbackMessage.value = message;
    feedbackType.value = "error";
  }

  setTimeout(() => {
    feedbackMessage.value = "";
    feedbackType.value = "";
  }, 3000);
};

const nextPage = () => {
  page.value++;
  loadReaders();
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadReaders();
  }
};

onMounted(loadReaders);
</script>

<style scoped>
.readers-page {
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

.default-btn {
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

.default-btn:hover {
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

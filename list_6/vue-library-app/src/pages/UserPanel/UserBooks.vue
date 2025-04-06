<template>
  <div class="borrow-page">
    <h1>📚 Borrow a Book</h1>

    <p v-if="feedbackMessage" :class="['feedback', feedbackType]">
      {{ feedbackMessage }}
    </p>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search books by title..."
        class="search-input"
      />
    </div>

    <div class="book-grid">
      <div class="book-card" v-for="book in books" :key="book.id">
        <h3>{{ book.title }}</h3>
        <p>
          <strong>Author:</strong>
          {{ book.authors?.map((a) => a.name + " " + a.surname).join(", ") }}
        </p>
        <button @click="openModal(book)">Borrow</button>
      </div>
    </div>

    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 0"
      >
        ← Prev
      </button>
      <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage + 1 >= totalPages"
      >
        Next →
      </button>
    </div>

    <!-- MODAL -->
    <div class="modal-backdrop" v-if="showModal">
      <div class="modal">
        <p>
          Are you sure you want to borrow
          <strong>{{ selectedBook?.title }}</strong
          >?
        </p>
        <div class="modal-actions">
          <button class="yes-btn" @click="confirmBorrow">Yes</button>
          <button class="no-btn" @click="closeModal">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getBooks, borrowBook } from "@/services/api";

const books = ref([]);
const currentPage = ref(0);
const totalPages = ref(1);
const showModal = ref(false);
const selectedBook = ref(null);
const searchQuery = ref("");
const feedbackMessage = ref("");
const feedbackType = ref("");

watch(searchQuery, () => {
  currentPage.value = 0;
  loadBooks();
});

const loadBooks = async () => {
  const result = await getBooks(currentPage.value, 12, searchQuery.value);
  books.value = result.books;
  totalPages.value = result.totalPages;
};

const openModal = (book) => {
  selectedBook.value = book;
  showModal.value = true;
};

const closeModal = () => {
  selectedBook.value = null;
  showModal.value = false;
};

const confirmBorrow = async () => {
  try {
    await borrowBook({ readerID: 4, bookId: selectedBook.value.id });
    feedbackMessage.value = "Book borrowed successfully!";
    feedbackType.value = "success";
  } catch (e) {
    feedbackMessage.value = "Failed to borrow book.";
    feedbackType.value = "error";
  } finally {
    closeModal();
    setTimeout(() => {
      feedbackMessage.value = "";
      feedbackType.value = "";
    }, 3000);
  }
};

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    currentPage.value = newPage;
    loadBooks();
  }
};

onMounted(loadBooks);
</script>

<style scoped>
.borrow-page {
  padding: 40px;
  background: #f9f9fb;
  min-height: 100vh;
}

h1 {
  color: #483248;
  margin-bottom: 24px;
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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.book-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-card h3 {
  margin: 0 0 10px;
}

.book-card button {
  align-self: flex-start;
  background-color: #6c4f75;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.book-card button:hover {
  background-color: #5a3f61;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  width: 300px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.yes-btn,
.no-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.yes-btn {
  background-color: #2e7d32;
  color: white;
}

.no-btn {
  background-color: #d32f2f;
  color: white;
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

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  background-color: #6c4f75;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
}

.pagination span {
  margin: 0 10px;
  font-weight: bold;
}
</style>

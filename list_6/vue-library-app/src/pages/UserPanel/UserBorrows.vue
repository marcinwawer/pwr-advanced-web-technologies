<template>
  <div class="borrowed-page">
    <h1>📖 Your Borrowed Books</h1>

    <p v-if="feedbackMessage" :class="['feedback', feedbackType]">
      {{ feedbackMessage }}
    </p>

    <div class="borrow-grid">
      <div class="borrow-card" v-for="borrow in activeBorrows" :key="borrow.id">
        <h3>{{ borrow.book.title }}</h3>
        <p>
          <strong>Author:</strong>
          {{
            borrow.book.authors?.map((a) => a.name + " " + a.surname).join(", ")
          }}
        </p>
        <button @click="openModal(borrow)">Return</button>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal-backdrop" v-if="showModal">
      <div class="modal">
        <p>
          Are you sure you want to return
          <strong>{{ selectedBorrow?.book.title }}</strong
          >?
        </p>
        <div class="modal-actions">
          <button class="yes-btn" @click="confirmReturn">Yes</button>
          <button class="no-btn" @click="closeModal">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getBorrowsForReader, returnBorrow } from "@/services/api";

const readerId = 4;
const borrows = ref([]);
const selectedBorrow = ref(null);
const showModal = ref(false);
const feedbackMessage = ref("");
const feedbackType = ref("");

const activeBorrows = computed(() =>
  borrows.value.filter((b) => !b.isReturned)
);

const loadBorrows = async () => {
  try {
    const res = await getBorrowsForReader(readerId);
    borrows.value = res;
  } catch (e) {
    feedbackMessage.value = "Error loading borrows.";
    feedbackType.value = "error";
  }
};

const openModal = (borrow) => {
  selectedBorrow.value = borrow;
  showModal.value = true;
};

const closeModal = () => {
  selectedBorrow.value = null;
  showModal.value = false;
};

const confirmReturn = async () => {
  try {
    await returnBorrow(selectedBorrow.value.id);
    feedbackMessage.value = "Book returned successfully!";
    feedbackType.value = "success";
    await loadBorrows();
  } catch (e) {
    feedbackMessage.value = "Failed to return the book.";
    feedbackType.value = "error";
  } finally {
    closeModal();
    setTimeout(() => {
      feedbackMessage.value = "";
      feedbackType.value = "";
    }, 3000);
  }
};

onMounted(loadBorrows);
</script>

<style scoped>
.borrowed-page {
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

.borrow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.borrow-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.borrow-card h3 {
  margin: 0 0 10px;
}

.borrow-card button {
  align-self: flex-start;
  background-color: #b85b5b;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.borrow-card button:hover {
  background-color: #993f3f;
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
</style>

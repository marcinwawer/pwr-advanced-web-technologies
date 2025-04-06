<template>
  <div class="reader-list">
    <h2>🤓 Reader List</h2>

    <table class="reader-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reader in readers" :key="reader.id">
          <td>{{ reader.name }}</td>
          <td>{{ reader.email }}</td>
          <td class="actions">
            <button class="edit-btn" @click="$emit('edit-reader', reader)">
              Edit
            </button>
            <button
              class="delete-btn"
              @click="$emit('delete-reader', reader.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="$emit('prev-page')" :disabled="currentPage === 0">
        ← Prev
      </button>
      <span>Page {{ currentPage + 1 }}</span>
      <button
        @click="$emit('next-page')"
        :disabled="currentPage + 1 >= totalPages"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  readers: Array,
  currentPage: Number,
  totalPages: Number,
});

defineEmits(["edit-reader", "delete-reader", "next-page", "prev-page"]);
</script>

<style scoped>
.reader-list {
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
  color: #483248;
}

.reader-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.reader-table th,
.reader-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.reader-table tr:nth-child(even) {
  background-color: #faf7fc;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-btn {
  background-color: #7b5e8b;
  color: white;
}
.edit-btn:hover {
  background-color: #6a4b7a;
}

.delete-btn {
  background-color: #e57373;
  color: white;
}
.delete-btn:hover {
  background-color: #d64b4b;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  background-color: #ddd;
  color: #333;
}
.pagination button:disabled {
  background-color: #eee;
  color: #aaa;
  cursor: not-allowed;
}
</style>

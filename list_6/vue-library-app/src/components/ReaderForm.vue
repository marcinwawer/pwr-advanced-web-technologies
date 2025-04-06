<template>
  <form class="reader-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="name">First Name</label>
      <input id="name" v-model="form.name" required />
      <p v-if="nameError" class="error-msg">{{ nameError }}</p>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" type="email" v-model="form.email" required />
    </div>

    <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <button type="submit" class="submit-btn">
      {{ isEdit ? "Update Reader" : "Create Reader" }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { createReaders, updateReaders } from "@/services/api";

const props = defineProps({ reader: Object });
const emit = defineEmits(["reader-saved"]);

const form = ref({ name: "", email: "" });
const successMessage = ref("");
const errorMessage = ref("");
const nameError = ref("");

const isEdit = computed(() => !!props.reader?.id);

const fillForm = () => {
  if (props.reader) {
    form.value.name = props.reader.name;
    form.value.email = props.reader.email;
  }
};

const validateName = () => {
  const name = form.value.name;
  if (!/^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(name)) {
    nameError.value = "First name must start with an uppercase letter.";
    return false;
  }
  nameError.value = "";
  return true;
};

const handleSubmit = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!validateName()) {
    return;
  }

  try {
    if (isEdit.value) {
      await updateReaders(props.reader.id, form.value);
      successMessage.value = "Reader updated successfully.";
    } else {
      await createReaders(form.value);
      successMessage.value = "Reader created successfully.";
    }

    emit("reader-saved", { success: true, message: successMessage.value });
  } catch (err) {
    let message = "An error occurred.";
    if (err.response?.data?.message) {
      message = err.response.data.message;
    }
    errorMessage.value = message;
    emit("reader-saved", { success: false, message });
  }
};

watch(() => props.reader, fillForm);
onMounted(fillForm);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.reader-form {
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  width: 100%;
  margin-bottom: 30px;
  font-family: "Roboto", sans-serif;
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

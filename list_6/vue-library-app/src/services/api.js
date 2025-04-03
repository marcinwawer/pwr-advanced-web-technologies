import axios from 'axios'

const API_URL = 'http://localhost:8080/v1'

// Books
export const getBooks = async (page = 0, size = 10) => {
    const res = await axios.get(`${API_URL}/books?page=${page}&pageSize=${size}`)
    return {
      books: res.data.content,
      totalPages: res.data.totalPages
    }
}

export const createBook = async (book) => {
  return (await axios.post(`${API_URL}/books`, {
    title: book.title,
    authorIds: book.authors
  })).data
}

export const updateBook = async (id, updateRequest) => {
  return (await axios.put(`${API_URL}/books/${id}`, updateRequest)).data
}

export const updateBookAuthors = async (id, authorIds) => {
  return (await axios.put(`${API_URL}/books/${id}/authors`, authorIds)).data
}

export const deleteBook = async (id) => {
  return await axios.delete(`${API_URL}/books/${id}`)
}

// Authors
export const getAuthors = async (page = 0, size = 100) => {
  const res = await axios.get(`${API_URL}/authors?page=${page}&pageSize=${size}`)
  return res.data
}
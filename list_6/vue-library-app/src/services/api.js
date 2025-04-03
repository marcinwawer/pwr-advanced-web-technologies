import axios from 'axios'

const API_URL = 'http://localhost:8080/v1'

// Books
export const getBooks = async (page = 0, size = 10, search = '') => {
    const params = new URLSearchParams({ page, pageSize: size })
    if (search) {
      params.append('search', search)
    }
  
    const res = await axios.get(`${API_URL}/books?${params.toString()}`)
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

export const getAuthorsPage = async (page = 0, size = 10, search = '') => {
    const params = new URLSearchParams({
      page,
      pageSize: size,
    })
    if (search) {
      params.append('search', search)
    }
  
    const res = await axios.get(`${API_URL}/authors?${params.toString()}`)
    return {
      authors: res.data.content,
      totalPages: res.data.totalPages
    }
  }
  
export const createAuthor = async (author) => {
return (await axios.post(`${API_URL}/authors`, author)).data
}

export const updateAuthor = async (id, author) => {
return (await axios.put(`${API_URL}/authors/${id}`, author)).data
}

export const deleteAuthor = async (id) => {
return await axios.delete(`${API_URL}/authors/${id}`)
}

export const getBooksByAuthor = async (authorId) => {
const res = await axios.get(`${API_URL}/authors/${authorId}/books`)
return res.data
}
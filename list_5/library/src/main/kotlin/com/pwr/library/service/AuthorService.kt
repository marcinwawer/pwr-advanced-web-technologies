package com.pwr.library.service

import com.pwr.library.model.Author
import com.pwr.library.model.Book
import com.pwr.library.repository.AuthorRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class AuthorService(
    private val authorRepository: AuthorRepository
) {
    fun getAll(): List<Author> = authorRepository.findAll()

    fun getById(id: Long): Author? = authorRepository.findById(id).orElse(null)

    fun getBooksByAuthor(authorId: Long): List<Book> {
        val author = authorRepository.findById(authorId).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "author not found")
        }
        return author.books
    }

    fun create(author: Author): Author = authorRepository.save(author)

    fun update(id: Long, updated: Author): Author {
        if (!authorRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "author not found")
        }
        return authorRepository.save(updated.copy(id = id))
    }

    fun delete(id: Long) {
        if (!authorRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "author not found")
        }
        authorRepository.deleteById(id)
    }
}
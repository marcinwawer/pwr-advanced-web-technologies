package com.pwr.library.service

import com.pwr.library.dto.BookRequest
import com.pwr.library.dto.BookUpdateRequest
import com.pwr.library.model.Book
import com.pwr.library.repository.AuthorRepository
import com.pwr.library.repository.BookRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page

@Service
class BookService(
    private val bookRepository: BookRepository,
    private val authorRepository: AuthorRepository
) {
    fun getAll(pageable: Pageable): Page<Book> = bookRepository.findAll(pageable)

    fun getById(id: Long): Book {
        return bookRepository.findById(id).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "book not found")
        }
    }

    fun create(bookRequest: BookRequest): Book {
        val authors = authorRepository.findAllById(bookRequest.authorIds)

        if (authors.isEmpty()) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "book must have valid author")
        }

        val bookToSave = Book(title = bookRequest.title, authors = authors)
        return bookRepository.save(bookToSave)
    }

    fun update(id: Long, updatedBook: Book): Book {
        if (!bookRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "book not found")
        }

        val authors = authorRepository.findAllById(updatedBook.authors.map { it.id })
        val toSave = updatedBook.copy(id = id, authors = authors)

        return bookRepository.save(toSave)
    }

    fun updateTitle(id: Long, updateRequest: BookUpdateRequest): Book {
        val book = bookRepository.findById(id).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "book not found")
        }

        val updatedBook = book.copy(title = updateRequest.title)
        return bookRepository.save(updatedBook)
    }

    fun updateAuthors(bookId: Long, authorIds: List<Long>): Book {
        val book = bookRepository.findById(bookId).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "book not found")
        }

        val authors = authorRepository.findAllById(authorIds)

        if (authors.size != authorIds.size) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "one or more authors not found")
        }

        val updatedBook = book.copy(authors = authors)
        return bookRepository.save(updatedBook)
    }

    fun delete(id: Long) {
        if (!bookRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "book not found")
        }
        bookRepository.deleteById(id)
    }
}
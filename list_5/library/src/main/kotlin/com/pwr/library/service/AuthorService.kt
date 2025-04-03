package com.pwr.library.service

import com.pwr.library.model.Author
import com.pwr.library.model.Book
import com.pwr.library.repository.AuthorRepository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page

@Service
class AuthorService(
    private val authorRepository: AuthorRepository
) {
    fun getAll(pageable: Pageable): Page<Author> = authorRepository.findAll(pageable)

    fun getById(id: Long): Author {
        return authorRepository.findById(id).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "author not found")
        }
    }

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

        try {
            authorRepository.deleteById(id)
        } catch (ex: DataIntegrityViolationException) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "cannot delete author: still linked to books")
        }
    }
}
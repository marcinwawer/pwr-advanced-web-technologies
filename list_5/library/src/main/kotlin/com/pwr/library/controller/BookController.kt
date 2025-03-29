package com.pwr.library.controller

import com.pwr.library.dto.BookRequest
import com.pwr.library.dto.BookUpdateRequest
import com.pwr.library.model.Book
import com.pwr.library.service.BookService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/books")
class BookController(
    private val bookService: BookService
) {
    @GetMapping
    fun getAll(): List<Book> = bookService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Book> =
        bookService.getById(id)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @PostMapping
    fun create(@RequestBody bookRequest: BookRequest): ResponseEntity<Book> =
        ResponseEntity.ok(bookService.create(bookRequest))

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody updateRequest: BookUpdateRequest
    ): ResponseEntity<Book> =
        ResponseEntity.ok(bookService.updateTitle(id, updateRequest))

    @PutMapping("/{id}/authors")
    fun updateAuthors(
        @PathVariable id: Long,
        @RequestBody authorIds: List<Long>
    ): ResponseEntity<Book> =
        ResponseEntity.ok(bookService.updateAuthors(id, authorIds))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        bookService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
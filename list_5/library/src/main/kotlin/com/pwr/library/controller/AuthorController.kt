package com.pwr.library.controller

import com.pwr.library.model.Author
import com.pwr.library.model.Book
import com.pwr.library.service.AuthorService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/authors")
class AuthorController(
    private val authorService: AuthorService
) {
    @GetMapping
    fun getAll(): List<Author> = authorService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Author> =
        authorService.getById(id)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @GetMapping("/{id}/books")
    fun getBooksByAuthor(@PathVariable id: Long): ResponseEntity<List<Book>> {
        val books = authorService.getBooksByAuthor(id)
        return ResponseEntity.ok(books)
    }

    @PostMapping
    fun create(@RequestBody author: Author): Author = authorService.create(author)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody author: Author): Author = authorService.update(id, author)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        authorService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
package com.pwr.library.controller

import com.pwr.library.model.Author
import com.pwr.library.model.Book
import com.pwr.library.service.AuthorService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.Parameter
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "Author Controller", description = "Handles all operations related to authors")
@RestController
@RequestMapping("/authors")
class AuthorController(
    private val authorService: AuthorService
) {
    @Operation(summary = "Get all authors")
    @GetMapping
    fun getAll(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<Page<Author>> {
        val pageable: Pageable = PageRequest.of(page, pageSize)
        val authorsPage: Page<Author> = authorService.getAll(pageable)
        return ResponseEntity.ok(authorsPage)
    }

    @Operation(summary = "Get an author by ID")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Author found"),
        ApiResponse(responseCode = "404", description = "Author not found")
    )
    @GetMapping("/{id}")
    fun getById(
        @Parameter(description = "ID of the author to retrieve") @PathVariable id: Long
    ): ResponseEntity<Author> =
        authorService.getById(id)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @Operation(summary = "Get books written by a specific author")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Books retrieved"),
        ApiResponse(responseCode = "404", description = "Author not found")
    )
    @GetMapping("/{id}/books")
    fun getBooksByAuthor(
        @Parameter(description = "ID of the author") @PathVariable id: Long
    ): ResponseEntity<List<Book>> {
        val books = authorService.getBooksByAuthor(id)
        return ResponseEntity.ok(books)
    }

    @Operation(summary = "Create a new author")
    @PostMapping
    fun create(
        @Parameter(description = "Author data to create") @RequestBody author: Author
    ): Author = authorService.create(author)

    @Operation(summary = "Update an existing author")
    @PutMapping("/{id}")
    fun update(
        @Parameter(description = "ID of the author to update") @PathVariable id: Long,
        @Parameter(description = "Updated author data") @RequestBody author: Author
    ): Author = authorService.update(id, author)

    @Operation(summary = "Delete an author by ID")
    @ApiResponses(
        ApiResponse(responseCode = "204", description = "Author deleted"),
        ApiResponse(responseCode = "404", description = "Author not found")
    )
    @DeleteMapping("/{id}")
    fun delete(
        @Parameter(description = "ID of the author to delete") @PathVariable id: Long
    ): ResponseEntity<Void> {
        authorService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
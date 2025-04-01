package com.pwr.library.controller

import com.pwr.library.dto.BookRequest
import com.pwr.library.dto.BookUpdateRequest
import com.pwr.library.model.Book
import com.pwr.library.service.BookService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

@Tag(name = "Book Controller", description = "Handles all operations related to books")
@RestController
@RequestMapping("/books")
class BookController(
    private val bookService: BookService
) {

    @Operation(summary = "Get all books")
    @GetMapping
    fun getAll(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): ResponseEntity<Page<Book>> {
        val pageable: Pageable = PageRequest.of(page, pageSize)
        val booksPage: Page<Book> = bookService.getAll(pageable)
        return ResponseEntity.ok(booksPage)
    }

    @Operation(summary = "Get a book by ID")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Book found"),
        ApiResponse(responseCode = "404", description = "Book not found")
    )
    @GetMapping("/{id}")
    fun getById(
        @Parameter(description = "ID of the book to retrieve") @PathVariable id: Long
    ): ResponseEntity<Book> =
        bookService.getById(id)?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @Operation(summary = "Create a new book")
    @ApiResponse(responseCode = "200", description = "Book successfully created")
    @PostMapping
    fun create(
        @Parameter(description = "Book data") @RequestBody bookRequest: BookRequest
    ): ResponseEntity<Book> =
        ResponseEntity.ok(bookService.create(bookRequest))

    @Operation(summary = "Update a book's title (excluding authors)")
    @PutMapping("/{id}")
    fun update(
        @Parameter(description = "ID of the book to update") @PathVariable id: Long,
        @Parameter(description = "New title of the book") @RequestBody updateRequest: BookUpdateRequest
    ): ResponseEntity<Book> =
        ResponseEntity.ok(bookService.updateTitle(id, updateRequest))

    @Operation(summary = "Update the authors of a book")
    @PutMapping("/{id}/authors")
    fun updateAuthors(
        @Parameter(description = "ID of the book to update") @PathVariable id: Long,
        @Parameter(description = "List of author IDs to assign") @RequestBody authorIds: List<Long>
    ): ResponseEntity<Book> =
        ResponseEntity.ok(bookService.updateAuthors(id, authorIds))

    @Operation(summary = "Delete a book by ID")
    @ApiResponses(
        ApiResponse(responseCode = "204", description = "Book deleted"),
        ApiResponse(responseCode = "404", description = "Book not found")
    )
    @DeleteMapping("/{id}")
    fun delete(
        @Parameter(description = "ID of the book to delete") @PathVariable id: Long
    ): ResponseEntity<Void> {
        bookService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
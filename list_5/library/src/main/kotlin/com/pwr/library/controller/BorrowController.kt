package com.pwr.library.controller

import com.pwr.library.dto.BorrowRequest
import com.pwr.library.dto.BorrowUpdateRequest
import com.pwr.library.model.Borrow
import com.pwr.library.service.BorrowService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
@Tag(name = "Borrows Controller", description = "Handles all operations related to borrows")
@RestController
@RequestMapping("/borrows")
class BorrowController(
    private val borrowService: BorrowService
) {

    @Operation(summary = "Borrow a book")
    @ApiResponse(responseCode = "200", description = "Book successfully borrowed")
    @PostMapping
    fun borrowBook(
        @Parameter(description = "Borrow request data") @RequestBody borrowRequest: BorrowRequest
    ): ResponseEntity<Borrow> {
        val borrowedBook = borrowService.createBorrow(borrowRequest)
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowedBook)
    }

    @Operation(summary = "Update borrow status (returned or not)")
    @PutMapping("/{borrowId}")
    fun updateBook(
        @Parameter(description = "ID of the borrow record") @PathVariable borrowId: Long,
        @Parameter(description = "Borrow status update data") @RequestBody borrowUpdateRequest: BorrowUpdateRequest
    ): ResponseEntity<Void> {
        borrowService.updateBorrow(borrowId, borrowUpdateRequest)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Get all books borrowed by a reader")
    @ApiResponse(responseCode = "200", description = "Borrowed books list")
    @GetMapping("/readers/{readerId}")
    fun getBorrowedBooks(
        @Parameter(description = "ID of the reader") @PathVariable readerId: Long
    ): ResponseEntity<List<Borrow>> {
        val borrows = borrowService.getBorrowedBooks(readerId)
        return ResponseEntity.ok(borrows)
    }
}

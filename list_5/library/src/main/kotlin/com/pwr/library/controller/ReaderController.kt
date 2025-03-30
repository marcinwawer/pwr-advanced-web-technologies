package com.pwr.library.controller

import com.pwr.library.model.Reader
import com.pwr.library.service.ReaderService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
@Tag(name = "Readers Controller", description = "Handles all operations related to readers")
@RestController
@RequestMapping("/readers")
class ReaderController(
    private val readerService: ReaderService
) {

    @Operation(summary = "Get all readers")
    @ApiResponse(responseCode = "200", description = "List of all readers")
    @GetMapping
    fun getAllReaders(): ResponseEntity<List<Reader>> {
        return ResponseEntity.ok(readerService.getAllReaders())
    }

    @Operation(summary = "Get a reader by ID")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Reader found"),
        ApiResponse(responseCode = "404", description = "Reader not found")
    )
    @GetMapping("/{id}")
    fun getReaderById(
        @Parameter(description = "ID of the reader to retrieve") @PathVariable id: Long
    ): ResponseEntity<Reader> {
        val reader = readerService.getReaderById(id)
        return if (reader != null) ResponseEntity.ok(reader) else ResponseEntity.notFound().build()
    }

    @Operation(summary = "Create a new reader")
    @PostMapping
    fun createReader(
        @Parameter(description = "Reader data") @RequestBody reader: Reader
    ) {
        readerService.createReader(reader)
    }

    @Operation(summary = "Update reader data")
    @PutMapping("/{id}")
    fun updateReaderById(
        @Parameter(description = "ID of the reader to update") @PathVariable id: Long,
        @Parameter(description = "Reader update data") @RequestBody reader: Reader
    ) {
        readerService.updateReader(id, reader)
    }

    @Operation(summary = "Delete a reader by ID")
    @ApiResponses(
        ApiResponse(responseCode = "204", description = "Reader deleted"),
        ApiResponse(responseCode = "404", description = "Reader not found")
    )
    @DeleteMapping("/{id}")
    fun deleteReader(
        @Parameter(description = "ID of the reader to delete") @PathVariable id: Long
    ): ResponseEntity<Void> {
        return try {
            readerService.deleteReader(id)
            ResponseEntity.noContent().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.notFound().build()
        }
    }
}

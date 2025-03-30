package com.pwr.library.service

import com.pwr.library.dto.BorrowRequest
import com.pwr.library.dto.BorrowUpdateRequest
import com.pwr.library.model.Borrow
import com.pwr.library.repository.BorrowRepository
import com.pwr.library.repository.BookRepository
import com.pwr.library.repository.ReaderRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDate

@Service
class BorrowService(
    private val borrowRepository: BorrowRepository,
    private val bookRepository: BookRepository,
    private val readerRepository: ReaderRepository
) {
    fun createBorrow(borrowRequest: BorrowRequest): Borrow {
        val reader = readerRepository.findById(borrowRequest.readerID)
            .orElseThrow { IllegalArgumentException("reader not found") }
        val book = bookRepository.findById(borrowRequest.bookId)
            .orElseThrow { IllegalArgumentException("book not found") }

        val borrow = Borrow(
            book = book,
            reader = reader,
            borrowDate = LocalDate.now()
        )
        return borrowRepository.save(borrow)
    }

    fun updateBorrow(borrowId: Long, borrowUpdateRequest: BorrowUpdateRequest): Borrow {
        val existingBorrow = borrowRepository.findById(borrowId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "borrow not found") }

        val updatedBorrow = existingBorrow.copy(
            isReturned = borrowUpdateRequest.isReturned
        )

        return borrowRepository.save(updatedBorrow)
    }

    fun getBorrowedBooks(readerId: Long): List<Borrow> {
        return borrowRepository.findByReaderId(readerId)
    }
}

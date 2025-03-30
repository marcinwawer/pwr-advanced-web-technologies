package com.pwr.library.repository

import com.pwr.library.model.BorrowedBook
import org.springframework.data.jpa.repository.JpaRepository

interface BorrowedBookRepository : JpaRepository<BorrowedBook, Long> {
    fun findByReaderId(readerId: Long): List<BorrowedBook>
    fun existsByBookIdAndReturnDateIsNull(bookId: Long): Boolean
}

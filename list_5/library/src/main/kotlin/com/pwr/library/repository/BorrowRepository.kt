package com.pwr.library.repository

import com.pwr.library.model.Borrow
import org.springframework.data.jpa.repository.JpaRepository

interface BorrowRepository : JpaRepository<Borrow, Long> {
    fun findByReaderId(readerId: Long): List<Borrow>
}

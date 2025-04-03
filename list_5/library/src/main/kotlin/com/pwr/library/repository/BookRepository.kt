package com.pwr.library.repository

import com.pwr.library.model.Book
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface BookRepository : JpaRepository<Book, Long> {
    fun findByTitleContainingIgnoreCase(title: String, pageable: Pageable): Page<Book>
}
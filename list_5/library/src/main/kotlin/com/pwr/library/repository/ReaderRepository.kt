package com.pwr.library.repository

import com.pwr.library.model.Author
import com.pwr.library.model.Reader
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface ReaderRepository : JpaRepository<Reader, Long>{
    fun findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(name: String, surname: String, pageable: Pageable): Page<Reader>
}

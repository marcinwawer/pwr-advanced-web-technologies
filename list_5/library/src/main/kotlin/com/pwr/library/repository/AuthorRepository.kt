package com.pwr.library.repository;

import com.pwr.library.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
interface AuthorRepository : JpaRepository<Author, Long> {
    fun findByNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(name: String, surname: String, pageable: Pageable): Page<Author>
}
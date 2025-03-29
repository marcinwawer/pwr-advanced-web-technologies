package com.pwr.library.repository;

import com.pwr.library.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

interface AuthorRepository : JpaRepository<Author, Long>
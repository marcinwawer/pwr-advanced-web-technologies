package com.pwr.library.repository

import com.pwr.library.model.Reader
import org.springframework.data.jpa.repository.JpaRepository

interface ReaderRepository : JpaRepository<Reader, Long>

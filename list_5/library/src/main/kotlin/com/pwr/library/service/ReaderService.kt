package com.pwr.library.service

import com.pwr.library.model.Author
import com.pwr.library.model.Reader
import com.pwr.library.repository.ReaderRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page

@Service
class ReaderService(
    private val readerRepository: ReaderRepository
) {

    fun getAllReaders(pageable: Pageable): Page<Reader> = readerRepository.findAll(pageable)

    fun getReaderById(id: Long): Reader {
        return readerRepository.findById(id).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "reader not found")
        }
    }

    fun searchByNameOrEmail(query: String, pageable: Pageable): Page<Reader> {
        return readerRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable)
    }

    fun createReader(reader: Reader): Reader = readerRepository.save(reader)

    fun updateReader(id: Long, updated: Reader): Reader {
        if (!readerRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "reader not found")
        }
        return readerRepository.save(updated.copy(id = id))
    }

    fun deleteReader(id: Long) {
        if (!readerRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "reader not found")
        }
        readerRepository.deleteById(id)
    }
}

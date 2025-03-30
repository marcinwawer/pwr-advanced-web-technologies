package com.pwr.library.model

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.time.LocalDate

@Entity
data class BorrowedBook(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "book_id")
    val book: Book,

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "reader_id")
    val reader: Reader,

    val borrowDate: LocalDate,
    val isReturned: Boolean = false,
) {
    constructor() : this(0,Book(),Reader(), LocalDate.now(), false)

}

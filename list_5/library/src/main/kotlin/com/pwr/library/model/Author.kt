package com.pwr.library.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
data class Author(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val name: String,
    val surname: String,

    @JsonIgnore
    @ManyToMany(mappedBy = "authors")
    val books: List<Book> = emptyList()
) {
    constructor() : this(0, "", "", emptyList())
}
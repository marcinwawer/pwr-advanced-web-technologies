package com.pwr.library.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*

@Entity
data class Reader(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val name: String,
    val email: String,


    @JsonManagedReference
    @OneToMany(mappedBy = "reader")
    val borrows: List<Borrow> = emptyList()


) {
    constructor() : this(0, "", "", emptyList()) {

    }
}

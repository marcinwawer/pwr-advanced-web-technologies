package com.pwr.library.dto

data class BookRequest(
    val title: String,
    val authorIds: List<Long>
)
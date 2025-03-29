package com.pwr.library.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Payload for creating a new book")
data class BookRequest(

    @Schema(
        description = "The title of the book",
        example = "The Witcher: The Last Wish"
    )
    val title: String,

    @Schema(
        description = "A list of author IDs to associate with the book",
        example = "[1, 2]"
    )
    val authorIds: List<Long>
)
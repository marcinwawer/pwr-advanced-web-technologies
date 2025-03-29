package com.pwr.library.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Payload for updating an existing book's title")
data class BookUpdateRequest(

    @Schema(
        description = "The new title of the book",
        example = "The Witcher: Blood of Elves"
    )
    val title: String
)
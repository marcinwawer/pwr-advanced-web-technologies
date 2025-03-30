package com.pwr.library.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Payload for creating a new booking")
data class BorrowRequest (
    @Schema(
        description = "ID of reader",
        example = "1"
    )
    val readerID: Long,

    @Schema(
        description = "Id of a borrowed book",
        example = "1"
    )
    val bookId: Long
)
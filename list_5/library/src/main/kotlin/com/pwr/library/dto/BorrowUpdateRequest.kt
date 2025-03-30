package com.pwr.library.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Payload for updating an existing borrow isReturned field")
data class BorrowUpdateRequest(

    @Schema(
        description = "The new borrow isReturned state",
        example = "true"
    )
    val isReturned: Boolean
)
package com.pwr.library.controller

import io.swagger.v3.oas.annotations.Hidden
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@Hidden
@RestController
class HomeController {

    @GetMapping("/")
    fun redirectToSwagger(): ResponseEntity<Void> =
        ResponseEntity.status(302)
            .header("Location", "/swagger-ui/index.html")
            .build()
}
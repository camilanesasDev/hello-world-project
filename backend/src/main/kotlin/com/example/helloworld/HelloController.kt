package com.example.helloworld

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:3000"])
class HelloController {

    @GetMapping("/hello")
    fun hello(): Map<String, String> {
        return mapOf("message" to "¡Hola Mundo desde Kotlin!")
    }
}

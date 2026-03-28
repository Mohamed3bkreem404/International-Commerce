package com.example.User.Service.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record SignUpRequest(

        @NotBlank(message = "user name required")
        @Size(max = 20, min = 1)
        String userName,

        @NotBlank(message = "password required")
        @Size(max = 20, min = 1 )
        String password


) {
}

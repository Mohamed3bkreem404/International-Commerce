package com.example.User.Service.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LogInRequest(

        @NotBlank(message = "user name required")
        @Size(max = 20, min = 1)
        String username,

        @NotBlank(message = "user name required")
        @Size(max = 20, min = 1)
        String password
) {
}

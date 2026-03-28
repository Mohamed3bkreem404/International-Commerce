package com.example.Product.Service.dtos;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProductCreate(

        @NotBlank(message = "product name missing")
        @Size(message = "Product name must be in range of 30" , max = 30)
        String name,

        @NotBlank(message = "description name missing")
        @Size(max = 200, message = "Description must be less than 200 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value ="0.0" , inclusive = false , message = "Price must be greater than 0")
        BigDecimal price,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0 , message = "Stock quantity cannot be negative")
        Long stockQuantity

) {
}

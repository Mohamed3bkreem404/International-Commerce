package com.example.Cart.Service.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddCartItemRequest(
        @NotNull(message = "productId is required")
        UUID productId,

        @NotNull(message = "quantity is required")
        @Min(value = 1, message = "quantity must be at least 1")
        Long quantity
) {
}

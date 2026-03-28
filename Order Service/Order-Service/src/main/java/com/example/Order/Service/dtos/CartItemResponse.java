package com.example.Order.Service.dtos;

import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
        UUID itemId,
        UUID productId,
        String productName,
        BigDecimal price,
        Long quantity,
        BigDecimal subtotal
) {
}

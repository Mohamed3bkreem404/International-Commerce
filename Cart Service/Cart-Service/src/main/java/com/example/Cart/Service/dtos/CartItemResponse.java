package com.example.Cart.Service.dtos;

import com.example.Cart.Service.entities.CartItem;

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
    public static CartItemResponse fromEntity(CartItem item) {
        BigDecimal subtotal = item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemResponse(
                item.getId(),
                item.getProductId(),
                item.getProductName(),
                item.getPrice(),
                item.getQuantity(),
                subtotal
        );
    }
}
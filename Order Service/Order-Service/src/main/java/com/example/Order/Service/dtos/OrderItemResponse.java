package com.example.Order.Service.dtos;

import com.example.Order.Service.entities.OrderItem;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
        UUID itemId,
        UUID productId,
        String productName,
        BigDecimal price,
        Long quantity,
        BigDecimal subtotal
) {
    public static OrderItemResponse fromEntity(OrderItem item) {
        BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return new OrderItemResponse(
                item.getId(),
                item.getProductId(),
                item.getProductName(),
                item.getPrice(),
                item.getQuantity(),
                subtotal
        );
    }
}

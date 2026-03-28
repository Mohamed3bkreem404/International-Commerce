package com.example.Order.Service.dtos;

import com.example.Order.Service.entities.Order;
import com.example.Order.Service.enums.OrderStatus;
import com.example.Order.Service.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        UUID userId,
        BigDecimal totalAmount,
        OrderStatus status,
        PaymentStatus paymentStatus,
        String shippingAddress,
        String notes,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse fromEntity(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(OrderItemResponse::fromEntity)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getShippingAddress(),
                order.getNotes(),
                order.getCreatedAt(),
                itemResponses
        );
    }
}

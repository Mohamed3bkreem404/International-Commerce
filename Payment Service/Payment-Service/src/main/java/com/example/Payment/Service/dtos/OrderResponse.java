package com.example.Payment.Service.dtos;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        UUID userId,
        BigDecimal totalAmount,
        String status,
        String paymentStatus,
        String shippingAddress,
        String notes
) {
}

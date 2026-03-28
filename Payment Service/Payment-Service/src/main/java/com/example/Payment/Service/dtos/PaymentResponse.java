package com.example.Payment.Service.dtos;

import com.example.Payment.Service.entities.Payment;
import com.example.Payment.Service.enums.PaymentMethod;
import com.example.Payment.Service.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PaymentResponse(
        UUID paymentId,
        UUID orderId,
        UUID userId,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        String transactionReference,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime paidAt
) {
    public static PaymentResponse fromEntity(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getTransactionReference(),
                payment.getNotes(),
                payment.getCreatedAt(),
                payment.getPaidAt()
        );
    }
}

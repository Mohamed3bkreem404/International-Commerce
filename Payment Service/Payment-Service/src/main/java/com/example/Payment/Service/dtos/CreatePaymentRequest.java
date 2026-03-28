package com.example.Payment.Service.dtos;

import com.example.Payment.Service.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreatePaymentRequest(
        @NotNull(message = "orderId is required")
        UUID orderId,

        @NotNull(message = "paymentMethod is required")
        PaymentMethod paymentMethod,

        String notes
) {
}

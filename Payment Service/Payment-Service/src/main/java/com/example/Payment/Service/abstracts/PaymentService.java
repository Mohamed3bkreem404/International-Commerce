package com.example.Payment.Service.abstracts;

import com.example.Payment.Service.dtos.CreatePaymentRequest;
import com.example.Payment.Service.dtos.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentResponse pay(CreatePaymentRequest createPaymentRequest);

    List<PaymentResponse> getMyPayments();

    PaymentResponse getMyPaymentById(UUID paymentId);

    PaymentResponse getMyPaymentByOrderId(UUID orderId);
}

package com.example.Payment.Service.services;

import com.example.Payment.Service.abstracts.OrderClient;
import com.example.Payment.Service.abstracts.PaymentService;
import com.example.Payment.Service.dtos.CreatePaymentRequest;
import com.example.Payment.Service.dtos.OrderResponse;
import com.example.Payment.Service.dtos.PaymentResponse;
import com.example.Payment.Service.entities.Payment;
import com.example.Payment.Service.enums.PaymentStatus;
import com.example.Payment.Service.exceptions.CustomerResponseException;
import com.example.Payment.Service.exceptions.GlobalResponse;
import com.example.Payment.Service.repositories.PaymentRepo;
import com.example.Payment.Service.utility.SecurityUtility;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentServiceImp implements PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private OrderClient orderClient;

    @Autowired
    private SecurityUtility securityUtility;

    @Override
    @Transactional
    public PaymentResponse pay(CreatePaymentRequest createPaymentRequest) {
        UUID userId = securityUtility.getCurrentUserId();

        paymentRepo.findByOrderIdAndUserId(createPaymentRequest.orderId(), userId)
                .ifPresent(payment -> {
                    throw CustomerResponseException.BadRequest("Payment already exists for this order");
                });

        GlobalResponse<OrderResponse> orderWrapper = orderClient.getMyOrderById(createPaymentRequest.orderId());
        OrderResponse orderResponse = orderWrapper.getData();

        if (orderResponse == null) {
            throw CustomerResponseException.ResourceNotFound("Order not found: " + createPaymentRequest.orderId());
        }

        if ("CANCELLED".equals(orderResponse.status())) {
            throw CustomerResponseException.BadRequest("Cancelled order cannot be paid");
        }

        if ("PAID".equals(orderResponse.paymentStatus())) {
            throw CustomerResponseException.BadRequest("Order is already paid");
        }

        if (orderResponse.totalAmount() == null || orderResponse.totalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw CustomerResponseException.BadRequest("Order total amount is invalid");
        }

        Payment payment = new Payment();
        payment.setOrderId(createPaymentRequest.orderId());
        payment.setUserId(userId);
        payment.setAmount(orderResponse.totalAmount());
        payment.setPaymentMethod(createPaymentRequest.paymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setNotes(createPaymentRequest.notes());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment = paymentRepo.save(payment);
        orderClient.markOrderPaid(createPaymentRequest.orderId());

        return PaymentResponse.fromEntity(savedPayment);
    }

    @Override
    public List<PaymentResponse> getMyPayments() {
        UUID userId = securityUtility.getCurrentUserId();

        return paymentRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(PaymentResponse::fromEntity)
                .toList();
    }

    @Override
    public PaymentResponse getMyPaymentById(UUID paymentId) {
        UUID userId = securityUtility.getCurrentUserId();
        Payment payment = paymentRepo.findByIdAndUserId(paymentId, userId)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Payment not found: " + paymentId));

        return PaymentResponse.fromEntity(payment);
    }

    @Override
    public PaymentResponse getMyPaymentByOrderId(UUID orderId) {
        UUID userId = securityUtility.getCurrentUserId();
        Payment payment = paymentRepo.findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Payment not found for order: " + orderId));

        return PaymentResponse.fromEntity(payment);
    }
}

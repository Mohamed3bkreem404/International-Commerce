package com.example.Payment.Service.controllers;

import com.example.Payment.Service.abstracts.PaymentService;
import com.example.Payment.Service.dtos.CreatePaymentRequest;
import com.example.Payment.Service.exceptions.GlobalResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<GlobalResponse<?>> pay(
            @Validated @RequestBody CreatePaymentRequest createPaymentRequest
    ) {
        return ResponseEntity.ok(new GlobalResponse<>(paymentService.pay(createPaymentRequest)));
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> getMyPayments() {
        return ResponseEntity.ok(new GlobalResponse<>(paymentService.getMyPayments()));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<GlobalResponse<?>> getMyPaymentById(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(new GlobalResponse<>(paymentService.getMyPaymentById(paymentId)));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<GlobalResponse<?>> getMyPaymentByOrderId(@PathVariable UUID orderId) {
        return ResponseEntity.ok(new GlobalResponse<>(paymentService.getMyPaymentByOrderId(orderId)));
    }
}

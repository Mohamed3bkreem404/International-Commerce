package com.example.Order.Service.controllers;

import com.example.Order.Service.abstracts.OrderService;
import com.example.Order.Service.dtos.CreateOrderRequest;
import com.example.Order.Service.exceptions.GlobalResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<GlobalResponse<?>> checkout(
            @RequestBody(required = false) CreateOrderRequest createOrderRequest
    ) {
        return ResponseEntity.ok(new GlobalResponse<>(orderService.checkout(createOrderRequest)));
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> getMyOrders() {
        return ResponseEntity.ok(new GlobalResponse<>(orderService.getMyOrders()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<GlobalResponse<?>> getMyOrderById(@PathVariable UUID orderId) {
        return ResponseEntity.ok(new GlobalResponse<>(orderService.getMyOrderById(orderId)));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<GlobalResponse<?>> cancelOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(new GlobalResponse<>(orderService.cancelOrder(orderId)));
    }

    @PutMapping("/{orderId}/pay")
    public ResponseEntity<GlobalResponse<?>> markOrderPaid(@PathVariable UUID orderId) {
        return ResponseEntity.ok(new GlobalResponse<>(orderService.markOrderPaid(orderId)));
    }
}

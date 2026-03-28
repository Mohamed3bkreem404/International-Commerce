package com.example.Order.Service.dtos;

public record CreateOrderRequest(
        String shippingAddress,
        String notes
) {
}

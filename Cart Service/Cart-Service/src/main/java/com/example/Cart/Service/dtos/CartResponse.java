package com.example.Cart.Service.dtos;

import com.example.Cart.Service.entities.Cart;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartResponse(

        UUID cartId,
        UUID userId,
        List<CartItemResponse> items,
        BigDecimal totalPrice

) {
    public static CartResponse fromEntity(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems()
                .stream()
                .map(CartItemResponse::fromEntity)
                .toList();

        BigDecimal totalPrice = cart.getItems()
                .stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                itemResponses,
                totalPrice
        );
    }
}
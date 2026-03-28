package com.example.Cart.Service.abstracts;

import com.example.Cart.Service.dtos.AddCartItemRequest;
import com.example.Cart.Service.dtos.CartResponse;
import com.example.Cart.Service.dtos.UpdateCartItemRequest;

import java.util.UUID;

public interface CartService {

    CartResponse getMyCart();

    CartResponse addItem(AddCartItemRequest addCartItemRequest);

    CartResponse updateItemQuantity(UUID productId, UpdateCartItemRequest updateCartItemRequest);

    CartResponse removeItem(UUID productId);

    CartResponse clearCart();
}

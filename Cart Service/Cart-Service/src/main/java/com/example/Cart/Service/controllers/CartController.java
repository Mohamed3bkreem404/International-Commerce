package com.example.Cart.Service.controllers;

import com.example.Cart.Service.abstracts.CartService;
import com.example.Cart.Service.dtos.AddCartItemRequest;
import com.example.Cart.Service.dtos.CartResponse;
import com.example.Cart.Service.dtos.UpdateCartItemRequest;
import com.example.Cart.Service.exceptions.GlobalResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> getMyCart() {
        return ResponseEntity.ok(new GlobalResponse<>(cartService.getMyCart()));
    }

    @PostMapping("/items")
    public ResponseEntity<GlobalResponse<?>> addItem(
            @Validated
            @RequestBody AddCartItemRequest addCartItemRequest

            ){
        return ResponseEntity.ok(new GlobalResponse<>(cartService.addItem(addCartItemRequest)));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<GlobalResponse<?>> updateItemQuantity(
            @PathVariable UUID productId,
            @Validated @RequestBody UpdateCartItemRequest updateCartItemRequest
    ) {
        return ResponseEntity.ok(new GlobalResponse<>(cartService.updateItemQuantity(productId, updateCartItemRequest)));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<GlobalResponse<?>> removeItem(@PathVariable UUID productId) {
        return ResponseEntity.ok(new GlobalResponse<>(cartService.removeItem(productId)));
    }

    @DeleteMapping
    public ResponseEntity<GlobalResponse<?>> clearCart() {
        return ResponseEntity.ok(new GlobalResponse<>(cartService.clearCart()));
    }
}

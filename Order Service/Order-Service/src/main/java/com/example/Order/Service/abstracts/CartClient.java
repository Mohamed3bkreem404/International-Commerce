package com.example.Order.Service.abstracts;

import com.example.Order.Service.config.FeignSecurityConfig;
import com.example.Order.Service.dtos.CartResponse;
import com.example.Order.Service.exceptions.GlobalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "cart-service",
        url = "${CART_SERVICE_URL:http://localhost:9003}",
        configuration = FeignSecurityConfig.class
)
public interface CartClient {

    @GetMapping("/api/v1/cart")
    GlobalResponse<CartResponse> getMyCart();

    @DeleteMapping("/api/v1/cart")
    GlobalResponse<CartResponse> clearCart();
}

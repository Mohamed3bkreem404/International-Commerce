package com.example.Payment.Service.abstracts;

import com.example.Payment.Service.config.FeignSecurityConfig;
import com.example.Payment.Service.dtos.OrderResponse;
import com.example.Payment.Service.exceptions.GlobalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.UUID;

@FeignClient(
        name = "order-service",
        url = "${ORDER_SERVICE_URL:http://localhost:9004}",
        configuration = FeignSecurityConfig.class
)
public interface OrderClient {

    @GetMapping("/api/v1/orders/{orderId}")
    GlobalResponse<OrderResponse> getMyOrderById(@PathVariable UUID orderId);

    @PutMapping("/api/v1/orders/{orderId}/pay")
    GlobalResponse<OrderResponse> markOrderPaid(@PathVariable UUID orderId);
}

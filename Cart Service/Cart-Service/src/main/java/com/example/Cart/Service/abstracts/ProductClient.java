package com.example.Cart.Service.abstracts;

import com.example.Cart.Service.config.FeignSecurityConfig;
import com.example.Cart.Service.dtos.ProductResponse;
import com.example.Cart.Service.exceptions.GlobalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
        name = "product-service" ,
        url = "${PRODUCT_SERVICE_URL:http://localhost:9001}",
        configuration = FeignSecurityConfig.class
)
public interface ProductClient {

    @GetMapping("/api/v1/products/{id}")
    GlobalResponse<ProductResponse> getProductById(@PathVariable UUID id);
}

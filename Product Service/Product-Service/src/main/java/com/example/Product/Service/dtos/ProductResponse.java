package com.example.Product.Service.dtos;

import com.example.Product.Service.entities.Product;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


public record ProductResponse(

        String name,


        String description,

        BigDecimal price,

        Long stockQuantity


) {
    public static ProductResponse fromEntity(Product product) {
        return new ProductResponse(
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity()


        );
    }
}

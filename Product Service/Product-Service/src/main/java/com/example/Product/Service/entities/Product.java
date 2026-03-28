package com.example.Product.Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "product")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    @Column(name = "product_name" , length = 50 , nullable = false)
    private String name;

    @Column(name = "product_description" , length = 200 , nullable = false)
    private String description;

    @Column(name = "product_price" , nullable = false)
    private BigDecimal price;

    @Column(name = "stock_quantity" , length = 20 , nullable = false)
    private Long stockQuantity;

    @Column(name = "created_at" , nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at" , nullable = false)
    private LocalDateTime updatedAt;








}

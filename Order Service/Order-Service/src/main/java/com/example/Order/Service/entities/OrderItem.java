package com.example.Order.Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_item")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    private UUID productId;

    private String productName;

    private BigDecimal price;

    private Long quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}

package com.example.Cart.Service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "cart_item",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"cart_id" , "productId"})
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    private UUID productId;

    private String productName;

    private BigDecimal price;

    private Long quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;
}

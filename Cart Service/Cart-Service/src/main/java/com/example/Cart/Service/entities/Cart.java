package com.example.Cart.Service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cart")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    @Column(nullable = false , unique = true)
    private UUID userId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "cart" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
}
